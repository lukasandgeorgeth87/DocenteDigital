# ESTADO BASE DE AUDITORÍA MAESTRA — 2026-08-31

> Documento de control interno. Se actualiza a partir de pruebas reales. No confundir con certificación oficial ni con validación normativa externa.

## Estado global actual

**Nivel interno provisional: NIVEL 1 — PROTOTIPO AVANZADO.**

La aplicación todavía **NO debe declararse lista para producción, piloto masivo ni escalamiento**. Para avanzar de nivel deben existir pruebas punta a punta, persistencia multiusuario segura, autenticación, aislamiento de datos, exportaciones verificadas, trazabilidad documental real y módulos directivos funcionales.

## Clasificación usada

- **FUNCIONAL:** completa correctamente su objetivo en una prueba real.
- **PARCIALMENTE FUNCIONAL:** inicia/completa parte del objetivo, pero tiene limitaciones importantes.
- **SIMULADA:** parece disponible, pero no completa realmente el proceso prometido.
- **ROTA:** produce un error reproducible.
- **INEXISTENTE:** todavía no existe.

---

## 1. Núcleo de comprensión e IA

| Función | Estado | Observación |
|---|---|---|
| Comprensión local de contexto e intención | PARCIALMENTE FUNCIONAL | Existe núcleo semántico local y reglas de finalidad; falta validar una batería amplia de casos. |
| Interpretación de finalidad “aprendemos X para hacer Y” | PARCIALMENTE FUNCIONAL | Caso biohuerto incorporado como regresión obligatoria; faltan pruebas con finalidades no previstas. |
| IA semántica real vía backend | INEXISTENTE | El prototipo todavía no cuenta con un modelo remoto integrado como cerebro principal. |
| Memoria semántica compartida entre documentos | PARCIALMENTE FUNCIONAL | Se han iniciado contratos/perfiles semánticos; falta trazabilidad completa entre todos los documentos. |
| No repetición creativa | PARCIALMENTE FUNCIONAL | Existen motores de variación; falta prueba de 100 generaciones y medición formal. |

## 2. Carpeta Docente

| Función | Estado | Observación |
|---|---|---|
| Configuración nivel/tipo/grados/áreas | PARCIALMENTE FUNCIONAL | Requiere pruebas completas en Inicial, Primaria y Secundaria. |
| Perfil EIB / monolingüe castellano | PARCIALMENTE FUNCIONAL | Existe selector y catálogo; falta validación total de denominaciones y flujos. |
| Contexto territorial | PARCIALMENTE FUNCIONAL | Se está eliminando el supuesto universal de “comunidad”; falta probar urbano/rural/periurbano. |
| Unidad de aprendizaje | PARCIALMENTE FUNCIONAL | Genera estructura de prototipo; faltan matrices curriculares oficiales completas y edición robusta. |
| Proyecto de aprendizaje | PARCIALMENTE FUNCIONAL | Tiene ruta diferenciada, pero aún requiere auditoría oficial y pruebas de proyectos reales. |
| Duración 1–6 semanas | PARCIALMENTE FUNCIONAL | Debe probarse en interfaz y secuenciación completa. |
| Sesión de aprendizaje | PARCIALMENTE FUNCIONAL | Existe generador; falta completar motores oficiales por nivel/área y validación de matrices. |
| Crear sesiones de toda la unidad | PARCIALMENTE FUNCIONAL | Debe verificarse punta a punta contra los 15 requisitos de la auditoría maestra. |
| Programación anual | SIMULADA / INCOMPLETA | Existe referencia de prototipo, no un flujo productivo completo. |
| Registro auxiliar | SIMULADA / INCOMPLETA | No existe aún como sistema completo de estudiantes, criterios, evidencias y progreso. |
| Evaluación por competencias | PARCIALMENTE FUNCIONAL | Hay componentes de prototipo; falta trazabilidad completa por estudiante/competencia/evidencia. |
| Instrumentos de evaluación | PARCIALMENTE FUNCIONAL | Se generan ejemplos; falta selector inteligente basado en criterio + evidencia + naturaleza del aprendizaje. |
| Materiales/fichas | PARCIALMENTE FUNCIONAL | Existen generadores básicos; falta auditoría sistemática por edad/grado/propósito/legibilidad. |
| Historial del estudiante | INEXISTENTE | Requiere backend, seguridad y modelo de datos. |

