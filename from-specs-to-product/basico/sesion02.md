# 📘 Sesión 2: Comandos básicos y primer cambio (3 horas)

## 🎯 Objetivos de la sesión
- Repasar los comandos CLI básicos (`list`, `show`, `validate`).
- Comprender la estructura de un cambio y sus artefactos.
- Crear el cambio `fix-session-timeout` usando `/opsx:propose`.
- Explorar y editar ligeramente los artefactos generados.
- Validar el cambio y verificar su estado.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado (Sesión 1 completada).
- Terminal abierta en la raíz del proyecto.
- Editor de código.
- Asistente IA configurado (Claude Code, Cursor, etc.) para usar `/opsx:propose`.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                                     | Duración |
| ----------- | ------------------------------------------------------------- | -------- |
| 0:00 - 0:30 | Repaso de comandos CLI (`list`, `show`, `validate`)           | 30 min   |
| 0:30 - 0:45 | Teoría: cambios y artefactos                                  | 15 min   |
| 0:45 - 1:15 | Creación del cambio `fix-session-timeout` con `/opsx:propose` | 30 min   |
| 1:15 - 2:00 | Exploración de artefactos generados                           | 45 min   |
| 2:00 - 2:30 | Edición manual de artefactos y validación                     | 30 min   |
| 2:30 - 3:00 | Cierre y entregables                                          | 30 min   |

---

## 🔧 Actividad 1: Repaso de comandos CLI (30 min)

### 1.1 Listar especificaciones existentes

```bash
openspec list --specs
```

**Salida esperada:**
```
Specs:
  auth     Authentication and session management
  catalog  Product listing and filtering
```

### 1.2 Mostrar contenido de una especificación

```bash
# Ver especificación completa de auth
openspec show auth --type spec

# Ver solo los requirements (sin escenarios)
openspec show auth --type spec --requirements

# Ver un requirement específico (el primero, índice 1)
openspec show auth --type spec --requirement 1
```

### 1.3 Validar especificaciones

```bash
# Validar todas las especificaciones
openspec validate --specs

# Validar solo la de auth
openspec validate auth --type spec
```

### 1.4 Ver lista de cambios activos (debe estar vacía)

```bash
openspec list --changes
```

**Salida esperada:** `No active changes found.`

---

## 📖 Actividad 2: Teoría - Cambios y artefactos (15 min)

**Instructor:** Explica los siguientes conceptos mostrando la estructura en la pizarra o slide.

- **Change**: Carpeta en `openspec/changes/<nombre>/` que contiene todo lo necesario para una modificación.
- **Artefactos**:
  - `proposal.md`: Por qué y qué (intención, alcance, enfoque).
  - `specs/`: Deltas (ADDED/MODIFIED/REMOVED) que describen cambios en el comportamiento.
  - `design.md`: Cómo (enfoque técnico, decisiones).
  - `tasks.md`: Checklist de implementación.
- **Delta specs**: Usan `## ADDED/MODIFIED/REMOVED Requirements` para indicar cambios.

