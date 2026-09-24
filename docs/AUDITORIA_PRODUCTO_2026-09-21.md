# Auditoría de producto — DocenteDigital
Fecha: 21/09/2026
Estado: Beta privada local-first
Objetivo: preparar una versión sólida para piloto real sin presentar como terminadas funciones que todavía requieren backend, IA remota o validación física.

## Referencias comparadas

### El Profe Caicedo
Fortalezas observadas públicamente:
- Suite amplia de generadores para docentes peruanos.
- Contextualización territorial.
- Biblioteca de recursos.
- Portafolio, seguimiento, reportes y evaluación por periodos.
- Autenticación, planes y acceso por cuenta.

### DocenteIA
Fortalezas observadas públicamente:
- Planificación anual, unidad y sesión conectadas.
- Contexto persistente.
- Edición por bloques sin rehacer todo el documento.
- Exportación a DOCX/PDF/HTML.
- Biblioteca de documentos oficiales.

### MagicSchool
Fortalezas observadas públicamente:
- Plataforma centralizada de planificación, evaluación, rúbricas y feedback.
- Knowledge/Base de conocimiento compartida.
- Studio/editor de documentos.
- Herramientas conectadas en un mismo flujo.

### Brisk Teaching
Fortalezas observadas públicamente:
- Transformar un recurso existente en ficha, quiz, plan u otro material.
- Diferenciación por nivel.
- Feedback alineado con rúbrica.
- Siguiente paso pedagógico.
- Integración con Google/Microsoft y trabajo desde la fuente ya abierta.

### Curipod
Fortalezas observadas públicamente:
- Actividades interactivas.
- Feedback inmediato.
- Revisión/segundo intento.

---

# Resultado de la auditoría

## P0 — Bloqueadores de producción pública

### 1. Falta autenticación y aislamiento multiusuario
Estado: PENDIENTE.
Actualmente el trabajo principal se guarda en localStorage. Esto sirve para una beta privada, pero no para vender a docentes con cuentas separadas.
Necesario:
- login;
- usuario/rol;
- institución;
- aislamiento por usuario e IE;
- recuperación de contraseña;
- sesiones seguras;
- RLS en base de datos.

### 2. Falta persistencia en nube y respaldo servidor
Estado: PENDIENTE.
Ya existe respaldo JSON local, pero una cuenta comercial debe poder cambiar de dispositivo y recuperar su información.

### 3. Falta backend seguro para OpenAI
Estado: PENDIENTE.
La clave OpenAI nunca debe colocarse en JavaScript del navegador.
Necesario:
- endpoint servidor/Edge Function;
- autenticación;
- límites por plan;
- registro de consumo;
- enrutamiento de modelos;
- caché;
- reutilización de resultados;
- separación texto / imagen.

### 4. Falta control comercial real
Estado: PENDIENTE.
Necesario:
- plan del usuario;
- cuota mensual;
- uso consumido;
- créditos premium de imagen;
- suspensión/renovación;
- panel del propietario separado de la vista docente.

### 5. Privacidad de registros de estudiantes
Estado: EN CORRECCIÓN.
Durante Beta se debe trabajar preferentemente con códigos o iniciales y no ingresar DNI, teléfonos, domicilios, diagnósticos ni información sensible.
Antes de producción:
- términos;
- política de privacidad;
- cifrado y RLS;
- reglas de retención;
- eliminación de cuenta/datos;
- acceso por rol.

---

## P1 — Calidad pedagógica y de flujo

### 6. Coherencia Nivel → Unidad/Proyecto → Sesión
Estado: MEJORADO.
- Inicial mantiene actividad de aprendizaje + taller.
- Primaria y Secundaria usan complejidad distinta.
- Los títulos ya no deben copiar literalmente una conducta escrita por el docente.
- El contexto institucional se reutiliza.

### 7. Situación significativa
Estado: MEJORADO / SEGUIR PROBANDO.
Debe:
- usar IE y localidad cuando estén disponibles;
- no inventar problemas, actores ni causas;
- convertir una idea vaga en una situación pedagógica;
- generar reto y producto coherentes.

### 8. Títulos
Estado: MEJORADO.
Se corrigió el error de convertir literalmente frases como “arrojan basura al piso” en títulos.
Regla:
- Inicial: curiosidad, juego, exploración.
- Primaria: observar, comprender, investigar, aplicar, proponer.
- Secundaria: analizar, contrastar, argumentar, decidir, proponer.

### 9. Estrategias de sesión
Estado: MEJORADO / REQUIERE PRUEBAS REALES.
Se eliminan tablas técnicas redundantes y se integra una secuencia lógica de acciones del estudiante.
Debe mantenerse:
- qué hace;
- con qué;
- para qué;
- cómo produce evidencia;
- segundo intento después de retroalimentación.

