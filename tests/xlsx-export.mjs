import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const source=await readFile(new URL('../xlsx-export-v1.js',import.meta.url),'utf8');
const browser={};
vm.runInNewContext(source,{window:browser,Blob,TextEncoder,Uint8Array,Array,URL,document:{},setTimeout});
assert.equal(typeof browser.DDXlsxExport.build,'function');

const rows=[
  ['Estudiante','Criterio','Evidencia'],
  ['=HYPERLINK("https://ejemplo.pe")','Comparación de < y >','Dice: “probé & expliqué”'],
  ['Ángel','Identifica cambios','<script>texto</script>'],
];
const blob=browser.DDXlsxExport.build(rows,'Evaluación / 3.º');
assert.equal(blob.type,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

const directory=await mkdtemp(join(tmpdir(),'dd-excel-'));
try{
  const file=join(directory,'registro.xlsx');
  await writeFile(file,new Uint8Array(await blob.arrayBuffer()));
  const verify=spawnSync('unzip',['-t',file],{encoding:'utf8'});
  assert.equal(verify.status,0,verify.stderr||verify.stdout);
  const entries=spawnSync('unzip',['-Z','-1',file],{encoding:'utf8'});
  assert.equal(entries.status,0);
  for(const name of ['[Content_Types].xml','_rels/.rels','xl/workbook.xml','xl/_rels/workbook.xml.rels','xl/worksheets/sheet1.xml']){
    assert.ok(entries.stdout.includes(name),`Falta ${name}`);
  }
  const sheet=spawnSync('unzip',['-p',file,'xl/worksheets/sheet1.xml'],{encoding:'utf8'}).stdout;
  const workbook=spawnSync('unzip',['-p',file,'xl/workbook.xml'],{encoding:'utf8'}).stdout;
  assert.match(sheet,/<c r="A2" t="inlineStr">/);
  assert.ok(sheet.includes('=HYPERLINK(&quot;https://ejemplo.pe&quot;)'));
  assert.ok(!sheet.includes('<f>'),'No se deben crear fórmulas ejecutables desde texto ingresado');
  assert.ok(sheet.includes('Comparación de &lt; y &gt;'));
  assert.ok(sheet.includes('&lt;script&gt;texto&lt;/script&gt;'));
  assert.ok(workbook.includes('name="Evaluación   3.º"'));
  assert.throws(()=>browser.DDXlsxExport.build([]),/tabla de filas/);
  assert.throws(()=>browser.DDXlsxExport.build([['a'],['b'],new Array(151).fill('x')]),/límite seguro/);
  console.log('Excel OOXML: ZIP íntegro, nombres válidos, texto escapado y fórmulas bloqueadas.');
}finally{
  await rm(directory,{recursive:true,force:true});
}
