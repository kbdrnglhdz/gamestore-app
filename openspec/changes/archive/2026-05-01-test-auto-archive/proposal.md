## Why

Se requiere un endpoint simple para pruebas de scripts y verificación de funcionamiento del servidor. Este endpoint servirá como endpoint de diagnóstico básico.

## What Changes

- Agregar un endpoint GET que devuelva el mensaje "Probando scripts"
- Endpoint público sin autenticación requerida

## Capabilities

### New Capabilities
- `test-endpoint`: Endpoint de prueba que devuelve el mensaje "Probando scripts".

### Modified Capabilities
_(ninguno)_

## Impact

- **Backend**: Nuevo archivo de ruta en `backend/src/routes/test.ts` con un endpoint GET.
- **Frontend**: No requiere cambios.
- **Database**: No requiere cambios.

## Risks

- **Riesgo**: Endpoint público expuesto en producción.
  **Mitigación**: Es un endpoint de solo lectura que no expone datos sensibles; se puede proteger con variable de entorno si es necesario.

## Complexity

Baja
