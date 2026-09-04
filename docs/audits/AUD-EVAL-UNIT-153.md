# AUD-EVAL-UNIT-153 — Evaluación de unidad/proyecto sin ejecución ni persistencia

## Alcance

Auditoría V2 + V3 + V4 + V5 + Núcleo IA sobre el flujo **Evaluación → Evaluación de unidad/proyecto** en `main` y producción.

## Prueba

**ID:** AUD-EVAL-UNIT-153  
**Módulo:** Evaluación / Unidad-Proyecto / E2E Docente  
**Entrada:** abrir `Evaluación` → `Evaluación de unidad/proyecto` → `Crear` → elegir idioma y tipo → pulsar `✨ Crear evaluación`.

### Resultado esperado

La acción debe construir una evaluación vinculada a la unidad/proyecto y a datos pedagógicos reales ya existentes. Debe conservar como mínimo procedencia y relación con unidad, competencias/criterios/evidencias pertinentes, permitir revisión docente y contar con persistencia/recuperación. Una acción principal no puede aprobar solo porque aparece.

V5 exige el recorrido Docente `Perfil IE → Programación → Unidad/Proyecto → Sesiones → Materiales → Evaluación → Registro → Seguimiento`, y V3 exige entrada → resultado → evidencia → persistencia/recuperación para funciones importantes.

### Resultado obtenido

En `app.js`, `showEvaluation('unit')` construye el panel con dos selectores (`Idioma` y `Tipo`) y un botón:

```html
<button class="btn">✨ Crear evaluación</button>
```

El botón no tiene `onclick`, formulario con `submit`, listener ni otra acción declarada en ese bloque. Tampoco se crea una entidad de evaluación, no se vincula a `unitId`, no se consultan competencias/criterios/evidencias, no se ejecuta guardado y no existe evidencia de persistencia o recuperación a partir de esa acción.

La cadena de módulos estable incluye guardas de diagnóstico y seguridad curricular, pero no convierte este botón de `showEvaluation('unit')` en una generación de evaluación de unidad/proyecto demostrada.

La misma estructura está servida por producción en `https://docente-digital.vercel.app/app.js` con HTTP 200.

## Veredicto

**PASA/NO PASA:** NO PASA  
**Clasificación:** SIMULADA  
**Severidad:** S1 CRÍTICO para Prelaunch V5

### Justificación de severidad

La evaluación es función esencial de Carpeta Docente V1.0 y paso obligatorio del E2E V5. La pantalla invita a crear una evaluación y presenta una acción principal que no ejecuta la función prometida. Mientras este paso no exista realmente, no puede demostrarse el recorrido Unidad/Proyecto → Evaluación → Registro → Seguimiento.

No se clasifica S0 porque no se demostró fuga, corrupción o pérdida irreversible de datos en esta prueba.

## Causa raíz

La superficie de Evaluación fue maquetada antes de implementar el modelo funcional y persistente de evaluación de unidad/proyecto. La UI expone una capacidad más avanzada que el runtime real.

## Acción correctiva

No resolver mediante un `alert()` ni contenido fijo. Implementar una entidad persistente de evaluación vinculada, como mínimo, a:

- `id` de evaluación;
- `unitId` / proyecto de origen;
- grado(s) y área(s) pertinentes;
- competencia(s) y criterio(s) provenientes de fuente curricular protegida;
- evidencias o desempeños que se desean recoger;
- tipo de evaluación elegido;
- idioma/perfil lingüístico confirmado;
- propuesta editable;
- estado de revisión/aprobación docente;
- procedencia y fecha;
- persistencia, reapertura y edición.

Si la matriz curricular oficial o los datos de la unidad no están disponibles/verificados, bloquear la generación o mostrar el requisito pendiente en lugar de fabricar una evaluación.

Hasta implementar la función real, una corrección visual segura sería deshabilitar la acción y rotularla claramente como `Próximamente`, para evitar simulación funcional.

## Regresión mínima exigida

1. Unidad real → Evaluación → guardar → recargar → reabrir.  
2. Cambio de tipo de evaluación → contenido coherente, sin alterar criterio arbitrariamente.  
3. EIB/monolingüe → idioma pertinente sin modificar dificultad/criterio por traducción.  
4. Multigrado → diferenciación por grado sin mezclar evidencias.  
5. Campos incompletos → bloqueo comprensible, sin datos inventados.  
6. Doble clic → una sola evaluación persistida.  
7. Evaluación → Registro → Seguimiento con trazabilidad del mismo estudiante/competencia/evidencia cuando ese backend/modelo exista.

## Impacto en gates

- **IUD:** afecta continuidad del flujo Docente.
- **ICGD:** afecta coherencia y trazabilidad entre planificación y evaluación.
- **IFR:** la función no cumple funcionalidad real.
- **ISU:** no se calcula puntuación definitiva; una acción clara pero inerte aumenta abandono/confusión.
- **Prelaunch:** BLOQUEA V1.0 hasta implementación y prueba real.

## Límites de esta auditoría

No se declara superada la prueba física móvil, Word/PDF, concurrencia, backup/restore, usuarios reales, 100 generaciones ni seguridad productiva. No se aplicó ni declaró vigente ninguna norma MINEDU nueva en este hallazgo técnico.