# DocenteDigital

DocenteDigital es una plataforma educativa en desarrollo para reducir trabajo docente y directivo en el contexto peruano, con énfasis en planificación, multigrado, EIB, trazabilidad y gestión escolar.

La versión pública actual es una **Beta Privada / prototipo local-first** orientada a validar experiencia, coherencia y continuidad antes de conectar infraestructura multiusuario e IA remota de producción.

## Documentos rectores

Toda evolución de DocenteDigital debe respetar:

- **Especificación Maestra – Plataforma de Gestión Docente y Directiva MINEDU v1.0**  
  `docs/ESPECIFICACION_MAESTRA_V1.md`
- **Especificación Maestra – Módulo Director v1.0**  
  `docs/ESPECIFICACION_MODULO_DIRECTOR_V1.md`
- **Plan de Beta Privada 24/09/2026**  
  `docs/BETA_PRIVADA_2026-09-24.md`

Regla principal: **DocenteDigital no es solo un generador con IA.** La solución final debe consultar bases curriculares, normativas e institucionales estructuradas, mantener trazabilidad y nunca inventar ni sustituir fuentes oficiales.

Para el Módulo Director rige además un principio de simplificación: la app debe reducir burocracia, identificar qué instrumentos corresponden realmente a cada tipo de IE y evitar duplicar planes o documentos cuando pueden integrarse.

## Flujo principal

Nivel educativo → Tipo de IE → Grados/edades → Áreas → Unidad/Proyecto → Sesión → Materiales → Evaluación → Registro/Seguimiento.

## Disponible en la Beta actual

- Inicial, Primaria y Secundaria en configuración base.
- IE Unidocente, Multigrado y Polidocente.
- Selección de varios grados en Multigrado/Unidocente.
- Selección de varias áreas en Inicial y Primaria.
- Secundaria organizada por área.
- Perfil EIB/monolingüe con confirmación de lengua/variedad.
- Modo Fácil y Modo Experto.
- Creación de Unidad/Proyecto con elección explícita de situación significativa y producto.
- Sesiones vinculadas a una Unidad/Proyecto real.
- Persistencia local y recuperación preventiva.
- Respaldo JSON descargable/restaurable para la Beta.
- Exportación DOCX OOXML real.
- Diseño adaptable a celular y laptop.
- Guardas que deshabilitan o marcan como “Próximamente” superficies todavía no terminadas.

## Todavía no disponible como función de producción

- IA generativa remota real.
- Autenticación/backend multiusuario.
- Aislamiento real entre instituciones.
- Evaluación y Registro Auxiliar E2E.
- Programación anual E2E.
- Generación contextualizada completa de materiales.
- Módulo Director E2E completo.
- PDF/impresión validados físicamente.
- Integraciones reales con SIAGIE, Drive u otros sistemas externos.

Estas funciones **no deben presentarse como terminadas** hasta que existan implementación y evidencia de prueba suficientes.

## Calidad y pruebas

El repositorio incluye:

- `Prelaunch Smoke`: sintaxis, assets, wiring de módulos críticos y regresiones conocidas.
- `Beta E2E Browser Gate`: Chromium real para el flujo principal de Beta.
- `tests/semantic-golden.mjs`: batería semántica multi-tema.
- `prelaunch-evidence-gate-v50.js`: mantiene separado el gate de Producción del gate de Beta.

## Estado de datos de la Beta

La versión pública actual funciona principalmente con almacenamiento local del navegador. El respaldo puede descargarse manualmente en JSON. No debe asumirse que existe sincronización multiusuario o nube hasta que esa infraestructura esté conectada y probada.

## Principio de lanzamiento

**Beta privada puede abrirse con alcance limitado y transparente. Producción pública permanece bloqueada hasta contar con evidencia real de seguridad, multiusuario, recuperación, exportación física, móvil, piloto y continuidad.**
