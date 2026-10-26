// Paid generative AI is for an authenticated private Vercel PREVIEW beta only.
// Never bill a production (or unidentified) deployment, even when the API key,
// access token, feature flag and Redis quota happen to be configured there.
function betaEnvironmentAllowed(){
  return process.env.VERCEL_ENV === 'preview';
}
module.exports={betaEnvironmentAllowed};
