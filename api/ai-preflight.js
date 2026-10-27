// Private, non-billable readiness probe for the Preview GPT beta.
// Checks that the configured Upstash endpoint can execute Redis EVAL
// without reserving quota or contacting OpenAI.
const {quotaConfig}=require('./_ai-quota');
const {checkBetaAccess}=require('./_beta-access');
const {betaEnvironmentAllowed}=require('./_ai-beta-environment');
const BRANCH='audit/v5-continuity-offline-diagnostic';
function send(res,status,body){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(body));
}
module.exports=async function handler(req,res){
  if(req.method!=='GET')return send(res,405,{ok:false,error:'method_not_allowed'});
  if(!betaEnvironmentAllowed()||process.env.VERCEL_GIT_COMMIT_REF!==BRANCH)
    return send(res,403,{ok:false,error:'ai_preview_branch_only'});
  const denied=checkBetaAccess(req);
  if(denied)return send(res,denied.status,{ok:false,error:denied.error});
  const cfg=quotaConfig();
  if(!cfg)return send(res,503,{ok:false,error:'ai_quota_not_configured'});
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),2500);
  try{
    // Redis EVAL capability is required by the atomic admission gate.
    // Read-only Lua verifies EVAL and GET on the actual quota key namespace.
    // It never increments, sets, expires or exposes quota usage.
    const response=await fetch(cfg.url,{
      method:'POST',
      headers:{Authorization:'Bearer '+cfg.token,'Content-Type':'application/json'},
      body:JSON.stringify(['EVAL',"return redis.call('GET',KEYS[1]) or 'NO_QUOTA_KEY'",'1','dd:beta:ai-quota:'+new Date().toISOString().slice(0,10)]),
      signal:controller.signal
    });
    if(!response.ok)return send(res,503,{ok:false,error:'ai_quota_unavailable'});
    const data=await response.json().catch(()=>({}));
    if(data?.result!=='NO_QUOTA_KEY' && !(typeof data?.result==='string' && /^\d+$/.test(data.result)))return send(res,503,{ok:false,error:'ai_quota_unavailable'});
    return send(res,200,{
      ok:true,quota_reachable:true,quota_atomic_eval:true,quota_write_tested:false,
      provider_tested:false,paid_call:false,
      beta_enabled:process.env.DD_AI_BETA_ENABLED==='true',
      openai_configured:Boolean(process.env.OPENAI_API_KEY)
    });
  }catch(_error){
    return send(res,503,{ok:false,error:'ai_quota_unavailable'});
  }finally{clearTimeout(timer);}
};
