module.exports = function handler(req,res){
  if(req.method !== 'GET'){
    res.statusCode=405;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.end(JSON.stringify({ok:false,error:'method_not_allowed'}));
  }
  res.statusCode=200;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  const configured=Boolean(process.env.OPENAI_API_KEY);
  const enabled=process.env.DD_AI_BETA_ENABLED==='true';
  const accessConfigured=typeof process.env.DD_AI_BETA_TOKEN==='string'&&process.env.DD_AI_BETA_TOKEN.length>=32;
  res.end(JSON.stringify({
    ok:true,
    configured,
    enabled,
    access_required:true,
    access_configured:accessConfigured,
    text:configured&&enabled&&accessConfigured,
    image:configured&&enabled&&accessConfigured,
    verified:false,
    server_side:true
  }));
};