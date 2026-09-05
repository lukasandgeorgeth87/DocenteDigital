# AUD-SEC-LOCAL-STATE-161 — Estado educativo reutilizado sin identidad ni aislamiento

## Alcance
Auditoría acumulativa V2 + V3 + V4 + V5 + Núcleo IA. Este hallazgo no declara cumplimiento de OWASP ASVS ni de normativa externa; esas pruebas continúan pendientes.

## ID de prueba
**AUD-SEC-LOCAL-STATE-161**

## Módulo
Persistencia / privacidad / aislamiento / continuidad de sesión.

## Entrada
1. Abrir DocenteDigital en un navegador.
2. Configurar nivel, tipo de IE, grados/áreas y crear información docente.
3. Cerrar la pestaña o navegador sin ejecutar una acción de cierre de sesión o cambio de usuario (no existe actualmente una identidad de usuario visible en el flujo base).
4. Volver a abrir DocenteDigital en el mismo perfil de navegador o entregar el dispositivo a otra persona.

## Resultado esperado
La información educativa o institucional debe pertenecer a una identidad/IE autorizada y no quedar expuesta a otra persona que use el mismo navegador. V3 exige probar aislamiento entre usuarios/IE y V5 exige seguridad, privacidad, autenticación/autorización cuando exista arquitectura productiva, además de bloquear el lanzamiento si datos de otros usuarios son visibles.

## Resultado obtenido
El estado principal se inicializa directamente desde una clave global de navegador:

```js
const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
...
const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
```

No existe namespace por `userId`, `ieId` o sesión en esa clave. La interfaz base tampoco presenta login, cambio de usuario ni cierre de sesión antes de cargar dicho estado. Por diseño, cualquier persona que abra la aplicación usando el mismo perfil de navegador reutiliza el mismo `docenteDigitalPrototype` hasta que sea borrado o reemplazado.

## Evidencia
- `app.js`: carga y guarda todo el estado principal en `localStorage['docenteDigitalPrototype']` sin identidad asociada.
- `index.html`: el flujo inicial comienza directamente por configuración pedagógica y navegación; no existe control de identidad previo.
- V3: exige aislamiento entre usuarios/IE y clasifica fuga de datos/privilegio indebido como S0.
- V5: el gate no permite datos de otros usuarios visibles y exige auditoría de autenticación/autorización, sesiones, almacenamiento y aislamiento.

## PASA / NO PASA
**NO PASA**

## Clasificación funcional
**PARCIALMENTE FUNCIONAL** como persistencia local; **INEXISTENTE** como aislamiento multiusuario/por IE.

## Severidad
**S0 BLOQUEANTE para lanzamiento** si se pretende uso real en dispositivos compartidos o con más de una identidad, porque el diseño actual no establece frontera de acceso al estado persistido. No se afirma una fuga remota entre cuentas: la evidencia demuestra exposición determinista dentro del mismo perfil de navegador.

## Causa raíz
La persistencia del prototipo fue diseñada como estado único por navegador antes de introducir identidad, tenant/IE, autorización y sesión. La clave global conserva continuidad local, pero no separa propietarios de los datos.

## Acción correctiva
No resolver con otra clave de `localStorage` elegida manualmente por el usuario. Implementar primero un modelo de identidad y pertenencia real:

- usuario autenticado;
- IE/tenant autorizado;
- roles Docente/Director;
- autorización por recurso;
- identificadores no confiados desde cliente sin verificación servidor;
- almacenamiento persistente asociado a propietario/IE;
- cierre de sesión que elimine o invalide acceso local sensible;
- política explícita para dispositivos compartidos;
- cifrado/transporte y controles de backend cuando exista;
- bitácora mínima para acciones críticas.

Mantener posibilidad de trabajo local solo si los datos están correctamente vinculados y protegidos para el usuario autorizado.

## Repruebas obligatorias
1. Usuario A crea IE A y documentos; Usuario B no puede verlos modificando URL/ID ni reutilizando el mismo navegador.
2. Director y Docente reciben solo los permisos previstos.
3. Cierre de sesión → reapertura no expone datos sensibles del usuario anterior.
4. Dos IE bajo una misma cuenta/rol no se mezclan.
5. Cambio manual de identificadores devuelve denegación segura.
6. Recarga, cierre abrupto y retorno recuperan únicamente datos del propietario autorizado.
7. Probar dispositivos compartidos reales.
8. Ejecutar posteriormente auditoría OWASP ASVS cuando exista backend/autenticación productiva.

## Corrección aplicada en esta pasada
Ninguna corrección funcional. Introducir autenticación/tenant/backend es un cambio arquitectónico y no cumple la regla de cambio pequeño, seguro y reversible. Se registra el bloqueante para evitar simular seguridad.

## Evidencia posterior requerida
Solo podrá cerrarse con pruebas reales de aislamiento y autorización. La mera presencia de una pantalla de login no constituye evidencia suficiente.

## Riesgo de regresión
Alto. Una futura migración desde `docenteDigitalPrototype` debe preservar datos del propietario correcto sin reasignar históricos a otra identidad o IE.

## Impacto en indicadores
- **IUD:** no puntuar definitivamente; afecta confianza/continuidad en equipos compartidos.
- **ICGD:** afecta trazabilidad y pertenencia documental.
- **IFR:** bloqueado para seguridad/persistencia multiusuario.
- **ISU:** no puntuar definitivamente; login debe diseñarse sin degradar simplicidad.
- **Prelaunch:** **BLOQUEADO por S0** hasta demostrar aislamiento real.

## Estado
**ABIERTO — NO APROBADO PARA V1.0.**
