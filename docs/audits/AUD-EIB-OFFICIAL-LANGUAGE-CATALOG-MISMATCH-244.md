# AUD-EIB-OFFICIAL-LANGUAGE-CATALOG-MISMATCH-244 — Catálogo EIB mezcla lenguas y variedades y no coincide con denominaciones oficiales vigentes

## Alcance
Auditoría acumulativa del perfil lingüístico EIB y su catálogo de lenguas/variedades.

## Especificaciones obligatorias aplicadas
- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`

## ID de prueba
**AUD-EIB-244-A**

## Módulo
Ficha Maestra / Perfil lingüístico EIB → Planificación → Sesiones → Materiales.

## Entrada
1. Configurar una IE como EIB.
2. Abrir el selector `Lengua originaria / variedad principal`.
3. Contrastar cada opción con la lista oficial vigente de lenguas indígenas u originarias.
4. Verificar si el sistema distingue claramente `lengua` de `variedad` y conserva una denominación oficial trazable.

## Resultado esperado
V3 exige usar **denominaciones oficiales vigentes** y no hardcodear una variedad por región. El sistema debe separar, como mínimo:
- lengua oficial canónica;
- variedad/denominación pedagógica cuando corresponda;
- fuente oficial y fecha de verificación;
- valor legado/migrado si existiera.

No debe presentar como un mismo catálogo entidades de distinto nivel (lengua oficial vs variedad) sin diferenciarlas.

## Resultado obtenido
`linguistic-profile-v26.js` define un arreglo `languages` de **53 opciones**. El selector se titula `Lengua originaria / variedad principal`, pero el arreglo mezcla:
- varias variedades/denominaciones de Quechua como si fueran entradas equivalentes a lenguas completas (`Quechua Cusco-Collao`, `Quechua Chanka`, `Quechua Central`, `Quechua Cajamarca`, `Quechua Inkawasi-Kañaris`, `Quechua amazónico / Kichwa amazónico`);
- lenguas con denominaciones que no coinciden con la lista oficial actual de la BDPI (`Chamicuro` frente a `Chamikuro`, `Isconahua` frente a `Iskonawa`, `Maijuna` frente a `Maijɨki`, `Muniche` frente a `Munichi`, `Murui-Muinani` frente a `Murui-Muinanɨ`, entre otras diferencias ortográficas/canónicas);
- `Nanti`, mientras la lista oficial vigente consultada de 48 lenguas incluye `Matsigenka Montetokunirira` y no presenta `Nanti` como una de las 48 entradas canónicas actuales.

La fuente oficial actual del Ministerio de Cultura (BDPI) informa **48 lenguas indígenas u originarias vigentes**: 4 andinas y 44 amazónicas. El material oficial MINEDU publicado en mayo de 2025 también señala 48 lenguas indígenas u originarias.

El problema no es que una variedad de Quechua no pueda seleccionarse pedagógicamente; el problema es que el modelo actual no separa `lengua oficial` de `variedad` y por tanto no puede demostrar trazabilidad normativa/canónica de la selección.

## Evidencia
- `linguistic-profile-v26.js`: arreglo `languages` con 53 entradas y un único valor persistido en `state.indigenousLanguage`/`state.quechuaVar`.
- BDPI, Ministerio de Cultura, `Lista de lenguas indígenas u originarias`: 48 lenguas vigentes; lista oficial actualizada continuamente.
- MINEDU, `Lenguas originarias: algunos datos interesantes que no conocías` (2025): 48 lenguas indígenas originarias.
- V3 §7 EIB: exige lengua, variedad, escenario lingüístico y denominaciones oficiales vigentes.

## PASA / NO PASA
**NO PASA**

## Clasificación
**PARCIALMENTE FUNCIONAL**: existe selección lingüística y guardas EIB/monolingüe, pero la taxonomía oficial/varietal no está normalizada ni trazable.

## Severidad
**S2 — ALTO**

La selección puede persistirse y reutilizarse, pero el sistema no puede demostrar que el valor represente correctamente una lengua oficial y una variedad diferenciada. Esto afecta exactitud EIB, trazabilidad y futuras validaciones normativas.

## Causa raíz
El catálogo evolucionó como una lista única para resolver simultáneamente dos necesidades distintas:
1. identificar la lengua originaria oficial;
2. elegir una variedad lingüística/pedagógica pertinente.

Al no existir dos campos normalizados, se mezclaron categorías y denominaciones históricas/alternativas.

## Acción correctiva
1. Crear un catálogo canónico `officialLanguage` basado en las 48 lenguas oficiales vigentes y versionado con fuente/fecha.
2. Crear un campo separado `languageVariety` cuando corresponda.
3. Para Quechua, seleccionar primero `Quechua` como lengua y luego la variedad pertinente, sin asumirla por ubicación.
4. Mantener un mapa de aliases/valores legados para no romper perfiles ya guardados.
5. Normalizar denominaciones visibles contra fuente oficial actual y conservar alias históricos solo como compatibilidad interna.
6. Registrar `source`, `verifiedAt` y versión del catálogo.
7. Volver a probar EIB → monolingüe → EIB y la herencia a Unidad/Sesión/Materiales.

## Corrección aplicada en esta ronda
No se modificó el catálogo funcional. Cambiar directamente los valores persistidos podría romper perfiles EIB existentes y alterar documentos históricos. La corrección segura requiere migración explícita y separación `lengua`/`variedad`, no un reemplazo textual masivo.

## Pruebas posteriores obligatorias
- seleccionar cada una de las 48 lenguas oficiales sin perder identidad canónica;
- Quechua → seleccionar variedad separada → guardar → recargar → recuperar ambos valores;
- alias legado `Quechua Cusco-Collao (Cusco)` → migrar a lengua `Quechua` + variedad correspondiente sin modificar históricos emitidos;
- EIB → monolingüe: limpiar herencia lingüística que ya no corresponda;
- materiales bilingües: heredar lengua/variedad correcta sin traducción literal automática;
- caracteres especiales de nombres oficiales (por ejemplo `Maijɨki`, `Murui-Muinanɨ`) en UI, localStorage, DOCX/PDF y búsqueda.

## Fuente oficial verificada
- Ministerio de Cultura — BDPI — Lista de lenguas indígenas u originarias, consultada el 8 de septiembre de 2026: https://bdpi.cultura.gob.pe/lenguas
- Ministerio de Educación — Repositorio Institucional — `Lenguas originarias: algunos datos interesantes que no conocías`, publicación mayo de 2025: https://repositorio.minedu.gob.pe/handle/20.500.12799/11471

## Riesgo de regresión
**ALTO** si se corrige mediante sustitución directa de strings: puede dejar perfiles guardados sin coincidencia, alterar documentos históricos o perder la variedad. **BAJO/MEDIO** si se hace mediante esquema normalizado + migración compatible.

## Impacto cualitativo
- **IUD:** riesgo de confusión al seleccionar lengua/variedad.
- **ICGD:** negativo por falta de identidad canónica y fuente versionada.
- **IFR:** afecta fidelidad EIB transversal.
- **ISU:** no se recalcula; separar lengua y variedad debe mantenerse simple y progresivo.
- **Prelaunch:** mantiene abierta la validación EIB/normativa real.

## Gate
DocenteDigital continúa **NO APROBADA PARA LANZAMIENTO V1.0** mientras existan bloqueantes V5 y falten pruebas reales esenciales.
