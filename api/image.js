const {crc32}=require('node:zlib');
const {reserveQuota}=require('./_ai-quota');
const {checkBetaAccess}=require('./_beta-access');
const {betaEnvironmentAllowed}=require('./_ai-beta-environment');
const {redactPersonalData}=require('./_ai-privacy');
const IMAGE_URL='https://api.openai.com/v1/images/generations';
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
function clean(v,max=5000){return String(v??'').replace(/\u0000/g,'').trim().slice(0,max);}
// The image endpoint requests PNG. A nonempty base64 string is not proof of an image.
// Validate the PNG signature and IHDR before reporting a successful generation.
function validPngBase64(value){
  if(typeof value!=='string'||value.length<64||value.length>40*1024*1024||value.length%4!==0)return false;
  if(!/^[A-Za-z0-9+/]+={0,2}$/.test(value))return false;
  const bytes=Buffer.from(value,'base64');
  if(bytes.length<57||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return false;
  let offset=8,seenHeader=false,seenData=false;
  while(offset+12<=bytes.length){
    const length=bytes.readUInt32BE(offset);
    const end=offset+12+length;
    if(end>bytes.length)return false;
    const type=bytes.toString('ascii',offset+4,offset+8);
    if(crc32(bytes.subarray(offset+4,offset+8+length))!==bytes.readUInt32BE(offset+8+length))return false;
    if(!seenHeader){
      if(type!=='IHDR'||length!==13||!bytes.readUInt32BE(offset+8)||!bytes.readUInt32BE(offset+12))return false;
      seenHeader=true;
    }else if(type==='IHDR')return false;
    if(type==='IDAT')seenData=true;
    if(type==='IEND')return length===0&&seenData&&end===bytes.length;
    offset=end;
  }
  return false;
}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return send(res,405,{ok:false,error:'method_not_allowed'});
  if(!betaEnvironmentAllowed())return send(res,403,{ok:false,error:'ai_preview_only'});
  if(!process.env.OPENAI_API_KEY)return send(res,503,{ok:false,error:'openai_not_configured'});
  // Fail-closed billing switch; still requires independent access control and quotas.
  if(process.env.DD_AI_BETA_ENABLED!=='true')return send(res,503,{ok:false,error:'ai_beta_disabled'});
  const denied=checkBetaAccess(req);
  if(denied)return send(res,denied.status,{ok:false,error:denied.error});
  const body=req.body&&typeof req.body==='object'?req.body:{};
  if(body.confirmedCredit!==true)return send(res,402,{ok:false,error:'premium_credit_confirmation_required'});
  const prompt=redactPersonalData(clean(body.prompt));
  if(!prompt)return send(res,400,{ok:false,error:'empty_prompt'});
  const model=process.env.OPENAI_IMAGE_MODEL||'gpt-image-2';
  const size=['1024x1024','1024x1536','1536x1024'].includes(body.size)?body.size:'1024x1536';
  const quality=['low','medium','high'].includes(body.quality)?body.quality:'medium';
  const quotaDenied=await reserveQuota('image');
  if(quotaDenied)return send(res,quotaDenied.status,{ok:false,error:quotaDenied.error});
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),55000);
  try{
    const r=await fetch(IMAGE_URL,{
      method:'POST',
      headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({model,prompt,size,quality,output_format:'png',n:1}),
      signal:controller.signal
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok){console.error('DocenteDigital image error',r.status,data?.error?.type||'unknown');return send(res,r.status===429?429:502,{ok:false,error:'image_request_failed',retryable:r.status===429||r.status>=500});}
    const first=data?.data?.[0]||{};
    const imageBase64=validPngBase64(first.b64_json)?first.b64_json:null;
    const imageUrl=typeof first.url==='string'&&/^https:\/\//i.test(first.url)?first.url:null;
    // HTTP 200 from the provider does not mean an image was generated.
    // Report failure when the provider omits the requested image.
    if(!imageBase64&&!imageUrl)return send(res,502,{ok:false,error:'invalid_image_output',retryable:true});
    return send(res,200,{ok:true,image_base64:imageBase64,image_url:imageUrl,revised_prompt:first.revised_prompt||null});
  }catch(e){
    if(e?.name==='AbortError')return send(res,504,{ok:false,error:'image_timeout',retryable:true});
    return send(res,500,{ok:false,error:'image_runtime_error'});
  }finally{clearTimeout(timer);}
};