### 10. Materiales
Estado: BETA FUNCIONAL.
Ya incluye:
- lectura;
- ficha;
- tarjetas;
- banco de problemas;
- conceptos;
- organizador;
- paquetes diferenciados por grado;
- texto/recurso base pegado por el docente;
- biblioteca visual con licencia y créditos;
- Word real DOCX.
Falta:
- PPTX real;
- PDF generado como archivo y validado físicamente;
- carga directa de PDF/DOCX/imagen para transformar;
- edición visual avanzada de fichas.

### 11. Evaluación
Estado: BETA FUNCIONAL.
Ya incluye:
- registro;
- evaluación de unidad/proyecto;
- conclusiones;
- rúbrica editable;
- retroalimentación desde evidencias;
- siguiente paso;
- CSV;
- DOCX.
Falta:
- análisis por periodo;
- consolidado por competencia;
- dashboard de progreso;
- recomendaciones para siguiente sesión;
- exportación compatible con registro auxiliar oficial definido por el docente.

### 12. Currículo oficial
Estado: PARCIAL.
El núcleo actual dispone de áreas, competencias y capacidades oficiales.
La matriz literal/versionada de desempeños todavía no está declarada como completa.
Regla obligatoria:
- no presentar criterios contextualizados como desempeño oficial;
- no inventar estándares/desempeños;
- completar y versionar matrices oficiales por nivel/grado/ciclo antes de producción.

### 13. Biblioteca
Estado: BETA FUNCIONAL.
Fortalezas:
- recurso propio;
- recurso web con licencia;
- autor;
- fuente;
- preview real;
- reutilización.
Falta:
- almacenamiento real de archivos propios;
- etiquetas administrables;
- colecciones por Inicial/Primaria/Secundaria/Director;
- buscador semántico;
- control de versiones;
- miniaturas de todos los recursos propios.

### 14. Director
Estado: BETA FUNCIONAL.
Ya:
- oficio;
- informe;
- memorando;
- acta;
- resolución;
- planes;
- historial;
- DOCX.
Falta:
- matrices específicas por tipo de IE;
- PAT/PEI/PCI y documentos priorizados sin duplicación;
- expediente/archivo institucional;
- calendario de vencimientos;
- panel de tareas;
- normativa estructurada y versionada.

---

## P2 — Ventaja competitiva para DocenteDigital

### 15. El flujo debe ser el producto, no la cantidad de generadores
Objetivo:
Contexto → Programación → Unidad/Proyecto → Sesión → Materiales → Evaluación → Registro → Retroalimentación → Siguiente sesión.

### 16. Reutilizar antes de generar
- Contexto: una sola vez.
- Criterio: viene de planificación.
- Registro: viene de criterios/evidencias.
- Conclusión: viene del registro.
- Material: reutiliza sesión/unidad/biblioteca.
- Imagen: biblioteca primero; nueva generación solo cuando realmente se necesita.

### 17. Editor por bloques
Prioridad ALTA.
Inspirado en el patrón de plataformas modernas: modificar propósito, criterio, actividad, evidencia, recurso o instrumento sin regenerar todo el documento.

### 18. Siguiente paso pedagógico
Prioridad ALTA.
Desde la evaluación, DocenteDigital debe proponer:
- estudiante/grupo que requiere apoyo;
- aprendizaje a reforzar;
- estrategia sugerida;
- material ya disponible;
- siguiente sesión relacionada.
El docente decide si lo acepta.

---

# Correcciones realizadas durante esta auditoría

- Títulos diferenciados por Inicial, Primaria y Secundaria.
- Activación real de Materiales y Evaluación en navegación.
- Diagnóstico funcional.
- Programación anual editable.
- Director funcional en Beta.
- Rúbrica desde criterios.
- Retroalimentación desde evidencia.
- Transformación de texto/recurso base en material.
- Exportación DOCX real extendida a Materiales, Evaluación, Programación y Director.
- Respaldo/restauración local habilitado.
- Navegación móvil con acceso Director/Configuración.
- Verificación de persistencia local.
- Pruebas Beta actualizadas para no esperar módulos deshabilitados.
- Manifest de Beta actualizado.

---

# Orden de trabajo recomendado antes de cobrar a docentes

1. Terminar matriz curricular oficial/versionada.
2. Probar 15–20 casos reales por cada nivel.
3. Cerrar errores de sesiones/materiales/evaluación en móvil.
4. Crear backend multiusuario.
5. Añadir autenticación.
6. Persistencia nube + RLS.
7. Conectar OpenAI solo desde backend.
8. Implementar cuotas/costos/planes.
9. Validar DOCX/PDF/PPT en Android, Windows y Office.
10. Piloto con 5 docentes.
11. Piloto con 20 docentes.
12. Recién después abrir venta pública.

# Criterio de lanzamiento

No lanzar públicamente como plataforma comercial mientras no estén resueltos:
- autenticación;
- aislamiento de usuarios;
- respaldo en nube;
- backend de IA;
- privacidad;
- pruebas físicas de archivos;
- piloto real.

Sí se puede usar antes como Beta privada controlada para detectar errores de experiencia y contenido.
