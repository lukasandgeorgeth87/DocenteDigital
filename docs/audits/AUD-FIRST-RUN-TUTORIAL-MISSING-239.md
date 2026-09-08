# AUD-FIRST-RUN-TUTORIAL-MISSING-239 — Tutorial inicial opcional inexistente

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Hallazgo
V4 exige un tutorial corto para el primer ingreso con la secuencia conceptual `rol → qué desea hacer → escribir necesidad → revisar → guardar/descargar` y exige que el tutorial sea opcional y siempre pueda omitirse. El runtime actual inicia con configuración de nivel, tipo de IE, grados/edades, áreas y perfil lingüístico. Esa configuración es necesaria para contextualizar la app, pero no constituye el tutorial solicitado: no explica el flujo completo de trabajo, no presenta la entrada natural de necesidad, no guía revisión/guardado/descarga y no existe una acción `Saltar tutorial` ni un estado de onboarding completado.

Búsqueda global del repositorio por `tutorial` no devuelve implementación. La inspección de `index.html` confirma que el primer ingreso corresponde al bloque `setup` de cuatro pasos de configuración y después entra a Inicio.

## Pruebas

### AUD-TUT-239-A — Primer ingreso guiado
**Módulo:** UX / onboarding.

**Entrada:** usuario nuevo abre DocenteDigital sin estado previo.

**Resultado esperado:** después o alrededor de la configuración indispensable, recibir una guía corta y práctica que enseñe el circuito esencial de uso sin manual: rol/objetivo → necesidad natural → revisar → guardar/descargar.

**Resultado obtenido:** el usuario recibe únicamente la configuración inicial `Nivel → Tipo de IE → Grados/edades → Áreas` y perfil lingüístico. No existe recorrido tutorial del trabajo real.

**Estado:** NO PASA.

**Severidad:** S3 MEDIO.

**Clasificación:** INEXISTENTE.

**Evidencia:** `index.html` (sección `#setup`) + búsqueda global del repositorio sin coincidencias para `tutorial`.

### AUD-TUT-239-B — Tutorial opcional / saltar
**Entrada:** usuario nuevo desea entrar directamente a la app sin tutorial.

**Resultado esperado:** si se muestra tutorial, debe existir una acción visible para omitirlo y no bloquear el trabajo.

**Resultado obtenido:** no existe tutorial ni control `Saltar/Omitir`; por tanto, el requisito de tutorial opcional tampoco está implementado.

**Estado:** NO PASA.

**Severidad:** S3 MEDIO, absorbido por AUD-239.

**Clasificación:** INEXISTENTE.

## Causa raíz
La experiencia de primer ingreso fue diseñada como configuración institucional/pedagógica y no como onboarding de uso. Se resolvió `qué datos necesita la app` antes que `cómo aprende el usuario a completar una tarea real`.

## Acción correctiva recomendada
No añadir un carrusel largo. Implementar un onboarding mínimo y opcional, preferentemente después de la configuración indispensable:
1. elegir/confirmar rol o espacio de trabajo;
2. mostrar una necesidad natural de ejemplo editable;
3. enseñar una única ruta real `Crear → Revisar → Guardar/Descargar`;
4. permitir `Saltar` desde el primer paso;
5. guardar metadato independiente `onboardingCompleted` sin modificar documentos históricos;
6. ofrecer `Ver tutorial` posteriormente desde ayuda/configuración;
7. probar en móvil, teclado, lector de pantalla y con usuarios principiantes.

## Corrección aplicada
Ninguna en esta ronda. Agregar onboarding afecta navegación, persistencia, accesibilidad y primera experiencia; no es un cambio suficientemente pequeño para aplicarlo sin pruebas UX reales.

## Riesgo de regresión
Medio si se implementa sin diseño: un tutorial obligatorio o extenso puede aumentar clics y contradecir V4. Debe ser corto, opcional y nunca bloquear funciones esenciales.

## Impacto cualitativo
- IUD: impacto negativo actual moderado en primer uso.
- ICGD: sin efecto directo demostrado.
- IFR: sin cálculo definitivo.
- ISU: afecta específicamente facilidad de aprendizaje/ayuda, pero no se calcula puntuación definitiva sin usuarios reales.
- Prelaunch: no constituye por sí solo S0/S1, pero es incumplimiento V4 y debe integrarse al cierre de experiencia de primer ingreso.

## Pendientes no simulados
- prueba con docentes/directores principiantes;
- prueba de 10 segundos;
- prueba sin manual;
- accesibilidad real del futuro onboarding;
- comportamiento en celular/tablet/laptop reales.

No se utilizó normativa MINEDU/UGEL externa para clasificar este hallazgo; no se declara ninguna vigencia normativa nueva.
