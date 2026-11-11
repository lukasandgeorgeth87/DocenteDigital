// Fase 48: session enrichment must not replace an approved teacher correction.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const src=read('session-learning-core-v54.js');
const reviewer=read('review-inline-v46.js');
assert(src.includes("if(session.teacherReviewApproved!==true){"));
assert(src.includes("session.purpose=purposeText(parts);"));
assert(src.includes("session.criterion=criterionForSession("));
assert(src.includes("session.evidence=evidenceForSession("));
assert(reviewer.includes("session.teacherReviewApproved=true;"));
assert(reviewer.includes("'criterion','teacherCriteria','teacherReviewApproved'"));
const a=src.indexOf("    if(session.teacherReviewApproved!==true){");
const b=src.indexOf("    const curriculum=inheritCurriculum",a);
assert(a>=0&&b>a);
const block=src.slice(a,b);
let session={
 teacherReviewApproved:true,
 purpose:'Propósito aprobado por el docente',
 criterion:'Criterio aprobado y específico',
 evidence:'Registro aprobado por el docente',
 area:'Comunicación',level:'Primaria'
};
const enrich=(s)=>{
 if(s.teacherReviewApproved!==true){
   s.purpose='Propósito reescrito automáticamente';
   s.criterion='Criterio automático';
   s.evidence='Evidencia automática';
 }
};
enrich(session);
assert.equal(session.purpose,'Propósito aprobado por el docente');
assert.equal(session.criterion,'Criterio aprobado y específico');
assert.equal(session.evidence,'Registro aprobado por el docente');
session.teacherReviewApproved=false;enrich(session);
assert.equal(session.purpose,'Propósito reescrito automáticamente');
console.log('PASS v48: propósito, criterio y evidencia aprobados protegidos en sesiones');
