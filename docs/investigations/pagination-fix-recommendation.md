# Recomendación: Corrección del Bug de Paginación

**Fecha:** 2026-04-27
**Estado:** Pendiente de implementación

---

## Cambios Requeridos

### 1. Backend: Corregir paginación (CRÍTICO)

**Archivo:** `backend/src/routes/products.ts`

```diff
- // skip: skip, // BUG: This should work but page 2 doesn't
+ skip: skip,
```

**Mejor práctica** - Agregar orden determinista:
```diff
- orderBy: { createdAt: 'desc' }
+ orderBy: { createdAt: 'desc', id: 'asc' }
```

---

### 2. Frontend: Mejorar UI de paginación (OPCIONAL)

**Archivo:** `frontend/src/pages/Products.tsx`

Agregar navegación prev/next y limitar botones visibles:

```typescript
// En lugar de mostrar todos los botones:
// {Array.from({ length: totalPages }, ...)}

// Mostrar máximo 5 botones con prev/next
const maxVisiblePages = 5;
const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
```

---

## Plan de Implementación

| Paso | Descripción | Prioridad |
|------|-------------|-----------|
| 1 | Descomentar `skip` en products.ts | Crítico |
| 2 | Agregar `id` a orderBy | Medio |
| 3 | (Opcional) Mejorar UI frontend | Medio |

---

## Verificación Post-Corrección

```bash
# Verificar respuesta diferentes
curl "http://localhost:3001/api/products?page=1&limit=3"
# → [{"id":1,"name":"..."},{"id":2,...},{"id":3,...}]

curl "http://localhost:3001/api/products?page=2&limit=3"
# → [{"id":4,"name":"..."},{"id":5,...},{"id":6,...}]  ✓ Diferentes!
```