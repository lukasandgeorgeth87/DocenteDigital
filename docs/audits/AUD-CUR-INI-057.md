# AUD-CUR-INI-057 — Áreas curriculares de Educación Inicial (ciclo II)

## Alcance
Auditoría V2 + V3 + V4 + V5 + Núcleo IA. Hallazgo localizado en configuración inicial de nivel/áreas. No se declara lista la matriz curricular completa.

## Prueba
- **ID:** AUD-CUR-INI-057
- **Módulo:** Perfil IE → Nivel Inicial → Áreas
- **Entrada:** seleccionar Nivel = Inicial y avanzar a selección de áreas para 3, 4 o 5 años.
- **Esperado:** mostrar la organización de áreas correspondiente al ciclo II del Programa Curricular de Educación Inicial vigente en la fuente oficial MINEDU disponible: Personal Social, Psicomotriz, Comunicación, Castellano como Segunda Lengua, Matemática y Ciencia y Tecnología. La competencia artística se desarrolla dentro de Comunicación en ciclo II; no corresponde ofrecer `Arte y Cultura` como área independiente en esta configuración.
- **Obtenido antes:** `app.js` devolvía `['Comunicación','Matemática','Personal Social','Ciencia y Tecnología','Psicomotriz','Arte y Cultura']`, omitiendo `Castellano como Segunda Lengua` y agregando `Arte y Cultura` como área independiente.
- **Evidencia de código previa:** función `areaOptions()` en `app.js`.
- **Fuente oficial:** Programa Curricular de Educación Inicial, Ministerio de Educación del Perú, sección VI Áreas curriculares. Fuente pública oficial: https://www.minedu.gob.pe/curriculo/pdf/programa-curricular-educacion-inicial.pdf
- **Resultado inicial:** NO PASA.
- **Severidad:** S2.
- **Clasificación:** PARCIALMENTE FUNCIONAL.

## Causa raíz
Lista curricular simplificada/hardcodeada que no respetaba la organización oficial del ciclo II de Inicial.

## Corrección segura aplicada
Se añadió `initial-curriculum-guard-v72.js` y se carga inmediatamente después de `app.js`.

La guardia:
1. reemplaza únicamente la lista base de áreas cuando `state.level === 'Inicial'`;
2. conserva sin cambios Primaria y Secundaria;
3. migra un estado antiguo `Arte y Cultura` a `Comunicación` para evitar mantener una selección curricular inválida oculta;
4. no activa `curriculumMatrixReady`, no inventa competencias/desempeños y no presenta la matriz curricular completa como conectada.

## Commits
- Archivo de guardia: `80c57b0c0345bf08e9f87d3d08e7d89ca1fd0cf5`
- Integración en `index.html`: `4cc74799d6b7f28e1150ca2f934c7a21cccfd4c2`

## Retest técnico
- El commit de integración reporta estado GitHub/Vercel `success` con descripción `Deployment has completed`.
- La verificación HTTP directa desde el entorno de auditoría quedó PENDIENTE por limitación de resolución/acceso del entorno; no se simula HTTP 200.
- No se realizó prueba física en navegador/dispositivo ni validación con docentes reales.

## Estado posterior
**PASA técnicamente para la corrección estática y despliegue reportado por Vercel; validación HTTP directa y prueba física: PENDIENTES.**

## Riesgo de regresión
Bajo-medio. La corrección solo intercepta `areaOptions()` en Inicial. Debe vigilarse compatibilidad con futuras matrices curriculares y reglas EIB para no mantener esta guardia hardcodeada cuando exista una fuente curricular estructurada/versionada.

## Impacto V4/V5
- V4: evita mostrar al docente una opción curricular incorrecta y mantiene el flujo simple.
- V5: reduce un error curricular de configuración, pero NO elimina los bloqueantes de lanzamiento: matriz curricular completa/versionada, autenticación/aislamiento, backend, seguridad OWASP ASVS, backup/restore real, Word/PDF físicos, móvil físico, 100 generaciones, año completo, concurrencia y pilotos.

## Métricas
No se recalculan IUD/ICGD/IFR/ISU/Prelaunch Score sin evidencia suficiente.