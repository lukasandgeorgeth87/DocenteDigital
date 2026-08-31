# ADENDA DE ALTA EXIGENCIA A LA AUDITORÍA MAESTRA — V3

> Esta adenda complementa y no reemplaza `AUDITORIA_MAESTRA_INTEGRAL_V2.md`.
> Su finalidad es convertir criterios pedagógicos, normativos, administrativos y técnicos en pruebas reales, repetibles y verificables.

## 1. Regla principal

Una función NO aprueba porque aparece, responde, genera una pantalla o produce texto.

Debe existir:

**Entrada de prueba → resultado esperado → resultado obtenido → evidencia → pasa/no pasa → severidad → acción correctiva.**

Cada prueba debe tener un identificador único, por ejemplo:

- AUD-PED-001
- AUD-DIR-001
- AUD-IA-001
- AUD-SEG-001
- AUD-MOV-001
- AUD-OFF-001
- AUD-NOR-001
- AUD-EIB-001
- AUD-MUL-001
- AUD-DOC-001

## 2. Sincronización de los motores

Los motores MRP, MSF, MAPI, MAN, MROA, MDPD, MGD, MDA, MFO y MTD no pueden funcionar como inteligencias aisladas.

Debe comprobarse especialmente:

- MRP ↔ MDPD
- MSF ↔ MAPI
- MAN ↔ MROA
- MGD ↔ MDA
- MFO ↔ MTD
- comunicación transversal entre todos cuando cambia un dato relevante.

## 3. Fuente única de verdad y procedencia

Los datos institucionales deben proceder de una fuente maestra única. IE, director, UGEL, año, estudiantes, grados y demás datos no deben almacenarse de manera contradictoria en cada documento.

Cada dato importante debe registrar procedencia cuando sea posible:

- USUARIO
- FICHA_MAESTRA
- INTEGRACIÓN_AUTORIZADA
- DOCUMENTO_ANTERIOR
- CÁLCULO_SISTEMA
- PROPUESTA_IA
- FUENTE_MINEDU
- FUENTE_CIENTÍFICA
- FUENTE_UGEL_DRE
- IMPORTACIÓN

Los documentos históricos emitidos conservan los datos vigentes al momento de su emisión. Los documentos nuevos usan la información maestra actualizada. No modificar documentos históricos retroactivamente.

## 4. Trazabilidad de decisiones IA

Registrar internamente, cuando corresponda:

- qué información utilizó;
- qué fuente normativa o curricular consultó;
- versión y fecha de vigencia;
- regla aplicada;
- contenido generado por IA;
- fecha de verificación.

No es obligatorio mostrar toda esta información al usuario final, pero debe quedar disponible para auditoría.

## 5. RAG normativo de alta confianza

RAG no equivale a verdad automática. Toda recuperación normativa debe combinar:

**recuperación + metadatos + jerarquía + vigencia + fecha + fuente oficial + citación + validación.**

Priorizar MINEDU, Repositorio Institucional MINEDU, Gob.pe/MINEDU, PRONIED cuando corresponda, DRE/GRE y UGEL oficiales.

No usar blogs, redes sociales, plantillas reenviadas o sitios sin origen verificable como sustento normativo.

Pruebas obligatorias:

- norma inventada: solicitar deliberadamente una norma inexistente y comprobar que el sistema no invente contenido;
- norma antigua: comprobar condición de vigencia/reemplazo antes de usarla;
- anti-RAG falso: un documento relacionado no puede citarse como sustento si no respalda exactamente la afirmación.

## 6. Documento de Gestión y aplicabilidad

En IE unidocente/multigrado, cuando corresponda normativamente Documento de Gestión, la app debe aplicar su lógica específica y no simplemente pegar PEI + PAT + PCI + RI.

Debe explicar por qué corresponde y ofrecer **Ver sustento**.

## 7. EIB

No hardcodear una variedad lingüística por región. La configuración debe considerar lengua, variedad, escenario lingüístico y nivel de dominio cuando exista caracterización disponible, usando denominaciones oficiales vigentes.

Pruebas:

- IE EIB: lengua, pertinencia cultural, vocabulario, diálogo de saberes, calendario local/comunal, no traducción literal, adecuación por grado;
- cambio EIB → monolingüe: eliminar componentes heredados que ya no correspondan.

## 8. Ahorro real de trabajo

La reducción de trabajo es una meta que debe medirse, no declararse.

**Ahorro real = 1 - (tiempo total con app / tiempo sin app).**

Tiempo total con app incluye generación + corrección + exportación + tareas necesarias para obtener un documento realmente utilizable.

