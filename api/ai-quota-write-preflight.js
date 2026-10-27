// Explicit, private Preview-only write probe for the GPT quota Redis backend.
// Writes ONLY to an expiring synthetic key, never to the daily paid quota key.
// Never contacts OpenAI or enables the paid GPT feature flag.
const {quotaConfig}=require('./_ai-quota');
const {checkBetaAccess}=require('./_beta-access');
const {betaEnvironmentAllowed}=require('./_ai-beta-environment');
const BRANCH='audit/v5-continuity-offline-diagnostic';
const SCRIPT=[
  "redis.call('INCRBY',KEYS[1],1)",
  "redis.call('EXPIRE',KEYS[1],60)",
  "return redis.call('TTL',KEYS[1])"
].join('\n');
function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return send(res,405,{ok:false,error:'method_not_allowed'});
  if(!betaEnvironmentAllowed()||process.env.VERCEL_GIT_COMMIT_REF!==BRANCH)
    return send(res,403,{ok:false,error:'ai_preview_branch_only'});
  const denied=checkBetaAccess(req);
  if(denied)return send(res,denied.status,{ok:false,error:denied.error});
  if(req.headers?.['x-dd-quota-write-confirm']!=='synthetic-only')
    return send(res,400,{ok:false,error:'synthetic_write_confirmation_required'});
  const cfg=quotaConfig();
  if(!cfg)return send(res,503,{ok:false,error:'ai_quota_not_configured'});
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),2500);
  try{
    const response=await fetch(cfg.url,{
      method:'POST',
      headers:{Authorization:'Bearer '+cfg.token,'Content-Type':'application/json'},
      body:JSON.stringify(['EVAL',SCRIPT,'1','dd:beta:quota-preflight:synthetic']),
      signal:controller.signal
    });
    if(!response.ok)return send(res,503,{ok:false,error:'ai_quota_write_unavailable'});
    const data=await response.json().catch(()=>({}));
    if(!Number.isInteger(data?.result)||data.result<1||data.result>60)
      return send(res,503,{ok:false,error:'ai_quota_write_unavailable'});
    return send(res,200,{
      ok:true,quota_atomic_write_tested:true,synthetic_key_ttl_seconds:data.result,
      daily_quota_unchanged:true,provider_tested:false,paid_call:false,
      beta_enabled:process.env.DD_AI_BETA_ENABLED==='true'
    });
  }catch(_error){
    return send(res,503,{ok:false,error:'ai_quota_write_unavailable'});
  }finally{clearTimeout(timer);}
};
