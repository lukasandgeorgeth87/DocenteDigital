import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Offline regression for OOXML produced by the real browser exporter.
// The exporter stores its ZIP entries uncompressed; no Word, network or
// external package is required to inspect word/document.xml.
const source=readFileSync(new URL('../docx-export-v29.js',import.meta.url),'utf8');
const invalid=String.fromCharCode(0,1,11,12,31,0xfffe,0xffff);
const paragraph='Semillas & agua <cuidado> '+String.fromCharCode(1)+' actividad '+String.fromCharCode(0xfffe);
const state={
  teacherName:'Docente '+String.fromCharCode(0)+' Ejemplo',
  institutionMaster:{ieName:'I.E. '+String.fromCharCode(11)+' Ejemplo'}
};
class DOMParserMock {
  parseFromString(){
    return {body:{children:[{tagName:'P',textContent:paragraph,children:[]}]}};
  }
}
const window={};
runInNewContext(source,{
  window,state,DOMParser:DOMParserMock,TextEncoder,Uint8Array,Blob,
  Date,URL,setTimeout,clearTimeout,console
},{filename:'docx-export-v29.js'});
assert.equal(typeof window.DDWordExport?.createBlob,'function');
const blob=window.DDWordExport.createBlob('Prueba', '<p>Texto de prueba</p>');
const bytes=new Uint8Array(await blob.arrayBuffer());
assert.equal(bytes[0],0x50);
assert.equal(bytes[1],0x4b);
const raw=new TextDecoder().decode(bytes);
const start=raw.indexOf('<w:document ');
const close='</w:document>';
const end=raw.indexOf(close,start);
assert.ok(start>=0&&end>start,'Falta word/document.xml en el ZIP');
const xml=raw.slice(start,end+close.length);
assert.doesNotMatch(xml,/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/,
  'El DOCX contiene caracteres ilegales de XML 1.0');
assert.ok(xml.includes('Semillas &amp; agua &lt;cuidado&gt;'),
  'Se perdieron caracteres escapados del contenido pedagógico');
assert.ok(xml.includes('Docente  Ejemplo'),'Se perdió el texto del docente');
assert.ok(xml.includes('I.E.  Ejemplo'),'Se perdió el nombre de la IE');
assert.ok(![...invalid].some(c=>xml.includes(c)),
  'Se conservó un carácter de control prohibido');
console.log('DOCX_XML_SAFETY_PASS: OOXML text escapes and invalid code points sanitized (offline)');
