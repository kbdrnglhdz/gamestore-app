# 📘 Sesión 4: Finalización, verificación y archive de `fix-session-timeout` (3 horas)

## 🎯 Objetivos de la sesión
- Completar las tareas pendientes del frontend para `fix-session-timeout`.
- Usar `/opsx:verify` para validar la implementación contra los artefactos.
- Corregir cualquier error detectado por la verificación.
- Archivar el cambio con `/opsx:archive`.
- Verificar que los delta specs se fusionaron correctamente en los specs principales.
- Explorar el cambio archivado en `changes/archive/`.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con el cambio `fix-session-timeout` parcialmente implementado (backend completado en la Sesión 3).
- Terminal abierta en la raíz del proyecto.
- Editor de código.
- Asistente IA configurado.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                             | Duración |
| ----------- | ----------------------------------------------------- | -------- |
| 0:00 - 0:15 | Verificación del estado actual del cambio             | 15 min   |
| 0:15 - 0:30 | Teoría: `/opsx:verify` y `/opsx:archive`              | 15 min   |
| 0:30 - 1:15 | Completar frontend (si no se hizo en sesión anterior) | 45 min   |
| 1:15 - 1:45 | Ejecutar `/opsx:verify` y corregir errores            | 30 min   |
| 1:45 - 2:30 | Archivar el cambio con `/opsx:archive`                | 45 min   |
| 2:30 - 2:50 | Verificar la fusión de specs y el archive             | 20 min   |
| 2:50 - 3:00 | Cierre y entregables                                  | 10 min   |

---

## 🔧 Actividad 1: Verificación del estado actual (15 min)

### 1.1 Listar cambios activos

```bash
openspec list --changes
```

**Salida esperada:** `fix-session-timeout` debe aparecer.

### 1.2 Ver el progreso de las tareas

```bash
openspec status --change fix-session-timeout
```

**Salida esperada (si el backend está completo y el frontend pendiente):**
```
Change: fix-session-timeout
Progress: 4/4 artifacts complete
[x] proposal
[x] specs
[x] design
[x] tasks

Implementation: 4/6 tasks complete
```

### 1.3 Ver las tareas pendientes específicamente

```bash
grep "\[ \]" openspec/changes/fix-session-timeout/tasks.md
```

**Salida esperada (ejemplo):**
```
- [ ] 2.1 Agregar interceptor para refresh automático
- [ ] 2.2 Mostrar indicador de sesión expirando
```

---

## 📖 Actividad 2: Teoría - `/opsx:verify` y `/opsx:archive` (15 min)

**Instructor explica:**

- **`/opsx:verify`**: Valida la implementación real contra los artefactos.  
  - Verifica **completitud** (todas las tareas hechas), **corrección** (el código hace lo que dice el spec) y **coherencia** (sigue el diseño).
  - Reporta errores **CRITICAL**, **WARNING** o **SUGGESTION**.
  - No modifica nada, solo informa.

- **`/opsx:archive`**: Finaliza el cambio.
  - Fusiona los delta specs con los specs principales (`openspec/specs/`).
  - Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<nombre>/`.
  - Pregunta si deseas sincronizar los specs si no se han sincronizado antes.

**Flujo recomendado:** `apply` → `verify` → `archive`.

---

## ⚙️ Actividad 3: Completar el frontend (45 min)

*Si el frontend ya se completó en la sesión anterior, salta a la Actividad 4.*

### 3.1 Ejecutar `/opsx:apply` para continuar

En el chat del asistente IA:

```
/opsx:apply fix-session-timeout
```

La IA implementará las tareas pendientes del frontend (interceptor y UI).

### 3.2 Verificar que todas las tareas estén completas

```bash
grep "\[ \]" openspec/changes/fix-session-timeout/tasks.md
```

No debe mostrar ninguna línea.

### 3.3 Ver el estado final de las tareas

```bash
openspec status --change fix-session-timeout
```

**Salida esperada:**
```
Implementation: 6/6 tasks complete
```

---

## ✅ Actividad 4: Ejecutar `/opsx:verify` y corregir errores (30 min)

### 4.1 Ejecutar la verificación

En el chat del asistente IA:

```
/opsx:verify fix-session-timeout
```

**Salida esperada (si todo está bien):**
```
Verifying fix-session-timeout...

COMPLETENESS
✓ All 6 tasks in tasks.md are checked
✓ All requirements in specs have corresponding code

CORRECTNESS
✓ Implementation matches spec intent
✓ Edge cases from scenarios are handled

COHERENCE
✓ Design decisions reflected in code structure

