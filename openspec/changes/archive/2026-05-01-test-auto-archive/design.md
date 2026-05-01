## Context

Se necesita un endpoint simple de prueba para verificar que el servidor está funcionando y para pruebas de scripts automatizados.

## Goals / Non-Goals

**Goals:**
- Crear endpoint GET en `/api/test-script` que devuelva JSON con mensaje "Probando scripts"
- Endpoint público sin autenticación

**Non-Goals:**
- No incluye lógica de negocio
- No requiere base de datos
- No requiere frontend

## Decisions

| Decisión | Alternativas | Por qué |
|----------|-------------|---------|
| Ruta simple en nuevo archivo `test.ts` | Agregar a `auth.ts` o `admin.ts` | Separar claramente pruebas del código de producción |
| Respuesta JSON simple | Respuesta de texto plano | Mantener consistencia con el resto de la API (todas usan JSON) |
| Endpoint público sin auth | Proteger con API key | Es solo un endpoint de prueba, no hay datos sensibles |

## Risks / Trade-offs

- **[Riesgo]** Endpoint accesible públicamente → Solo devuelve mensaje estático, sin riesgo de seguridad

## Migration Plan

N/A - No requiere migración

## Open Questions

Ninguna

## Files to Create/Modify

### New Files
- `backend/src/routes/test.ts` (nuevo - endpoint de prueba)
- `openspec/changes/test-auto-archive/specs/test-endpoint/spec.md` (spec)

### Modified Files
- `backend/src/index.ts` o archivo principal (registrar nueva ruta)

## Security & Performance

- No hay riesgos de seguridad: endpoint de solo lectura, sin datos sensibles
- Sin impacto en performance: respuesta estática en memoria
