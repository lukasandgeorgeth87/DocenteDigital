import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const handler=require('../api/ai-quota-write-preflight.js');
const keys=['VERCEL_ENV','VERCEL_GIT_COMMIT_REF','DD_AI_BETA_TOKEN','UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN','DD_AI_DAILY_MAX_UNITS','DD_AI_BETA_ENABLED'];
const before=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const originalFetch=globalThis.fetch;
const secret='test-private-token-at-least-thirty-two-characters';
const validHeaders={'x-dd-beta-token':secret,'x-dd-quota-write-confirm':'synthetic-only'};
let calls=0;
async function request(method='POST',headers=validHeaders){
  const res={statusCode:200,headers:{},body:null,
    setHeader(k,v){this.headers[k.toLowerCase()]=v;},
    end(s){this.body=JSON.parse(s);}};
  await handler({method,headers},res);
  return res;
}
try{
  process.env.VERCEL_ENV='preview';
  process.env.VERCEL_GIT_COMMIT_REF='audit/v5-continuity-offline-diagnostic';
  process.env.DD_AI_BETA_TOKEN=secret;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.DD_AI_DAILY_MAX_UNITS;
  delete process.env.DD_AI_BETA_ENABLED;
  globalThis.fetch=async()=>{calls++;throw Error('No network before authorization');};
  let res=await request('GET');
  assert.equal(res.statusCode,405);
  process.env.VERCEL_ENV='production';
  res=await request();
  assert.equal(res.statusCode,403);
  process.env.VERCEL_ENV='preview';
  process.env.VERCEL_GIT_COMMIT_REF='another-branch';
  res=await request();
  assert.equal(res.statusCode,403);
  process.env.VERCEL_GIT_COMMIT_REF='audit/v5-continuity-offline-diagnostic';
  res=await request('POST',{});
  assert.equal(res.statusCode,401);
  res=await request('POST',{'x-dd-beta-token':'wrong','x-dd-quota-write-confirm':'synthetic-only'});
  assert.equal(res.statusCode,401);
  res=await request('POST',{'x-dd-beta-token':secret});
  assert.equal(res.statusCode,400);
  res=await request();
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_quota_not_configured');
  assert.equal(calls,0,'Denied requests must not write or contact Redis');
  process.env.UPSTASH_REDIS_REST_URL='https://quota.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN='synthetic-redis-token';
  process.env.DD_AI_DAILY_MAX_UNITS='2';
  let requestBody;
  globalThis.fetch=async(url,options)=>{
    calls++;
    assert.equal(url,'https://quota.example.test');
    assert.equal(options.headers.Authorization,'Bearer synthetic-redis-token');
    requestBody=JSON.parse(options.body);
    return {ok:true,json:async()=>({result:60})};
  };
  res=await request();
  assert.equal(res.statusCode,200);
  assert.equal(res.body.quota_atomic_write_tested,true);
  assert.equal(res.body.daily_quota_unchanged,true);
  assert.equal(res.body.provider_tested,false);
  assert.equal(res.body.paid_call,false);
  assert.equal(res.body.beta_enabled,false);
  assert.equal(res.headers['cache-control'],'no-store');
  assert.equal(requestBody[0],'EVAL');
  assert.equal(requestBody[2],'1');
  assert.match(requestBody[3],/^dd:beta:quota-preflight:synthetic:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  const firstSyntheticKey=requestBody[3];
  assert.match(requestBody[1],/INCRBY/);
  assert.match(requestBody[1],/EXPIRE/);
  assert.match(requestBody[1],/TTL/);
  assert.doesNotMatch(requestBody[3],/ai-quota:/);
  assert.equal(calls,1,'Exactly one synthetic Redis call per request is allowed');
  res=await request();
  assert.equal(res.statusCode,200);
  assert.equal(calls,2,'Second authorized request must make exactly one more Redis call');
  assert.notEqual(requestBody[3],firstSyntheticKey,'Each preflight must use an isolated expiring key');
  assert.match(requestBody[3],/^dd:beta:quota-preflight:synthetic:/);
  assert.doesNotMatch(requestBody[3],/ai-quota:/);
  for(const result of [0,61,-1,'60',null]){
    globalThis.fetch=async()=>({ok:true,json:async()=>({result})});
    res=await request();
    assert.equal(res.statusCode,503,'Invalid synthetic TTL must fail closed: '+result);
  }
  globalThis.fetch=async()=>({ok:false,status:403,json:async()=>({error:'denied'})});
  res=await request();
  assert.equal(res.statusCode,503);
  globalThis.fetch=async()=>{throw Error('offline');};
  res=await request();
  assert.equal(res.statusCode,503);
  console.log('AI_QUOTA_WRITE_PREFLIGHT_PASS: synthetic TTL key, preview branch, explicit confirmation, private token, fail closed');
}finally{
  globalThis.fetch=originalFetch;
  for(const k of keys){if(before[k]===undefined)delete process.env[k];else process.env[k]=before[k];}
}
