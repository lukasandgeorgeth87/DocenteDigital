// Durable, global daily admission limit for paid beta AI calls.
// Uses one atomic Redis EVAL over Upstash REST; never falls back to process memory.
const SCRIPT=[
  "local used=tonumber(redis.call('GET',KEYS[1]) or '0')",
  "local cost=tonumber(ARGV[1])",
  "local max=tonumber(ARGV[2])",
  "if used + cost > max then return -1 end",
  "local next=redis.call('INCRBY',KEYS[1],cost)",
  "if used == 0 then redis.call('EXPIRE',KEYS[1],172800) end",
  "return next"
].join('\n');

function quotaConfig(){
  const url=process.env.UPSTASH_REDIS_REST_URL;
  const token=process.env.UPSTASH_REDIS_REST_TOKEN;
  const limit=Number(process.env.DD_AI_DAILY_MAX_UNITS);
  if(typeof url!=='string'||!/^https:\/\/[^/?#]+\/?$/.test(url))return null;
  if(typeof token!=='string'||!token.trim())return null;
  if(!Number.isSafeInteger(limit)||limit<1||limit>10000)return null;
  return {url:url.replace(/\/$/,''),token,limit};
}

async function reserveQuota(kind){
  const cfg=quotaConfig();
  if(!cfg)return {status:503,error:'ai_quota_not_configured'};
  const cost=kind==='image'?5:1;
  if(cost>cfg.limit)return {status:429,error:'ai_daily_quota_exceeded'};
  const day=new Date().toISOString().slice(0,10);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),2500);
  try{
    const response=await fetch(cfg.url,{
      method:'POST',
      headers:{Authorization:'Bearer '+cfg.token,'Content-Type':'application/json'},
      body:JSON.stringify(['EVAL',SCRIPT,'1','dd:beta:ai-quota:'+day,String(cost),String(cfg.limit)]),
      signal:controller.signal
    });
    if(!response.ok)return {status:503,error:'ai_quota_unavailable'};
    const data=await response.json();
    if(data?.result===-1)return {status:429,error:'ai_daily_quota_exceeded'};
    if(!Number.isSafeInteger(data?.result)||data.result<cost||data.result>cfg.limit)return {status:503,error:'ai_quota_unavailable'};
    return null;
  }catch(_error){
    return {status:503,error:'ai_quota_unavailable'};
  }finally{
    clearTimeout(timer);
  }
}

module.exports={quotaConfig,reserveQuota};