## 9. Prueba de 100 generaciones

Medir en cada batería:

- éxito técnico;
- coherencia;
- exactitud curricular;
- exactitud normativa;
- formato;
- tiempo;
- alucinaciones;
- repetición;
- documentos vacíos;
- datos perdidos;
- archivos corruptos.

Crear golden tests pedagógicos y directivos previamente validados, y ejecutarlos después de cambios relevantes.

## 10. Consistencia

La misma solicitud puede variar en redacción, ejemplos y estrategias, pero NO puede variar arbitrariamente en:

- competencia oficial;
- grado;
- normativa;
- hechos institucionales;
- datos registrados.

## 11. Competencia del Director y actos de riesgo

Construir una matriz verificable de qué puede resolver, aprobar, designar, conformar, solicitar o elevar a otra autoridad.

Para RD, sanciones, designaciones, decisiones sobre personal, disciplina u otros actos con efectos jurídicos: activar verificación reforzada.

Prueba de alucinación administrativa: una solicitud fuera de la competencia de la dirección debe bloquear el acto y no fabricar fundamento legal.

## 12. PAT, actas y hechos reales

El PAT puede desencadenar recordatorios, checklist, borradores o propuestas de documentos, pero nunca afirmar hechos no registrados.

No inventar:

- reunión realizada;
- representante elegido;
- aprobación por unanimidad;
- actividad ejecutada.

Las actas pueden prepararse como plantilla previa, pero se completan con hechos reales después de la reunión.

## 13. Correlativos

Los borradores pueden existir sin número definitivo. La numeración se asigna al emitir o cuando se reserva formalmente, según la política institucional.

Impedir duplicados, saltos involuntarios y reutilización sin control.

Mantener libro de correlativos por tipo con número, año, fecha, estado, documento, usuario emisor y anulaciones cuando corresponda.

## 14. Offline y sincronización

Mientras no exista modo offline real, clasificarlo como requisito futuro, no como función terminada.

Si se implementa, probar: crear, guardar, editar, evaluar y reabrir sin internet; sincronizar; resolver conflictos; mostrar claramente:

- ✓ Sincronizado
- ⟳ Pendiente de sincronización
- ⚠ Conflicto

Nunca afirmar sincronización con servidor si el dato permanece solo en el dispositivo.

Probar cortes de internet, cierre forzado y pérdida abrupta durante guardado.

## 15. Registro Auxiliar

Recuperar evaluación y evidencias, pero no transformar observaciones complejas en valoración final mediante promedio mecánico.

No convertir automáticamente AD/A/B/C a números para promediar como regla general.

La app puede mostrar evidencias, criterios, progresión, valoraciones y retroalimentaciones y proponer una conclusión; la decisión profesional final corresponde al docente.

El registro debe retroalimentar la planificación futura sin etiquetar al estudiante.

## 16. Carpeta Director como sistema de acción

Debe responder:

- ¿qué necesito hacer?
- ¿qué está pendiente?
- ¿qué vence?
- ¿qué documento lo sustenta?
- ¿qué ya realicé?

Modelar procesos completos, no documentos aislados: CONEI, mantenimiento, monitoreo, planificación, evaluación, convivencia y otros que correspondan.

## 17. Exportación profesional

No basta con que Word abra. Comparar:

**vista en app ↔ Word ↔ PDF ↔ impresión.**

Verificar márgenes, encabezados, membrete, tablas, saltos, firmas, anexos, imágenes, tipografía, quechua, caracteres especiales, numeración y orientación.

Cuando sea técnicamente posible, usar comparación visual automatizada para detectar tablas cortadas, superposición, imágenes fuera de página y márgenes anómalos.

## 18. UX y accesibilidad

Auditar por separado UX y funcionalidad real.

Agregar pruebas de teclado, lector de pantalla, contraste, foco, zoom, tamaño de botones, formularios y mensajes de error.

## 19. Roles, permisos y seguridad

Roles mínimos previstos: Director, Docente, Administrador y futuros roles pertinentes.

Probar escalamiento de privilegios y cambio manual de identificadores. Un usuario no puede acceder a datos o documentos de otro usuario/IE sin autorización.

Para acciones críticas mantener bitácora mínima: quién, qué hizo, cuándo, documento y cambio realizado.

Definir papelera, recuperación y eliminación definitiva. Probar backups y restauración, no solo declarar que existen.

Definir RPO/RTO cuando exista arquitectura productiva.

## 20. Observabilidad

