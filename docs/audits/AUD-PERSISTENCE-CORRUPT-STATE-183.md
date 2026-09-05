# AUD-PERSISTENCE-CORRUPT-STATE-183 — Estado local corrupto puede impedir el arranque

## Resultado

**NO PASA · S1 CRÍTICO · ROTA ante estado local JSON inválido**

## Entrada

Abrir DocenteDigital cuando la clave `docenteDigitalPrototype` de `localStorage` contiene un valor que no es JSON válido (por ejemplo, por escritura truncada, edición manual, extensión del navegador o corrupción local).

## Esperado

La aplicación debe recuperar el arranque de forma controlada, conservar o aislar el estado defectuoso para diagnóstico/recuperación, informar al usuario con lenguaje comprensible y permitir volver a entrar sin pantalla inutilizable. V5 exige persistencia y recuperación; V4 exige errores comprensibles y continuidad del trabajo.

## Obtenido

`app.js` inicia con:

```js
const state=JSON.parse(localStorage.getItem('docenteDigitalPrototype')||'{}');
```

No existe `try/catch` alrededor de esa deserialización inicial. Si el valor almacenado no es JSON válido, `JSON.parse` lanza `SyntaxError` antes de que se inicialice `state` y antes de registrar el resto de funciones de `app.js`. La app depende por tanto de que esa única cadena persistida sea siempre válida.

Además, el guardado base usa:

```js
const save=()=>localStorage.setItem('docenteDigitalPrototype',JSON.stringify(state));
```

sin manejo visible de fallos de cuota/almacenamiento, por lo que la persistencia tampoco tiene contrato de error recuperable en esta capa.

## Evidencia

- `app.js`, inicialización de `state` y función `save()` en las primeras líneas del archivo.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: §§ 3, 4 y 18 exigen guardar/recuperar, probar recarga/interrupciones y bloquean pantallas blancas/negras en funciones principales.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: §§ 17, 19 y 20 exigen errores comprensibles, guardado comprensible y continuar donde quedó.

## Acción requerida

1. Encapsular la lectura/deserialización del estado en una función segura.
2. Si el JSON es inválido, preservar una copia de la cadena defectuosa antes de aislarla o reinicializarla.
3. Mostrar un mensaje comprensible y ofrecer recuperación/reinicio sin perder silenciosamente la copia original.
4. Manejar `QuotaExceededError` y otros fallos de `localStorage.setItem` sin afirmar que se guardó.
5. Añadir pruebas automáticas de: JSON corrupto, clave vacía, esquema antiguo, cuota agotada y recarga posterior.

## Corrección automática

No aplicada en esta pasada. Modificar únicamente la lectura inicial sin diseñar la recuperación de la copia dañada podría convertir un fallo visible en pérdida silenciosa de información, lo que sería peor para V5. La corrección debe preservar datos antes de resetear y después retestear arranque, persistencia y recuperación.

## Clasificación

- Arranque con estado válido: **FUNCIONAL/PARCIAL**.
- Arranque con estado local JSON inválido: **ROTA**.
- Recuperación explícita del estado corrupto: **INEXISTENTE**.
- Manejo visible de error de escritura/cuota en la capa base: **INEXISTENTE/PARCIAL**.
