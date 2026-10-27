import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {crc32,deflateSync} from 'node:zlib';

const require=createRequire(import.meta.url);
const ai=require('../api/ai.js');
const status=require('../api/ai-status.js');
const image=require('../api/image.js');
const previousKey=process.env.OPENAI_API_KEY;
const previousFlag=process.env.DD_AI_BETA_ENABLED;
const previousEnvironment=process.env.VERCEL_ENV;
const previousBranch=process.env.VERCEL_GIT_COMMIT_REF;
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
  // Exercise the authorized Preview branch by default; negative branch cases below override it.
  process.env.VERCEL_GIT_COMMIT_REF='audit/v5-continuity-offline-diagnostic';
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
  // A foreign or unidentified Preview must never inherit billable AI access.
  // This applies to BOTH paid endpoints and the status advertised to clients.
  process.env.VERCEL_ENV='preview';
  for(const branch of [undefined,'another-preview-branch']){
    if(branch===undefined)delete process.env.VERCEL_GIT_COMMIT_REF;
    else process.env.VERCEL_GIT_COMMIT_REF=branch;
    res=await call(status,'GET');
    assert.equal(res.body.environment_allowed,false,'Unapproved Preview branch must not be advertised as ready');
    assert.equal(res.body.text,false);
    assert.equal(res.body.image,false);
    res=await call(ai,'POST',{task:'contextual_help',prompt:'Hola'});
    assert.equal(res.statusCode,403,'Unapproved Preview branch must not bill text');
    res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
    assert.equal(res.statusCode,403,'Unapproved Preview branch must not bill images');
  }
  assert.equal(quotaCount,quotaBeforeProduction,'Foreign Preview must not consume quota');
  assert.equal(productionNetworkCalls,0,'Foreign Preview must not contact Redis or OpenAI');
  globalThis.fetch=beforeProductionFetch;
  process.env.VERCEL_GIT_COMMIT_REF='audit/v5-continuity-offline-diagnostic';
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

  // School rosters often use "Nombres y apellidos" instead of "Estudiante".
  // Assert the actual outgoing provider request contains no labeled pupil names.
  res=await call(ai,'POST',{task:'material',
    prompt:'Nombres y apellidos: Ana María Pérez. Explica fracciones equivalentes.',
    context:{sourceText:'Nombre completo: Juan Carlos de la Cruz. Apellidos y nombres: Quispe Huamán Lucía. Nombre del estudiante: Diego Rojas. Actividad de mercado de Calca.'}
  });
  assert.equal(res.statusCode,200);
  const rosterPayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const leak of ['Ana María Pérez','Juan Carlos de la Cruz','Quispe Huamán Lucía','Diego Rojas'])
    assert.equal(rosterPayload.includes(leak),false,'School roster name leaked to GPT: '+leak);
  for(const preserved of ['fracciones equivalentes','mercado de Calca','[nombre omitido]'])
    assert.ok(rosterPayload.includes(preserved),'Roster redaction lost teaching content: '+preserved);

  // Uppercase school-roster headings and alternate separators previously leaked
  // pupils' names. Verify the outgoing mocked provider payload, not only helper output.
  res=await call(ai,'POST',{task:'material',
    prompt:'NOMBRES Y APELLIDOS: ANA MARÍA PÉREZ. Explica fracciones equivalentes. Nombre Completo = Juan Carlos de la Cruz.',
    context:{sourceText:'APELLIDOS Y NOMBRES - QUISPE HUAMÁN LUCÍA. Nombre del Estudiante: Diego Rojas. Actividad de mercado.'}
  });
  assert.equal(res.statusCode,200);
  const uppercaseRosterPayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const leak of ['ANA MARÍA PÉREZ','Juan Carlos de la Cruz','QUISPE HUAMÁN LUCÍA','Diego Rojas'])
    assert.equal(uppercaseRosterPayload.includes(leak),false,'Uppercase or separated roster name leaked to GPT: '+leak);
  for(const safe of ['[nombre omitido]','fracciones equivalentes','Actividad de mercado'])
    assert.ok(uppercaseRosterPayload.includes(safe),'Roster privacy removed teaching context: '+safe);

  // Privacy regression: common school labels and parenthesized/slash-formatted
  // Peruvian mobile numbers must be removed from the actual GPT payload.
  res=await call(ai,'POST',{task:'material',
    prompt:'Niña: Rosa Quispe. Alumno/a: Ana María Pérez. WhatsApp (+51) 987/654/321. Aprendemos fracciones.',
    context:{sourceText:'Niño: José Luis de la Cruz. Alumno(a): Pedro Huamán. Escolar: Lucía Ramos. Celular (51) 912-345-678. Registro de semillas.'}
  });
  assert.equal(res.statusCode,200);
  const aliasPrivacyPayload=JSON.stringify(JSON.parse(captured.options.body));
  for(const leak of ['Rosa Quispe','Ana María Pérez','José Luis de la Cruz','Pedro Huamán','Lucía Ramos','987/654/321','912-345-678','(+51)','(51)'])
    assert.equal(aliasPrivacyPayload.includes(leak),false,'School alias or phone leaked to GPT: '+leak);
  for(const safe of ['[nombre omitido]','[teléfono omitido]','Aprendemos fracciones','Registro de semillas'])
    assert.ok(aliasPrivacyPayload.includes(safe),'Privacy redaction removed the learning task: '+safe);

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
    return {ok:true,status:200,json:async()=>({data:[{b64_json:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg=='}]})};
  };
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true,size:'1024x1536',quality:'medium'});
  assert.equal(res.statusCode,200);
  assert.equal(res.body.image_base64,'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==');
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
  res=await call(image,'POST',{
    prompt:'Ilustra semillas. Niña: Rosa Quispe. WhatsApp (+51) 987/654/321.',confirmedCredit:true
  });
  assert.equal(res.statusCode,200);
  const aliasImagePrompt=JSON.parse(captured.options.body).prompt;
  for(const leak of ['Rosa Quispe','987/654/321','(+51)'])
    assert.equal(aliasImagePrompt.includes(leak),false,'Image provider received school PII: '+leak);
  assert.match(aliasImagePrompt,/Ilustra semillas/);
  assert.match(aliasImagePrompt,/\[nombre omitido\]/);
  assert.match(aliasImagePrompt,/\[teléfono omitido\]/);
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

  res=await call(image,'POST',{prompt:'Ficha de fracciones. Nombres y apellidos: Ana María Pérez.',confirmedCredit:true});
  assert.equal(res.statusCode,200);
  const rosterImagePrompt=JSON.parse(captured.options.body).prompt;
  assert.equal(rosterImagePrompt.includes('Ana María Pérez'),false,'School roster name leaked to image provider');
  assert.match(rosterImagePrompt,/Ficha de fracciones/);

  // Provider HTTP 200 with a nonempty base64 string that is not PNG must fail.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:'ZmFrZS1wbmc='}]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,502,'Fake base64 must not be shown as a PNG image');
  assert.equal(res.body.error,'invalid_image_output');
  // A truncated PNG header must also be rejected.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:'iVBORw0KGgo='}]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,502,'Truncated PNG must not be accepted');
  // The old 1x1 fixture had a corrupt IDAT CRC; a valid PNG must pass,
  // while an IHDR-looking payload, corrupt CRC or missing IEND must fail.
  // These previously slipped past the signature-only validator.
  const validPng='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==';
  // A provider URL is not an image validation substitute. The paid endpoint
  // requests PNG bytes, so URL-only and invalid-PNG-with-URL must fail closed.
  for(const providerImage of [
    {url:'https://untrusted.example.test/worksheet.png'},
    {b64_json:'ZmFrZS1wbmc=',url:'https://untrusted.example.test/worksheet.png'}
  ]){
    globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[providerImage]})});
    res=await call(image,'POST',{prompt:'Ficha escolar',confirmedCredit:true});
    assert.equal(res.statusCode,502,'An image URL must not bypass PNG validation');
    assert.equal(res.body.error,'invalid_image_output');
  }
  // A valid PNG may be accepted, but a second URL must not reach the client.
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{
    b64_json:validPng,url:'https://untrusted.example.test/track.png'
  }]})});
  res=await call(image,'POST',{prompt:'Ficha escolar',confirmedCredit:true});
  assert.equal(res.statusCode,200,'Valid PNG bytes remain accepted');
  assert.equal(res.body.image_base64,validPng);
  assert.equal(res.body.image_url,null,'Provider URL must not be forwarded to the teacher browser');
  const damagedPng=Buffer.from(validPng,'base64');
  damagedPng[45]^=1;
  // A valid CRC alone does not prove the IDAT zlib stream can be decoded.
  const forgedZlibPng=Buffer.from(validPng,'base64');
  const idatAt=forgedZlibPng.indexOf(Buffer.from('IDAT'));
  assert.ok(idatAt>0);
  const idatLength=forgedZlibPng.readUInt32BE(idatAt-4);
  forgedZlibPng[idatAt+4]^=0xff;
  forgedZlibPng.writeUInt32BE(
    crc32(forgedZlibPng.subarray(idatAt,idatAt+4+idatLength)),
    idatAt+4+idatLength
  );
  const oversizedPng=Buffer.from(validPng,'base64');
  const ihdrAt=oversizedPng.indexOf(Buffer.from('IHDR'));
  oversizedPng.writeUInt32BE(8193,ihdrAt+4);
  oversizedPng.writeUInt32BE(crc32(oversizedPng.subarray(ihdrAt,ihdrAt+17)),ihdrAt+17);
  // Adam7: even with correct CRC and zlib, each interlaced pass needs
  // the exact scanline length and a PNG filter byte between 0 and 4.
  const pngChunk=(type,data)=>{
    const chunk=Buffer.alloc(data.length+12);
    chunk.writeUInt32BE(data.length,0);
    chunk.write(type,4,4,'ascii');
    data.copy(chunk,8);
    chunk.writeUInt32BE(crc32(chunk.subarray(4,chunk.length-4)),chunk.length-4);
    return chunk;
  };
  const interlacedPng=(scanlines)=>{
    const header=Buffer.alloc(13);
    header.writeUInt32BE(1,0);
    header.writeUInt32BE(1,4);
    header[8]=8;header[9]=6;header[12]=1;
    return Buffer.concat([
      Buffer.from([137,80,78,71,13,10,26,10]),
      pngChunk('IHDR',header),
      pngChunk('IDAT',deflateSync(Buffer.from(scanlines))),
      pngChunk('IEND',Buffer.alloc(0))
    ]).toString('base64');
  };
  // PNG palette and critical-chunk regressions: CRC and zlib alone do not
  // prove a decoder can display an indexed image.
  const pngWithChunks=(colorType,bitDepth,beforeIdat=[],idatTail=Buffer.alloc(0))=>{
    const header=Buffer.alloc(13);
    header.writeUInt32BE(1,0);
    header.writeUInt32BE(1,4);
    header[8]=bitDepth;header[9]=colorType;
    const raw=colorType===6?[0,255,0,0,255]:[0,0];
    return Buffer.concat([
      Buffer.from([137,80,78,71,13,10,26,10]),
      pngChunk('IHDR',header),
      ...beforeIdat,
      pngChunk('IDAT',Buffer.concat([deflateSync(Buffer.from(raw)),idatTail])),
      pngChunk('IEND',Buffer.alloc(0))
    ]).toString('base64');
  };
  const redPalette=pngChunk('PLTE',Buffer.from([255,0,0]));
  const validIndexed=pngWithChunks(3,8,[redPalette]);
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:validIndexed}]})});
  res=await call(image,'POST',{prompt:'Paleta escolar',confirmedCredit:true});
  assert.equal(res.statusCode,200,'A valid indexed PNG with PLTE must remain supported');
  assert.equal(res.body.image_base64,validIndexed);
  const invalidPalettePngs=[
    // CRC-correct IDAT with junk after a complete zlib stream must fail.
    // inflateSync without info:true silently accepts this malformed PNG.
    pngWithChunks(6,8,[],Buffer.from([0xde,0xad,0xbe,0xef])),
    pngWithChunks(3,8), // Missing required PLTE.
    pngWithChunks(3,8,[pngChunk('PLTE',Buffer.from([255,0]))]), // Partial RGB triplet.
    pngWithChunks(3,1,[pngChunk('PLTE',Buffer.from([255,0,0,0,255,0,0,0,255]))]), // More colors than 1-bit allows.
    pngWithChunks(3,8,[redPalette,redPalette]), // Duplicate palette.
    pngWithChunks(0,8,[redPalette]), // Grayscale forbids PLTE.
    pngWithChunks(6,8,[pngChunk('ABCD',Buffer.from([1]))]) // Unknown critical chunk.
  ];
  for(const invalid of invalidPalettePngs){
    globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:invalid}]})});
    res=await call(image,'POST',{prompt:'Paleta escolar',confirmedCredit:true});
    assert.equal(res.statusCode,502,'Malformed PNG palette or unknown critical chunk must be rejected');
    assert.equal(res.body.error,'invalid_image_output');
  }
  const validAdam7=interlacedPng([0,255,0,0,255]);
  globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:validAdam7}]})});
  res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
  assert.equal(res.statusCode,200,'Valid Adam7 PNG must remain supported');
  assert.equal(res.body.image_base64,validAdam7);
  for(const invalid of [
    interlacedPng([5,255,0,0,255]), // Invalid filter, valid CRC and zlib.
    interlacedPng([0,255,0,0,255,0]), // Extra decompressed bytes.
    interlacedPng([0]), // Truncated pass.

    forgedZlibPng.toString('base64'),
    oversizedPng.toString('base64'),
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9f4NvK0AAAAASUVORK5CYII=',
    'iVBORw0KGgoAAAANSUhEUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    damagedPng.toString('base64'),
    Buffer.from(validPng,'base64').subarray(0,-12).toString('base64')
  ]){
    globalThis.fetch=async()=>({ok:true,status:200,json:async()=>({data:[{b64_json:invalid}]})});
    res=await call(image,'POST',{prompt:'Imagen escolar',confirmedCredit:true});
    assert.equal(res.statusCode,502,'Malformed PNG must never be delivered as a valid worksheet image');
    assert.equal(res.body.error,'invalid_image_output');
  }
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
  if(previousBranch===undefined)delete process.env.VERCEL_GIT_COMMIT_REF;
  else process.env.VERCEL_GIT_COMMIT_REF=previousBranch;
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
