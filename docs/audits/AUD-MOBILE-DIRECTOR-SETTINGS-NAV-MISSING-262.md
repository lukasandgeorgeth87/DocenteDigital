# AUD-MOBILE-DIRECTOR-SETTINGS-NAV-MISSING-262

**Fecha de verificación:** 12-09-2026  
**Módulo:** Navegación móvil / Director / Configuración-Ficha Maestra  
**Estado:** ABIERTO  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 ALTO  
**Gate:** V4/V5 — NO PASA para navegación móvil integral

## Especificaciones aplicadas

- `docs/AUDITORIA_MAESTRA_INTEGRAL_V2.md`: Carpeta Docente y Carpeta Director deben compartir una Ficha Maestra reutilizable y el sistema debe reconocer ambos espacios/roles.
- `docs/ADENDA_AUDITORIA_EJECUTABLE_V3.md`: una función no aprueba por aparecer; debe ser localizable y ejecutable con evidencia real.
- `docs/AUDITORIA_SIMPLICIDAD_USO_V4.md`: Volver visible, menú simple, prueba de 10 segundos, prueba del pulgar, funciones frecuentes utilizables sin manual y una navegación comprensible en celular.
- `docs/AUDITORIA_PRELANZAMIENTO_V5.md`: Perfil IE y Carpeta Director forman parte del alcance V1.0; móvil físico y recorrido extremo a extremo siguen siendo requisitos obligatorios antes del lanzamiento.

No se aplica ni se declara vigente ninguna norma MINEDU externa nueva en este hallazgo.

## Prueba AUD-MOV-262-A — Acceso a Director desde ancho móvil

**Entrada**  
Abrir la interfaz con ancho `<= 850px` después de completar el setup y buscar el acceso al espacio Director.

**Resultado esperado**  
El usuario móvil debe conservar una ruta visible y sencilla al espacio Director, aun cuando varias funciones internas estén correctamente marcadas como “En desarrollo”.

**Resultado obtenido**  
`styles.css` aplica `.sidebar{display:none}` dentro de `@media(max-width:850px)`. La navegación móvil visible se define con cinco destinos: Inicio, Plan, Sesión, Materiales y Evaluación. No contiene un destino Director.

El HTML de producción sí contiene Director en la barra lateral de escritorio (`data-screen="director"`), pero esa barra se oculta completamente en el breakpoint móvil.

**Evidencia**

- Producción `https://docente-digital.vercel.app/`: barra lateral con Director; `mobile-nav` con solo cinco destinos y sin Director.
- `styles.css`: `@media(max-width:850px){ ... .sidebar{display:none} ... .mobile-nav{display:grid;grid-template-columns:repeat(5,1fr) ... } }`.

**Resultado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 ALTO

## Prueba AUD-MOV-262-B — Acceso a Configuración/Ficha Maestra desde ancho móvil

**Entrada**  
Con setup ya completado y ancho `<= 850px`, intentar localizar Configuración para editar Nivel/Tipo/Grados/Áreas y los datos reutilizables.

**Resultado esperado**  
Debe existir una ruta móvil visible hacia Configuración/Ficha Maestra sin exigir cambiar a vista de escritorio ni conocer una ruta oculta.

**Resultado obtenido**  
El acceso `⚙️ Configuración` existe únicamente en `.sidebar`; esa barra se oculta en móvil. `mobile-nav` no incluye Configuración ni un menú “Más” que permita llegar a ella.

**Resultado:** NO PASA  
**Clasificación:** PARCIALMENTE FUNCIONAL  
**Severidad:** S2 ALTO

## Causa raíz

La navegación responsive se redujo a cinco destinos docentes y ocultó por completo la navegación lateral, sin preservar una ruta alternativa para Director y Configuración.

## Acción correctiva recomendada

Implementar una solución móvil deliberada y pequeña, por ejemplo:

1. mantener las acciones docentes principales visibles;
2. añadir un acceso `Más` o menú equivalente accesible con el pulgar;
3. dentro de ese acceso mostrar Director y Configuración/Ficha Maestra;
4. conservar estado activo, foco de teclado y `aria` pertinentes;
5. verificar que Director siga comunicando honestamente las funciones “En desarrollo” hasta que existan flujos reales;
6. probar después en viewport móvil automatizado y, por V5, dejar la validación física final PENDIENTE hasta usar dispositivos reales.

No se recomienda añadir seis o siete botones comprimidos a la barra inferior sin verificar legibilidad y tamaño táctil.

## Corrección aplicada en esta ronda

**No se modifica código funcional.** La corrección visual requiere decidir la estructura responsive (`Más`, menú lateral móvil u otra opción) y probarla para no introducir regresiones de accesibilidad ni botones demasiado pequeños. Se registra el defecto antes de intervenir.

## Evidencia posterior requerida para cierre

- viewport automatizado `<=850px`: Director y Configuración localizables y navegables;
- prueba de retorno y foco;
- ninguna pérdida de Inicio/Plan/Sesión/Materiales/Evaluación;
- prueba física V5 en celular económico y gama media todavía PENDIENTE;
- HTTP 200 y Vercel READY tras cualquier corrección futura.

## Riesgo de regresión

MEDIO: modificar la barra inferior puede afectar legibilidad, tamaño táctil, estado activo y espacio de contenido.

## Impacto en indicadores

- **IUD/ICGD:** negativo por navegación incompleta entre superficies y Ficha Maestra.
- **IFR:** no calculado definitivamente; evidencia parcial negativa en navegación móvil.
- **ISU:** no calculado definitivamente; afecta localización de funciones, móvil y cantidad de decisiones.
- **Prelaunch:** permanece BLOQUEADO; este hallazgo no sustituye las pruebas físicas V5.

## Dictamen

La interfaz responsive no conserva actualmente acceso visible a Director ni a Configuración/Ficha Maestra cuando la barra lateral se oculta. Esto impide considerar la navegación móvil integral como aprobada, aunque no demuestra por sí solo una falla en dispositivo físico ni justifica calcular un puntaje ISU/Prelaunch definitivo.