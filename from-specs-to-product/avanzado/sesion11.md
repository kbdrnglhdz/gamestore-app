# 📘 Sesión 11: Schemas Personalizados – Creación y Forkeo (3 horas)

## 🎯 Objetivos de la sesión
- Comprender qué es un schema y cómo se estructura.
- Forkear el schema `spec-driven` a `gamestore-schema`.
- Agregar un nuevo artefacto personalizado (`security-review`) al schema forkeado.
- Crear un schema desde cero (`rapid-workflow`) con solo `proposal` y `tasks`.
- Validar los schemas y probarlos con cambios de prueba.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado.
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                     | Duración |
| ----------- | --------------------------------------------- | -------- |
| 0:00 - 0:20 | Teoría: ¿Qué es un schema?                    | 20 min   |
| 0:20 - 0:50 | Forkear `spec-driven` → `gamestore-schema`    | 30 min   |
| 0:50 - 1:20 | Agregar artefacto `security-review` al schema | 30 min   |
| 1:20 - 1:50 | Crear schema desde cero `rapid-workflow`      | 30 min   |
| 1:50 - 2:20 | Validar schemas y probar con cambios          | 30 min   |
| 2:20 - 2:45 | Comparar flujos y discutir casos de uso       | 25 min   |
| 2:45 - 3:00 | Cierre y entregables                          | 15 min   |

---

## 📖 Actividad 1: Teoría - ¿Qué es un schema? (20 min)

**Instructor explica:**

### Definición
Un **schema** es la receta que define:
- Qué artefactos tiene un cambio.
- Cómo dependen entre sí (`requires`).
- Qué templates usar y qué instrucciones adicionales dar a la IA.

### Estructura de un schema
```yaml
name: mi-schema
version: 1
description: Descripción

artifacts:
  - id: proposal
    generates: proposal.md
    requires: []
  - id: design
    generates: design.md
    requires: [proposal]
  - id: tasks
    generates: tasks.md
    requires: [design]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Ubicación
- **Proyecto**: `openspec/schemas/<nombre>/`
- **Global**: `~/.local/share/openspec/schemas/`

### Comandos útiles
```bash
openspec schemas                     # Listar disponibles
openspec schema fork <source> <dest> # Copiar existente
openspec schema init <nombre>        # Crear desde cero
openspec schema validate <nombre>    # Validar
```

---

## 🔧 Actividad 2: Forkear `spec-driven` → `gamestore-schema` (30 min)

### 2.1 Ver schemas disponibles

```bash
openspec schemas
```

Deberías ver `spec-driven` (package).

### 2.2 Ejecutar el fork

```bash
openspec schema fork spec-driven gamestore-schema
```

**Salida esperada:**
```
✓ Copied schema 'spec-driven' to 'gamestore-schema'
  Location: openspec/schemas/gamestore-schema/

  Files created:
    schema.yaml
    templates/proposal.md
    templates/specs.md
    templates/design.md
    templates/tasks.md
```

### 2.3 Explorar la estructura

```bash
ls -la openspec/schemas/gamestore-schema/
tree openspec/schemas/gamestore-schema/  # si tienes tree
cat openspec/schemas/gamestore-schema/schema.yaml
```

### 2.4 Verificar que el schema se reconoce

```bash
openspec schemas | grep gamestore
```

Debería aparecer `gamestore-schema (project)`.

---

## ✨ Actividad 3: Agregar artefacto `security-review` al schema (30 min)

### 3.1 Editar `schema.yaml` para agregar el nuevo artefacto

```bash
code openspec/schemas/gamestore-schema/schema.yaml
```

Reemplaza el contenido con:

```yaml
name: gamestore-schema
version: 1
description: GameStore workflow with security review

artifacts:
  - id: proposal
    generates: proposal.md
    template: proposal.md
    requires: []

  - id: specs
    generates: specs/**/*.md
    template: specs.md
    requires: [proposal]

  - id: design
    generates: design.md
    template: design.md
    requires: [proposal]

  # Nuevo artefacto
  - id: security-review
    generates: security-review.md
    description: Security review checklist
    template: security-review.md
    requires: [design]

  - id: tasks
    generates: tasks.md
    template: tasks.md
    requires: [specs, design, security-review]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 3.2 Crear el template para `security-review`

```bash
cat > openspec/schemas/gamestore-schema/templates/security-review.md << 'EOF'
# Security Review: {{CHANGE_NAME}}

## Authentication & Authorization
- [ ] ¿Los nuevos endpoints requieren autenticación?
- [ ] ¿Se verifican roles (ADMIN vs USER)?

## Input Validation
- [ ] ¿Se validan todos los inputs del usuario?
- [ ] ¿Se previene SQL injection (usando Prisma)?

## Data Protection
- [ ] ¿Se almacenan contraseñas hasheadas (bcrypt)?
- [ ] ¿Se evita loguear información sensible?

## Rate Limiting
- [ ] ¿Se implementó rate limiting en endpoints públicos?

## Checklist Summary
- Critical issues: ___
- High issues: ___
- Medium issues: ___
- Low issues: ___

## Aprobación
- [ ] Seguridad: _____ (nombre)
- [ ] Equipo: _____ (nombre)
EOF
```

