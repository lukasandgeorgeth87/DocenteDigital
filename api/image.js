const IMAGE_URL='https://api.openai.com/v1/images/generations';
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
function clean(v,max=5000){return String(v??'').replace(/\u0000/g,'').trim().slice(0,max);}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return send(res,405,{ok:false,error:'method_not_allowed'});
  if(!process.env.OPENAI_API_KEY)return send(res,503,{ok:false,error:'openai_not_configured'});
  const body=req.body&&typeof req.body==='object'?req.body:{};
  if(body.confirmedCredit!==true)return send(res,402,{ok:false,error:'premium_credit_confirmation_required'});
  const prompt=clean(body.prompt);
  if(!prompt)return send(res,400,{ok:false,error:'empty_prompt'});
  const model=process.env.OPENAI_IMAGE_MODEL||'gpt-image-2.5-flare';
  const size=['1024x1024','1024x1536','1536x1024'].includes(body.size)?body.size:'1024x1536';
  const quality=['low','medium','high'].includes(body.quality)?body.quality:'medium';
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
    return send(res,200,{ok:true,image_base64:first.b64_json||null,image_url:first.url||null,revised_prompt:first.revised_prompt||null});
  }catch(e){
    if(e?.name==='AbortError')return send(res,504,{ok:false,error:'image_timeout',retryable:true});
    return send(res,500,{ok:false,error:'image_runtime_error'});
  }finally{clearTimeout(timer);}
};