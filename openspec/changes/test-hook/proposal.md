## Why

Se requiere un endpoint simple para pruebas de hooks y verificación de funcionamiento del servidor. Este endpoint servirá como endpoint de diagnóstico para pruebas de integración.

## What Changes

- Agregar un endpoint GET que devuelva el mensaje "Prueba de hook"
- Endpoint público sin autenticación requerida

## Capabilities

### New Capabilities
- `hook-test-endpoint`: Endpoint de prueba que devuelve el mensaje "Prueba de hook".

### Modified Capabilities
_(ninguno)_

## Impact

- **Backend**: Nuevo archivo de ruta en `backend/src/routes/hook-test.ts` con un endpoint GET.
- **Frontend**: No requiere cambios.
- **Database**: No requiere cambios.

## Risks

- **Riesgo**: Endpoint público expuesto en producción.
  **Mitigación**: Es un endpoint de solo lectura que no expone datos sensibles.

## Complexity

Baja
