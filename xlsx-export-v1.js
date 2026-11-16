/* DocenteDigital — Exportación Excel OOXML sin servicios externos. */
(function(root){
  'use strict';
  if(root.DDXlsxExport)return;

  const encoder=new TextEncoder();
  const u16=n=>Uint8Array.of(n&255,(n>>>8)&255);
  const u32=n=>Uint8Array.of(n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255);
  const concat=chunks=>{const out=new Uint8Array(chunks.reduce((n,x)=>n+x.length,0));let pos=0;for(const x of chunks){out.set(x,pos);pos+=x.length;}return out;};
  const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0;});
  const crc32=bytes=>{let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;};
  function zip(entries){
    const local=[],central=[];let offset=0;
    for(const entry of entries){
      const name=encoder.encode(entry.name),data=encoder.encode(entry.data),crc=crc32(data);
      const header=concat([u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);
      const directory=concat([u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);
      local.push(header);central.push(directory);offset+=header.length;
    }
    const directory=concat(central);
    return concat([...local,directory,u32(0x06054b50),u16(0),u16(0),u16(entries.length),u16(entries.length),u32(directory.length),u32(offset),u16(0)]);
  }
  function xml(value){
    return String(value==null?'':value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g,'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  }
  function col(index){let name='';for(let n=index+1;n;n=Math.floor((n-1)/26))name=String.fromCharCode(65+(n-1)%26)+name;return name;}
  function build(rows,sheetName='Registro'){
    if(!Array.isArray(rows)||!rows.length||rows.some(x=>!Array.isArray(x)))throw new Error('Se necesita una tabla de filas para exportar Excel.');
    if(rows.length>10000||rows.some(r=>r.length>150))throw new Error('El registro excede el límite seguro de exportación.');
    // Siempre inlineStr: ningún texto de estudiantes o criterios se ejecutará como fórmula.
    const body=rows.map((cells,r)=>'<row r="'+(r+1)+'">'+cells.map((value,c)=>{
      const content=xml(value);return '<c r="'+col(c)+(r+1)+'" t="inlineStr"><is><t xml:space="preserve">'+content+'</t></is></c>';
    }).join('')+'</row>').join('');
    const safeName=String(sheetName||'Registro').replace(/[\\\/*?:\[\]]/g,' ').trim().slice(0,31)||'Registro';
    const main='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const pkg='http://schemas.openxmlformats.org/package/2006/relationships';
    const rel='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const entries=[
      {name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'},
      {name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="'+pkg+'"><Relationship Id="rId1" Type="'+rel+'/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
      {name:'xl/workbook.xml',data:'<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="'+main+'" xmlns:r="'+rel+'"><sheets><sheet name="'+xml(safeName)+'" sheetId="1" r:id="rId1"/></sheets></workbook>'},
      {name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="'+pkg+'"><Relationship Id="rId1" Type="'+rel+'/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'},
      {name:'xl/worksheets/sheet1.xml',data:'<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="'+main+'"><sheetData>'+body+'</sheetData></worksheet>'}
    ];
    return new Blob([zip(entries)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  function download(rows,name='Registro_evaluacion',sheetName='Registro'){
    const blob=build(rows,sheetName);
    const clean=String(name||'Registro_evaluacion').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9-_ ]/g,'').trim().replace(/\s+/g,'_').slice(0,90)||'Registro_evaluacion';
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=clean+'.xlsx';document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1800);
    return blob;
  }
  root.DDXlsxExport={build,download};
})(window);
