# AUD-SEC-SHARED-BROWSER-DATA-231

## Resumen

**Módulo:** Persistencia / autenticación / autorización / aislamiento de datos  
**Estado:** NO PASA  
**Severidad:** **S0 BLOQUEANTE**  
**Clasificación:** persistencia local = FUNCIONAL para prototipo; autenticación = INEXISTENTE; autorización = INEXISTENTE; aislamiento entre usuarios/IE = INEXISTENTE; protección en navegador compartido = ROTA para lanzamiento.

## Especificaciones obligatorias aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: la aplicación debe reconocer roles, reutilizar una Ficha Maestra y operar como sistema integral Docente/Director.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`, secciones 19 y 23: probar roles, permisos, escalamiento de privilegios, cambio de identificadores, aislamiento entre usuarios/IE y bitácora; una fuga de datos o privilegio indebido es S0.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`, secciones 3, 11 y 18: probar login cuando exista, autenticación, autorización, sesiones, almacenamiento y aislamiento; no lanzar si datos de otros usuarios son visibles.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: la recuperación y reutilización de trabajo no puede sacrificar seguridad.
- `docs/NUCLEO_IA_DOCENTEDIGITAL.md`: el rol y los datos institucionales forman parte del contexto que debe conservarse de forma controlada.

OWASP ASVS fue verificado contra la fuente oficial de OWASP durante esta auditoría. La página oficial indica que **ASVS 5.0.0 fue publicado el 30 de mayo de 2025**. Esta auditoría no declara cumplimiento ASVS; únicamente confirma que V5 exige una auditoría con estándar reconocido y que la seguridad productiva actual todavía no puede aprobarse.

## Evidencia de implementación

### E1 — `app.js`

El estado completo se carga automáticamente al abrir la aplicación:

```js
const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
```

y se persiste bajo una única clave global del origen:

```js
const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
```

No existe en esa ruta un `userId`, `institutionId`, sesión autenticada, comprobación de propietario ni namespace por usuario/IE antes de cargar los datos.

### E2 — `institution-master-v46.js`

El propio módulo declara expresamente:

> `No sustituye autenticación ni una base de datos multiusuario; en este prototipo se guarda en localStorage.`

También guarda bajo la misma clave `docenteDigitalPrototype` datos como nombre de IE, código modular, código de local, UGEL, DRE/GRE, ubicación, director, docente, número de docentes, número de estudiantes, calendario y notas institucionales.

La interfaz informa además que los datos se guardan solamente en ese navegador y que la versión multiusuario requerirá autenticación y base de datos segura.

### E3 — `storage-access-guard-v71.js`

La guardia actual protege únicamente fallos de acceso/cuota de `localStorage`. No introduce autenticación, autorización, cifrado por usuario ni aislamiento de datos.

### E4 — producción

`https://docente-digital.vercel.app/` y `https://docente-digital.vercel.app/app.js` responden HTTP 200. La aplicación productiva sirve la misma carga automática de `docenteDigitalPrototype` desde `localStorage`.

## Pruebas

### AUD-SEC-231-A — navegador compartido / segundo usuario local

**Entrada:**  
1. Persona A utiliza DocenteDigital en un navegador y guarda Ficha Maestra, unidades o sesión.  
2. Sin borrar datos del sitio ni cambiar de perfil de navegador, Persona B abre posteriormente `https://docente-digital.vercel.app/`.

**Resultado esperado:**  
La aplicación debe exigir identidad válida antes de acceder a información privada y cargar únicamente datos autorizados para esa persona/IE. En un producto multiusuario, el contexto debe estar asociado a una identidad y tenant/IE verificables.

**Resultado obtenido por inspección determinista del runtime:**  
`app.js` carga automáticamente la única clave `docenteDigitalPrototype` del mismo origen antes de cualquier autenticación. No existe pantalla de login ni comprobación de propietario en el arranque auditado. Por diseño del navegador, el `localStorage` del mismo origen y perfil permanece disponible para aperturas posteriores del sitio.

**Evidencia:** E1, E2, E3 y E4.

