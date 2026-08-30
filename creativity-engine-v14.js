/* DocenteDigital – motor creativo v14: variación contextual + memoria de no repetición */
(function(){
  if(window.__ddCreativityV14)return; window.__ddCreativityV14=true;
  state.creativityHistory=state.creativityHistory||{};

  const norm=s=>String(s||'').toLowerCase();
  const themeFor=brief=>{
    const s=norm(brief);
    if(/siembr|tarpuy|papa|añu|oca|olluco/.test(s))return'siembra';
    if(/pachamama|madre tierra/.test(s))return'pachamama';
    if(/agua|yaku/.test(s))return'agua';
    if(/residuo|basura|contamin/.test(s))return'residuos';
    return'general';
  };
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
  function pick(key,pool,n){
    if(!pool?.length)return[];
    let used=Array.isArray(state.creativityHistory[key])?state.creativityHistory[key]:[];
    let available=pool.filter(x=>!used.includes(x.id));
    if(available.length<n){used=[];available=[...pool];}
    const chosen=shuffle(available).slice(0,n);
    state.creativityHistory[key]=[...used,...chosen.map(x=>x.id)].slice(-Math.max(pool.length,18));save();
    return chosen;
  }
  function ctx(brief){
    const c=state.teacherContext||{};
    const raw=String(brief||'').trim();
    const place=c.community||(/ccotataqui|cotataqui/i.test(raw)?'Ccotataqui':'nuestra comunidad');
    const grades=(state.grades||[]).join(', ')||'los grados seleccionados';
    return{raw,place,grades,c};
  }

  function titlePool(theme,project,place){
    const P=(id,t)=>({id,t});
    if(theme==='siembra')return project?[
      P('sp1',`Semillas con historia: investigamos y renovamos los saberes de la siembra en ${place}`),P('sp2','Guardianes de nuestras semillas: del saber familiar a una propuesta para el futuro'),P('sp3','Hatun Tarpuy en acción: investigamos, decidimos y compartimos cómo sembramos'),P('sp4','De la semilla a la comunidad: construimos soluciones para valorar nuestra agricultura'),P('sp5','Chacras que enseñan: investigamos la siembra y creamos un producto para nuestra comunidad'),P('sp6','Saberes que germinan: aprendemos con las familias y actuamos para cuidar la siembra'),P('sp7','Nuestro calendario de la chacra: investigamos señales, semillas y decisiones de siembra'),P('sp8','Sembrar hoy, cuidar mañana: proyecto de saberes, ciencia y comunidad'),P('sp9','Rutas del Hatun Tarpuy: investigamos cómo decide y trabaja nuestra comunidad'),P('sp10','Semillas de identidad: recuperamos saberes y los convertimos en una propuesta comunitaria')
    ]:[
      P('su1',`Aprendemos de la chacra: saberes y decisiones de la siembra en ${place}`),P('su2','Semillas que nos enseñan: descubrimos la ciencia y la cultura de nuestra siembra'),P('su3','Hatun Tarpuy: aprendemos de la tierra, las semillas y nuestras familias'),P('su4','Entre semillas y saberes: comprendemos cómo se organiza nuestra siembra'),P('su5','La chacra es nuestra aula: aprendemos investigando la siembra de la comunidad'),P('su6','Saberes que germinan: aprendemos de la siembra y cuidamos nuestra tierra'),P('su7','¿Cómo sabe la comunidad cuándo sembrar?: investigamos señales y experiencias'),P('su8','De nuestros abuelos a la escuela: aprendemos los saberes del Hatun Tarpuy'),P('su9','Cultivamos aprendizajes: matemática, ciencia, comunicación y cultura desde la siembra'),P('su10','Nuestra siembra, nuestra identidad: comprendemos, valoramos y comunicamos lo aprendido')
    ];
    if(theme==='pachamama')return project?[P('pp1','Pachamama viva: investigamos tradiciones y construimos compromisos que sí podemos cumplir'),P('pp2','Agradecer cuidando: un proyecto para unir saberes, identidad y acciones ambientales'),P('pp3','Voces de la Pachamama: recuperamos saberes y los compartimos con la comunidad'),P('pp4','Nuestra tierra nos habla: investigamos, creamos y actuamos para cuidarla'),P('pp5','Saberes para la vida: de la tradición de la Pachamama a una acción comunitaria'),P('pp6','Pachamamanchik: memoria, cuidado y acción desde la escuela')]:[P('pu1','Aprendemos de la Pachamama para valorar nuestra cultura y cuidar la vida'),P('pu2','Pachamamanchik: saberes, gratitud y cuidado de nuestra Madre Tierra'),P('pu3','Lo que nos enseña la Pachamama: aprendemos con nuestras familias'),P('pu4','Tradición y cuidado: comprendemos el agradecimiento a la Madre Tierra'),P('pu5','Nuestra tierra, nuestros saberes: aprendemos para cuidar y valorar'),P('pu6','Agradecemos y aprendemos: la Pachamama en nuestra vida comunitaria')];
    if(theme==='agua')return project?[P('ap1','Guardianes del yaku: investigamos y ponemos en marcha soluciones para cuidar el agua'),P('ap2','Yaku kawsaymi: un proyecto para conocer, cuidar y compartir soluciones'),P('ap3','Cada gota tiene una historia: investigamos el agua de nuestra comunidad'),P('ap4','Del problema a la acción: construimos soluciones para cuidar nuestro yaku'),P('ap5','Agua para la vida: investigamos, decidimos y actuamos juntos'),P('ap6','La ruta del yaku: investigamos de dónde viene, cómo se usa y cómo cuidarlo')]:[P('au1','El yaku nos da vida: aprendemos a conocerlo y cuidarlo'),P('au2','¿De dónde viene nuestra agua?: investigamos y aprendemos desde la comunidad'),P('au3','Agua, vida y comunidad: comprendemos cómo usarla responsablemente'),P('au4','Aprendemos del yaku: datos, saberes y acciones de cuidado'),P('au5','Cada gota cuenta: comprendemos el agua desde nuestras áreas'),P('au6','Nuestro yaku, nuestra responsabilidad: aprendemos para cuidarlo')];
    if(theme==='residuos')return project?[P('rp1','Menos residuos, más comunidad: investigamos y ponemos soluciones en práctica'),P('rp2','Transformamos lo que desechamos: proyecto de investigación, creación y acción'),P('rp3','De residuo a recurso: diseñamos soluciones para nuestra escuela'),P('rp4','Nuestra comunidad sin basura: investigamos, decidimos y actuamos'),P('rp5','Ecoideas que funcionan: construimos respuestas frente a nuestros residuos'),P('rp6','Cuidamos nuestros espacios: un proyecto para reducir, reutilizar y comunicar')]:[P('ru1','Comprendemos nuestros residuos para cuidar mejor la comunidad'),P('ru2','¿Qué pasa con lo que botamos?: investigamos y aprendemos'),P('ru3','Menos basura, más vida: aprendemos a tomar mejores decisiones'),P('ru4','Residuos bajo la lupa: observamos, analizamos y proponemos'),P('ru5','Nuestro entorno también aprende con nosotros: cuidamos los espacios comunes'),P('ru6','De lo que desechamos a lo que podemos cambiar: aprendemos juntos')];
    return project?[P('gp1','De nuestras preguntas a la acción: investigamos y construimos una respuesta útil'),P('gp2','Aprendemos haciendo: un proyecto para comprender y mejorar nuestro entorno'),P('gp3','Nuestra comunidad nos plantea un reto: investigamos, creamos y compartimos'),P('gp4','Ideas que transforman: aprendemos, decidimos y actuamos'),P('gp5','Investigamos nuestra realidad y construimos una solución con sentido'),P('gp6','Un reto de nuestra comunidad, muchas maneras de aprender y actuar')]:[P('gu1','Aprendemos desde nuestra realidad y construimos conocimientos con sentido'),P('gu2','Nuestra comunidad nos enseña: investigamos, dialogamos y aprendemos'),P('gu3','Preguntas de nuestra vida cotidiana que se convierten en aprendizajes'),P('gu4','Saberes cercanos, aprendizajes profundos: comprendemos nuestro entorno'),P('gu5','Miramos nuestra realidad con nuevos ojos: aprendemos desde varias áreas'),P('gu6','Lo que vivimos también se aprende: exploramos un reto de nuestra comunidad')];
  }

  function situationPools(theme,{place,grades,raw}){
    const S=(id,text)=>({id,text});
    if(theme==='siembra')return{
      formal:[
        S('sf1',`En ${place}, las familias se preparan para la siembra seleccionando semillas, organizando el terreno y tomando decisiones según su experiencia. Los estudiantes de ${grades} conocen parte de estas prácticas, pero no todos saben por qué se eligen ciertas semillas ni qué criterios usan las familias para decidir. Esto abre una oportunidad para recuperar saberes, observar, comparar y explicar. Reto: ¿Cómo podemos investigar cómo se seleccionan y cuidan las semillas en nuestra comunidad y compartir lo aprendido de una manera útil para otras familias y estudiantes?`),
        S('sf2',`En ${place}, la preparación del suelo y el uso de abonos forman parte importante de la siembra. Los estudiantes participan o acompañan a sus familias, aunque todavía tienen preguntas sobre qué hace fértil a la tierra, qué abonos se usan y por qué algunas prácticas cambian de una chacra a otra. Reto: ¿Cómo podemos investigar qué necesita el suelo antes de sembrar y explicar qué saberes y cuidados ayudan a que nuestros cultivos crezcan mejor?`),
        S('sf3',`En ${place}, algunas familias observan señales del clima, plantas, animales o el cielo para decidir cuándo realizar la siembra. Los estudiantes han escuchado estas explicaciones, pero no siempre conocen su significado ni cómo compararlas con otros datos sobre el tiempo y el ambiente. Reto: ¿Cómo podemos investigar las señales que orientan la siembra y compararlas con otras formas de observar el clima para explicar cómo toman decisiones nuestras familias?`),
        S('sf4',`En ${place}, la siembra no depende solo de semillas y herramientas; también requiere organización familiar, ayuda mutua y distribución de tareas. Los estudiantes observan distintas formas de trabajo, pero necesitan comprender cómo la colaboración permite cumplir una actividad comunal importante. Reto: ¿Cómo podemos conocer y explicar cómo se organizan las familias durante la siembra y qué podemos aprender de esas formas de colaboración para nuestra vida escolar?`),
        S('sf5',`En ${place}, se cultivan papa, añu, oca y otros productos que forman parte de la alimentación y de la vida de las familias. Sin embargo, los estudiantes conocen de manera desigual sus variedades, usos y formas de conservación. Reto: ¿Cómo podemos investigar la diversidad de cultivos de nuestra comunidad, reconocer su importancia y crear una manera atractiva de compartir estos saberes con otras personas?`)
      ],
      narrative:[
        S('sn1',`Un día, en ${place}, llegaron al aula varias semillas de papa, añu y oca. A simple vista algunas parecían iguales y otras muy diferentes. Los estudiantes comenzaron a preguntar quién las había elegido, cómo sabían cuáles servían para sembrar y por qué las familias guardaban unas y no otras. Reto: ¿Cómo podemos convertirnos en investigadores de nuestras semillas, descubrir qué saben las familias sobre ellas y enseñar esos saberes a otros?`),
        S('sn2',`Mientras caminaban cerca de una chacra de ${place}, los estudiantes vieron que dos familias preparaban la tierra de manera distinta. Una usaba un tipo de abono y otra seguía otro procedimiento. Surgió entonces una pregunta: ¿pueden existir varias maneras correctas de preparar la chacra? Reto: ¿Cómo podemos investigar estas formas de preparar el suelo, comparar sus razones y explicar lo que descubrimos?`),
        S('sn3',`Antes del Hatun Tarpuy, una persona mayor de ${place} comentó que ciertas señales anunciaban un buen momento para sembrar. Algunos estudiantes habían escuchado señales parecidas y otros nunca las habían oído. Reto: ¿Cómo podemos recoger esas señales, preguntar qué significan, compararlas con otras observaciones y construir una explicación para compartirla con nuestra comunidad?`),
        S('sn4',`En una conversación sobre la siembra, los estudiantes notaron que nadie trabaja completamente solo: unas personas preparan, otras llevan semillas, otras apoyan con herramientas y todas cumplen responsabilidades. Entonces se preguntaron por qué esa organización es tan importante. Reto: ¿Cómo podemos descubrir cómo se organiza el trabajo durante la siembra y representar de manera creativa lo que esta colaboración enseña a nuestra escuela?`),
        S('sn5',`Al observar los productos que se siembran en ${place}, los estudiantes descubrieron nombres, colores, tamaños y usos que no todos conocían. Algunos recordaron lo que sus abuelos les contaron y otros quisieron saber si esas variedades siempre existieron. Reto: ¿Cómo podemos investigar la diversidad de nuestros cultivos y crear un producto que ayude a valorar y conservar esos conocimientos?`)
      ]
    };
    const base=raw||'una situación cercana a la vida de la comunidad';
    return{
      formal:[S('gf1',`En ${place}, ${base} forma parte de la experiencia de los estudiantes de ${grades}. Aunque conocen algunos aspectos por su vida familiar y comunitaria, todavía existen preguntas, distintas explicaciones y aspectos que necesitan comprender mejor. Reto: ¿Cómo podemos investigar esta situación desde varias áreas, relacionar lo que sabe la comunidad con nuevos aprendizajes y construir una respuesta útil para nuestro contexto?`),S('gf2',`En ${place}, la situación “${base}” permite observar una necesidad, oportunidad o problema cercano. Los estudiantes tienen experiencias previas, pero requieren recoger información, comparar puntos de vista y explicar mejor lo que ocurre. Reto: ¿Cómo podemos comprender esta situación, tomar decisiones con razones y comunicar una propuesta que tenga sentido para nuestra comunidad?`),S('gf3',`Las familias de ${place} viven de distintas maneras la situación “${base}”. Esto brinda la oportunidad de escuchar voces, recuperar saberes y trabajar con información real para aprender desde varias áreas. Reto: ¿Cómo podemos investigar lo que ocurre, explicar lo aprendido y crear una respuesta que pueda ser compartida con destinatarios reales?`)],
      narrative:[S('gn1',`Durante una conversación en el aula apareció un tema que todos reconocían: “${base}”. Pronto surgieron experiencias diferentes, preguntas y opiniones que no coincidían. Los estudiantes decidieron que antes de responder necesitaban investigar. Reto: ¿Cómo podemos averiguar más, comparar lo que sabemos y transformar nuestros descubrimientos en algo útil para la comunidad?`),S('gn2',`Un hecho relacionado con “${base}” llamó la atención de los estudiantes de ${place}. Algunos tenían una explicación, otros recordaron lo que dicen sus familias y varios querían comprobar quién tenía razón. Reto: ¿Cómo podemos investigar juntos, escuchar diferentes saberes y construir una explicación o propuesta que podamos mostrar a otras personas?`),S('gn3',`Los estudiantes descubrieron que una situación cotidiana —“${base}”— escondía muchas preguntas que nunca se habían hecho. Decidieron observar mejor, conversar con sus familias y buscar nuevas pistas. Reto: ¿Cómo podemos convertir esas preguntas en aprendizajes y crear una respuesta que realmente tenga sentido en ${place}?`)]
    };
  }

  function productPool(theme,project){
    const P=(id,title,text)=>({id,title,text});
    if(theme==='siembra')return[
      P('prd1','Atlas vivo de semillas andinas','Catálogo ilustrado de semillas y cultivos con nombres locales, características, usos, entrevistas, medidas, gráficos y explicaciones científicas preparado para consulta de la escuela y las familias.'),
      P('prd2','Maleta viajera del Hatun Tarpuy','Maleta didáctica con muestras o representaciones, tarjetas, relatos, problemas matemáticos, fichas científicas y retos para que otros grados o familias conozcan los saberes de la siembra.'),
      P('prd3','Calendario comunal interactivo de la siembra','Calendario mural que integra épocas, señales, tareas, cultivos, datos, textos breves y saberes familiares para explicar cómo se organiza el ciclo de la siembra.'),
      P('prd4','Mapa de decisiones de la chacra','Gran mapa o ruta visual que muestra las decisiones de la siembra: suelo, semilla, clima, organización, cuidado y cosecha, sustentadas con información recogida por los estudiantes.'),
      P('prd5','Banco escolar de saberes y semillas','Muestra organizada con semillas o réplicas, fichas de identificación, testimonios, registros matemáticos y científicos y recomendaciones para valorar la diversidad agrícola.'),
      P('prd6','Juego de mesa “Reto Tarpuy”','Juego construido por los estudiantes con preguntas, decisiones y desafíos sobre semillas, clima, medidas, organización, vocabulario y saberes de la comunidad.'),
      P('prd7','Guía familiar “Así sembramos en nuestra comunidad”','Guía ilustrada elaborada por grados con entrevistas, secuencias, medidas, recomendaciones, vocabulario local, explicaciones científicas y acuerdos de cuidado.'),
      P('prd8','Radio escolar “Voces de la chacra”','Serie breve de audios o programa radial acompañado de un mural físico con entrevistas, relatos, datos, problemas y conclusiones sobre la siembra.'),
      P('prd9','Museo de decisiones del Hatun Tarpuy','Exposición por estaciones centrada no solo en objetos, sino en las decisiones que toman las familias antes, durante y después de sembrar, explicadas con evidencias de las áreas.'),
      P('prd10','Bitácora comparativa de una chacra','Cuaderno colectivo con observaciones, dibujos, medidas, tablas, entrevistas y explicaciones que documentan y comparan el proceso de siembra a lo largo de varias semanas.'),
      P('prd11','Feria “Semillas, saberes y sabores”','Feria con estaciones sobre diversidad de cultivos, alimentación, medidas, textos, saberes familiares, indagaciones y demostraciones preparadas por los estudiantes.'),
      P('prd12','Mural desplegable “De la semilla a la vida”','Mural modular y portátil que integra el ciclo de la siembra, testimonios, problemas matemáticos, explicaciones científicas, vocabulario y compromisos para cuidar los saberes agrícolas.')
    ];
    const generic=[P('gprd1','Museo vivo de aprendizajes','Muestra por estaciones con objetos, textos, datos, explicaciones y producciones de las áreas para responder al reto.'),P('gprd2','Maleta viajera de saberes','Kit portátil con materiales creados por los estudiantes para compartir aprendizajes y preguntas con otras aulas o familias.'),P('gprd3','Guía comunitaria ilustrada','Guía práctica con información, recomendaciones, datos, testimonios y producciones relacionadas con el reto.'),P('gprd4','Ruta interactiva de aprendizajes','Recorrido con estaciones donde los estudiantes explican hallazgos, muestran evidencias y plantean decisiones o propuestas.'),P('gprd5','Juego educativo del reto','Juego de mesa o tarjetas diseñado para enseñar a otros lo aprendido mediante preguntas, decisiones y desafíos.'),P('gprd6','Podcast o radio escolar con exposición','Producción sonora acompañada de una muestra física que integra testimonios, explicaciones, datos y conclusiones.'),P('gprd7','Portafolio comunitario comentado','Colección organizada de evidencias con textos, gráficos, fotografías o dibujos y explicaciones de lo aprendido.'),P('gprd8','Feria de soluciones y aprendizajes','Feria donde los estudiantes muestran evidencias de las áreas y presentan propuestas relacionadas directamente con el reto.'),P('gprd9','Mural modular para la comunidad','Mural desmontable con información, mapas, datos, producciones y compromisos que puede circular por distintos espacios.'),P('gprd10','Campaña con producto útil','Acción de comunicación acompañada de materiales concretos elaborados por los estudiantes para informar y movilizar a destinatarios reales.')];
    return generic;
  }

  window.ddCreativeTitleOptions=function(brief,type){
    const theme=themeFor(brief),project=/proyecto/i.test(type||''),{place}=ctx(brief);const pool=titlePool(theme,project,place);
    return pick(`${theme}:${project?'project':'unit'}:titles`,pool,3).map(x=>x.t);
  };

  window.ddCreativeChoices=function(brief,type,fallback){
    const theme=themeFor(brief),project=/proyecto/i.test(type||''),c=ctx(brief);const sp=situationPools(theme,c);
    const formal=pick(`${theme}:${project?'project':'unit'}:formal`,sp.formal,1)[0];
    const narrative=pick(`${theme}:${project?'project':'unit'}:narrative`,sp.narrative,1)[0];
    const products=pick(`${theme}:${project?'project':'unit'}:products`,productPool(theme,project),3);
    return{
      situations:[{key:'A',title:'Opción A · Clara y pedagógica',text:formal?.text||fallback?.situations?.[0]?.text||''},{key:'B',title:'Opción B · Narrativa y vivencial',text:narrative?.text||fallback?.situations?.[1]?.text||''}],
      products:products.map((x,i)=>({key:String(i+1),title:x.title,text:x.text}))
    };
  };

  window.ddCreativeProducts=function(brief,type,fallback){
    const theme=themeFor(brief),project=/proyecto/i.test(type||'');const products=pick(`${theme}:${project?'project':'unit'}:products`,productPool(theme,project),3);
    return products.length?products.map((x,i)=>({key:String(i+1),title:x.title,text:x.text})):fallback;
  };

  window.ddSuggestTitles=function(){
    const brief=byId('unitSituation')?.value.trim()||'';if(!brief)return alert('Primero escribe la idea o contexto de partida.');
    const type=byId('unitType')?.value||'Unidad de aprendizaje';const opts=window.ddCreativeTitleOptions(brief,type);
    let box=byId('ddTitleSuggestions');if(!box){box=document.createElement('div');box.id='ddTitleSuggestions';box.className='dd-title-suggestions';byId('unitTitle')?.parentElement?.appendChild(box);}
    if(box)box.innerHTML='<small><b>3 títulos nuevos:</b> vuelve a pulsar para recibir otros.</small>'+opts.map((t,i)=>`<button type="button" data-dd-title="${i}">${i+1}. ${escapeHtml(t)}</button>`).join('');
    box?.querySelectorAll('[data-dd-title]').forEach((b,i)=>b.onclick=()=>{byId('unitTitle').value=opts[i];});
  };
  const titleBtn=document.querySelector('.dd-title-btn');if(titleBtn){titleBtn.textContent='✨ Proponer 3 títulos nuevos';titleBtn.onclick=window.ddSuggestTitles;}

  window.ddCreativity={themeFor};
})();