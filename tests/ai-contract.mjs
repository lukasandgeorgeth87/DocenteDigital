import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const ai=require('../api/ai.js');
const status=require('../api/ai-status.js');
const image=require('../api/image.js');
const previousKey=process.env.OPENAI_API_KEY;
const previousFlag=process.env.DD_AI_BETA_ENABLED;
const previousEnvironment=process.env.VERCEL_ENV;
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
  process.env.VERCEL_ENV='preview';
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
  // Paid beta must never run in production or an unknown environment, even
  // when all six secrets/switches exist. Verify denial before Redis or GPT.
  const quotaBeforeProduction=quotaCount;
  const beforeProductionFetch=globalThis.fetch;
  let productionNetworkCalls=0;
  globalThis.fetch=async()=>{productionNetworkCalls++;throw Error('Production must not call quota or OpenAI');};
  process.env.VERCEL_ENV='production';
  res=await call(status,'GET');
  assert.equal(res.body.environment_allowed,false);
  assert.equal(res.body.enabled,false);
  assert.equal(res.body.text,false);
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,403);
  assert.equal(res.body.error,'ai_preview_only');
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,403);
  assert.equal(res.body.error,'ai_preview_only');
  delete process.env.VERCEL_ENV;
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
  assert.equal(res.statusCode,403,'Unknown deployment environment must fail closed');
  assert.equal(quotaCount,quotaBeforeProduction);
  assert.equal(productionNetworkCalls,0);
  globalThis.fetch=beforeProductionFetch;
  process.env.VERCEL_ENV='preview';
  res=await call(status,'GET');
  assert.equal(res.body.environment_allowed,true);
  assert.equal(res.body.enabled,true);
  assert.equal(res.body.text,true);

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
  assert.match(payload.instructions,/YA saben o practican/,'The provider must distinguish prior knowledge from the new challenge');
  assert.match(payload.instructions,/propósito → actividad por grado → evidencia → criterio/,'The provider must receive pedagogical traceability rules');
  // The browser may inadvertently contain identifiers; scrub obvious PII on
  // the server before any paid provider call, preserving the educational task.
  res=await call(ai,'POST',{task:'material',
    prompt:'Propón una ficha para hortalizas. Alumna: Luisa Rojas; contacto anita@example.pe.',
    context:{
      sourceText:'Estudiante: Ana Pérez, DNI 12345678, celular 987 654 321. Practicamos la siembra de hortalizas.',
      purpose:'Sembrar hortalizas y registrar cambios',
      grades:['1.º','3.º','5.º']
    }
  });
  assert.equal(res.statusCode,200);
  const privatePayload=JSON.stringify(JSON.parse(captured.options.body));
  assert.ok(privatePayload.includes('Estudiante: [nombre omitido]'), 'Mixed-case student label must be anonymized');
  assert.ok(privatePayload.includes('Alumna: [nombre omitido]'), 'Mixed-case pupil label must be anonymized');
  for(const leak of ['Ana Pérez','Luisa Rojas','12345678','987 654 321','anita@example.pe'])
    assert.equal(privatePayload.includes(leak),false,'Provider received a recognized private identifier: '+leak);
  for(const safe of ['[nombre omitido]','[correo omitido]','DNI [omitido]','[teléfono omitido]',
    'siembra de hortalizas','Sembrar hortalizas','1.º','3.º','5.º'])
    assert.ok(privatePayload.includes(safe),'Redaction discarded teaching content or placeholder: '+safe);

  // A common Peruvian DNI written in groups must never reach paid providers.
  res=await call(ai,'POST',{task:'material',
    prompt:'Prepara ejercicios sobre hortalizas. DNI: 1234 5678.',
    context:{sourceText:'Ficha de cultivo. Documento nacional de identidad N° 4321-8765.'}
  });
  assert.equal(res.statusCode,200);
  const spacedDniPayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const dni of ['1234 5678','4321-8765'])
    assert.equal(spacedDniPayload.includes(dni),false,'Formatted DNI leaked to text provider: '+dni);
  assert.ok(spacedDniPayload.includes('DNI [omitido]'));
  assert.ok(spacedDniPayload.includes('hortalizas'),'Privacy redaction removed the learning topic');

  // Common Peruvian DNI prefixes previously leaked identifiers into the provider.
  // Check the actual mocked paid-provider payload, not just the redaction helper.
  res=await call(ai,'POST',{task:'material',
    prompt:'Crea ejercicios. DNI N.º 1234 5678; DNI Nro. 87654321; DNI: N.º 1122-3344.',
    context:{sourceText:'Documento nacional de identidad N.° 44332211. Practicamos la siembra de hortalizas.'}
  });
  assert.equal(res.statusCode,200);
  const prefixedDniPayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const leak of ['1234 5678','87654321','1122-3344','44332211'])
    assert.equal(prefixedDniPayload.includes(leak),false,'Prefixed DNI leaked to GPT: '+leak);
  assert.ok(prefixedDniPayload.includes('DNI [omitido]'));
  assert.match(prefixedDniPayload,/siembra de hortalizas/,
    'DNI redaction must preserve the pedagogical context');

  // Regression: hyphenated pupil names and slash-separated DNI must not reach GPT.
  res=await call(ai,'POST',{task:'material',
    prompt:'Prepara una ficha para Alumna: Ana-María Pérez. D.N.I. 1234/5678.',
    context:{sourceText:'Estudiante: José-Luis Quispe; cultivamos hortalizas.'}
  });
  assert.equal(res.statusCode,200);
  const hyphenatedPrivacyPayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const leak of ['Ana-María','Pérez','José-Luis','Quispe','1234/5678'])
    assert.equal(hyphenatedPrivacyPayload.includes(leak),false,'Unredacted private identifier in GPT payload: '+leak);
  assert.match(hyphenatedPrivacyPayload,/\[nombre omitido\]/);
  assert.match(hyphenatedPrivacyPayload,/DNI \[omitido\]/);
  assert.match(hyphenatedPrivacyPayload,/hortalizas/);

  // Compound surnames with lower-case particles previously leaked "de la Cruz".
  // The old /i expression also erased verbs following a student's first name.
  res=await call(ai,'POST',{task:'material',
    prompt:'Estudiante: Ana María de la Cruz aprende a sembrar hortalizas.',
    context:{sourceText:'ESTUDIANTE: JOSÉ DE LA CRUZ. Registro de semillas de lechuga.'}
  });
  assert.equal(res.statusCode,200);
  const compoundNamePayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const leak of ['Ana María','de la Cruz','JOSÉ DE LA CRUZ'])
    assert.equal(compoundNamePayload.includes(leak),false,'Compound name leaked to GPT: '+leak);
  assert.match(compoundNamePayload,/aprende a sembrar hortalizas/,
    'Name redaction must preserve the learning activity after a labeled pupil');
  assert.match(compoundNamePayload,/Registro de semillas de lechuga/,
    'Name redaction must preserve context after an uppercase pupil name');

  res=await call(ai,'POST',{task:'material',prompt:'Ficha de hortalizas',context:{
    purpose:'Aprender a sembrar hortalizas',product:'Biohuerto escolar',
    criterion:'Justifica la selección de semillas',evidence:'Registro de siembra'
  }});
  assert.equal(res.statusCode,200);
  const materialPayload=JSON.parse(captured.options.body);
  assert.match(materialPayload.instructions,/aprendizaje NUEVO/);
  for(const value of ['Aprender a sembrar hortalizas','Biohuerto escolar','Justifica la selección de semillas','Registro de siembra'])
    assert.ok(materialPayload.input[0].content[0].text.includes(value),'Missing linked material context: '+value);


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

  // Provider HTTP 200 with valid JSON but no usable content must be rejected.
  const mockedText=(data)=>async()=>({ok:true,status:200,json:async()=>({
    status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(data)}]}]
  })});
  globalThis.fetch=mockedText({result:'  ',options:[],warnings:[],teacher_note:''});
  res=await call(ai,'POST',{task:'contextual_help',prompt:'Explica el tema'});
  assert.equal(res.statusCode,502,'Empty pedagogical output must not be announced as success');
  assert.equal(res.body.error,'invalid_structured_output');

  globalThis.fetch=mockedText({result:'Títulos',options:['Opción A','Opción B'],warnings:[],teacher_note:''});
  res=await call(ai,'POST',{task:'title_options',prompt:'Tres títulos'});
  assert.equal(res.statusCode,502,'Title picker requires exactly three alternatives');

  globalThis.fetch=mockedText({result:'Títulos',options:['Opción A',' opción a ','Opción C'],warnings:[],teacher_note:''});
  res=await call(ai,'POST',{task:'title_options',prompt:'Tres títulos'});
  assert.equal(res.statusCode,502,'Duplicate title proposals must be rejected');

  globalThis.fetch=mockedText({result:'Títulos',options:['Opción A','Opción B','Opción C'],warnings:[],teacher_note:''});
  res=await call(ai,'POST',{task:'title_options',prompt:'Tres títulos'});
  assert.equal(res.statusCode,200,'Three distinct title proposals remain accepted');
  assert.equal(res.body.data.options.length,3);

  delete process.env.OPENAI_API_KEY;
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,503);
  process.env.OPENAI_API_KEY='test-only-not-a-real-secret';
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:false});
  assert.equal(res.statusCode,402,'Image credits require explicit confirmation');
  globalThis.fetch=async(url,options)=>{
    captured={url,options};
    return {ok:true,status:200,json:async()=>({data:[{b64_json:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9f4NvK0AAAAASUVORK5CYII='}]})};
  };
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true,size:'1024x1536',quality:'medium'});
  assert.equal(res.statusCode,200);
  assert.equal(res.body.image_base64,'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9f4NvK0AAAAASUVORK5CYII=');
  assert.equal(res.headers['cache-control'],'no-store');
  assert.equal(captured.url,'https://api.openai.com/v1/images/generations');
  const imagePayload=JSON.parse(captured.options.body);
  assert.equal(imagePayload.model,'gpt-image-2');
  assert.equal(imagePayload.n,1);
  res=await call(image,'POST',{prompt:'Dibuja semillas para la alumna: María Quispe. DNI: 87654321. Contacto: 912 345 678.',confirmedCredit:true});
  assert.equal(res.statusCode,200);
  const privateImagePrompt=JSON.parse(captured.options.body).prompt;
  for(const leak of ['María Quispe','87654321','912 345 678'])
    assert.equal(privateImagePrompt.includes(leak),false,'Image API received personal data: '+leak);
  assert.match(privateImagePrompt,/Dibuja semillas/,'Image safety must not erase the learning topic');
  res=await call(image,'POST',{prompt:'Dibuja hortalizas, DNI N° 1122.3344',confirmedCredit:true});
  assert.equal(res.statusCode,200);
  const groupedDniImagePrompt=JSON.parse(captured.options.body).prompt;
  assert.equal(groupedDniImagePrompt.includes('1122.3344'),false,'Formatted DNI leaked to image provider');
  assert.match(groupedDniImagePrompt,/Dibuja hortalizas/);

  res=await call(image,'POST',{prompt:'Dibuja hortalizas. Alumna: Ana-María Pérez; D.N.I. 1234/5678.',confirmedCredit:true});
  assert.equal(res.statusCode,200);
  const hyphenatedImagePrompt=JSON.parse(captured.options.body).prompt;
  for(const leak of ['Ana-María','Pérez','1234/5678'])
    assert.equal(hyphenatedImagePrompt.includes(leak),false,'Unredacted private identifier in image prompt: '+leak);
  assert.match(hyphenatedImagePrompt,/Dibuja hortalizas/);
  res=await call(image,'POST',{prompt:'Dibuja hortalizas. Alumna: María de la Cruz observa semillas.',confirmedCredit:true});
  assert.equal(res.statusCode,200);
  const compoundImagePrompt=JSON.parse(captured.options.body).prompt;
  for(const leak of ['María de la Cruz','de la Cruz'])
    assert.equal(compoundImagePrompt.includes(leak),false,'Compound name leaked to image provider: '+leak);
  assert.match(compoundImagePrompt,/observa semillas/,
    'Image prompt lost its pedagogical action after removing a name');

  // Provider HTTP 200 with a nonempty base64 string that is not PNG must fail.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:'ZmFrZS1wbmc='}]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,502,'Fake base64 must not be shown as a PNG image');
  assert.equal(res.body.error,'invalid_image_output');
  // A truncated PNG header must also be rejected.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:'iVBORw0KGgo='}]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,502,'Truncated PNG must not be accepted');
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
  if(previousEnvironment===undefined)delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV=previousEnvironment;
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