El sistema productivo debe permitir conocer errores, latencia, tasa de éxito, costo IA, tokens, caídas y servicio afectado. Detectar degradación antes de que el usuario tenga que reportarla.

## 21. Costos IA

Separar razonamiento pedagógico, generación, auditoría, RAG y tareas mecánicas. No usar LLM donde un algoritmo convencional basta. Seguridad y corrección tienen prioridad sobre ahorro de tokens.

Cachear contenido oficial estable en una base verificada cuando sea apropiado.

## 22. Versionado normativo

Guardar versiones, fecha de entrada en vigencia y reemplazo. Cada documento debe poder registrar internamente una fecha de corte normativa.

Al reabrir un borrador antiguo, si existe normativa posterior relevante, advertir antes de modificar.

## 23. Severidad

- **S0 BLOQUEANTE:** fuga de datos, corrupción documental, norma inventada en acto administrativo, pérdida irreversible, privilegio indebido.
- **S1 CRÍTICO:** documento pedagógicamente incorrecto, competencia falsa, correlativo duplicado, exportación inutilizable, sesión multigrado inviable.
- **S2 ALTO:** incoherencia importante, mala trazabilidad, documento incompleto, función parcialmente rota.
- **S3 MEDIO:** dificultad UX, formato imperfecto, redundancia.
- **S4 BAJO:** detalle visual o mejora cosmética.

Una puntuación alta nunca puede ocultar un S0/S1.

## 24. Quality gates

Para pasar a producción deben cumplirse simultáneamente metas de:

- pedagogía;
- gestión directiva;
- IFR;
- seguridad sin bloqueantes;
- normativa sin alucinaciones críticas;
- exportación funcional;
- móvil funcional;
- persistencia funcional.

## 25. Piloto y generalización

Antes de escalar, probar con docentes/directores reales de contextos rural, urbano, EIB, multigrado, unidocente, polidocente, Inicial, Primaria y Secundaria.

No entrenar ni auditar solo con una IE piloto. Una solución útil para multigrado no puede romper secundaria; una solución para una IE grande no puede impedir trabajar en unidocente.

## 26. Configuración y datos incompletos

Probar configuración desde cero, medir tiempo y datos realmente necesarios, e identificar cuáles pueden importarse o recuperarse de fuentes autorizadas.

Detectar configuraciones inconsistentes sin decidir arbitrariamente cuál dato es correcto.

Si la IA recibe una solicitud sin información suficiente, debe reutilizar datos existentes, mostrar campos pendientes o hacer las preguntas mínimas necesarias. Nunca inventar.

## 27. Autonomía profesional

La IA sugiere, fundamenta, audita y automatiza.

El docente/director revisa, decide y aprueba.

## 28. Pruebas definitivas

### Carpeta Docente

Seleccionar una unidad completa → crear todas las sesiones → comprobar individualmente título, área, competencia, criterio, evidencia, proceso didáctico, formalización, material, instrumento, tiempo, diferenciación, fuente, exportación y registro.

### Carpeta Director

Ficha Maestra → planificación → actividad PAT → documento previo → ejecución real → evidencia → acta/informe → RD si corresponde → archivo → búsqueda → recuperación.

Si algún eslabón exige reescribir innecesariamente datos existentes, revisar el diseño.

## 29. Prueba de un año completo

Simular marzo–diciembre con cientos de sesiones, evidencias, registros, oficios, informes y RD. Probar crecimiento de 100, 1 000 y 10 000 documentos según la escala prevista y búsqueda histórica exacta.

## 30. Indicadores de confianza

Medir:

- índice de reelaboración;
- error silencioso;
- confianza documental;
- tiempo real ahorrado;
- finalización;
- errores por documento.

Los errores silenciosos son especialmente peligrosos: dato equivocado, norma incorrecta, competencia falsa, correlativo erróneo o nombre incorrecto aunque no exista Error 500.

## 31. Principio definitivo

No aprobar una función porque **responde**.

Aprobarla solamente si:

**responde + es correcta + utiliza los datos correctos + respeta la norma + guarda + se recupera + se edita + se exporta + no pierde información + no filtra datos + realmente reduce trabajo.**

## 32. Nivel 5

DocenteDigital estará listo para escalar solamente cuando las pruebas demuestren que:

1. es pedagógicamente sólido;
2. es normativamente confiable;
3. es técnicamente estable;
4. protege datos;
5. funciona en contexto real;
6. reduce significativamente carga laboral;
7. mantiene trazabilidad;
8. no inventa hechos ni normas;
9. exporta documentos utilizables;
10. puede mantenerse funcional durante todo un año escolar.

**La calidad no se declara: se demuestra.**