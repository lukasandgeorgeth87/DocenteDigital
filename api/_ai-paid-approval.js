// Second, independent fail-closed switch. No provider spending by default.
function paidRequestsAllowed(){
  return process.env.DD_AI_PAID_CALLS_ENABLED==='true';
}
module.exports={paidRequestsAllowed};
