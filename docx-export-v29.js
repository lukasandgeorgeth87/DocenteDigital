/* DocenteDigital – exportación DOCX OOXML real v29
   Genera .docx ZIP válido sin dependencias externas para mejorar compatibilidad móvil.
*/
(function(){
  if(window.__ddDocxExportV29)return; window.__ddDocxExportV29=true;
  // XML 1.0 forbids C0 control characters except TAB, LF and CR, and U+FFFE/U+FFFF.
  // Replace invalid code points with spaces so pasted teacher text cannot corrupt OOXML.
  const E=v=>String(v??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g,' ').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const enc=new TextEncoder();
  let lastDownloadName='';
  let lastDownloadContentKey='';
  let lastDownloadAt=0;
  let shareInFlight=false;
  const DUPLICATE_WINDOW_MS=1200;

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

  function textOf(node){
    const parts=[];
    function visit(n){
      if(n?.nodeType===3){parts.push(String(n.nodeValue||''));return;}
      if(n?.nodeName==='BR'){parts.push('\n');return;}
      if(n?.childNodes)for(const child of n.childNodes)visit(child);
    }
    visit(node);
    return (parts.length?parts.join(''):String(node?.textContent||''))
      .replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').trim();
  }
  function runXml(text,bold=false,size=22){
    if(!text)return '';
    const fragments=String(text).split('\n');
    const content=fragments.map((line,i)=>`${i?'<w:br/>':''}<w:t xml:space="preserve">${E(line)}</w:t>`).join('');
    return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/>${bold?'<w:b/>':''}</w:rPr>${content}</w:r>`;
  }
  function pXml(text,{bold=false,size=22,center=false,after=80}={}){
    if(!text)return '<w:p/>';
    return `<w:p><w:pPr>${center?'<w:jc w:val="center"/>':''}<w:spacing w:after="${after}"/></w:pPr>${runXml(text,bold,size)}</w:p>`;
  }
  function tableXml(table){
    const rows=[...table.rows];
    if(!rows.length)return '';
    const cellsOf=tr=>[...tr.children].filter(c=>/^(TD|TH)$/.test(c.tagName));
    const span=c=>Math.max(1,Math.min(16,parseInt(c.getAttribute?.('colspan')||'1',10)||1));
    const count=Math.max(1,...rows.map(tr=>cellsOf(tr).reduce((n,c)=>n+span(c),0)));
    // Word necesita tblGrid explícito y anchos consistentes para evitar páginas
    // vacías y columnas que se expanden al imprimir tablas largas.
    const totalWidth=15000;
    const declared=String(table.getAttribute?.('data-col-weights')||'').split(',').map(Number);
    const valid=declared.length===count&&declared.every(n=>Number.isFinite(n)&&n>0);
    const weights=valid?declared:Array(count).fill(1);
    const sum=weights.reduce((a,b)=>a+b,0);
    const widths=weights.map(n=>Math.max(550,Math.floor(totalWidth*n/sum)));
    widths[count-1]+=totalWidth-widths.reduce((a,b)=>a+b,0);
    const grid='<w:tblGrid>'+widths.map(width=>`<w:gridCol w:w="${width}"/>`).join('')+'</w:tblGrid>';
    const body=rows.map(tr=>{
      const cells=cellsOf(tr);
      const head=cells.length&&cells.every(c=>c.tagName==='TH');
      return `<w:tr><w:trPr><w:cantSplit/>${head?'<w:tblHeader w:val="true"/>':''}</w:trPr>${cells.map((c,i)=>{
        const sp=span(c);
        const cellW=widths.slice(i,i+sp).reduce((a,b)=>a+b,0);
        return `<w:tc><w:tcPr><w:tcW w:w="${cellW}" w:type="dxa"/>${sp>1?`<w:gridSpan w:val="${sp}"/>`:''}${c.tagName==='TH'?'<w:shd w:fill="E7F1EA"/>':''}<w:tcMar><w:top w:w="95" w:type="dxa"/><w:left w:w="95" w:type="dxa"/><w:bottom w:w="95" w:type="dxa"/><w:right w:w="95" w:type="dxa"/></w:tcMar><w:tcBorders><w:top w:val="single" w:sz="4" w:color="A8B5AF"/><w:left w:val="single" w:sz="4" w:color="A8B5AF"/><w:bottom w:val="single" w:sz="4" w:color="A8B5AF"/><w:right w:val="single" w:sz="4" w:color="A8B5AF"/></w:tcBorders></w:tcPr>${pXml(textOf(c),{bold:c.tagName==='TH',size:18,after:22})}</w:tc>`;
      }).join('')}</w:tr>`;
    }).join('');
    return `<w:tbl><w:tblPr><w:tblW w:w="${totalWidth}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr>${grid}${body}</w:tbl>${pXml('',{})}`;
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
  function docxBlob(title,html,landscape=false,documentContext=null){
    const body=htmlToWordXml(html);
    const pgSz=landscape?'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>':'<w:pgSz w:w="11906" w:h="16838"/>';
    // Para documentos históricos, usar SOLO el snapshot del documento; nunca
    // completar la identidad con la Ficha Maestra que esté activa hoy.
    const context=documentContext&&typeof documentContext==='object'?documentContext:null;
    const ieName=context?context.institution:(state.institutionMaster?.ieName||state.ieName||state.schoolName||'');
    const teacher=context?context.teacher:state.teacherName;
    const identity=[teacher,ieName].map(v=>String(v||'').trim()).filter(Boolean).join(' · ');
    const identityXml=identity?`<w:p>${runXml(identity,false,18)}</w:p>`:'';
    const verificationXml=context?.historicalIdentityUnverified?pXml('Identidad histórica por verificar antes de emitir este documento.',{bold:true}):'';
    const documentXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}${identityXml}${verificationXml}<w:sectPr>${pgSz}<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    const contentTypes=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
    const rels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    const bytes=zip([{name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rels},{name:'word/document.xml',data:documentXml}]);
    return new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }
  function fileName(title){return (typeof cleanFileName==='function'?cleanFileName(title):String(title||'documento').replace(/[^\w -]+/g,'').trim().replace(/\s+/g,'_'))+'.docx'}
  function downloadDocx(blob,name,contentKey=''){
    const now=Date.now();
    if(name===lastDownloadName&&contentKey===lastDownloadContentKey&&now-lastDownloadAt<DUPLICATE_WINDOW_MS)return false;
    lastDownloadName=name;lastDownloadContentKey=contentKey;lastDownloadAt=now;
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1800);
    return true;
  }
  async function shareDocx(blob,name,title){
    if(shareInFlight)return;
    shareInFlight=true;
    try{
      const f=new File([blob],name,{type:blob.type});
      if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[f]}))){
        await navigator.share({title,files:[f]});
        return;
      }
      downloadDocx(blob,name);
    }catch(e){
      if(e?.name==='AbortError') return;
      console.warn('Compartir DOCX:',e);
      downloadDocx(blob,name);
    }finally{
      shareInFlight=false;
    }
  }

  function savedIdentity(document){
    return document?.documentContextSnapshot&&typeof document.documentContextSnapshot==='object'
      ?document.documentContextSnapshot:{historicalIdentityUnverified:true};
  }

  window.downloadUnitWord=function(id){
    const unit=(state.units||[]).find(u=>u.id===id);if(!unit)return;
    const blob=docxBlob(unit.title,unitWordHtml(unit),true,savedIdentity(unit));downloadDocx(blob,fileName(unit.title));
  };
  window.shareUnit=function(id){
    const unit=(state.units||[]).find(u=>u.id===id);if(!unit)return;
    const blob=docxBlob(unit.title,unitWordHtml(unit),true,savedIdentity(unit));shareDocx(blob,fileName(unit.title),unit.title);
  };
  window.downloadSessionWord=function(){
    const s=state.lastSession;if(!s)return alert('Primero crea una sesión.');
    const blob=docxBlob(s.title,sessionHtml(s,true),false,savedIdentity(s));downloadDocx(blob,fileName(s.title));
  };
  window.shareSession=function(){
    const s=state.lastSession;if(!s)return alert('Primero crea una sesión.');
    const blob=docxBlob(s.title,sessionHtml(s,true),false,savedIdentity(s));shareDocx(blob,fileName(s.title),s.title);
  };
  window.DDWordExport={
    downloadHtml:function(title,html,landscape=false,customName=''){
      const blob=docxBlob(title,html,landscape);
      const name=customName?cleanFileName(customName)+'.docx':fileName(title);
      return downloadDocx(blob,name,String(html||''));
    },
    shareHtml:function(title,html,landscape=false,customName=''){
      const blob=docxBlob(title,html,landscape);
      const name=customName?cleanFileName(customName)+'.docx':fileName(title);
      return shareDocx(blob,name,title);
    },
    createBlob:docxBlob
  };

  window.ddDocxSelfTest=function(){
    try{const b=docxBlob('Prueba','<h1>Prueba DOCX</h1><p>Compatibilidad OOXML.</p><table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>',false);return b.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'&&b.size>500}catch(e){console.error(e);return false}
  };
})();
