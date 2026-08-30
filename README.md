# DocenteDigital

Prototipo interactivo independiente de Base44 para validar la experiencia de uso antes de conectar infraestructura de pago.

## Documentos rectores del proyecto

Toda evolución de DocenteDigital debe respetar:

- **Especificación Maestra – Plataforma de Gestión Docente y Directiva MINEDU v1.0**  
  `docs/ESPECIFICACION_MAESTRA_V1.md`
- **Especificación Maestra – Módulo Director v1.0**  
  `docs/ESPECIFICACION_MODULO_DIRECTOR_V1.md`

Regla principal: **DocenteDigital no es solo un generador con IA. La IA debe consultar una base curricular, normativa e institucional estructurada, mantener trazabilidad y nunca inventar ni sustituir fuentes oficiales.**

Para el Módulo Director rige además un principio de simplificación: **la app debe ayudar a reducir burocracia, identificar qué instrumentos corresponden realmente a cada tipo de IE y evitar duplicar planes o documentos cuando pueden integrarse en PEI, PAT, PCI, RI o DG.**

## Flujo principal

Nivel educativo → Tipo de IE → Grados/edades → Áreas → Planificación → Sesión → Materiales → Evaluación.

## Incluido en este prototipo

- Inicial, Primaria y Secundaria.
- IE Unidocente, Multigrado y Polidocente.
- Selección de varios grados en Multigrado/Unidocente.
- Selección de varias áreas en Inicial y Primaria.
- Secundaria organizada por área.
- Configuración EIB: castellano, quechua y bilingüe.
- Evaluación diagnóstica.
- Unidad/proyecto.
- Sesión con título automático tomado de la actividad.
- Barra de chat para indicar correcciones.
- Materiales y lecturas.
- Evaluación de unidad/proyecto.
- Conclusiones descriptivas para SIAGIE.
- Modo Fácil y Modo Experto.
- Diseño adaptable a celular y laptop.

## Importante

La generación con IA y el sistema multiusuario todavía están simulados. La siguiente fase conectará autenticación, base de datos, separación por institución y generación real mediante una arquitectura que deberá cumplir las Especificaciones Maestras.