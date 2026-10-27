import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const preflight=require('../api/ai-preflight.js');
const keys=['VERCEL_ENV','DD_AI_BETA_TOKEN','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','DD_AI_DAILY_MAX_UNITS','OPENAI_API_KEY','DD_AI_BETA_ENABLED'];
const old=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const oldFetch=globalThis.fetch;
const token='local-preflight-test-token-at-least-32-chars';
let calls=0;
async function request(method='GET',headers={'x-dd-beta-token':token}){
  const res={statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k.toLowerCase()]=v;},end(s){this.body=JSON.parse(s);}};
  await preflight({method,headers},res);
  return res;
}
try{
  process.env.VERCEL_ENV='preview';
  process.env.DD_AI_BETA_TOKEN=token;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.DD_AI_DAILY_MAX_UNITS;
  delete process.env.OPENAI_API_KEY;
  delete process.env.DD_AI_BETA_ENABLED;
  globalThis.fetch=async()=>{calls++;throw Error('Network must not run');};
  let res=await request('POST');
  assert.equal(res.statusCode,405);
  res=await request('GET',{});
  assert.equal(res.statusCode,401);
  res=await request('GET',{'x-dd-beta-token':'wrong'});
  assert.equal(res.statusCode,401);
  res=await request();
  assert.equal(res.statusCode,503);
  assert.equal(res.body.error,'ai_quota_not_configured');
  process.env.VERCEL_ENV='production';
  res=await request();
  assert.equal(res.statusCode,403);
  assert.equal(calls,0,'Unauthorized and production requests must not contact Redis');
  process.env.VERCEL_ENV='preview';
  process.env.UPSTASH_REDIS_REST_URL='https://quota.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN='redis-test-only-token';
  process.env.DD_AI_DAILY_MAX_UNITS='10';
  let seen;
  globalThis.fetch=async(url,options)=>{
    calls++;
    seen={url,options};
    return {ok:true,json:async()=>({result:'PONG'})};
  };
  res=await request();
  assert.equal(res.statusCode,200);
  assert.equal(res.body.quota_atomic_eval,true);
  assert.equal(res.body.provider_tested,false);
  assert.equal(res.body.paid_call,false);
  assert.equal(res.body.beta_enabled,false);
  assert.equal(res.body.openai_configured,false);
  assert.equal(res.headers['cache-control'],'no-store');
  assert.equal(seen.url,'https://quota.example.test');
  assert.deepEqual(JSON.parse(seen.options.body),['EVAL',"return redis.call('PING')",'0']);
  assert.equal(seen.options.headers.Authorization,'Bearer redis-test-only-token');
  assert.equal(calls,1,'Preflight must make exactly one non-billable Redis request');
  globalThis.fetch=async()=>({ok:true,json:async()=>({result:'unexpected'})});
  res=await request();
  assert.equal(res.statusCode,503,'An unsupported EVAL result must fail closed');
  globalThis.fetch=async()=>({ok:false,status:403,json:async()=>({error:'denied'})});
  res=await request();
  assert.equal(res.statusCode,503,'Redis permission errors must fail closed');
  globalThis.fetch=async()=>{throw Error('offline');};
  res=await request();
  assert.equal(res.statusCode,503,'Network errors must fail closed');
  console.log('AI_PREFLIGHT_PASS: Preview-only, private token, read-only Redis EVAL, no provider billing, fail closed');
}finally{
  globalThis.fetch=oldFetch;
  for(const key of keys){if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];}
}
