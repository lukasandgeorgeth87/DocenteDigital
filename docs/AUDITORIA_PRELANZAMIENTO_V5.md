# AUDITORÍA FINAL OBLIGATORIA DE PRELANZAMIENTO — V5

> Esta V5 complementa la Auditoría Maestra V2, la Adenda Ejecutable V3 y la Auditoría de Simplicidad V4. Su objetivo es impedir que DocenteDigital sea lanzada solamente porque abre, genera texto o se ve bien.

## Regla central

DocenteDigital solo podrá considerarse lista cuando pueda demostrar, mediante pruebas y usuarios reales, que funciona durante un ciclo escolar, es simple, segura, pedagógica y normativamente sólida, guarda y recupera información, exporta documentos utilizables y reduce trabajo real.

## 1. Congelamiento de V1.0

Antes del lanzamiento se congelará el alcance. Primero deben funcionar perfectamente las funciones esenciales.

### Carpeta Docente V1.0
- Perfil de IE.
- Programación.
- Unidades y proyectos.
- Sesiones.
- Evaluación e instrumentos.
- Registro auxiliar.
- Materiales.
- Guardar, recuperar, editar y exportar.

### Carpeta Director V1.0
- Ficha institucional.
- Documentos de gestión y planes.
- Oficios, RD, informes y actas.
- Comités y CONEI.
- Archivo, buscador y correlativos.
- Seguimiento.

Regla: es preferible tener 20 funciones excelentes que 100 funciones a medias.

## 2. Pruebas de extremo a extremo

### Docente
Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento.

### Director
Perfil IE → Diagnóstico → Documentos de gestión → PAT/actividades → Documentación administrativa → Evidencias → Informes → Archivo → Seguimiento.

No aprobar módulos aislados que pierdan datos o obliguen a reescribir información al avanzar.

## 3. Pruebas funcionales obligatorias

Cada función crítica tendrá PASA/NO PASA y evidencia. Probar registro/login/recuperación de contraseña cuando existan, crear/editar IE, crear/guardar/editar/duplicar/buscar/descargar/imprimir/eliminar/recuperar documentos, cerrar sesión y volver a ingresar.

Probar doble clic rápido en generar/guardar/descargar/crear documentos para impedir duplicados y correlativos repetidos.

Probar campos vacíos, textos muy largos, caracteres especiales, quechua, nombres extensos, múltiples grados, muchas competencias y grandes listas de estudiantes.

## 4. Persistencia y recuperación

Durante una tarea probar cierre de navegador, recarga, cambio de pestaña, interrupción de internet y retorno. No perder información ingresada.

Implementar autoguardado comprensible y recuperación de trabajo pendiente.

## 5. Pruebas pedagógicas y directivas

Pedagogía: Programación → Unidad → Sesiones → Criterios → Evidencias → Instrumentos → Registro.

Director: Actividad PAT → Documento previo → Ejecución real → Evidencia → Acta/Informe → RD si corresponde → Archivo.

Realizar prueba de 100 generaciones midiendo éxito técnico, coherencia, exactitud pedagógica y normativa, alucinaciones, repetición, formato, tiempo, exportación y conservación de datos.

## 6. Anti-alucinación

Intentar deliberadamente provocar competencias, capacidades, normas, resoluciones, autores, páginas, resultados institucionales y funciones del director inexistentes. Resultado obligatorio: NO INVENTAR.

## 7. Simplicidad y usuarios reales

Un docente principiante debe poder crear, encontrar y descargar una sesión sin manual. Un director principiante debe poder localizar y preparar un oficio sin explicación previa.

Aplicar V4: potente por dentro, simple por fuera.

## 8. Móvil, conectividad y offline

Probar físicamente en celular económico, celular gama media, tablet y laptop.

Simular conexión lenta, intermitente y pérdida temporal. Conservar datos y evitar pantallas blancas/negras.

No anunciar modo offline hasta que crear, guardar, editar, reabrir y sincronizar sin internet hayan sido probados realmente.

## 9. Exportación profesional