### 3.3 Validar el schema modificado

```bash
openspec schema validate gamestore-schema
```

**Salida esperada:** `✓ Schema 'gamestore-schema' is valid`

### 3.4 Probar el nuevo schema con un cambio de prueba

```bash
/opsx:new test-security --schema gamestore-schema
openspec status --change test-security
```

Deberías ver 5 artefactos: proposal, specs, design, security-review, tasks.

```bash
# Limpiar
rm -rf openspec/changes/test-security
```

---

## 🚀 Actividad 4: Crear schema desde cero `rapid-workflow` (30 min)

### 4.1 Inicializar nuevo schema

```bash
openspec schema init rapid-workflow \
  --description "Rapid iteration without design and specs" \
  --artifacts proposal,tasks
```

**Salida esperada:**
```
✓ Created schema 'rapid-workflow' at openspec/schemas/rapid-workflow/
  - schema.yaml
  - templates/proposal.md
  - templates/tasks.md
```

### 4.2 Ver la estructura

```bash
cat openspec/schemas/rapid-workflow/schema.yaml
```

**Contenido esperado:**
```yaml
name: rapid-workflow
version: 1
description: Rapid iteration without design and specs

artifacts:
  - id: proposal
    generates: proposal.md
    template: proposal.md
    requires: []

  - id: tasks
    generates: tasks.md
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 4.3 Personalizar los templates (opcional)

```bash
code openspec/schemas/rapid-workflow/templates/proposal.md
```

Reemplaza con:

```markdown
# {{CHANGE_NAME}}

## What
<!-- Describe what needs to be done in 1-2 sentences -->

## Why
<!-- Business reason -->

## Quick Plan
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Time Estimate
<!-- Hours -->
```

### 4.4 Validar el nuevo schema

```bash
openspec schema validate rapid-workflow
```

### 4.5 Probar con un cambio rápido

```bash
/opsx:new test-rapid --schema rapid-workflow
/opsx:ff test-rapid
ls openspec/changes/test-rapid/
# Debería ver solo proposal.md y tasks.md (no specs ni design)
```

```bash
rm -rf openspec/changes/test-rapid
```

---

## ✅ Actividad 5: Validar todos los schemas (10 min)

```bash
# Validar todos los schemas del proyecto
openspec schema validate

# Ver de dónde resuelve cada uno
openspec schema which --all
```

**Salida esperada:**
```
spec-driven (package)
gamestore-schema (project)
rapid-workflow (project)
```

---

## 🔄 Actividad 6: Comparar flujos y casos de uso (25 min)

### 6.1 Tabla comparativa

| Schema             | Artefactos                                          | Cuándo usar                           |
| ------------------ | --------------------------------------------------- | ------------------------------------- |
| `spec-driven`      | proposal, specs, design, tasks                      | Features completas, estándar          |
| `gamestore-schema` | proposal, specs, design, **security-review**, tasks | Proyectos con requisitos de seguridad |
| `rapid-workflow`   | proposal, tasks                                     | Hotfixes, experimentos, prototipos    |

### 6.2 Discusión guiada

- **¿Cuándo agregarías un artefacto como `security-review`?**
  - Equipos con compliance (PCI, GDPR).
  - Cambios que afectan autenticación o datos sensibles.

- **¿Cuándo usarías `rapid-workflow`?**
  - Correcciones urgentes (hotfixes).
  - Pruebas de concepto (POCs).
  - Cambios de infraestructura (no afectan especificaciones).

- **¿Puedo mezclar?**
  - Sí, puedes tener diferentes cambios usando diferentes schemas.

---

## 📦 Entregables de la sesión

- [ ] Schema `gamestore-schema` forkeado y personalizado (con `security-review`).
- [ ] Schema `rapid-workflow` creado desde cero.
- [ ] Validación exitosa de ambos schemas.
- [ ] Cambios de prueba que demuestran el uso de cada schema.
- [ ] Comprensión de cuándo crear un schema personalizado.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                            | Solución                                                              |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| `openspec schema fork` no existe                    | Actualizar OpenSpec: `npm update -g @fission-ai/openspec`             |
| El schema no aparece en `openspec schemas`          | Verificar que está en `openspec/schemas/<nombre>/schema.yaml`.        |
| Validación falla por dependencia circular           | Revisar `requires` para que no haya ciclos (A→B→A).                   |
| El artefacto `security-review` no se genera en `ff` | Verificar que está listado en `artifacts` y que no falta el template. |

---

## 📚 Recursos adicionales

- [Custom Schemas - Documentación oficial](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md#custom-schemas)
- [CLI: Schema commands](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md#schema-commands)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida: se crean, validan y prueban los schemas.
- Enfatiza que los schemas se versionan en Git, por lo que todo el equipo los comparte.
- El `rapid-workflow` es ideal para demostrar que no es obligatorio tener specs y design.
- Si el grupo tiene tiempo, pueden crear un cuarto schema (ej. `compliance-workflow` con artefactos `privacy-review` y `legal-approval`).