# AUD-EVAL-REGISTER-154 — Registro de evaluación sin estudiante, criterio, evidencia ni persistencia

## Alcance

Auditoría V2 + V3 + V4 + V5 + Núcleo IA sobre el flujo **Evaluación → Registrar evaluación** en `main` y producción.

## Prueba

**ID:** AUD-EVAL-REGISTER-154  
**Módulo:** Evaluación / Registro auxiliar / E2E Docente  
**Entrada:** abrir `Evaluación` → `Registrar evaluación` → `Abrir`.

### Resultado esperado

El registro debe operar sobre datos reales y trazables. Como mínimo debe permitir identificar estudiante, competencia, criterio/evidencia de origen, valoración/nivel de logro y procedencia (unidad/sesión/instrumento), guardar el registro, recuperarlo y continuar hacia seguimiento. No debe presentar una valoración aislada como si constituyera un registro funcional.

V5 define como esencial `Evaluación e instrumentos` y `Registro auxiliar`, y exige el recorrido Docente `Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento`. V3 exige demostrar funciones con entrada, resultado, evidencia y persistencia/recuperación.

### Resultado obtenido

En `app.js`, `showEvaluation('register')` construye únicamente:

```html
<h2>📋 Registro de evaluación</h2>
<p>Usa criterios y evidencias ya registrados.</p>
<label>Nivel de logro
  <select>
    <option>AD</option>
    <option>A</option>
    <option selected>B</option>
    <option>C</option>
  </select>
</label>
```

No se solicita ni recupera estudiante, competencia, criterio, evidencia, instrumento, unidad, sesión o fecha. Tampoco existe en ese bloque una acción de guardar, actualización de estado, entidad de registro, persistencia, reapertura, historial o paso hacia seguimiento.

La afirmación visible `Usa criterios y evidencias ya registrados` no está respaldada por una lectura de esos datos en `showEvaluation('register')`.

La cadena estable de módulos cargada desde `schedule-prompt-v6.js` incluye guardas de diagnóstico, currículo, persistencia y prelaunch, pero no incluye un módulo específico de Registro/Evaluación que sustituya esta rama base por un registro funcional demostrado.

## Veredicto

**PASA/NO PASA:** NO PASA  
**Clasificación:** SIMULADA  
**Severidad:** S1 CRÍTICO para Prelaunch V5

### Justificación de severidad

`Registro auxiliar` es una función esencial explícita de Carpeta Docente V1.0 y un paso obligatorio del E2E V5. La pantalla permite elegir AD/A/B/C, pero no existe evidencia de a quién, a qué competencia/criterio ni a qué evidencia corresponde la valoración, ni de que el dato se conserve. Esto puede inducir al usuario a creer que ya está registrando evaluación cuando solo modifica un selector temporal sin trazabilidad.

No se clasifica S0 porque en esta prueba no se demostró fuga de datos, corrupción irreversible ni pérdida de registros previamente persistidos; lo probado es ausencia de implementación funcional suficiente.

## Causa raíz

La superficie de Registro fue maquetada antes de implementar el modelo de evaluación por estudiante/competencia/evidencia y su persistencia. La UI expone el concepto de registro, pero el runtime base no contiene la entidad ni el flujo correspondiente.

## Acción correctiva

Implementar un modelo persistente de registro que relacione como mínimo:

- `studentId` / estudiante real;
- `competenceId` / competencia protegida;
- `criterionId` / criterio de evaluación;
- `evidenceId` / evidencia observada;
- instrumento o fuente de valoración;
- nivel de logro/valoración;
- retroalimentación cuando corresponda;
- `unitId` / `sessionId` de procedencia;
- fecha y estado de revisión;
- autor/rol cuando exista autenticación;
- historial y trazabilidad sin alterar registros históricos al cambiar datos maestros.

Si faltan estudiante, criterio o evidencia, bloquear el guardado y explicar qué falta. No autocompletar valoraciones inventadas.

Hasta implementar la función real, una corrección visual segura sería deshabilitar `Registrar evaluación` o rotularla como `Próximamente` para no simular capacidad.

## Regresión mínima exigida

1. Estudiante real → criterio/evidencia → valoración → guardar → recargar → reabrir.  
2. Dos estudiantes → valores aislados, sin contaminación entre registros.  
3. Dos competencias → registros independientes y trazables.  
4. Cambio posterior de Ficha Maestra → históricos no se modifican retroactivamente.  
5. Doble clic/guardar repetido → no duplica el mismo registro.  
6. Campos incompletos → bloqueo comprensible y sin valoración ficticia.  
7. Multigrado → separación correcta por estudiante/grado.  
8. Evaluación → Registro → Seguimiento conserva la misma cadena estudiante/competencia/criterio/evidencia.

## Impacto en gates

- **IUD:** bloquea continuidad del flujo Docente.
- **ICGD:** rompe trazabilidad evaluación → registro → seguimiento.
- **IFR:** función presentada pero no demostrada.
- **ISU:** no se calcula puntuación definitiva; selector sin guardado puede generar falsa sensación de éxito.
- **Prelaunch:** BLOQUEA V1.0 hasta implementación y prueba real.

## Límites de esta auditoría

No se declaran superadas pruebas de usuarios reales, móvil físico, Word/PDF, concurrencia, backup/restore, 100 generaciones, año completo ni seguridad productiva. No se aplicó ni declaró vigente ninguna norma MINEDU nueva en este hallazgo técnico.