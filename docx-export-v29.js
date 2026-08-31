/* DocenteDigital – exportación DOCX OOXML real v29
   Genera .docx ZIP válido sin dependencias externas para mejorar compatibilidad móvil.
*/
(function(){
  if(window.__ddDocxExportV29)return; window.__ddDocxExportV29=true;
  const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const enc=new TextEncoder();

  function crc32(bytes){
    let c=0xffffffff;
    for(let i=0;i<bytes.length;i++){
      c^=bytes[i];
      for(let k=0;k<8;k++) c=(c>>>1)^((c&1)?0xedb88320:0);
    }
    return (c^0xffffffff)>>>0;
  }
  function u16(n){return Uint8Array.of(n&255,(n>>>8)&255)}
  function u32(n){return Uint8Array.of(n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255)}
  function cat(parts){const len=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(len);let o=0;for(const p of parts){out.set(p,o);o+=p.length}return out}
  function dosNow(){
    const d=new Date(),year=Math.max(1980,d.getFullYear());
    return {time:((d.getHours()&31)<<11)|((d.getMinutes()&63)<<5)|((Math.floor(d.getSeconds()/2))&31),date:(((year-1980)&127)<<9)|(((d.getMonth()+1)&15)<<5)|(d.getDate()&31)};
  }
  function zip(entries){
    const locals=[],centrals=[];let offset=0;const dt=dosNow();
    for(const entry of entries){
      const name=enc.encode(entry.name),data=typeof entry.data==='string'?enc.encode(entry.data):entry.data,crc=crc32(data),flags=0x0800;
      const local=cat([u32(0x04034b50),u16(20),u16(flags),u16(0),u16(dt.time),u16(dt.date),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);
      locals.push(local);
      const central=cat([u32(0x02014b50),u16(20),u16(20),u16(flags),u16(0),u16(dt.time),u16(dt.date),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);
      centrals.push(central); offset+=local.length;
    }
    const centralBytes=cat(centrals),localBytes=cat(locals);
    const end=cat([u32(0x06054b50),u16(0),u16(0),u16(entries.length),u16(entries.length),u32(centralBytes.length),u32(localBytes.length),u16(0)]);
    return cat([localBytes,centralBytes,end]);
  }

  function textOf(node){return String(node?.textContent||'').replace(/\s+/g,' ').trim()}
  function runXml(text,bold=false,size=22){
    if(!text)return '';
    return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/>${bold?'<w:b/>':''}</w:rPr><w:t xml:space="preserve">${E(text)}</w:t></w:r>`;
  }
  function pXml(text,{bold=false,size=22,center=false,after=80}={}){
    if(!text)return '<w:p/>';
    return `<w:p><w:pPr>${center?'<w:jc w:val="center"/>':''}<w:spacing w:after="${after}"/></w:pPr>${runXml(text,bold,size)}</w:p>`;
  }
  function tableXml(table){
    const rows=[...table.rows];
    if(!rows.length)return '';
    const body=rows.map(tr=>{
      const cells=[...tr.children].filter(c=>/^(TD|TH)$/.test(c.tagName));
      return `<w:tr>${cells.map(c=>`<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/><w:tcBorders><w:top w:val="single" w:sz="4" w:color="777777"/><w:left w:val="single" w:sz="4" w:color="777777"/><w:bottom w:val="single" w:sz="4" w:color="777777"/><w:right w:val="single" w:sz="4" w:color="777777"/></w:tcBorders></w:tcPr>${pXml(textOf(c),{bold:c.tagName==='TH',size:20,after:20})}</w:tc>`).join('')}</w:tr>`;
    }).join('');
    return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblLayout w:type="autofit"/></w:tblPr>${body}</w:tbl>${pXml('',{})}`;
  }
  function htmlToWordXml(html){
    const doc=new DOMParser().parseFromString(`<body>${html}</body>`,'text/html'),out=[];
    function walk(node){
      for(const el of [...node.children]){
        const tag=el.tagName;
        if(tag==='TABLE'){out.push(tableXml(el));continue;}
        if(tag==='H1'){out.push(pXml(textOf(el),{bold:true,size:32,center:true,after:140}));continue;}
        if(tag==='H2'){out.push(pXml(textOf(el),{bold:true,size:26,after:100}));continue;}
        if(tag==='H3'||tag==='H4'){out.push(pXml(textOf(el),{bold:true,size:23,after:80}));continue;}
        if(tag==='P'){out.push(pXml(textOf(el),{size:22,after:80}));continue;}
        if(tag==='UL'||tag==='OL'){
          [...el.children].filter(li=>li.tagName==='LI').forEach((li,i)=>out.push(pXml(`${tag==='OL'?(i+1)+'.':'•'} ${textOf(li)}`,{size:22,after:40})));
          continue;
        }
        if(el.children.length)walk(el); else if(textOf(el))out.push(pXml(textOf(el),{size:22,after:60}));
      }
    }
    walk(doc.body);return out.join('');
  }
  function docxBlob(title,html,landscape=false){
    const body=htmlToWordXml(html);
    const pgSz=landscape?'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>':'<w:pgSz w:w="11906" w:h="16838"/>';
    const identity=[state.teacherName,state.schoolName].map(v=>String(v||'').trim()).filter(Boolean).join(' · ');
    const identityXml=identity?`<w:p>${runXml(identity,false,18)}</w:p>`:'';
    const documentXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}${identityXml}<w:sectPr>${pgSz}<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    const contentTypes=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
    const rels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    const bytes=zip([{name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rels},{name:'word/document.xml',data:documentXml}]);
    return new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }
  function fileName(title){return (typeof cleanFileName==='function'?cleanFileName(title):String(title||'documento').replace(/[^\w -]+/g,'').trim().replace(/\s+/g,'_'))+'.docx'}
  function downloadDocx(blob,name){
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1800);
  }
  async function shareDocx(blob,name,title){
    try{const f=new File([blob],name,{type:blob.type});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[f]}))){await navigator.share({title,files:[f]});return;}}catch(e){console.warn('Compartir DOCX:',e)}
    downloadDocx(blob,name);
  }

  window.downloadUnitWord=function(id){
    const unit=(state.units||[]).find(u=>u.id===id);if(!unit)return;
    const blob=docxBlob(unit.title,unitWordHtml(unit),true);downloadDocx(blob,fileName(unit.title));
  };
  window.shareUnit=function(id){
    const unit=(state.units||[]).find(u=>u.id===id);if(!unit)return;
    const blob=docxBlob(unit.title,unitWordHtml(unit),true);shareDocx(blob,fileName(unit.title),unit.title);
  };
  window.downloadSessionWord=function(){
    const s=state.lastSession;if(!s)return alert('Primero crea una sesión.');
    const blob=docxBlob(s.title,sessionHtml(s,true),false);downloadDocx(blob,fileName(s.title));
  };
  window.shareSession=function(){
    const s=state.lastSession;if(!s)return alert('Primero crea una sesión.');
    const blob=docxBlob(s.title,sessionHtml(s,true),false);shareDocx(blob,fileName(s.title),s.title);
  };
  window.ddDocxSelfTest=function(){
    try{const b=docxBlob('Prueba','<h1>Prueba DOCX</h1><p>Compatibilidad OOXML.</p><table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>',false);return b.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'&&b.size>500}catch(e){console.error(e);return false}
  };
})();