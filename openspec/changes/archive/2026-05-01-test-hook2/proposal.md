## Why

Se requiere un segundo endpoint de prueba para verificar hooks y scripts automatizados. Este endpoint servirá como otra herramienta de diagnóstico para pruebas de integración continua.

## What Changes

- Agregar un endpoint GET que devuelva el mensaje "prueba de hook2"
- Endpoint público sin autenticación requerida

## Capabilities

### New Capabilities
- `hook2-test-endpoint`: Endpoint de prueba que devuelve el mensaje "prueba de hook2".

### Modified Capabilities
_(ninguno)_

## Impact

- **Backend**: Nuevo archivo de ruta en `backend/src/routes/hook2-test.ts` con un endpoint GET.
- **Frontend**: No requiere cambios.
- **Database**: No requiere cambios.

## Risks

- **Riesgo**: Endpoint público expuesto en producción.
  **Mitigación**: Es un endpoint de solo lectura que no expone datos sensibles.

## Complexity

Baja
