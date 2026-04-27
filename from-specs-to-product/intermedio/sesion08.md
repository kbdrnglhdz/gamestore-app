# 📘 Sesión 8: Verificación y Sincronización (3 horas)

## 🎯 Objetivos de la sesión
- Crear un cambio `add-stock-validation` con `/opsx:propose`.
- Implementar el cambio **con errores intencionales**.
- Usar `/opsx:verify` para detectar los errores.
- Corregir los errores y volver a verificar.
- Usar `/opsx:sync` para fusionar deltas a los specs principales **sin archivar** el cambio.
- Finalmente archivar el cambio.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado.
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                         | Duración |
| ----------- | ------------------------------------------------- | -------- |
| 0:00 - 0:15 | Teoría: `verify` (tres dimensiones) y `sync`      | 15 min   |
| 0:15 - 0:45 | Crear cambio `add-stock-validation` con `propose` | 30 min   |
| 0:45 - 1:15 | Implementar **con errores intencionales**         | 30 min   |
| 1:15 - 1:45 | Ejecutar `verify` y analizar resultados           | 30 min   |
| 1:45 - 2:15 | Corregir errores y volver a verificar             | 30 min   |
| 2:15 - 2:30 | Ejecutar `sync` (fusionar specs sin archivar)     | 15 min   |
| 2:30 - 2:45 | Archivar el cambio                                | 15 min   |
| 2:45 - 3:00 | Cierre y entregables                              | 15 min   |

---

## 📖 Actividad 1: Teoría - `verify` y `sync` (15 min)

**Instructor explica:**

### `/opsx:verify` - tres dimensiones
| Dimensión        | Pregunta                      | Ejemplo de fallo                                  |
| ---------------- | ----------------------------- | ------------------------------------------------- |
| **Completeness** | ¿Está todo implementado?      | Task marcada `[x]` pero código no existe          |
| **Correctness**  | ¿Funciona como se especifica? | Condición de stock incorrecta                     |
| **Coherence**    | ¿Sigue el diseño?             | Usa Redis cuando el diseño decía caché en memoria |

### `/opsx:sync`
- Fusiona los delta specs con los specs principales **sin archivar** el cambio.
- Útil para cambios largos donde otros equipos necesitan ver los specs actualizados.
- El cambio sigue activo después del sync.

**Flujo de hoy:** `propose` → `apply` (con errores) → `verify` → corregir → `verify` → `sync` → `archive`

---

## 🚀 Actividad 2: Crear cambio `add-stock-validation` (30 min)

### 2.1 Ejecutar `/opsx:propose`

```
/opsx:propose add-stock-validation
```

### 2.2 Verificar los artefactos generados

```bash
ls openspec/changes/add-stock-validation/
cat openspec/changes/add-stock-validation/specs/cart/spec.md
```

**El delta spec debe incluir:**
```markdown
## ADDED Requirements

### Requirement: Stock Validation
The system SHALL prevent adding out-of-stock products to cart.

#### Scenario: Product in stock
- GIVEN a product with stock = 5
- WHEN user adds 1 to cart
- THEN item is added successfully

#### Scenario: Product out of stock
- GIVEN a product with stock = 0
- WHEN user attempts to add to cart
- THEN error message "Product out of stock" is shown
- AND cart remains unchanged
```

Si no aparece, edítalo manualmente:

```bash
code openspec/changes/add-stock-validation/specs/cart/spec.md
```

---

## 🐛 Actividad 3: Implementar con errores intencionales (30 min)

### 3.1 Ejecutar `apply` (implementación normal)

```
/opsx:apply add-stock-validation
```

Esperar a que la IA complete la implementación.

### 3.2 Introducir errores intencionales (copiar y pegar)

**Error 1: Condición de stock incorrecta (correctness)**

Abre `backend/src/routes/cart.ts` y **cambia** la condición de validación:

```bash
code backend/src/routes/cart.ts
```

Busca la línea similar a:
```typescript
if (!product || product.stock < quantity) {
```

Cámbiala a:
```typescript
if (!product || product.stock < 0) {   // ❌ ERROR INTENCIONAL
```

**Error 2: Marcar tareas como completas sin implementarlas (completeness)**

```bash
code openspec/changes/add-stock-validation/tasks.md
```

Marca todas las tareas como `[x]`, aunque el frontend no tenga manejo de errores.

### 3.3 Verificar que los errores están presentes

```bash
# Verificar condición incorrecta
grep -n "product.stock < 0" backend/src/routes/cart.ts

# Verificar tasks marcadas
grep "\[x\]" openspec/changes/add-stock-validation/tasks.md | wc -l
```

---

## 🔍 Actividad 4: Ejecutar `verify` (30 min)

### 4.1 Ejecutar verificación

```
/opsx:verify add-stock-validation
```