**Referencia:** [concepts.md#changes](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md#changes)

---

## 🚀 Actividad 3: Creación del cambio `fix-session-timeout` (30 min)

### 3.1 Ejecutar `/opsx:propose`

**En el chat del asistente IA (Claude Code, Cursor, etc.):**

```
/opsx:propose fix-session-timeout
```

**El asistente debe responder algo como:**
```
✓ Created openspec/changes/fix-session-timeout/
  - proposal.md
  - specs/auth/spec.md (delta)
  - design.md
  - tasks.md

Change ready. Run /opsx:apply to implement.
```

### 3.2 Verificar la estructura del cambio

```bash
# Listar el contenido de la carpeta del cambio
ls -la openspec/changes/fix-session-timeout/

# Deberías ver:
# proposal.md  design.md  tasks.md  specs/
```

### 3.3 Ver el estado del cambio con CLI

```bash
openspec status --change fix-session-timeout
```

**Salida esperada:**
```
Change: fix-session-timeout
Schema: spec-driven
Progress: 4/4 artifacts complete

[x] proposal
[x] specs
[x] design
[x] tasks
```

(Nota: los artefactos ya están creados porque `propose` los genera todos.)

### 3.4 Listar cambios activos

```bash
openspec list --changes
```

**Salida esperada:**
```
Active changes:
  fix-session-timeout     Fix session timeout bug
```

---

## 🔍 Actividad 4: Exploración de artefactos generados (45 min)

### 4.1 Ver el `proposal.md`

```bash
cat openspec/changes/fix-session-timeout/proposal.md
```

**Ejemplo de contenido (puede variar según la IA):**
```markdown
# Proposal: Fix Session Timeout

## Intent
Los usuarios se desconectan después de 15 minutos incluso si están activos.
Debemos cambiar la sesión para que expire solo tras 60 minutos de inactividad.

## Scope
- Modificar el middleware de autenticación para actualizar `lastActivity`.
- Cambiar el TTL del refresh token a 60 minutos.
- Agregar renovación automática de token.

## Approach
Usar un campo `lastActivity` en la sesión y actualizarlo en cada request.
```

### 4.2 Ver el delta spec (cambios en `auth`)

```bash
cat openspec/changes/fix-session-timeout/specs/auth/spec.md
```

**Ejemplo de delta spec (MODIFIED):**
```markdown
# Delta for Auth

## MODIFIED Requirements

### Requirement: Session Persistence
The system SHALL maintain session for 60 minutes of inactivity.

#### Scenario: Active user session
- GIVEN an authenticated user
- WHEN the user makes requests within 60 minutes
- THEN the session remains active

#### Scenario: Inactivity timeout
- GIVEN an authenticated user
- WHEN 60 minutes pass without any request
- THEN the session expires
```

### 4.3 Ver el `design.md`

```bash
cat openspec/changes/fix-session-timeout/design.md
```

**Ejemplo:**
```markdown
# Design: Fix Session Timeout

## Technical Approach
1. Agregar middleware que actualice `lastActivity` en cada request.
2. Cambiar la expiración del refresh token de 15 a 60 minutos.
3. Implementar endpoint `/api/auth/refresh` para renovar token automáticamente.
```

### 4.4 Ver el `tasks.md`

```bash
cat openspec/changes/fix-session-timeout/tasks.md
```

**Ejemplo:**
```markdown
# Tasks

## 1. Backend
- [ ] 1.1 Agregar campo `lastActivity` al modelo de sesión
- [ ] 1.2 Modificar middleware para actualizar `lastActivity`
- [ ] 1.3 Cambiar TTL del refresh token a 60 minutos
- [ ] 1.4 Implementar endpoint `/api/auth/refresh`

## 2. Frontend
- [ ] 2.1 Agregar interceptor para refresh automático
- [ ] 2.2 Mostrar indicador de sesión expirando
```

---

## ✏️ Actividad 5: Edición manual de artefactos y validación (30 min)

### 5.1 Mejorar el `proposal.md` agregando una sección de "Riesgos"

Abre el archivo con tu editor:

```bash
code openspec/changes/fix-session-timeout/proposal.md
```

(O usa `nano`, `vim`, etc.)

Agrega al final el siguiente contenido:

```markdown
## Risks
- Cambiar el TTL puede invalidar tokens existentes.
- Necesitamos migrar sesiones activas o invalidarlas.
```

### 5.2 Validar el cambio después de la edición

```bash
openspec validate fix-session-timeout
```

**Salida esperada:** `✓ change/fix-session-timeout is valid`

### 5.3 Ver el estado detallado en formato JSON (opcional)

```bash
openspec status --change fix-session-timeout --json | jq '.'
```

(Si no tienes `jq`, simplemente omite el pipe.)

### 5.4 Ver el cambio en el dashboard interactivo

```bash
openspec view
```

Navega con flechas y selecciona `Changes` → `fix-session-timeout` para explorar los artefactos visualmente.

---

## 📦 Entregables de la sesión

Al finalizar la sesión, cada participante debe tener:

- [ ] Cambio `fix-session-timeout` creado exitosamente.
- [ ] Capacidad de listar cambios con `openspec list --changes`.
- [ ] Entendimiento de los artefactos (`proposal.md`, `design.md`, `tasks.md`, delta spec).
- [ ] Edición manual de un artefacto y validación exitosa.
- [ ] El cambio está **listo para implementar** en la Sesión 3.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                          | Solución                                                                                                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/opsx:propose` no es reconocido por la IA        | Asegurar que `openspec init` se ejecutó correctamente y que el asistente tiene los skills cargados. Reiniciar el asistente o ejecutar `openspec update`. |
| El cambio no aparece en `openspec list --changes` | Verificar que la carpeta se creó en `openspec/changes/` y que el nombre es correcto.                                                                     |
| La validación falla después de editar             | Revisar la sintaxis del archivo editado (especialmente si se copió texto con caracteres especiales).                                                     |
| No se ve la sección "Riesgos" en el proposal      | Asegurar que se agregó exactamente como se indica, con dos `##` y el texto correcto.                                                                     |

---

## 📚 Recursos adicionales (para el participante)

- [Comandos CLI - referencia rápida](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md)
- [Conceptos de cambios y artefactos](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md#changes)

---

## 🧠 Nota para el instructor

- El cambio `fix-session-timeout` **no se implementa en esta sesión**. Solo se crea y se exploran los artefactos.
- Asegúrate de que todos los participantes tengan el asistente IA funcionando antes de ejecutar `/opsx:propose`. Si alguien no tiene acceso, puede crear manualmente la estructura y los archivos copiando los ejemplos (pero se perderá la automatización).
- La edición manual de `proposal.md` es intencional para mostrar que los artefactos son mutables.