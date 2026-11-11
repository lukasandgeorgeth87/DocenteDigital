// Paid generative AI is restricted to the explicitly authorized private Vercel
// Preview branch. Preview deployments from other branches must never bill,
// even if they inherit the same environment secrets and feature flags.
const AUTHORIZED_BRANCH='preview/docentedigital-fase10-20261030';
function betaEnvironmentAllowed(){
  return process.env.VERCEL_ENV==='preview' &&
    process.env.VERCEL_GIT_COMMIT_REF===AUTHORIZED_BRANCH;
}
module.exports={AUTHORIZED_BRANCH,betaEnvironmentAllowed};