**Resultado:** **NO PASA**  
**Severidad:** **S0 BLOQUEANTE**  
**Clasificación:** aislamiento local entre personas = **INEXISTENTE**.

### AUD-SEC-231-B — separación Docente / Director

**Entrada:** guardar estado con rol Docente o Director y volver a abrir desde la misma instancia del navegador.

**Resultado esperado:** el rol visible no debe ser equivalente a un permiso de seguridad; cualquier acceso a funciones/datos sensibles debe validarse mediante autorización real.

**Resultado obtenido:** `state.userRole` es un dato del mismo objeto local persistido. No existe evidencia de sesión autenticada, autorización server-side ni política de acceso que proteja los datos o funciones según identidad.

**Resultado:** **NO PASA**  
**Severidad:** **S0 BLOQUEANTE** si se pretende lanzamiento multiusuario/productivo.  
**Clasificación:** rol funcional/declarativo = PARCIALMENTE FUNCIONAL; autorización = INEXISTENTE.

### AUD-SEC-231-C — aislamiento entre IE

**Entrada:** almacenar una Ficha Maestra de IE A y posteriormente cambiar datos/rol desde la misma aplicación.

**Resultado esperado:** en arquitectura productiva, los documentos y datos deben quedar asociados a un tenant/IE con autorización verificable y no ser legibles por otra identidad.

**Resultado obtenido:** la clave de almacenamiento no contiene namespace por usuario ni IE; el estado completo comparte el mismo contenedor local del origen.

**Resultado:** **NO PASA para gate de lanzamiento**  
**Severidad:** **S0 BLOQUEANTE** hasta implementar y probar aislamiento real.

## Causa raíz

La aplicación desplegada continúa usando una arquitectura de prototipo single-browser: un objeto global persistido en `localStorage`. La Ficha Maestra reconoce explícitamente que esta arquitectura no sustituye autenticación ni base de datos multiusuario.

## Acción correctiva

No aplicar un parche cliente que oculte menús o agregue un PIN local, porque no resolvería autorización ni aislamiento.

Antes de lanzamiento V1.0 se requiere, como mínimo:

1. autenticación real;
2. identidad estable del usuario;
3. relación explícita usuario ↔ IE/tenant ↔ rol;
4. autorización server-side para cada lectura/escritura sensible;
5. almacenamiento persistente aislado por tenant/usuario;
6. sesiones seguras y cierre de sesión;
7. protección de datos/documentos históricos por propietario/IE;
8. pruebas de IDOR/cambio manual de identificadores y escalamiento de privilegios;
9. bitácora de acciones críticas;
10. política de migración segura desde el estado local del prototipo;
11. pruebas en navegador compartido y múltiples cuentas reales;
12. auditoría OWASP ASVS 5.0.0 y privacidad antes del gate final.

## Corrección aplicada en esta ejecución

**Ninguna corrección de código.** La solución requiere backend, autenticación, autorización y decisiones de arquitectura. Según la regla de auditoría, no se simula una solución cliente incompleta.

## Evidencia posterior / producción

Se documenta el defecto únicamente. Debe comprobarse tras este commit que Vercel vuelva a estado READY y que la raíz pública continúe respondiendo HTTP 200; esto solo confirma disponibilidad técnica, no cierre del S0.

## Riesgo de regresión

Alto si se intenta migrar a autenticación sin separar explícitamente estado local, documentos históricos y ownership. Una migración incorrecta podría asignar datos antiguos al usuario/IE equivocados.

## Impacto en gates y métricas

- **V5 Prelaunch:** BLOQUEADO.
- **Seguridad/privacidad:** NO APROBADA.
- **IUD / ICGD / IFR / ISU / Prelaunch Score:** no se calcula valor definitivo por existir S0 y faltar pruebas reales.
- **Pilotos multiusuario:** no deben tratar datos reales/sensibles como si el aislamiento estuviera aprobado.

## Pendientes que no se simulan

- prueba con dos cuentas reales;
- backend multiusuario;
- aislamiento server-side;
- restauración real;
- auditoría ASVS completa;
- pruebas de autorización/IDOR;
- revisión legal de privacidad y protección de datos;
- dispositivos físicos compartidos;
- concurrencia productiva.