Probar al menos 20 documentos Word reales y comprobar tablas, imágenes, membretes, márgenes, fuentes, encabezados, pies, firmas, saltos, orientación y caracteres quechua.

Probar PDF e impresión reales. Word/PDF corruptos son bloqueantes.

## 10. Año completo y escala

Simular una IE durante marzo–diciembre con grandes cantidades de sesiones, registros, unidades, evidencias, oficios, RD, informes y actas. Verificar buscador, archivo, historial, velocidad y organización.

Antes de escalar probar progresivamente 10, 100, 500, 1 000, 5 000 y 10 000 usuarios cuando exista arquitectura multiusuario productiva.

## 11. Seguridad y privacidad

Antes del lanzamiento realizar auditoría con estándar reconocido como OWASP ASVS. Revisar autenticación, autorización, sesiones, contraseñas, APIs, base de datos, archivos, validación, almacenamiento y aislamiento entre usuarios.

Cumplir normativa peruana vigente de protección de datos personales. Aplicar minimización de datos. Tener Política de Privacidad, Términos de Uso, ejercicio de derechos, eliminación de cuenta/datos cuando corresponda y respuesta a incidentes.

Nunca incluir API keys, contraseñas, tokens o secretos en código cliente.

## 12. Backup y continuidad

No basta afirmar que existen backups: realizar una restauración real de prueba.

Definir qué ocurre si falla base de datos, proveedor IA, servidor o almacenamiento.

La caída de IA no debe impedir abrir, editar o descargar documentos ya existentes.

## 13. IA y costos

Medir costo por usuario, sesión, unidad, documento directivo, auditoría y mes.

No utilizar IA generativa para correlativos, sumas, filtros, ordenamiento, fechas o búsquedas simples cuando programación convencional sea suficiente.

## 14. Monitoreo

En producción controlar servicio, errores, latencia, generaciones, costo IA, usuarios activos, fallos de exportación y fallos de login. Los errores graves deben generar alertas sin esperar el reporte del docente.

## 15. Publicación controlada

Antes de cada publicación ejecutar automáticamente pruebas mínimas de Docente, Director, multigrado, Unidad, Proyecto, Sesión, Evaluación, Registro, Oficio, RD, Informe, guardado, buscador, Word/PDF, móvil, seguridad, IA y normativa.

Si falla una función crítica: NO PUBLICAR.

Separar desarrollo, pruebas y producción. Mantener rollback rápido.

## 16. Pilotos

- Piloto 1: 5–10 usuarios para errores grandes.
- Piloto 2: 30–50 usuarios para facilidad, calidad, estabilidad y ahorro.
- Piloto 3: 100–300 usuarios para concurrencia, soporte, infraestructura y costo.

No escalar por entusiasmo; escalar cuando los datos lo justifiquen.

## 17. Métricas

Medir tiempo de tarea, finalización, abandono, errores, correcciones, regeneraciones, ayuda, satisfacción y confianza.

Pregunta fundamental: “¿Utilizarías mañana este documento sin tener que hacerlo nuevamente?”

## 18. Prelaunch Gate

No lanzar si existe cualquiera de estos bloqueantes:
- pérdida o fuga de información;
- contraseñas inseguras;
- datos de otros usuarios visibles;
- normativa o competencias inventadas;
- correlativos duplicados;
- Word/PDF corruptos;
- guardado inestable;
- app inutilizable en celular;
- pantallas blancas/negras en funciones principales;
- recuperación de contraseña rota cuando exista autenticación;
- backup sin restauración comprobada.

La puntuación global nunca puede ocultar un bloqueante.

## Definición de LISTA PARA LANZAR

DocenteDigital debe demostrar que:
1. funciona;
2. es simple;
3. es segura;
4. es pedagógicamente sólida;
5. respeta normativa vigente;
6. guarda y recupera;
7. exporta documentos utilizables;
8. funciona en celular;
9. resiste la concurrencia esperada;
10. no inventa información;
11. ahorra tiempo real;
12. los usuarios piloto quieren seguir usándola.

## Principio final

**No lanzar porque “ya terminamos de programar”. Lanzar cuando “ya demostramos que funciona en manos de usuarios reales”.**