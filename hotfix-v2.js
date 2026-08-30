/* Hotfix de selección de títulos */
(function(){
  window.ddSuggestTitles=function(){
    const brief=byId('unitSituation')?.value.trim()||'';
    if(!brief)return alert('Primero escribe la idea o contexto de partida.');
    const type=byId('unitType')?.value||'Unidad de aprendizaje';
    const s=brief.toLowerCase();
    const project=type==='Proyecto de aprendizaje';
    let opts;
    if(/siembr|tarpuy|papa|añu|oca|olluco/.test(s)) opts=project?[
      'Hatun Tarpuy: investigamos, sembramos y compartimos los saberes de nuestra comunidad',
      'Sembramos saberes y futuro: aprendemos del Hatun Tarpuy de Ccotataqui',
      'De la chacra a la escuela: investigamos y valoramos nuestra siembra andina'
    ]:[
      'Sembramos saberes y cuidamos nuestra tierra en el Hatun Tarpuy de Ccotataqui',
      'Aprendemos de nuestra siembra: saberes, ciencia y comunidad en Ccotataqui',
      'Hatun Tarpuy: aprendemos juntos de la siembra y la vida de nuestra comunidad'
    ];
    else if(/pachamama|madre tierra/.test(s)) opts=project?[
      'Pachamamanchik: investigamos, valoramos y actuamos para cuidar nuestra Madre Tierra',
      'Saberes que cuidan la vida: un proyecto para agradecer y proteger la Pachamama',
      'Nuestra Pachamama, nuestra responsabilidad: aprendemos y actuamos desde la comunidad'
    ]:[
      'Pachamamanchik kawsayta quwanchik: aprendemos a agradecer y cuidar nuestra Madre Tierra',
      'Aprendemos de la Pachamama y fortalecemos nuestro compromiso con la vida',
      'Saberes de nuestra tierra: valoramos, agradecemos y cuidamos la Pachamama'
    ];
    else opts=project?[
      'Investigamos nuestra realidad y construimos soluciones para la comunidad',
      'Aprendemos haciendo: un proyecto para comprender y mejorar nuestro entorno',
      'De nuestras preguntas a la acción: investigamos, creamos y compartimos'
    ]:[
      'Aprendemos desde nuestra realidad para comprender y transformar el entorno',
      'Saberes de nuestra comunidad: investigamos, dialogamos y aprendemos juntos',
      'Nuestra comunidad nos enseña: construimos aprendizajes con sentido'
    ];
    let box=byId('ddTitleSuggestions');
    if(!box){box=document.createElement('div');box.id='ddTitleSuggestions';box.className='dd-title-suggestions';byId('unitTitle').parentElement.appendChild(box);}
    box.innerHTML='<small><b>Títulos propuestos por DocenteDigital:</b></small>';
    opts.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.textContent=`${i+1}. ${t}`;b.onclick=()=>{byId('unitTitle').value=t;};box.appendChild(b);});
  };
})();