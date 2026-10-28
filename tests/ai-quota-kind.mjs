import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {reserveQuota}=require('../api/_ai-quota.js');
const keys=['UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','DD_AI_DAILY_MAX_UNITS'];
const original=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const originalFetch=globalThis.fetch;
let calls=0;
let used=0;
try{
  process.env.UPSTASH_REDIS_REST_URL='https://quota.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN='synthetic-test-token';
  process.env.DD_AI_DAILY_MAX_UNITS='6';
  globalThis.fetch=async(url,options)=>{
    calls++;
    assert.equal(url,'https://quota.example.test');
    assert.equal(options.method,'POST');
    assert.equal(options.headers.Authorization,'Bearer synthetic-test-token');
    const [command,script,numberOfKeys,key,cost,limit]=JSON.parse(options.body);
    assert.equal(command,'EVAL');
    assert.equal(typeof script,'string');
    assert.equal(numberOfKeys,'1');
    assert.equal(key,'dd:beta:ai-quota:'+new Date().toISOString().slice(0,10));
    assert.equal(limit,'6');
    const n=Number(cost);
    assert.ok(n===1||n===5,'An unexpected cost reached Redis');
    if(used+n>Number(limit))return {ok:true,json:async()=>({result:-1})};
    used+=n;
    return {ok:true,json:async()=>({result:used})};
  };
  for(const invalid of [undefined,null,'','images','Image','IMAGE','teacher',0,{},['image']]){
    assert.deepEqual(await reserveQuota(invalid),
      {status:400,error:'ai_quota_invalid_kind'},
      'Unknown kind must fail closed: '+String(invalid));
  }
  assert.equal(calls,0,'Invalid kind contacted Redis');
  assert.equal(await reserveQuota('text'),null,'Text should reserve one unit');
  assert.equal(await reserveQuota('image'),null,'Image should reserve five units');
  assert.equal(used,6);
  assert.deepEqual(await reserveQuota('text'),
    {status:429,error:'ai_daily_quota_exceeded'});
  assert.equal(used,6,'Exceeded quota must not increment the balance');
  assert.equal(calls,3,'Only valid operations should contact Redis');
  console.log('AI_QUOTA_KIND_PASS: invalid kinds rejected without network; text=1, image=5, exceeded=429 (mock Redis)');
}finally{
  globalThis.fetch=originalFetch;
  for(const k of keys){
    if(original[k]===undefined)delete process.env[k];
    else process.env[k]=original[k];
  }
}
