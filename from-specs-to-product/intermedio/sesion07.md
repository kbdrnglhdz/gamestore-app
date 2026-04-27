# 📘 Sesión 7: Fast‑Forward y Bulk Archive (3 horas)

## 🎯 Objetivos de la sesión
- Usar `/opsx:new` + `/opsx:ff` para crear cambios pequeños de forma rápida.
- Implementar cambios simples con `/opsx:apply`.
- Archivar **varios cambios a la vez** con `/opsx:bulk-archive`.
- Manejar conflictos simples entre cambios (si ocurren).
- Comprender cuándo usar bulk archive vs archive individual.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado y perfil expandido habilitado (Sesión 6).
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                         | Duración |
| ----------- | ------------------------------------------------- | -------- |
| 0:00 - 0:15 | Teoría: `ff` y `bulk-archive`                     | 15 min   |
| 0:15 - 0:45 | Crear tres cambios pequeños con `new` + `ff`      | 30 min   |
| 0:45 - 1:45 | Implementar los tres cambios con `apply`          | 60 min   |
| 1:45 - 2:15 | Ejecutar `bulk-archive` para archivarlos juntos   | 30 min   |
| 2:15 - 2:45 | Verificar specs actualizados y cambios archivados | 30 min   |
| 2:45 - 3:00 | Cierre y entregables                              | 15 min   |

---

## 📖 Actividad 1: Teoría - `ff` y `bulk-archive` (15 min)

**Instructor explica:**

### Fast‑forward (`/opsx:ff`)
- Crea **todos los artefactos de planificación** de una sola vez (proposal, specs, design, tasks).
- Requiere haber creado el scaffold con `/opsx:new`.
- Ideal para cambios pequeños y bien entendidos.

**Comparación:**
| Comando          | Velocidad  | Control                        |
| ---------------- | ---------- | ------------------------------ |
| `/opsx:continue` | Lenta      | Alto (uno por uno)             |
| `/opsx:ff`       | Rápida     | Bajo (todos juntos)            |
| `/opsx:propose`  | Muy rápida | Bajo (scaffold + ff implícito) |

### Bulk Archive (`/opsx:bulk-archive`)
- Archiva **múltiples cambios completados** en un solo comando.
- Detecta conflictos entre cambios (si dos tocan el mismo spec).
- Archiva en orden cronológico (por fecha de creación).
- Pregunta antes de proceder.

**Cuándo usarlo:**
- Tienes 3 o más cambios completados.
- Los cambios tocan diferentes dominios (poco conflicto).
- Quieres ahorrar tiempo.

---

## 🚀 Actividad 2: Crear tres cambios pequeños (30 min)

Vamos a crear tres cambios que corrigen bugs menores y no entran en conflicto entre sí.

### 2.1 Cambio 1: `add-logout-button` (agrega botón de cierre de sesión)

```
/opsx:new add-logout-button
/opsx:ff add-logout-button
```

Verificar que se crearon los artefactos:
```bash
ls openspec/changes/add-logout-button/
```

### 2.2 Cambio 2: `fix-price-filter` (corrige filtro de precios - orden numérico)

```
/opsx:new fix-price-filter
/opsx:ff fix-price-filter
```

### 2.3 Cambio 3: `improve-error-messages` (mejora mensajes de error en login)

```
/opsx:new improve-error-messages
/opsx:ff improve-error-messages
```

### 2.4 Listar los cambios activos

```bash
openspec list --changes
```

**Salida esperada:**
```
Active changes:
  add-logout-button
  fix-price-filter
  improve-error-messages
```

---

## ⚙️ Actividad 3: Implementar los tres cambios (60 min)

**Instructor:** Vamos a implementar cada cambio con `/opsx:apply`. Pueden hacerse en paralelo o secuencialmente. La IA los implementará uno tras otro.

### 3.1 Implementar `add-logout-button`

```
/opsx:apply add-logout-button
```

Esperar a que complete todas las tareas.

### 3.2 Implementar `fix-price-filter`

```
/opsx:apply fix-price-filter
```

### 3.3 Implementar `improve-error-messages`

```
/opsx:apply improve-error-messages
```

