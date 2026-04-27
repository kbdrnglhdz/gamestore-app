# 📘 Sesión 9: Cambios Paralelos y Conflictos (3 horas)

## 🎯 Objetivos de la sesión
- Crear dos cambios que modifiquen el **mismo requirement** del spec `auth/spec.md`.
- Implementar **solo uno** de los cambios.
- Detectar el conflicto durante el archive.
- Resolver el conflicto manualmente (actualizando el delta del segundo cambio).
- Archivar ambos cambios exitosamente.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado.
- Especificación `auth/spec.md` con el requirement `Session Persistence` (de sesiones anteriores).
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                             | Duración |
| ----------- | ----------------------------------------------------- | -------- |
| 0:00 - 0:15 | Teoría: conflictos en cambios paralelos               | 15 min   |
| 0:15 - 0:45 | Crear Cambio A: `update-session-1hour`                | 30 min   |
| 0:45 - 1:15 | Crear Cambio B: `update-session-30min`                | 30 min   |
| 1:15 - 1:45 | Implementar solo el Cambio A                          | 30 min   |
| 1:45 - 2:15 | Intentar archivar ambos y detectar conflicto          | 30 min   |
| 2:15 - 2:45 | Resolver conflicto (actualizar delta de B) y archivar | 30 min   |
| 2:45 - 3:00 | Cierre y entregables                                  | 15 min   |

---

## 📖 Actividad 1: Teoría - Conflictos en cambios paralelos (15 min)

**Instructor explica:**

### ¿Cuándo hay conflicto?
Dos cambios tienen conflicto si **modifican el mismo requirement** (no solo el mismo archivo).  
Ejemplo: Ambos cambios tienen `## MODIFIED Requirements` con `### Requirement: Session Persistence`.

### ¿Cómo detecta OpenSpec el conflicto?
- Durante `openspec validate --changes` (puede advertir).
- Durante `/opsx:bulk-archive` o `archive` individual.
- El CLI inspecciona el código base para ver qué está realmente implementado.

### Estrategias de resolución
| Caso                               | Solución                                           |
| ---------------------------------- | -------------------------------------------------- |
| Un cambio implementado, el otro no | Descartar el no implementado o actualizar su delta |
| Ambos implementados, compatibles   | OpenSpec puede fusionar automáticamente            |
| Ambos implementados, incompatibles | Resolver manual: editar uno de los deltas          |

**Hoy:** Simularemos el primer caso.

---

## 🚀 Actividad 2: Crear Cambio A - `update-session-1hour` (30 min)

### 2.1 Crear el cambio

```
/opsx:propose update-session-1hour
```

### 2.2 Verificar el delta spec generado

```bash
cat openspec/changes/update-session-1hour/specs/auth/spec.md
```

**Debe tener:**
```markdown
## MODIFIED Requirements

### Requirement: Session Persistence
The system SHALL maintain session for 60 minutes of inactivity.
```

Si no es así, edítalo manualmente:

```bash
code openspec/changes/update-session-1hour/specs/auth/spec.md
```

Asegúrate de que el requirement se llame exactamente `Session Persistence` (como está en `openspec/specs/auth/spec.md`).

### 2.3 Verificar el estado

```bash
openspec status --change update-session-1hour
```

---

## 🚀 Actividad 3: Crear Cambio B - `update-session-30min` (30 min)

### 3.1 Crear el cambio

```
/opsx:propose update-session-30min
```

### 3.2 Editar el delta spec para que también modifique `Session Persistence`

```bash
code openspec/changes/update-session-30min/specs/auth/spec.md
```

Reemplaza el contenido con:

```markdown
# Delta for Auth

## MODIFIED Requirements

### Requirement: Session Persistence
The system SHALL maintain session for 30 minutes of inactivity.

#### Scenario: Inactivity timeout
- GIVEN an authenticated user
- WHEN 30 minutes pass without activity
- THEN the session expires
```

### 3.3 Verificar que ambos cambios están activos

```bash
openspec list --changes
```

**Salida:**
```
Active changes:
  update-session-1hour
  update-session-30min
```