SUMMARY
Critical issues: 0
Warnings: 0
Ready to archive: Yes
```

### 4.2 Si hay errores o advertencias (simulación)

El instructor puede inyectar un error intencional para mostrar cómo se corrige.

**Ejemplo de error común:** El interceptor de frontend no maneja el refresh automático.

**Corrección:** Editar el archivo correspondiente (ej. `frontend/src/services/api.ts`) y luego ejecutar `verify` nuevamente.

### 4.3 Verificar en formato JSON (opcional)   //ELMINAR

```bash
openspec verify --change fix-session-timeout --json | jq '.summary'
```

---

## 📦 Actividad 5: Archivar el cambio (45 min)

### 5.1 Ejecutar `/opsx:archive`

En el chat del asistente IA:

```
/opsx:archive fix-session-timeout
```

**Interacción esperada:**
```
AI: Archiving fix-session-timeout...

Artifact status:
✓ proposal.md exists
✓ specs/ exists (delta spec found)
✓ design.md exists
✓ tasks.md exists (6/6 tasks complete)

Delta specs: Ready to sync
→ This will modify openspec/specs/auth/spec.md
→ MODIFIED: Session Persistence (15min → 60min)

Continue with archive? (Y/n)
```

Responde: `Y`

```
AI: ✓ Synced delta specs to openspec/specs/auth/spec.md
✓ Moved change to openspec/changes/archive/2026-04-23-fix-session-timeout/

Change archived successfully!
```

### 5.2 Verificar que el cambio ya no está activo

```bash
openspec list --changes
```

**Salida esperada:** `No active changes found.`

### 5.3 Ver el cambio en el archivo

```bash
ls openspec/changes/archive/
```

Deberías ver una carpeta con nombre `2026-04-23-fix-session-timeout` (la fecha será la actual).

---

## 🔍 Actividad 6: Verificar la fusión de specs y el archive (20 min)

### 6.1 Ver el spec principal actualizado

```bash
cat openspec/specs/auth/spec.md | grep -A 20 "Session Persistence"
```

**Ahora debería mostrar 60 minutos de inactividad y dos escenarios (activo + timeout).**

### 6.2 Verificar que otros requirements no se modificaron

```bash
cat openspec/specs/auth/spec.md | grep "### Requirement:" 
```

Deben seguir apareciendo `User Login`, `Password Storage` y `Logout (Missing)` (aunque este último siga como gap).

### 6.3 Explorar el contenido del archive

```bash
ls -la openspec/changes/archive/2026-04-23-fix-session-timeout/
cat openspec/changes/archive/2026-04-23-fix-session-timeout/proposal.md | head -10
```

Todo el contexto se preserva.

### 6.4 Validar todos los specs después del merge

```bash
openspec validate --specs
```

Debe pasar sin errores.

---

## 📦 Entregables de la sesión

Al finalizar la sesión, cada participante debe tener:

- [ ] Cambio `fix-session-timeout` completamente implementado (frontend + backend).
- [ ] Verificación exitosa con `/opsx:verify` (sin errores críticos).
- [ ] Cambio archivado en `changes/archive/`.
- [ ] Spec principal `auth/spec.md` actualizado con la nueva duración de sesión (60 min).
- [ ] Comprensión del flujo completo: `propose` → `apply` → `verify` → `archive`.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                           | Solución                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `verify` reporta errores críticos                  | Revisar la implementación; corregir el código y volver a ejecutar `verify`.                         |
| El archive dice "tasks incompletas"                | Asegurar que todas las tareas estén marcadas como `[x]` en `tasks.md`.                              |
| El delta spec no encuentra el requirement original | Verificar que el nombre del requirement en el delta coincida exactamente con el del spec principal. |
| El cambio no se mueve a `archive/`                 | Ejecutar `openspec archive fix-session-timeout --yes` si hay problemas interactivos.                |
| Quiero des-archivar (no recomendado)               | Mover manualmente la carpeta de `archive/` a `changes/` y eliminar el prefijo de fecha.             |

---

## 📚 Recursos adicionales (para el participante)

- [Comando `/opsx:verify` - documentación oficial](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxverify)
- [Comando `/opsx:archive` - documentación oficial](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxarchive)
- [Cómo funcionan los delta specs](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md#delta-specs)

---

## 🧠 Nota para el instructor

- Si el grupo no completó el frontend en la sesión anterior, dedica más tiempo a la Actividad 3 (hasta 1 hora). Ajusta el cronograma recortando la teoría o la exploración final.
- Si todo está bien, el archive es rápido. Aprovecha para mostrar el contenido del archive y cómo queda el spec principal.
- Enfatiza que el `design.md` y otros artefactos no se copian a `specs/`, solo se preservan en el archive.