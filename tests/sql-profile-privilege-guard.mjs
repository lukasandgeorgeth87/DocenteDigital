import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Static regression for the unexecuted Supabase/Postgres schema draft.
// This does NOT substitute for RLS integration tests against a real database.
const sql=readFileSync(new URL('../docs/SUPABASE_BACKEND_SCHEMA_V1.sql',import.meta.url),'utf8')
  .replace(/\/\*[\s\S]*?\*\//g,'')
  .replace(/--[^\n]*/g,'');

function policies(table){
  return [...sql.matchAll(/create\s+policy\s+["']?([\w-]+)["']?\s+on\s+public\.([\w]+)\b([^;]*);/gi)]
    .filter(([, , name])=>name.toLowerCase()===table)
    .map(([,name,,definition])=>({name,definition}));
}

assert.match(sql,/alter\s+table\s+public\.profiles\s+enable\s+row\s+level\s+security\s*;/i);
const profilePolicies=policies('profiles');
assert.equal(profilePolicies.length,1,'Profiles must expose exactly one client policy (read own profile)');
assert.match(profilePolicies[0].definition,/\bfor\s+select\s+using\s*\(\s*auth\.uid\(\)\s*=\s*user_id\s*\)/i);
assert.doesNotMatch(sql,/grant\s+(?:all|insert|update|delete)\b[^;]*\bon\s+(?:table\s+)?public\.profiles\s+to\s+(?:public|anon|authenticated)\b/i,
  'Client grants must not expose profile role/plan changes');

// Usage and quotas are server-owned. Users can read only their own rows.
for(const table of ['ai_usage','user_quotas']){
  assert.match(sql,new RegExp('alter\\s+table\\s+public\\.'+table+'\\s+enable\\s+row\\s+level\\s+security\\s*;','i'));
  const rules=policies(table);
  assert.equal(rules.length,1,table+' must have exactly one client policy');
  assert.match(rules[0].definition,/\bfor\s+select\s+using\s*\(\s*auth\.uid\(\)\s*=\s*user_id\s*\)/i,
    table+' must be readable only by the owner');
}
console.log('PASS: SQL draft denies client profile privilege writes and quota/usage writes (static only)');