---

## ⚙️ Actividad 4: Implementar solo el Cambio A (30 min)

### 4.1 Implementar `update-session-1hour`

```
/opsx:apply update-session-1hour
```

La IA modificará el código para que la sesión expire a los 60 minutos.

### 4.2 Verificar que el Cambio A está completo

```bash
openspec status --change update-session-1hour
# Debe mostrar Implementation: X/X tasks complete
```

### 4.3 NO implementar el Cambio B (déjalo como está)

---

## ⚠️ Actividad 5: Intentar archivar y detectar conflicto (30 min)

### 5.1 Intentar archivar el Cambio A (debería funcionar)

```
/opsx:archive update-session-1hour --yes
```

### 5.2 Intentar archivar el Cambio B

```
/opsx:archive update-session-30min
```

**Interacción esperada:**
```
AI: Archiving update-session-30min...

     Artifact status: OK

     Delta specs: MODIFIED Session Persistence (30 minutes)

     ⚠️ WARNING: Main spec already has Session Persistence with 60 minutes.
     The implementation in code reflects 60 minutes, not 30.
     
     Do you want to update this change's delta to match the current spec? (Y/n)
```

**Responde:** `Y`

```
AI: Updated delta spec to 60 minutes.
     ✓ Synced (no changes, already up to date)
     ✓ Moved to archive/YYYY-MM-DD-update-session-30min/
```

### 5.3 Explicación

OpenSpec detectó que el código implementa 60 minutos (del Cambio A), por lo que el delta de 30 minutos es incorrecto. Ofrece actualizarlo automáticamente.

---

## 🔧 Actividad 6: Resolución manual alternativa (si no hay opción automática) (30 min)

### 6.1 Simular un conflicto más complejo

Para este caso, vamos a editar manualmente el delta del Cambio B para que coincida con 60 minutos.

```bash
code openspec/changes/update-session-30min/specs/auth/spec.md
```

Cambia `30 minutes` por `60 minutes` en todo el archivo.

### 6.2 Validar el cambio modificado

```bash
openspec validate update-session-30min
```

### 6.3 Archivar nuevamente

```
/opsx:archive update-session-30min --yes
```

Ahora debería funcionar sin advertencias.

---

## ✅ Actividad 7: Verificar resultados finales (15 min)

### 7.1 Ver que ambos cambios están en archive

```bash
ls openspec/changes/archive/ | grep update-session
```

### 7.2 Ver spec principal actualizado

```bash
cat openspec/specs/auth/spec.md | grep -A 10 "Session Persistence"
```

Debe mostrar **60 minutes** (el valor del Cambio A).

### 7.3 Listar cambios activos (debe estar vacío)

```bash
openspec list --changes
```

---

## 📦 Entregables de la sesión

- [ ] Dos cambios creados y modificando el mismo requirement.
- [ ] Implementación solo del Cambio A.
- [ ] Conflicto detectado durante archive del Cambio B.
- [ ] Resolución del conflicto (automática o manual).
- [ ] Ambos cambios archivados exitosamente.
- [ ] Spec principal con `60 minutes`.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                           | Solución                                                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Los deltas no se generan con `Session Persistence` | Editar manualmente para que coincida exactamente con el nombre del spec principal.                        |
| Al archivar B no aparece la opción de actualizar   | Es porque el delta ya es idéntico al spec principal; simplemente archiva sin cambios.                     |
| Quiero un conflicto más real                       | Implementa ambos cambios (50% y 60 minutos) y luego intenta archivar; OpenSpec preguntará cuál prevalece. |

---

## 📚 Recursos adicionales

- [Manejo de conflictos en OpenSpec](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md#parallel-changes)
- [Comando `archive`](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxarchive)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida: los dos cambios se crean, se implementa solo uno, se detecta el conflicto y se resuelve.
- Si el grupo es avanzado, pueden simular el caso donde ambos cambios se implementan (50% vs 60%) y ver cómo OpenSpec resuelve basado en el código real.
- Enfatiza que la resolución automática de OpenSpec es segura porque inspecciona el código, no solo los archivos de especificación.