### 3.4 Verificar que todos tienen las tareas completas

```bash
for change in add-logout-button fix-price-filter improve-error-messages; do
  echo "=== $change ==="
  grep "\[ \]" openspec/changes/$change/tasks.md | wc -l
done
```

Debe mostrar `0` para los tres.

---

## 📦 Actividad 4: Bulk Archive (30 min)

### 4.1 Ejecutar bulk archive

```
/opsx:bulk-archive
```

**Interacción esperada:**
```
AI: Found 3 completed changes:
     - add-logout-button (tasks complete)
     - fix-price-filter (tasks complete)
     - improve-error-messages (tasks complete)

     Checking for spec conflicts...
     ✓ No conflicts detected (changes touch different domains)

     Changes will be archived in creation order:
     1. add-logout-button
     2. fix-price-filter
     3. improve-error-messages

     Archive all 3 changes? (Y/n)
```

Responde: `Y`

```
AI: Archiving add-logout-button...
     ✓ Synced delta specs
     ✓ Moved to archive/YYYY-MM-DD-add-logout-button/
     
     Archiving fix-price-filter...
     ✓ Synced delta specs
     ✓ Moved to archive/YYYY-MM-DD-fix-price-filter/
     
     Archiving improve-error-messages...
     ✓ Synced delta specs
     ✓ Moved to archive/YYYY-MM-DD-improve-error-messages/
     
     ✓ 3 changes archived successfully!
```

### 4.2 Verificar que no hay cambios activos

```bash
openspec list --changes
```

Debe estar vacío.

### 4.3 Ver los cambios en el archivo

```bash
ls openspec/changes/archive/ | grep -E "add-logout|fix-price|improve-error"
```

---

## 🔍 Actividad 5: Verificar resultados (30 min)

### 5.1 Ver especificaciones actualizadas

Cada cambio debió modificar distintos dominios:

```bash
# add-logout-button modificó auth (agregó logout)
cat openspec/specs/auth/spec.md | grep -A 5 "Logout"

# fix-price-filter modificó catalog (filtro numérico)
cat openspec/specs/catalog/spec.md | grep -A 10 "Price Filter"

# improve-error-messages modificó auth (mensajes de error)
cat openspec/specs/auth/spec.md | grep -A 5 "error message"
```

### 5.2 Validar todas las especificaciones

```bash
openspec validate --specs
```

### 5.3 Simular un conflicto (opcional, si hay tiempo)

**Instructor:** ¿Qué pasaría si dos cambios modificaran el mismo requirement?

```bash
# Crear dos cambios que toquen auth/session
/opsx:new change-a
/opsx:new change-b
# Editar sus delta specs para modificar el mismo requirement
# Luego implementar solo uno
# Ejecutar bulk-archive y ver cómo detecta el conflicto
```

**Explicación:** OpenSpec detectará el conflicto y preguntará cómo resolverlo.

---

## 📦 Entregables de la sesión

- [ ] Tres cambios creados con `new` + `ff`.
- [ ] Tres cambios implementados con `apply`.
- [ ] Bulk archive exitoso de los tres cambios.
- [ ] Especificaciones principales actualizadas.
- [ ] Comprensión de `ff` y `bulk-archive`.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                | Solución                                                                                |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| `ff` no genera artefactos               | Verificar que el schema es `spec-driven` y que `openspec/config.yaml` no tiene errores. |
| `apply` no completa tareas              | Ejecutar nuevamente; si la IA se bloquea, marcar manualmente `[x]` en `tasks.md`.       |
| Bulk archive dice "cambios incompletos" | Revisar que todos los `tasks.md` no tengan `[ ]`.                                       |
| Conflicto durante bulk archive          | Archivar individualmente los cambios conflictivos o resolver manualmente los deltas.    |

---

## 📚 Recursos adicionales

- [Comando `/opsx:ff`](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxff)
- [Comando `/opsx:bulk-archive`](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxbulk-archive)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida: los tres cambios se completan y archivan dentro de las 3 horas.
- Si el grupo es lento, prioriza que al menos dos cambios lleguen a bulk archive.
- El ejercicio opcional de conflicto es para grupos avanzados o si sobra tiempo.