**Salida esperada (similar a):**
```
Verifying add-stock-validation...

COMPLETENESS
✓ All tasks in tasks.md are checked
⚠ Task "Add error handling in frontend" - no implementation found

CORRECTNESS
✗ CRITICAL: Stock validation condition is incorrect
   Spec: "stock < quantity" should reject when quantity exceeds stock
   Code: "stock < 0" → always false for stock > 0
   Location: backend/src/routes/cart.ts line 23

✗ CRITICAL: No error message shown on frontend
   Spec: "error message 'Product out of stock' is shown"
   Code: No error handling for 400 responses

COHERENCE
✓ Design decisions match implementation

SUMMARY
Critical issues: 2
Warnings: 1
Ready to archive: No (fix critical issues first)
```

### 4.2 Analizar los resultados con los participantes

**Preguntas:**
- ¿Qué error es de completitud? (frontend error handling)
- ¿Qué error es de corrección? (condición `stock < 0`)
- ¿Qué error es de coherencia? (ninguno en este caso)

---

## ✅ Actividad 5: Corregir errores y volver a verificar (30 min)

### 5.1 Corregir condición de stock

```bash
code backend/src/routes/cart.ts
```

Vuelve a cambiar la condición a la correcta:
```typescript
if (!product || product.stock < quantity) {   // ✅ CORRECTO
```

### 5.2 Agregar manejo de error en frontend (si falta)

```bash
code frontend/src/components/AddToCartButton.tsx
```

Agrega (o modifica) el bloque `catch`:
```typescript
catch (error) {
  if (error.response?.status === 400 && 
      error.response?.data?.error === 'Product out of stock') {
    showError('Product out of stock - please check availability');
  } else {
    showError('Failed to add to cart');
  }
}
```

### 5.3 Desmarcar tareas incompletas en `tasks.md` (opcional)

Si la IA no completó alguna tarea, márcala manualmente como `[x]`.

### 5.4 Volver a ejecutar `verify`

```
/opsx:verify add-stock-validation
```

**Salida esperada:**
```
Verifying add-stock-validation...
COMPLETENESS: ✓
CORRECTNESS: ✓
COHERENCE: ✓
Critical issues: 0
Ready to archive: Yes
```

---

## 🔄 Actividad 6: Sincronización (`sync`) sin archivar (15 min)

### 6.1 Ejecutar `sync`

```
/opsx:sync add-stock-validation
```

**Salida esperada:**
```
AI: Syncing add-stock-validation delta specs...
     Reading: openspec/changes/add-stock-validation/specs/cart/spec.md
     Target:  openspec/specs/cart/spec.md

     Changes to apply:
     ✓ ADDED: Stock Validation requirement (2 scenarios)

     ✓ openspec/specs/cart/spec.md updated

     Change remains active. Run /opsx:archive when ready.
```

### 6.2 Verificar que los specs principales se actualizaron

```bash
cat openspec/specs/cart/spec.md | grep -A 15 "Stock Validation"
```

### 6.3 Verificar que el cambio sigue activo

```bash
openspec list --changes
# add-stock-validation debe seguir apareciendo
```

---

## 📦 Actividad 7: Archivar el cambio (15 min)

### 7.1 Archivar (ahora sí)

```
/opsx:archive add-stock-validation
```

Responde `Y` cuando pregunte.

**Salida:**
```
✓ Synced delta specs (already up to date)
✓ Moved to openspec/changes/archive/YYYY-MM-DD-add-stock-validation/
```

### 7.2 Verificar que ya no está activo

```bash
openspec list --changes
```

---

## ✅ Actividad 8: Verificación final (5 min)

```bash
# Validar todos los specs
openspec validate --specs

# Ver el spec actualizado con stock validation
cat openspec/specs/cart/spec.md | grep -A 10 "Stock Validation"
```

---

## 📦 Entregables de la sesión

- [ ] Cambio `add-stock-validation` creado.
- [ ] Verificación fallida (errores detectados).
- [ ] Errores corregidos y verificación exitosa.
- [ ] Sincronización de specs (`sync`) sin archivar.
- [ ] Cambio archivado.
- [ ] Comprensión de las tres dimensiones de `verify`.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                  | Solución                                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `verify` no detecta el error de condición | Asegurar que el delta spec tiene el requirement correcto y que el código está en la ruta esperada. |
| `sync` dice "no changes to apply"         | Verificar que el delta spec tiene `## ADDED/MODIFIED/REMOVED` y que el spec principal existe.      |
| El frontend no tiene `showError`          | Crear una función simple: `alert()` o `console.error()`.                                           |
| `archive` pregunta de nuevo por sync      | No hay problema; confirmar y continuar.                                                            |

---

## 📚 Recursos adicionales

- [Comando `/opsx:verify`](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxverify)
- [Comando `/opsx:sync`](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxsync)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida: el cambio se crea, se implementa (con errores), se corrige, se sincroniza y se archiva dentro de las 3 horas.
- El error intencional de la condición `stock < 0` es muy didáctico porque el `verify` lo detecta claramente.
- Si el grupo es muy rápido, pueden crear un segundo cambio y practicar `sync` nuevamente.