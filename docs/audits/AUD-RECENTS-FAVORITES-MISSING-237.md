# AUD-RECENTS-FAVORITES-MISSING-237 — Recientes y favoritos inexistentes

## Especificaciones aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## Alcance
Carpeta Docente/Director → recuperación rápida de documentos y continuidad de trabajo.

## Prueba principal
**ID:** AUD-REC-237-A  
**Entrada:** disponer de varias unidades/proyectos/sesiones/documentos y volver a la aplicación para localizar rápidamente los últimos usados o marcar uno de uso frecuente.  
**Resultado esperado:** V4 exige `Recientes y favoritos` para reducir búsquedas. Debe existir una superficie simple que muestre documentos recientes y permita fijar/favoritar elementos sin alterar el histórico.  
**Resultado obtenido:** el runtime actual dispone de `Continuar mi trabajo` y de bibliotecas parciales, pero no existe modelo ni interfaz de `Recientes`, `Favoritos`, `favorite`, `favorites`, `recentDocuments` o equivalente. La búsqueda global del repositorio por esos términos no devuelve implementación funcional. `continueWork()` únicamente deriva al último `lastSession` o a una unidad ya guardada y no ofrece una lista de recientes ni marcación de favoritos.  
**PASA/NO PASA:** NO PASA.  
**Clasificación:** INEXISTENTE.  
**Severidad:** S3 MEDIO.

## Evidencia técnica
- V4, regla 21: `Recientes y favoritos`.
- `app.js`: `continueWork()` solo retoma `lastSession` o una unidad; no mantiene colección de recientes ni favoritos.
- `index.html`: no existe superficie visible de recientes/favoritos.
- Búsqueda global de código por `recent`, `recentDocuments`, `favorito`, `favorite`, `favorites`: sin implementación funcional.

## Causa raíz
La aplicación ha priorizado continuidad de un único trabajo (`lastSession`/unidad activa), pero todavía no modela acceso rápido a varios documentos usados recientemente ni preferencias de documentos frecuentes.

## Acción correctiva recomendada
1. registrar internamente `lastOpenedAt` o historial de apertura por documento sin modificar contenido histórico;
2. mostrar 3–5 documentos recientes en Inicio o `Mis documentos`, no una lista extensa;
3. permitir marcar/desmarcar favorito con una propiedad separada del contenido documental;
4. conservar ID y snapshot histórico intactos;
5. ordenar recientes con lógica convencional, sin IA;
6. probar recarga, cambio de dispositivo cuando exista backend y eliminación/restauración;
7. en Modo Fácil mantener una única acción principal y ocultar opciones secundarias.

## Corrección directa
No se implementa en esta ronda. La función requiere definir primero un índice documental consistente para unidades, sesiones y documentos de Director; introducir favoritos solo para una entidad produciría una experiencia parcial y aumentaría fragmentación.

## Riesgo de regresión
Medio si se implementa antes de resolver el modelo documental global: referencias a documentos eliminados, históricos reetiquetados o listas inconsistentes entre Docente y Director.

## Impacto cualitativo
- **IUD/ISU:** empeora localización y retorno a trabajos frecuentes.
- **ICGD/IFR:** impacto indirecto; no altera contenido pedagógico o normativo.
- **Prelaunch:** hallazgo de simplicidad; no es por sí solo un bloqueante S0/S1.

No se recalculan ISU/IFR/Prelaunch Score definitivos por falta de pruebas con usuarios reales.

## Pendientes no simulados
- prueba con docentes/directores reales;
- tiempo real para localizar documentos;
- comportamiento con cientos/miles de documentos;
- sincronización multiusuario/multidispositivo cuando exista backend.

No se aplica ni declara vigente normativa MINEDU/UGEL externa para clasificar este hallazgo.