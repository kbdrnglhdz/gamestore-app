## Context

Se necesita un segundo endpoint simple de prueba para verificar hooks y funcionamiento del servidor, complementario al test-hook existente.

## Goals / Non-Goals

**Goals:**
- Crear endpoint GET en `/api/hook2-test` que devuelva JSON con mensaje "prueba de hook2"
- Endpoint público sin autenticación

**Non-Goals:**
- No incluye lógica de negocio
- No requiere base de datos
- No requiere frontend

## Decisions

| Decisión | Alternativas | Por qué |
|----------|-------------|---------|
| Ruta simple en nuevo archivo `hook2-test.ts` | Agregar a hook-test.ts existente | Mantener separación de pruebas |
| Respuesta JSON simple | Respuesta de texto plano | Consistencia con el resto de la API |
| Endpoint público sin auth | Proteger con autenticación | Solo devuelve mensaje estático, sin riesgo |

## Risks / Trade-offs

- **[Riesgo]** Endpoint accesible públicamente → Solo devuelve mensaje estático, sin riesgo de seguridad

## Migration Plan

N/A - No requiere migración

## Open Questions

Ninguna

## Files to Create/Modify

### New Files
- `backend/src/routes/hook2-test.ts` (nuevo - endpoint de prueba)
- `openspec/changes/test-hook2/specs/hook2-test-endpoint/spec.md` (spec)

### Modified Files
- `backend/src/index.ts` o archivo principal (registrar nueva ruta)

## Security & Performance

- No hay riesgos: endpoint de solo lectura, sin datos sensibles
- Sin impacto en performance: respuesta estática
