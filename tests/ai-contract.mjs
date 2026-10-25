import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const ai=require('../api/ai.js');
const status=require('../api/ai-status.js');
const image=require('../api/image.js');
const previousKey=process.env.OPENAI_API_KEY;
const previousFlag=process.env.DD_AI_BETA_ENABLED;
const previousToken=process.env.DD_AI_BETA_TOKEN;
const previousFetch=globalThis.fetch;
const previousQuotaUrl=process.env.UPSTASH_REDIS_REST_URL;
const previousQuotaToken=process.env.UPSTASH_REDIS_REST_TOKEN;
const previousQuotaMax=process.env.DD_AI_DAILY_MAX_UNITS;
let quotaCount=0;
let quotaUnavailable=false;

function response(){
  return {
    statusCode:200,
    headers:{},
    body:null,
    setHeader(name,value){this.headers[name.toLowerCase()]=value;},
    end(raw){this.body=JSON.parse(raw);}
  };
}
async function call(handler,method,body,headers){
  const res=response();
  const actualHeaders=headers===undefined?(process.env.DD_AI_BETA_TOKEN?{'x-dd-beta-token':process.env.DD_AI_BETA_TOKEN}:{}):headers;
  // Mock the durable Redis EVAL independently from the provider mock.
  const providerFetch=globalThis.fetch;
  globalThis.fetch=async(url,options)=>{
    if(url==='https://quota.example.test'){
      if(quotaUnavailable)return {ok:false,status:503,json:async()=>({error:'temporary_unavailable'})};
      const [cmd,script,nkeys,key,cost,max]=JSON.parse(options.body);
      assert.equal(cmd,'EVAL');
      assert.equal(nkeys,'1');
      assert.equal(key,'dd:beta:ai-quota:'+new Date().toISOString().slice(0,10));
      assert.match(script,/INCRBY/);
      assert.equal(options.headers.Authorization,'Bearer quota-test-token');
      const n=Number(cost), limit=Number(max);
      if(quotaCount+n>limit)return {ok:true,status:200,json:async()=>({result:-1})};
      quotaCount+=n;
      return {ok:true,status:200,json:async()=>({result:quotaCount})};
    }
    return providerFetch(url,options);
  };
  try{await handler({method,body,headers:actualHeaders},res);}
  finally{globalThis.fetch=providerFetch;}
  return res;
}
try{
  delete process.env.OPENAI_API_KEY;
  delete process.env.DD_AI_BETA_ENABLED;
  delete process.env.DD_AI_BETA_TOKEN;
  let res=await call(status,'GET');
  assert.equal(res.statusCode,200);
  assert.equal(res.body.configured,false);
  assert.equal(res.body.text,false,'Text must not be advertised without API key');
  assert.equal(res.body.image,false);
  assert.equal(res.body.verified,false,'Configured is not a live provider check');
  assert.equal(res.headers['cache-control'],'no-store');
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'openai_not_configured');

  process.env.OPENAI_API_KEY='test-only-not-a-real-secret';
  // A configured key must NOT make a publicly accessible endpoint billable.
  res=await call(status,'GET');
  assert.equal(res.body.configured,true);
  assert.equal(res.body.enabled,false);
  assert.equal(res.body.text,false);
  assert.equal(res.body.image,false);
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_beta_disabled');
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_beta_disabled');
  process.env.DD_AI_BETA_ENABLED='true';
  res=await call(status,'GET');
  assert.equal(res.body.text,false,'No access secret must fail closed even with beta enabled');
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'beta_access_not_configured');
  process.env.DD_AI_BETA_TOKEN='local-test-token-32-chars-minimum-0123456789';
  // A token and provider key without durable quota must still fail closed.
  res=await call(status,'GET');
  assert.equal(res.body.quota_configured,false);
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_quota_not_configured');
  process.env.UPSTASH_REDIS_REST_URL='https://quota.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN='quota-test-token';
  process.env.DD_AI_DAILY_MAX_UNITS='1000';
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'},{});
  assert.equal(res.statusCode,401,'Missing beta access token must be rejected');
  assert.equal(res.body.error,'beta_access_denied');
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'},{'x-dd-beta-token':'wrong-token'});
  assert.equal(res.statusCode,401,'Wrong beta access token must be rejected');
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true},{});
  assert.equal(res.statusCode,401,'Image endpoint must require access token');
  res=await call(status,'GET');
  assert.equal(res.body.enabled,true);
  assert.equal(res.body.configured,true);
  assert.equal(res.body.text,true);
  assert.equal(res.body.verified,false);
  res=await call(status,'POST');
  assert.equal(res.statusCode,405);
  res=await call(ai,'GET');
  assert.equal(res.statusCode,405);
  res=await call(ai,'POST',{task:'not_supported',prompt:'Hola'});
  assert.equal(res.statusCode,400);
  res=await call(ai,'POST',{task:'contextual_help',prompt:'  '});
  assert.equal(res.statusCode,400);

  let captured=null;
  globalThis.fetch=async(url,options)=>{
    captured={url,options};
    return {ok:true,status:200,json:async()=>({
      id:'resp_mock',usage:{input_tokens:12,output_tokens:6,total_tokens:18},
      output:[{content:[{type:'output_text',text:JSON.stringify({
        result:'CONEXION_OK',options:[],warnings:[],teacher_note:''
      })}]}]
    })};
  };
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Responde CONEXION_OK',context:{
    level:'Primaria',community:'Ccotataqui',studentName:'No transmitir'
  }});
  assert.equal(res.statusCode,200);
  assert.equal(res.body.data.result,'CONEXION_OK');
  assert.equal(res.body.usage.total_tokens,18);
  assert.equal(res.headers['cache-control'],'no-store');
  assert.equal(captured.url,'https://api.openai.com/v1/responses');
  const payload=JSON.parse(captured.options.body);
  assert.equal(payload.model,'gpt-6-luna');
  assert.equal(payload.store,false);
  assert.equal(payload.text.format.strict,true);
  assert.equal(payload.input[0].content[0].text.includes('studentName'),false);
  assert.equal(payload.input[0].content[0].text.includes('Ccotataqui'),true);

  await call(ai,'POST',{task:'significant_situation',prompt:'Unidad',quality:'high'});
  assert.equal(JSON.parse(captured.options.body).model,'gpt-6.1-sol');

  globalThis.fetch=async()=>({ok:false,status:429,json:async()=>({error:{type:'rate_limit_error'}})});
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,429);
  assert.equal(res.body.retryable,true);

  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({output:[{content:[{type:'output_text',text:'not-json'}]}]})});
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,502);
  assert.equal(res.body.error,'invalid_structured_output');
  // A provider returning HTTP 200 is not proof that the expected structured
  // result is complete and safe to display as a generated teaching document.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({
    status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({
      result:'partial',options:'not-an-array',warnings:[],teacher_note:''
    })}]}]
  })});
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,502,'Invalid provider schema must fail closed');
  assert.equal(res.body.error,'invalid_structured_output');

  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({
    status:'incomplete',incomplete_details:{reason:'max_output_tokens'},
    output:[{content:[{type:'output_text',text:JSON.stringify({
      result:'partial',options:[],warnings:[],teacher_note:''
    })}]}]
  })});
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,502,'Incomplete provider response must fail closed');
  assert.equal(res.body.error,'incomplete_ai_response');
  assert.equal(res.body.retryable,true);

  delete process.env.OPENAI_API_KEY;
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,503);
  process.env.OPENAI_API_KEY='test-only-not-a-real-secret';
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:false});
  assert.equal(res.statusCode,402,'Image credits require explicit confirmation');
  globalThis.fetch=async(url,options)=>{
    captured={url,options};
    return {ok:true,status:200,json:async()=>({data:[{b64_json:'ZmFrZS1wbmc='}]})};
  };
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true,size:'1024x1536',quality:'medium'});
  assert.equal(res.statusCode,200);
  assert.equal(res.body.image_base64,'ZmFrZS1wbmc=');
  assert.equal(res.headers['cache-control'],'no-store');
  assert.equal(captured.url,'https://api.openai.com/v1/images/generations');
  const imagePayload=JSON.parse(captured.options.body);
  assert.equal(imagePayload.model,'gpt-image-2');
  assert.equal(imagePayload.n,1);
  // Provider HTTP 200 without an image must not be shown as a completed generation.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{}]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,502);
  assert.equal(res.body.error,'invalid_image_output');
  assert.equal(res.body.ok,false);
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,502);
  assert.equal(res.body.error,'invalid_image_output');
  globalThis.fetch=async()=>({ok:false,status:429,json:async()=>({error:{type:'rate_limit_error'}})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,429);
  assert.equal(res.body.retryable,true);

  // One text unit per request and five image units, atomically across instances.
  quotaCount=0;
  process.env.DD_AI_DAILY_MAX_UNITS='1';
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify({
    result:'OK',options:[],warnings:[],teacher_note:''
  })}]}]})});
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,200);
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,429);
  assert.equal(res.body.error,'ai_daily_quota_exceeded');
  res=await call(image,'POST',{prompt:'Imagen',confirmedCredit:true});
  assert.equal(res.statusCode,429,'Image unit cost must be checked before paid provider');
  // Redis outages must fail closed, without a fallback in-memory allowance.
  quotaCount=0;
  process.env.DD_AI_DAILY_MAX_UNITS='1000';
  quotaUnavailable=true;
  let providerCalls=0;
  globalThis.fetch=async()=>{providerCalls++;throw Error('Provider must not be called on quota outage');};
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_quota_unavailable');
  res=await call(image,'POST',{prompt:'Imagen',confirmedCredit:true});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_quota_unavailable');
  assert.equal(providerCalls,0);
  quotaUnavailable=false;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_quota_not_configured');
  console.log('AI_CONTRACT_PASS: text and image status, validation, mocked GPT requests, privacy, credit confirmation and errors');
}finally{
  globalThis.fetch=previousFetch;
  if(previousQuotaUrl===undefined)delete process.env.UPSTASH_REDIS_REST_URL;
  else process.env.UPSTASH_REDIS_REST_URL=previousQuotaUrl;
  if(previousQuotaToken===undefined)delete process.env.UPSTASH_REDIS_REST_TOKEN;
  else process.env.UPSTASH_REDIS_REST_TOKEN=previousQuotaToken;
  if(previousQuotaMax===undefined)delete process.env.DD_AI_DAILY_MAX_UNITS;
  else process.env.DD_AI_DAILY_MAX_UNITS=previousQuotaMax;
  if(previousToken===undefined)delete process.env.DD_AI_BETA_TOKEN;
  else process.env.DD_AI_BETA_TOKEN=previousToken;
  if(previousFlag===undefined)delete process.env.DD_AI_BETA_ENABLED;
  else process.env.DD_AI_BETA_ENABLED=previousFlag;
  if(previousKey===undefined)delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY=previousKey;
}
