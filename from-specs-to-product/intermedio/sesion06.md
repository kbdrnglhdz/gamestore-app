# 📘 Sesión 6: Workflow expandido – Creación e implementación de `fix-pagination` (3 horas)

## 🎯 Objetivos de la sesión
- Habilitar el perfil expandido de OpenSpec (comandos `new`, `continue`, `ff`).
- Crear un cambio usando `/opsx:new` y completar artefactos con `/opsx:ff` o `/opsx:continue`.
- Implementar el cambio con `/opsx:apply`.
- Verificar y archivar el cambio dentro de la misma sesión.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con especificaciones actualizadas.
- Archivo de investigación `docs/investigations/pagination-bug.md` (Sesión 5).
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                                        | Duración |
| ----------- | ---------------------------------------------------------------- | -------- |
| 0:00 - 0:20 | Habilitar perfil expandido (`openspec config profile`)           | 20 min   |
| 0:20 - 0:40 | Teoría: `new`, `continue`, `ff`                                  | 20 min   |
| 0:40 - 1:10 | Crear cambio con `/opsx:new` y generar artefactos con `/opsx:ff` | 30 min   |
| 1:10 - 2:00 | Implementar con `/opsx:apply`                                    | 50 min   |
| 2:00 - 2:30 | Verificar y archivar                                             | 30 min   |
| 2:30 - 2:50 | Explorar cambio archivado y validar specs                        | 20 min   |
| 2:50 - 3:00 | Cierre y entregables                                             | 10 min   |

---

## ⚙️ Actividad 1: Habilitar el perfil expandido (20 min)

### 1.1 Verificar perfil actual

```bash
openspec config get profile
```

Si no aparece, es `core` por defecto.

### 1.2 Cambiar a perfil custom con todos los workflows

```bash
openspec config profile
```

**Interacción esperada (copiar respuestas):**
```
Current configuration:
  Profile: core
  Delivery: both
  Selected workflows: propose, explore, apply, archive

What would you like to change?
  1) Change delivery + workflows
  2) Change delivery only
  3) Change workflows only
  4) Keep current settings

Select option: 3
```

**Seleccionar workflows (presiona espacio para marcar/desmarcar):**
```
Available workflows (use space to select):
  [x] propose
  [x] explore
  [x] new          ← marcar
  [x] continue     ← marcar
  [x] apply
  [x] ff           ← marcar
  [x] sync
  [x] archive
  [x] bulk-archive
  [x] verify
  [x] onboard

Select workflows to enable: (presiona Enter cuando estén marcados)
```

**Confirmar:**
```
✓ Updated global config
  Profile: custom
  Workflows: propose, explore, new, continue, apply, ff, sync, archive, bulk-archive, verify, onboard
```

### 1.3 Aplicar cambios al proyecto

```bash
openspec update
```

### 1.4 Verificar que los nuevos comandos están disponibles

```bash
# Para Claude Code
ls .claude/skills/ | grep -E "new|continue|ff"

# Para Cursor
ls .cursor/commands/ | grep -E "new|continue|ff"
```

---

## 📖 Actividad 2: Teoría - `new`, `continue`, `ff` (20 min)

**Instructor explica con ejemplos:**

| Comando              | Qué hace                                                      | Cuándo usar                                      |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| `/opsx:new [nombre]` | Crea solo la carpeta del cambio y el archivo `.openspec.yaml` | Quieres control granular, revisar cada artefacto |
| `/opsx:continue`     | Crea el siguiente artefacto disponible (según dependencias)   | Para revisar uno por uno                         |
| `/opsx:ff`           | Crea todos los artefactos de planificación de una vez         | Ya sabes lo que quieres, solo ejecuta            |

**Comparación con `propose`:**
- `propose` = `new` + `ff` en un paso (rápido, poco control)
- `new` + `continue` = máximo control
- `new` + `ff` = balance

**Para hoy:** Usaremos `new` + `ff` porque ya investigamos el problema.

---

## 🚀 Actividad 3: Crear cambio `fix-pagination` (30 min)

### 3.1 Crear el scaffold del cambio

```
/opsx:new fix-pagination
```

**Salida esperada:**
```
AI: Created openspec/changes/fix-pagination/
     Schema: spec-driven
     
     Ready to create: proposal
     Use /opsx:continue or /opsx:ff
```

### 3.2 Verificar el estado inicial

```bash
openspec status --change fix-pagination
```

**Salida:**
```
Change: fix-pagination
Progress: 0/4 artifacts complete
[ ] proposal (ready)
[ ] specs (blocked)
[ ] design (blocked)
[ ] tasks (blocked)
```

### 3.3 Generar todos los artefactos con `/opsx:ff`

```
/opsx:ff fix-pagination
```

