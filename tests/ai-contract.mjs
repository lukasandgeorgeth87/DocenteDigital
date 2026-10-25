import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const ai=require('../api/ai.js');
const status=require('../api/ai-status.js');
const previousKey=process.env.OPENAI_API_KEY;
const previousFetch=globalThis.fetch;

function response(){
  return {
    statusCode:200,
    headers:{},
    body:null,
    setHeader(name,value){this.headers[name.toLowerCase()]=value;},
    end(raw){this.body=JSON.parse(raw);}
  };
}
async function call(handler,method,body){
  const res=response();
  await handler({method,body},res);
  return res;
}
try{
  delete process.env.OPENAI_API_KEY;
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
  res=await call(status,'GET');
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
  console.log('AI_CONTRACT_PASS: status, configuration, input validation, mock GPT response, model routes, privacy and errors');
}finally{
  globalThis.fetch=previousFetch;
  if(previousKey===undefined)delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY=previousKey;
}
