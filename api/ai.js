const {reserveQuota}=require('./_ai-quota');
const {checkBetaAccess}=require('./_beta-access');
const {betaEnvironmentAllowed}=require('./_ai-beta-environment');
const {redactPersonalData}=require('./_ai-privacy');
const ROUTINE_MODEL = process.env.OPENAI_MODEL_ROUTINE || 'gpt-6-luna';
const COMPLEX_MODEL = process.env.OPENAI_MODEL_COMPLEX || 'gpt-6.1-sol';
const API_URL = 'https://api.openai.com/v1/responses';

const TASKS = {
  title_options: {
    mode: 'routine',
    instruction: 'El título escrito por el docente es el ancla semántica principal cuando ya expresa con claridad el tema, territorio o intención; el contexto complementa y precisa, pero no debe desplazarlo. Primero extrae un núcleo pedagógico breve y natural. Ejemplo: “CONOCIENDO NUESTROS RESTOS ARQUEOLÓGICOS EN PISAC Y CCOTATAQUI” + “en la comunidad encontramos pinturas rupestres” debe integrarse como patrimonio arqueológico local, restos arqueológicos y pinturas rupestres en ese territorio, nunca copiar la frase circunstancial completa. Propón exactamente 3 títulos distintos, potentes, naturales, motivadores y coherentes con el nivel y el tipo de planificación. Evita mayúsculas sostenidas, frases pegadas literalmente del contexto y fórmulas genéricas como “construimos nuevos aprendizajes”, “desde nuestra experiencia” o “comunicamos lo aprendido”. No inventes problemas, causas ni datos locales.'
  },
  significant_situation: {
    mode: 'complex',
    instruction: 'Redacta una situación significativa concreta, auténtica y pedagógicamente útil. Mantén una sola columna vertebral de coherencia: tema o fenómeno central → contexto real → lo que los estudiantes observan o saben → lo que necesitan averiguar o comprender → reto → acciones de aprendizaje → evidencia o producto. Si el perfil incluye institución, comunidad, distrito, provincia o región, nómbralos de forma natural; no los sustituyas por frases vagas como “entorno de los estudiantes”. Usa únicamente hechos proporcionados por el docente o por el perfil. No mezcles temas de distintas áreas solo para mencionarlos: cada área debe aportar al mismo reto central. No inventes causas, actores, antigüedad, significados, costumbres ni datos. Distingue claramente observación, inferencia e información que requiere fuente. La redacción debe sonar como un docente experimentado, no como una plantilla genérica.'
  },
  products: {
    mode: 'routine',
    instruction: 'Propón productos o actuaciones finales auténticos, viables, observables y directamente conectados con el reto central. El producto debe permitir evidenciar qué comprendieron, investigaron, resolvieron o comunicaron los estudiantes; no debe añadir un tema nuevo ni convertirse en una actividad decorativa. Ajusta complejidad por nivel y ofrece alternativas realmente distintas.'
  },
  session_strategy: {
    mode: 'complex',
    instruction: 'Diseña una secuencia lógica y concreta de estrategias de aprendizaje. Explica qué hacen los estudiantes, con qué recursos, para qué y qué evidencia producen. Ajusta complejidad por nivel; en Inicial prioriza juego, exploración, interacción y representación; en Primaria y Secundaria aumenta progresivamente razonamiento, autonomía y uso de evidencias.'
  },
  material: {
    mode: 'routine',
    instruction: 'Crea o mejora un material educativo listo para usar, ajustado al nivel, grado/edad, área, propósito y evidencia. Si es Inicial, prioriza consignas breves, actividad visual concreta y variedad de diseños; cualquier ficha de referencia es inspiración, no plantilla obligatoria.'
  },
  director_document: {
    mode: 'complex',
    instruction: 'Redacta un documento de gestión escolar claro y editable. No inventes normas, números de resolución, autoridades, fechas ni datos institucionales. Si falta una base normativa, indícalo como pendiente de verificación.'
  },
  contextual_help: {
    mode: 'routine',
    instruction: 'Responde como especialista pedagógico peruano, de manera breve, práctica y contextualizada, usando únicamente los datos suministrados.'
  }
};

function json(res,status,data){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(data));
}

function cleanString(value,max=12000){
  return String(value ?? '').replace(/\u0000/g,'').trim().slice(0,max);
}

function safeContext(raw){
  const c = raw && typeof raw === 'object' ? raw : {};
  const allow = [
    'level','ieType','grades','areas','language','indigenousLanguage','linguisticMode',
    'institutionName','localityType','community','district','province','region','ugel',
    'planningType','duration','title','brief','purpose','product','area','grade','age',
    'criterion','evidence','topic','teacherInstruction','sourceText'
  ];
  const out={};
  for(const key of allow){
    if(c[key] === undefined || c[key] === null) continue;
    if(Array.isArray(c[key])) out[key]=c[key].slice(0,12).map(v=>redactPersonalData(cleanString(v,250)));
    else out[key]=redactPersonalData(cleanString(c[key], key==='sourceText' ? 7000 : 1200));
  }
  return out;
}

function schema(){
  return {
    type:'object',
    properties:{
      result:{type:'string'},
      options:{type:'array',items:{type:'string'}},
      warnings:{type:'array',items:{type:'string'}},
      teacher_note:{type:'string'}
    },
    required:['result','options','warnings','teacher_note'],
    additionalProperties:false
  };
}