**Salida esperada:**
```
AI: Fast-forwarding fix-pagination...
     ✓ Creating proposal.md
     ✓ Creating specs/catalog/spec.md (delta)
     ✓ Creating design.md
     ✓ Creating tasks.md
     All planning artifacts complete!
```

### 3.4 Explorar los artefactos generados

```bash
# Ver el proposal
cat openspec/changes/fix-pagination/proposal.md | head -20

# Ver el delta spec (debería tener MODIFIED)
cat openspec/changes/fix-pagination/specs/catalog/spec.md

# Ver las tareas
cat openspec/changes/fix-pagination/tasks.md
```

### 3.5 Editar el delta spec para que refleje el cambio real (opcional)

Si el delta spec no incluye la corrección del parseo, edítalo:

```bash
code openspec/changes/fix-pagination/specs/catalog/spec.md
```

Asegura que el requirement `Product Pagination` especifique el comportamiento corregido (página 2 devuelve productos 11-20).

---

## ⚙️ Actividad 4: Implementar con `/opsx:apply` (50 min)

### 4.1 Ejecutar apply

```
/opsx:apply fix-pagination
```

La IA leerá `tasks.md` e implementará:

1. Modificar `productController.ts` para parsear `page` y `limit`.
2. Agregar validación.
3. Incluir metadatos en la respuesta.
4. Actualizar frontend (paginación UI).
5. Pruebas.

### 4.2 Verificar progreso en tiempo real

En otra terminal:

```bash
watch -n 2 "grep '\[[x ]\]' openspec/changes/fix-pagination/tasks.md | wc -l"
```

(Para ver cuántas tareas completadas.)

### 4.3 Si la IA se detiene o quieres pausar, no hay problema

El progreso se guarda en `tasks.md`. Puedes volver a ejecutar `apply` luego.

### 4.4 Al finalizar, verificar que todas las tareas están `[x]`

```bash
grep "\[ \]" openspec/changes/fix-pagination/tasks.md
```

No debe mostrar ninguna línea.

---

## ✅ Actividad 5: Verificar y archivar (30 min)

### 5.1 Ejecutar `/opsx:verify`

```
/opsx:verify fix-pagination
```

**Salida esperada:**
```
Verifying fix-pagination...
COMPLETENESS
✓ All tasks complete
CORRECTNESS
✓ Implementation matches spec
COHERENCE
✓ Design decisions followed
Ready to archive.
```

### 5.2 Archivar el cambio

```
/opsx:archive fix-pagination
```

Responde `Y` cuando pregunte.

**Salida:**
```
✓ Synced delta specs to openspec/specs/catalog/spec.md
✓ Moved to openspec/changes/archive/YYYY-MM-DD-fix-pagination/
```

### 5.3 Verificar que ya no está activo

```bash
openspec list --changes
```

No debe aparecer `fix-pagination`.

---

## 🔍 Actividad 6: Explorar resultados (20 min)

### 6.1 Ver spec principal actualizado

```bash
cat openspec/specs/catalog/spec.md | grep -A 20 "Product Pagination"
```

Ahora debe mostrar el comportamiento corregido.

### 6.2 Ver cambio archivado

```bash
ls openspec/changes/archive/ | grep fix-pagination
cat openspec/changes/archive/*fix-pagination*/proposal.md | head -10
```

### 6.3 Probar manualmente la corrección (opcional)

Si el servidor está corriendo:

```bash
curl "http://localhost:3000/api/products?page=1&limit=5"
curl "http://localhost:3000/api/products?page=2&limit=5"
# Deben diferir
```

---

## 📦 Entregables de la sesión

- [ ] Perfil expandido habilitado.
- [ ] Cambio `fix-pagination` creado, implementado y archivado.
- [ ] Spec `catalog/spec.md` actualizado con la corrección.
- [ ] Capacidad de usar `new`, `ff`, `continue`, `apply`, `verify`, `archive`.

---

## ❓ Posibles problemas y soluciones

| Problema                                       | Solución                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| `openspec config profile` no muestra opciones  | Actualizar OpenSpec: `npm update -g @fission-ai/openspec`                |
| Los nuevos comandos no aparecen en la IA       | Ejecutar `openspec update` y reiniciar el asistente.                     |
| `ff` no genera todos los artefactos            | Verificar que el schema está definido y no hay errores en `config.yaml`. |
| La implementación no completa todas las tareas | Ejecutar `apply` nuevamente; si persiste, marcar manualmente como `[x]`. |

---

## 🧠 Nota para el instructor

- Si el grupo ya usaba el perfil expandido, pueden saltarse la Actividad 1.
- Enfatiza la diferencia entre `propose` (todo junto) y `new`+`ff` (similar pero con scaffold explícito).
- Al final, el cambio debe estar archivado; es una sesión autocontenida.