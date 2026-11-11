// Phase 43: Prepared Preview only. No provider calls, quota writes or secrets.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {AUTHORIZED_BRANCH,betaEnvironmentAllowed}=require('../api/_ai-beta-environment.js');
const {paidRequestsAllowed}=require('../api/_ai-paid-approval.js');
const ai=require('../api/ai.js'),image=require('../api/image.js'),status=require('../api/ai-status.js');
const names=['VERCEL_ENV','VERCEL_GIT_COMMIT_REF','DD_AI_BETA_ENABLED','DD_AI_PAID_CALLS_ENABLED',
 'OPENAI_API_KEY','DD_AI_BETA_TOKEN','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','DD_AI_DAILY_MAX_UNITS'];
const saved=Object.fromEntries(names.map(x=>[x,process.env[x]]));
const previousFetch=globalThis.fetch;
let externalCalls=0;
async function request(handler,method='POST',body={}){
 const res={statusCode:200,headers:{},body:null,
   setHeader(k,v){this.headers[k.toLowerCase()]=v;},end(raw){this.body=JSON.parse(raw);}};
 await handler({method,body,headers:{}},res);
 return res;
}
try{
 globalThis.fetch=async()=>{externalCalls++;throw Error('No external network calls authorized');};
 process.env.VERCEL_ENV='preview';
 process.env.VERCEL_GIT_COMMIT_REF=AUTHORIZED_BRANCH;
 assert.equal(AUTHORIZED_BRANCH,'preview/docentedigital-fase10-20261030');
 assert.equal(betaEnvironmentAllowed(),true);
 process.env.OPENAI_API_KEY='not-a-real-key-test-only';
 process.env.DD_AI_BETA_ENABLED='true';
 process.env.DD_AI_BETA_TOKEN='mock-token-length-greater-than-thirty-two';
 process.env.UPSTASH_REDIS_REST_URL='https://quota.example.test';
 process.env.UPSTASH_REDIS_REST_TOKEN='mock-redis-token';
 process.env.DD_AI_DAILY_MAX_UNITS='10';
 delete process.env.DD_AI_PAID_CALLS_ENABLED;
 let res=await request(status,'GET');
 assert.equal(res.body.configured,true);
 assert.equal(res.body.enabled,false);
 assert.equal(res.body.paid_calls_enabled,false);
 assert.equal(res.body.text,false);
 assert.equal(res.body.requires_explicit_paid_activation,true);
 for(const handler of [ai,image]){
   res=await request(handler,'POST',{task:'contextual_help',prompt:'Derechos de segundo grado',confirmedCredit:true});
   assert.equal(res.statusCode,503);
   assert.equal(res.body.error,'ai_paid_calls_disabled');
 }
 for(const invalid of ['1','yes','TRUE','on','false','']){
   process.env.DD_AI_PAID_CALLS_ENABLED=invalid;
   assert.equal(paidRequestsAllowed(),false);
   res=await request(ai,'POST',{task:'contextual_help',prompt:'Hola'});
   assert.equal(res.statusCode,503);
 }
 assert.equal(externalCalls,0);
 process.env.DD_AI_PAID_CALLS_ENABLED='true';
 assert.equal(paidRequestsAllowed(),true);
 // No paid endpoint on the authorized branch is invoked with both flags true.
 for(const [env,ref] of [['production',AUTHORIZED_BRANCH],['preview','unapproved-branch'],
                         ['preview',undefined],[undefined,AUTHORIZED_BRANCH]]){
   if(env===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=env;
   if(ref===undefined)delete process.env.VERCEL_GIT_COMMIT_REF;else process.env.VERCEL_GIT_COMMIT_REF=ref;
   assert.equal(betaEnvironmentAllowed(),false);
   res=await request(status,'GET');
   assert.equal(res.body.text,false);
   res=await request(ai,'POST',{task:'contextual_help',prompt:'Hola'});
   assert.equal(res.statusCode,403);
   res=await request(image,'POST',{prompt:'Imagen',confirmedCredit:true});
   assert.equal(res.statusCode,403);
 }
 assert.equal(externalCalls,0);
 console.log('PASS v43: GPT Preview authorized; independent billing switch OFF by default and no network calls');
}finally{
 globalThis.fetch=previousFetch;
 for(const name of names){if(saved[name]===undefined)delete process.env[name];else process.env[name]=saved[name];}
}
