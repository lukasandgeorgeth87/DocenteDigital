const {crc32,inflateSync}=require('node:zlib');
const {reserveQuota}=require('./_ai-quota');
const {checkBetaAccess}=require('./_beta-access');
const {betaEnvironmentAllowed}=require('./_ai-beta-environment');
const {redactPersonalData}=require('./_ai-privacy');
const IMAGE_URL='https://api.openai.com/v1/images/generations';
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
function clean(v,max=5000){return String(v??'').replace(/\u0000/g,'').trim().slice(0,max);}
// The image endpoint requests PNG. A nonempty base64 string is not proof of an image.
// Validate chunk CRC, bounded zlib decoding and scanline structure before success.
function validPngBase64(value){
  if(typeof value!=='string'||value.length<64||value.length>40*1024*1024||value.length%4!==0)return false;
  if(!/^[A-Za-z0-9+/]+={0,2}$/.test(value))return false;
  const bytes=Buffer.from(value,'base64');
  if(bytes.length<57||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return false;
  let offset=8,seenHeader=false,seenData=false,afterData=false,seenPalette=false,seenTransparency=false,paletteEntries=0;
  let width=0,height=0,bitDepth=0,colorType=0,interlace=0,idatBytes=0;
  const idat=[];
  while(offset+12<=bytes.length){
    const length=bytes.readUInt32BE(offset);
    const end=offset+12+length;
    if(end>bytes.length)return false;
    const type=bytes.toString('ascii',offset+4,offset+8);
    if(!/^[A-Za-z]{4}$/.test(type))return false;
    // Unknown critical chunks must not be silently treated as valid PNG data.
    if(type[0]===type[0].toUpperCase()&&!['IHDR','PLTE','IDAT','IEND'].includes(type))return false;
    if(crc32(bytes.subarray(offset+4,offset+8+length))!==bytes.readUInt32BE(offset+8+length))return false;
    if(!seenHeader){
      if(type!=='IHDR'||length!==13)return false;
      width=bytes.readUInt32BE(offset+8);
      height=bytes.readUInt32BE(offset+12);
      bitDepth=bytes[offset+16];
      colorType=bytes[offset+17];
      interlace=bytes[offset+20];
      const depths={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
      if(!width||!height||width>8192||height>8192||width*height>16777216)return false;
      if(!depths[colorType]?.includes(bitDepth)||bytes[offset+18]!==0||bytes[offset+19]!==0||interlace>1)return false;
      seenHeader=true;
    }else if(type==='IHDR')return false;
    if(type==='PLTE'){
      // Indexed images require a well-formed palette before the first IDAT.
      // Grayscale PNGs forbid PLTE; a duplicate or late palette is invalid.
      if(seenData||seenPalette||seenTransparency||colorType===0||colorType===4||!length||length>768||length%3!==0||(colorType===3&&length/3>2**bitDepth))return false;
      seenPalette=true;
      paletteEntries=length/3;
    }
    if(type==='tRNS'){
      // PNG transparency is allowed only before IDAT. For indexed PNG it
      // follows PLTE and cannot contain more alpha entries than colors.
      // Grayscale and truecolor use fixed-size transparent color samples.
      if(seenData||seenTransparency||![0,2,3].includes(colorType))return false;
      if(colorType===3&&(!seenPalette||!length||length>paletteEntries))return false;
      // PNG tRNS stores grayscale/RGB keys in 16-bit fields. For 1/2/4/8-bit
      // images the transparent sample must fit the declared sample depth.
      // Otherwise a CRC-valid PNG can still carry an invalid transparency key.
      if(colorType===0&&(length!==2||bytes.readUInt16BE(offset+8)>=2**bitDepth))return false;
      if(colorType===2&&(length!==6||(bitDepth<16&&[0,2,4].some(i=>bytes.readUInt16BE(offset+8+i)>=2**bitDepth))))return false;
      seenTransparency=true;
    }
    if(type==='IDAT'){
      if(afterData||(colorType===3&&!seenPalette))return false;
      idatBytes+=length;
      if(idatBytes>40*1024*1024)return false;
      idat.push(bytes.subarray(offset+8,offset+8+length));
      seenData=true;
    }else if(seenData&&type!=='IEND')afterData=true;
    if(type==='IEND'){
      if(length!==0||!seenData||end!==bytes.length)return false;
      try{
        // A CRC-valid IDAT can still contain a corrupt or decompression-bomb
        // zlib stream. Bound inflation before delivering teacher materials.
        const compressed=Buffer.concat(idat);
        const inflated=inflateSync(compressed,{maxOutputLength:64*1024*1024,info:true});
        // zlib accepts trailing bytes after a valid stream by default.
        // PNG IDAT must contain exactly one complete compressed image stream.
        if(inflated.engine.bytesWritten!==compressed.length)return false;
        const raw=inflated.buffer;
        if(!raw.length)return false;
        const channels={0:1,2:3,3:1,4:2,6:4}[colorType];
        if(interlace===0){
          const rowBytes=Math.ceil(width*channels*bitDepth/8);
          if(raw.length!==(rowBytes+1)*height)return false;
          for(let row=0;row<height;row++){
            if(raw[row*(rowBytes+1)]>4)return false;
          }
        }else{
          // Adam7 images also contain filtered scanlines. A valid zlib stream
          // alone does not prove that any of the seven passes can be decoded.
          const passes=[[0,0,8,8],[4,0,8,8],[0,4,4,8],[2,0,4,4],[0,2,2,4],[1,0,2,2],[0,1,1,2]];
          let cursor=0;
          for(const [x,y,dx,dy] of passes){
            if(width<=x||height<=y)continue;
            const passWidth=Math.ceil((width-x)/dx);
            const passHeight=Math.ceil((height-y)/dy);
            const rowBytes=Math.ceil(passWidth*channels*bitDepth/8);
            for(let row=0;row<passHeight;row++){
              if(cursor+rowBytes+1>raw.length||raw[cursor]>4)return false;
              cursor+=rowBytes+1;
            }
          }
          if(cursor!==raw.length)return false;
        }
        return true;
      }catch(_error){return false;}
    }
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
    // The request explicitly asks the provider for PNG bytes. A URL alone
    // does not prove the image is PNG and could point the teacher's browser
    // to an unrelated host, bypassing the structural validator above.
    if(!imageBase64)return send(res,502,{ok:false,error:'invalid_image_output',retryable:true});
    return send(res,200,{ok:true,image_base64:imageBase64,image_url:null,revised_prompt:first.revised_prompt||null});
  }catch(e){
    if(e?.name==='AbortError')return send(res,504,{ok:false,error:'image_timeout',retryable:true});
    return send(res,500,{ok:false,error:'image_runtime_error'});
  }finally{clearTimeout(timer);}
};