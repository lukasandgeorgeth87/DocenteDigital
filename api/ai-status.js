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
  res.end(JSON.stringify({
    ok:true,
    configured,
    text:configured,
    image:configured,
    verified:false,
    server_side:true
  }));
};