## 3. Carpeta Director

| Función | Estado | Observación |
|---|---|---|
| Centro de gestión del Director | SIMULADA / INCOMPLETA | La interfaz todavía no constituye un centro de gestión anual completo. |
| Asistente de interpretación del pedido | PARCIALMENTE FUNCIONAL | Existe una primera capa de comprensión; falta generación normativa real. |
| PEI | INEXISTENTE / PROTOTIPO | Falta generador completo con datos reales y trazabilidad. |
| PAT vivo | INEXISTENTE / PROTOTIPO | Falta seguimiento de actividades, responsables, evidencias y estados. |
| PCI | INEXISTENTE / PROTOTIPO | Falta construcción completa y conexión efectiva con planificación docente. |
| RI | INEXISTENTE / PROTOTIPO | Falta generador contextualizado y control de coherencia con convivencia. |
| Documento de Gestión para IE que corresponda | INEXISTENTE / PROTOTIPO | Debe depender de aplicabilidad normativa verificada. |
| RD | INEXISTENTE / PROTOTIPO | Falta módulo real de correlativos, competencia normativa, estados y archivo. |
| Oficios | INEXISTENTE / PROTOTIPO | Falta generador completo y libro de correlativos. |
| Informes | INEXISTENTE / PROTOTIPO | Falta generación conectada a datos reales y evidencias. |
| Actas | INEXISTENTE | Falta módulo y conversión de acuerdos en tareas/seguimiento. |
| CONEI | INEXISTENTE / PROTOTIPO | Falta flujo acta → conformación → RD → registro → seguimiento. |
| Comités | INEXISTENTE / PROTOTIPO | Falta matriz de aplicabilidad y normativa vigente. |
| Mantenimiento | INEXISTENTE / PROTOTIPO | No existe integración oficial; cualquier función debe llamarse asistente/preparación mientras no exista integración autorizada. |
| Monitoreo pedagógico | INEXISTENTE / PROTOTIPO | Falta flujo evidencia → análisis → retroalimentación → compromiso → seguimiento. |

## 4. Base institucional y reutilización de datos

| Función | Estado | Observación |
|---|---|---|
| Ficha Maestra de IE | PARCIALMENTE FUNCIONAL | Existen datos dispersos en configuración; falta unificar una ficha institucional completa. |
| Reutilización automática en todos los documentos | PARCIALMENTE FUNCIONAL | Aún hay duplicaciones y datos que no se propagan entre todos los módulos. |
| Rol Docente / Director / Director-Docente | INEXISTENTE | Requiere autenticación, permisos y perfiles reales. |
| Multiinstitución | INEXISTENTE | Requiere backend y aislamiento por organización. |

## 5. Persistencia, seguridad y datos

| Función | Estado | Observación |
|---|---|---|
| Guardado local | PARCIALMENTE FUNCIONAL | Actualmente depende principalmente de localStorage. |
| Recuperación tras recarga/cierre | PARCIALMENTE FUNCIONAL | Existen guardas de recuperación, pero debe probarse sistemáticamente. |
| Autoguardado de documentos en edición | INEXISTENTE / PARCIAL | Falta un sistema de borradores/versiones por documento. |
| Versionado | INEXISTENTE | No hay V1/V2 recuperable por documento. |
| Autenticación | INEXISTENTE | Bloqueante para multiusuario real. |
| Aislamiento Usuario A / Usuario B | INEXISTENTE | Bloqueante para producción. |
| Seguridad/RLS/backend | INEXISTENTE | Bloqueante para datos de estudiantes y documentos reales. |
| Privacidad y consentimiento | INEXISTENTE / PENDIENTE | Debe diseñarse antes de almacenar datos personales reales. |

## 6. Exportación y compatibilidad

