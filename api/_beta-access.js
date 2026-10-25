// Private beta shared-secret gate. This is NOT per-user authentication or a quota.
const {createHash,timingSafeEqual}=require('node:crypto');
function checkBetaAccess(req){
  const secret=process.env.DD_AI_BETA_TOKEN;
  // Fail closed when no sufficiently strong secret has been configured.
  if(typeof secret!=='string'||secret.length<32)return {status:503,error:'beta_access_not_configured'};
  const candidate=req?.headers?.['x-dd-beta-token'];
  if(typeof candidate!=='string'||candidate.length<1||candidate.length>512)return {status:401,error:'beta_access_denied'};
  const hash=s=>createHash('sha256').update(s,'utf8').digest();
  if(!timingSafeEqual(hash(candidate),hash(secret)))return {status:401,error:'beta_access_denied'};
  return null;
}
module.exports={checkBetaAccess};