function validStructuredResult(value,task){
  if(!value || typeof value!=='object' || Array.isArray(value)) return false;
  const keys=Object.keys(value);
  if(keys.length!==4 || !['result','options','warnings','teacher_note'].every(k=>keys.includes(k))) return false;
  if(typeof value.result!=='string' || typeof value.teacher_note!=='string') return false;
  if(!Array.isArray(value.options) || !value.options.every(x=>typeof x==='string')) return false;
  if(!Array.isArray(value.warnings) || !value.warnings.every(x=>typeof x==='string')) return false;
  // A structurally valid JSON object can still contain no usable teaching content.
  const options=value.options.map(x=>x.trim());
  if(options.some(x=>!x)) return false;
  if(!value.result.trim() && options.length===0) return false;
  // The title picker expects exactly three distinct, usable proposals.
  if(task==='title_options'){
    if(options.length!==3) return false;
    if(new Set(options.map(x=>x.toLocaleLowerCase('es'))).size!==3) return false;
  }
  return true;
}

function extractOutputText(data){
  if(typeof data?.output_text === 'string') return data.output_text;
  const chunks=[];
  for(const item of data?.output || []){
    for(const part of item?.content || []){
      if(part?.type === 'output_text' && typeof part.text === 'string') chunks.push(part.text);
    }
  }
  return chunks.join('\n');
}

module.exports = async function handler(req,res){
  if(req.method !== 'POST') return json(res,405,{ok:false,error:'method_not_allowed'});
  if(!betaEnvironmentAllowed())return json(res,403,{ok:false,error:'ai_preview_only'});
  if(!process.env.OPENAI_API_KEY) return json(res,503,{ok:false,error:'openai_not_configured'});
  // Fail closed: setting a paid provider key alone must never activate a public endpoint.
  // This is a billing kill switch, NOT authentication or a substitute for quotas.
  if(process.env.DD_AI_BETA_ENABLED!=='true') return json(res,503,{ok:false,error:'ai_beta_disabled'});
  const denied=checkBetaAccess(req);
  if(denied)return json(res,denied.status,{ok:false,error:denied.error});

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const task = cleanString(body.task,80);
  const cfg = TASKS[task];
  if(!cfg) return json(res,400,{ok:false,error:'unsupported_task'});

  const prompt = redactPersonalData(cleanString(body.prompt,12000));
  if(!prompt) return json(res,400,{ok:false,error:'empty_prompt'});
  const context = safeContext(body.context);
  const requested = body.quality === 'high' ? 'complex' : cfg.mode;
  const model = requested === 'complex' ? COMPLEX_MODEL : ROUTINE_MODEL;

  const instructions = [
    'Eres el motor pedagógico de DocenteDigital para docentes del Perú.',
    'Respeta el CNEB y la información curricular oficial suministrada por la aplicación; no presentes una redacción generada como desempeño oficial.',
    'No inventes información institucional, territorial, normativa ni datos sobre estudiantes.',
    'No incluyas datos personales innecesarios.',
    'Escribe en español claro y profesional.',
    'Antes de responder, distingue lo que los estudiantes YA saben o practican del aprendizaje NUEVO o desafío que el docente quiere lograr; no conviertas los saberes previos en el tema central si el reto es otro.',
    'Para unidad/proyecto conserva una secuencia contexto verificable → necesidad → reto → producto observable. Para sesión y materiales enlaza propósito → actividad por grado → evidencia → criterio de evaluación, sin inventar competencias ni desempeños oficiales.',
    'Si faltan datos curriculares o locales necesarios, señala la limitación en warnings en vez de completarla con supuestos. No mezcles proyectos o sesiones ajenas al contexto recibido.',
    cfg.instruction,
    'Devuelve JSON estructurado. En options incluye alternativas cuando sean útiles; de lo contrario devuelve un arreglo vacío.'
  ].join(' ');

  // Reserve a durable global daily unit before any paid provider request.
  const quotaDenied=await reserveQuota('text');
  if(quotaDenied)return json(res,quotaDenied.status,{ok:false,error:quotaDenied.error});

  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),28000);
  try{
    const response = await fetch(API_URL,{
      method:'POST',
      headers:{
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model,
        store:false,
        max_output_tokens: requested === 'complex' ? 1800 : 1000,
        instructions,
        input:[
          {role:'user',content:[
            {type:'input_text',text:'CONTEXTO SEGURO DE LA APP:\n'+JSON.stringify(context)},
            {type:'input_text',text:'SOLICITUD DEL DOCENTE:\n'+prompt}
          ]}
        ],
        text:{
          format:{
            type:'json_schema',
            name:'docente_digital_response',
            strict:true,
            schema:schema()
          }
        }
      }),
      signal:controller.signal
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok){
      console.error('DocenteDigital OpenAI error',response.status,data?.error?.type||'unknown');
      return json(res,response.status===429?429:502,{ok:false,error:'openai_request_failed',retryable:response.status===429||response.status>=500});
    }
    if(data?.status && data.status!=='completed') return json(res,502,{ok:false,error:'incomplete_ai_response',retryable:true});
    const raw=extractOutputText(data);
    let parsed;
    try{parsed=JSON.parse(raw);}catch(_e){
      return json(res,502,{ok:false,error:'invalid_structured_output'});
    }
    if(!validStructuredResult(parsed,task)) return json(res,502,{ok:false,error:'invalid_structured_output'});
    return json(res,200,{
      ok:true,
      task,
      data:parsed,
      usage:{
        input_tokens:data?.usage?.input_tokens||0,
        output_tokens:data?.usage?.output_tokens||0,
        total_tokens:data?.usage?.total_tokens||0
      },
      route:requested,
      request_id:data?.id||null
    });
  }catch(error){
    if(error?.name==='AbortError') return json(res,504,{ok:false,error:'openai_timeout',retryable:true});
    console.error('DocenteDigital AI runtime error',error?.message||error);
    return json(res,500,{ok:false,error:'ai_runtime_error'});
  }finally{
    clearTimeout(timer);
  }
};