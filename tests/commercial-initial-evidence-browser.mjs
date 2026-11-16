/* Segunda evidencia comercial: ficha real descargada para Inicial 4 años.
   Estudiantes ficticios; no requiere red, API ni credenciales de pago. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const out=process.env.EVIDENCE_DIR||'/tmp/dd-commercial-evidence';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
const page=await context.newPage();
try{
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.locator('input[name="ddLevel"][value="Inicial"]').locator('..').click();
  await page.locator('input[name="ddIE"][value="Polidocente"]').locator('..').click();
  await page.locator('[data-dd-grade-group="Inicial"] input[value="4 años"]').locator('..').click();
  await page.locator('[data-dd-area-group="Inicial"] input[value="Ciencia y Tecnología"]').locator('..').click();
  await page.locator('#linguisticMode').selectOption('Monolingüe castellano');
  await page.locator('#ddSetupNativeForm button[type="submit"]').click();
  await page.waitForFunction(()=>window.state?.level==='Inicial'&&typeof window.go==='function',null,{timeout:20000});
  await page.evaluate(()=>{go('materials');window.DDMaterials.fill();});
  await page.locator('#materialSource').selectOption('free');
  await page.locator('#materialType').selectOption('Ficha de trabajo');
  await page.locator('#materialArea').selectOption('Ciencia y Tecnología');
  await page.locator('#materialGrade').selectOption('4 años');
  await page.locator('#materialTopic').fill('Exploramos semillas en el aula');
  await page.evaluate(()=>window.DDMaterials.create());
  await page.waitForSelector('#materialOutput .dd-initial-seeds');
  const screen=await page.locator('#materials').screenshot({path:path.join(out,'07-inicial-ficha-en-celular.png')});
  assert(screen.length>1000);
  const download=page.waitForEvent('download',{timeout:20000});
  await page.evaluate(()=>window.DDMaterials.downloadWord());
  const file=await download;
  const location=path.join(out,'07-inicial-ficha-semillas-4-anos.docx');
  await file.saveAs(location);
  const bytes=await fs.readFile(location);
  assert.equal(bytes.toString('latin1',0,2),'PK');
  let xml='';let pos=0;
  while(pos+30<bytes.length&&bytes.readUInt32LE(pos)===0x04034b50){
    const length=bytes.readUInt32LE(pos+18),nameSize=bytes.readUInt16LE(pos+26),extra=bytes.readUInt16LE(pos+28);
    const name=bytes.subarray(pos+30,pos+30+nameSize).toString('utf8'),start=pos+30+nameSize+extra;
    if(name==='word/document.xml'){xml=bytes.subarray(start,start+length).toString('utf8');break;}
    pos=start+length;
  }
  for(const expected of ['Pequeños exploradores de semillas','Semilla A','Semilla B','Juego a agrupar','Volvemos a observar'])
    assert(xml.includes(expected),'Inicial: el Word carece de contenido concreto: '+expected);
  assert((xml.match(/w:trHeight w:val="\d+" w:hRule="atLeast"/g)||[]).length>=4,
    'Inicial: la ficha Word necesita cuatro recuadros amplios para dibujar, no solo líneas para escribir');
  assert(xml.includes('w:br w:type="page"'),'Inicial: la segunda jornada de observación debe comenzar en una página nueva');
  assert(!xml.includes('Vinculación con la planificación'),'Inicial: el Word contiene controles del docente');
  await page.reload({waitUntil:'networkidle'});
  assert((await page.evaluate(()=>state.materials||[])).length===1,'La ficha de Inicial se perdió al recargar');
  await fs.writeFile(path.join(out,'resultado-inicial.json'),JSON.stringify({case:'Inicial 4 años, semillas',downloaded:true,storedAfterReload:true,quality:'pendiente de revisión editorial y visual'},null,2));
  console.log('PASS ficha de Inicial 4 años: descargada, contextualizada y recuperada.');
}catch(error){
  await fs.writeFile(path.join(out,'error-inicial.txt'),String(error.stack||error));
  throw error;
}finally{await browser.close();}
