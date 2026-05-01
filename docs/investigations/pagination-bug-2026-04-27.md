# Investigación: Bug de Paginación del Catálogo

**Fecha:** 2026-04-27  
**Issue:** `/api/products?page=2` devuelve los mismos productos que `page=1`

---

## Resumen Ejecutivo

La paginación está rota. Todas las páginas devuelven los mismos productos (los primeros 10) en lugar de productos únicos por página.

---

## Causa Raíz

**Ubicación:** `backend/src/routes/products.ts:48`

```typescript
// Línea 48 - skip comentado
prisma.product.findMany({
  where,
  // skip: skip,  ← BUG: No se aplica el offset
  take: limitNum,
  orderBy
});
```

El cálculo de `skip` es correcto (línea 16):
```typescript
const skip = (pageNum - 1) * limitNum;  // ✓ Cálculo correcto
```

Pero el valor **nunca se usa** en la consulta Prisma.

---

## Diagrama de Flujo: Actual vs Correcto

### Flujo Actual (BUGGY)

```
Petición: /api/products?page=2
         │
         ▼
page=2, limit=10
         │
         ▼
skip = (2-1)*10 = 10  ✓ cálculo correcto
         │
         ▼
prisma.findMany({
  // skip: skip,  ← ⚠️ COMENTADO
  take: 10,
  orderBy: { createdAt: 'desc' }
})
         │
         ▼
RESULTADO: productos 1-10 (siempre los mismos)
```

### Flujo Correcto

```
Petición: /api/products?page=2
         │
         ▼
page=2, limit=10
         │
         ▼
skip = (2-1)*10 = 10
         │
         ▼
prisma.findMany({
  skip: 10,  ← ✅ Se usa el offset
  take: 10,
  orderBy: { createdAt: 'desc', id: 'asc' }
})
         │
         ▼
RESULTADO: productos 11-20 (página correcta)
```

---

## Problemas Adicionales

### Backend
| Problema | Ubicación | Severidad |
|----------|-----------|-----------|
| Orden no determinista | `products.ts:37` - Falta `id` en orderBy | 🟡 Medio |

### Frontend (`frontend/src/pages/Products.tsx`)
| Problema | Ubicación | Severidad |
|----------|-----------|-----------|
| 100+ botones de página | Línea 113 | 🟡 Medio |
| Sin prev/next | Línea 112-122 | 🟡 Bajo |
| Sin indicador de rango | - | 🟡 Bajo |

---

## Soluciones Propuestas

| # | Solución | Esfuerzo | Impacto |
|---|----------|----------|---------|
| 1 | Descomentar `skip` en `products.ts:48` | 🔴 Mínimo | 🔴 Crítico |
| 2 | Agregar `id` a `orderBy: { createdAt: 'desc', id: 'asc' }` | 🟡 Bajo | 🟡 Medio |
| 3 | Agregar paginación con prev/next en frontend | 🟡 Medio | 🟢 Medio |

---

## Verificación

```bash
# Página 1
curl "http://localhost:3001/api/products?page=1&limit=3"

# Página 2 (debería dar diferentes productos)
curl "http://localhost:3001/api/products?page=2&limit=3"

# Ambos retornan los mismos productos → BUG confirmado
```

---

## Referencias

- `backend/src/routes/products.ts` - Bug de paginación
- `frontend/src/pages/Products.tsx` - UI de paginación
- `backend/prisma/schema.prisma` - Modelo Product