# Docente Digital — Preparación de GPT sin gastos

**Rama autorizada:** `preview/docentedigital-fase10-20261030`. No incluye producción.

## Protecciones activas en código

1. La restricción de rama exige exactamente `VERCEL_ENV=preview` y el nombre de rama autorizado.
2. Tanto `/api/ai` como `/api/image` tienen dos interruptores: `DD_AI_BETA_ENABLED=true` y **`DD_AI_PAID_CALLS_ENABLED=true`**. El segundo está **apagado por defecto y no se configura en esta fase**.
3. Se exige token privado, cuota global atómica por día y clave de API solo en servidor. Ni el token privado ni `OPENAI_API_KEY` se envían al navegador o se guardan en el código.
4. `GET /api/ai-status` informa `paid_calls_enabled:false` mientras la autorización de pago no exista.
5. Las pruebas automáticas usan respuestas simuladas, y verifican que una configuración parcial no llegue a OpenAI ni a Redis.
6. Los preflight prueban Redis **solo con un acceso privado**. El preflight de escritura exige confirmación específica para una clave sintética; ninguno llama a GPT.
7. El docente siempre revisa y acepta las mejoras. El generador local sigue siendo alternativa si GPT falla.

## Lo que esta fase NO hace

No genera consumo de API, no activa pagos, no configura claves, no habilita GPT a usuarios, no toca `main`, producción ni Supabase. Tampoco copia datos de estudiantes.

## Antes de una prueba real posterior

Requiere una autorización adicional, una clave API configurada por el dueño en Vercel (no en el chat), un presupuesto pequeño, límites de cuota, validación de la privacidad de estudiantes y un caso ficticio de 2.º grado de Primaria. La suscripción ChatGPT Plus **no incluye** consumo de la API.

Pruebas offline: `node tests/ai-preview-lock-v43.mjs`, `node tests/ai-contract.mjs`, `node tests/ai-preflight.mjs`, `node tests/ai-quota-write-preflight.mjs` y `node tests/ai-beta-client.mjs`.