| Función | Estado | Observación |
|---|---|---|
| DOCX real | PARCIALMENTE FUNCIONAL / PENDIENTE DE PRUEBA REAL | Existe módulo de exportación DOCX, pero debe verificarse abriendo archivos generados en Word móvil/escritorio y otras apps. |
| Compatibilidad Android | PENDIENTE | El error observado previamente en CamScanner obliga a prueba real. |
| PDF | INEXISTENTE / PENDIENTE | Falta flujo de exportación PDF validado. |
| Vista previa de impresión | INEXISTENTE / PENDIENTE | Debe compararse con salida real. |
| Imágenes embebidas en documentos | PENDIENTE | Requiere pruebas por sesión/unidad/material. |

## 7. Funcionalidad operativa (MFO)

A partir de esta versión, ningún botón se aprobará solo porque exista.

Pendiente de batería completa para:

- crear;
- editar;
- eliminar;
- guardar;
- cancelar;
- volver;
- siguiente/anterior;
- duplicar;
- descargar;
- imprimir;
- compartir;
- buscar;
- filtrar;
- auditar;
- corregir;
- regenerar.

Toda acción debe probarse como **entrada → procesamiento → guardado → recuperación → edición → exportación → reapertura** cuando corresponda.

## 8. Rendimiento, móvil y conectividad

| Función | Estado | Observación |
|---|---|---|
| Responsive móvil | PARCIALMENTE FUNCIONAL | Requiere pruebas reales en Android económico/gama media/pantalla pequeña. |
| Internet lento | PENDIENTE | Debe simularse latencia, pérdida y reconexión. |
| Modo bajo consumo | INEXISTENTE / PENDIENTE | Debe diseñarse. |
| Telemetría de tiempos | INEXISTENTE | Aún no se miden apertura, guardado, búsqueda, generación y descarga. |

## 9. Escalabilidad y costos

| Función | Estado | Observación |
|---|---|---|
| 100–10 000 usuarios | NO EVALUABLE TODAVÍA | El prototipo localStorage no representa arquitectura multiusuario. |
| Concurrencia | NO EVALUABLE TODAVÍA | Requiere backend e infraestructura productiva. |
| Costo IA por función | NO EVALUABLE TODAVÍA | No existe integración IA remota productiva. |

## 10. Normativa

| Función | Estado | Observación |
|---|---|---|
| Biblioteca normativa central | PARCIALMENTE FUNCIONAL / CONCEPTUAL | Existen reglas de protección, pero falta base estructurada y verificaciones vigentes. |
| Vigilancia normativa | PARCIALMENTE FUNCIONAL / CONCEPTUAL | La auditoría puede revisar fuentes; falta motor productivo con impacto documental. |
| Jerarquía nacional/regional/UGEL/orientación/guía | INEXISTENTE / PENDIENTE | Debe modelarse. |
| Aplicabilidad por tipo de IE | INEXISTENTE / PENDIENTE | Debe verificarse documento por documento. |

## 11. Indicadores

- **IUD — Índice de Utilidad Docente:** PENDIENTE DE INSTRUMENTACIÓN.
- **ICGD — Índice de Calidad de Gestión Digital:** PENDIENTE DE INSTRUMENTACIÓN.
- **IFR — Índice de Funcionalidad Real:** PENDIENTE DE INSTRUMENTACIÓN.

**Regla:** no inventar porcentajes ni puntuaciones. Solo asignarlos cuando existan pruebas trazables y una fórmula implementada.

## 12. Bloqueantes actuales para declarar producción

1. Falta autenticación y aislamiento de datos.
2. Falta backend/persistencia multiusuario.
3. Falta versionado y recuperación robusta por documento.
4. Falta completar Carpeta Director real.
5. Falta Registro Auxiliar y seguimiento de estudiantes completos.
6. Falta matriz curricular oficial estructurada completa por niveles/grados/áreas.
7. Falta motor normativo estructurado y verificado.
8. Falta prueba real y repetible de DOCX/PDF/móvil.
9. Falta batería de regresión automática y pruebas de 100 generaciones.
10. Falta medir IUD, ICGD e IFR.

## Pregunta de control

> ¿Un docente o director real puede utilizar DocenteDigital durante todo el año escolar, confiar en ella, recuperar su información, reducir su trabajo y obtener documentos pedagógica, técnica y normativamente sólidos sin rehacerlos?

**Respuesta actual: TODAVÍA NO.**

Por tanto, la aplicación debe continuar en mejora y pruebas antes de escalar.
