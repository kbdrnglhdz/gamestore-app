# 📘 Sesión 10: Configuración Avanzada – Contexto y Reglas (3 horas)

## 🎯 Objetivos de la sesión
- Comprender la estructura de `openspec/config.yaml`.
- Agregar **contexto del proyecto** (tech stack, convenciones, reglas de negocio).
- Definir **reglas específicas** para cada tipo de artefacto (proposal, specs, design, tasks).
- Verificar que la IA inyecta el contexto y las reglas al generar artefactos.
- Crear un cambio de prueba para validar la configuración.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado.
- Archivo `openspec/config.yaml` (puede estar vacío o no existir).
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                       | Duración |
| ----------- | ----------------------------------------------- | -------- |
| 0:00 - 0:15 | Teoría: `config.yaml` (contexto y reglas)       | 15 min   |
| 0:15 - 0:45 | Configurar contexto del proyecto                | 30 min   |
| 0:45 - 1:15 | Configurar reglas por artefacto                 | 30 min   |
| 1:15 - 1:30 | Verificar inyección con `openspec instructions` | 15 min   |
| 1:30 - 2:00 | Crear cambio de prueba `test-config`            | 30 min   |
| 2:00 - 2:30 | Validar que los artefactos siguen las reglas    | 30 min   |
| 2:30 - 2:45 | Ajustes y refinamiento                          | 15 min   |
| 2:45 - 3:00 | Cierre y entregables                            | 15 min   |

---

## 📖 Actividad 1: Teoría - `config.yaml` (15 min)

**Instructor explica:**

### Ubicación y propósito
- Archivo: `openspec/config.yaml`
- Controla el comportamiento de OpenSpec en el proyecto.
- El **contexto** se inyecta en **todos** los artefactos.
- Las **reglas** se inyectan **solo** en el artefacto correspondiente.

### Estructura básica
```yaml
schema: spec-driven

context: |
  Texto libre que describe el proyecto.
  Se inyecta en cada prompt.

rules:
  proposal:
    - Regla 1
    - Regla 2
  specs:
    - Regla para specs
  design:
    - Regla para design
  tasks:
    - Regla para tasks
```

### ¿Por qué es importante?
- La IA conoce tu tech stack y convenciones.
- Las reglas evitan que los artefactos sean genéricos.
- Mejora la consistencia en todo el equipo.

---

## ⚙️ Actividad 2: Configurar contexto del proyecto (30 min)

### 2.1 Verificar si ya existe `config.yaml`

```bash
cat openspec/config.yaml
```

Si no existe, créalo vacío:

```bash
touch openspec/config.yaml
```

### 2.2 Editar el archivo con el siguiente contenido (copiar y pegar)

```bash
code openspec/config.yaml
```

Pega exactamente este contenido:

```yaml
# OpenSpec Project Configuration for GameStore

# Default schema para nuevos cambios
schema: spec-driven

# Contexto del proyecto (se inyecta en TODOS los artefactos)
context: |
  # GameStore - E-commerce de videojuegos
  
  ## Tech Stack
  - Backend: Node.js 20 + Express + TypeScript + Prisma ORM + SQLite
  - Frontend: React 18 + TypeScript + Vite + TailwindCSS
  - Auth: JWT con refresh tokens (HTTP-only cookie)
  - Testing: Jest (backend) + React Testing Library (frontend)
  
  ## Convenciones de código
  - Usar ES modules (import/export, no require)
  - Preferir async/await sobre callbacks
  - Todas las API endpoints devuelven JSON: { success: boolean, data?: any, error?: string }
  
  ## Reglas de negocio
  - Los productos deben validar stock antes de agregar al carrito
  - Las sesiones expiran después de 60 minutos de inactividad
  - Solo usuarios con rol ADMIN pueden modificar productos
  
  ## Bugs conocidos (aún no corregidos)
  - Contraseñas en texto plano (security)
  - No hay rate limiting en login
  - El panel de admin es accesible para cualquier usuario autenticado
```

### 2.3 Guardar y verificar

```bash
cat openspec/config.yaml | head -20
```

---

## 📝 Actividad 3: Configurar reglas por artefacto (30 min)

### 3.1 Agregar reglas al `config.yaml`

Sigue editando el mismo archivo. **Agrega al final** (después del `context:`):

```yaml
# Reglas específicas por tipo de artefacto
rules:
  proposal:
    - "Incluir una sección 'Impacto' que enumere los componentes afectados (backend, frontend, db)"
    - "Incluir una sección 'Riesgos' con al menos un riesgo y su mitigación"
    - "Estimar complejidad: Baja/Media/Alta"
    - "Mencionar si requiere migración de base de datos"
  
  specs:
    - "Cada requirement DEBE tener al menos un escenario con formato Given/When/Then"
    - "Incluir escenarios de error (ej. producto sin stock, usuario no autorizado)"
    - "Usar SHALL para requisitos obligatorios, SHOULD para recomendados"
    - "Referenciar requisitos existentes si se modifican"
  
  design:
    - "Incluir una tabla de 'Decisiones de Arquitectura' con columnas: Decisión, Alternativas, Por qué"
    - "Agregar un diagrama de flujo para procesos con más de 3 pasos (usar texto o arte ASCII)"
    - "Listar todos los archivos nuevos y modificados"
    - "Incluir consideraciones de seguridad y rendimiento"
  
  tasks:
    - "Agrupar tareas por capa (Backend, Frontend, Database, Testing)"
    - "Cada tarea debe tener un ID jerárquico (1.1, 1.2, 2.1, etc.)"
    - "Estimar tiempo por tarea (máximo 2 horas)"
    - "Incluir tareas de verificación y pruebas"
```

### 3.2 Verificar la sintaxis YAML

```bash
# Si tienes python3 con PyYAML
python3 -c "import yaml; yaml.safe_load(open('openspec/config.yaml'))"
echo "✓ Sintaxis YAML válida"
```

### 3.3 Ver el archivo completo

```bash
cat openspec/config.yaml
```

---

## 🔍 Actividad 4: Verificar inyección con `openspec instructions` (15 min)

### 4.1 Ver las instrucciones que recibiría la IA para un `proposal`

```bash
openspec instructions proposal --change dummy --json 2>/dev/null | jq -r '.instruction' | head -50
```

(Si no tienes `jq`, simplemente ejecuta `openspec instructions proposal`)

**Deberías ver:**
- El `context:` al inicio.
- Las `rules.proposal:` justo después.
- El template base.

### 4.2 Ver para otros artefactos

```bash
openspec instructions specs --json 2>/dev/null | jq -r '.instruction' | grep -A5 "rules"
openspec instructions design --json 2>/dev/null | jq -r '.instruction' | grep -A5 "rules"
openspec instructions tasks --json 2>/dev/null | jq -r '.instruction' | grep -A5 "rules"
```

---

## 🧪 Actividad 5: Crear cambio de prueba `test-config` (30 min)

### 5.1 Crear un cambio para validar la configuración

```
/opsx:propose test-config
```

### 5.2 Explorar los artefactos generados

```bash
# Ver el proposal
cat openspec/changes/test-config/proposal.md

# Ver el delta spec (debería tener Given/When/Then)
cat openspec/changes/test-config/specs/*/spec.md

# Ver el design (debería tener tabla de decisiones)
cat openspec/changes/test-config/design.md

# Ver tasks (debería tener IDs jerárquicos)
cat openspec/changes/test-config/tasks.md
```

### 5.3 Verificar que las reglas se aplicaron

**Checklist manual:**

| Regla                               | ¿Aparece en el artefacto? |
| ----------------------------------- | ------------------------- |
| Proposal: sección "Impacto"         | [ ] Sí / [ ] No           |
| Proposal: sección "Riesgos"         | [ ] Sí / [ ] No           |
| Proposal: estimación de complejidad | [ ] Sí / [ ] No           |
| Specs: Given/When/Then              | [ ] Sí / [ ] No           |
| Specs: escenarios de error          | [ ] Sí / [ ] No           |
| Design: tabla de decisiones         | [ ] Sí / [ ] No           |
| Design: diagrama de flujo           | [ ] Sí / [ ] No           |
| Tasks: IDs jerárquicos              | [ ] Sí / [ ] No           |
| Tasks: agrupación por capa          | [ ] Sí / [ ] No           |

---

## ✏️ Actividad 6: Ajustes y refinamiento (15 min)

### 6.1 Si alguna regla no se aplicó, reforzar en el `config.yaml`

Por ejemplo, si la IA no incluyó "Riesgos" en el proposal, edita la regla para hacerla más explícita:

```yaml
rules:
  proposal:
    - "DEBE incluir una sección '## Riesgos' con al menos dos riesgos potenciales y sus mitigaciones (no opcional)"
```

### 6.2 Validar nuevamente con otro cambio de prueba

```
/opsx:propose test-config-2
```

### 6.3 Comparar la calidad de los artefactos

```bash
diff openspec/changes/test-config/proposal.md openspec/changes/test-config-2/proposal.md
```

---

## 🗑️ Actividad 7: Limpiar cambios de prueba

```bash
rm -rf openspec/changes/test-config
rm -rf openspec/changes/test-config-2
```

---

## 📦 Entregables de la sesión

- [ ] Archivo `openspec/config.yaml` con contexto completo y reglas.
- [ ] Verificación de sintaxis YAML.
- [ ] Confirmación de que `openspec instructions` muestra el contexto y las reglas.
- [ ] Al menos un cambio de prueba generado que cumpla las reglas.
- [ ] Comprensión de cómo el contexto y las reglas mejoran la calidad de los artefactos.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                 | Solución                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| El contexto no aparece en los artefactos | Ejecutar `openspec update` después de modificar `config.yaml`.              |
| Las reglas se ignoran                    | Verificar que la indentación YAML es correcta (2 espacios, no tabs).        |
| `openspec instructions` da error         | Asegurar que el archivo `config.yaml` existe y tiene `schema: spec-driven`. |
| La IA es muy verbosa con el contexto     | Resumir contexto a 10-15 líneas; lo demás mover a reglas específicas.       |

---

## 📚 Recursos adicionales

- [Customización – Project Configuration](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md#project-configuration)
- [Comandos de instrucciones](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md#openspec-instructions)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida: se configura, se prueba y se limpia dentro de las 3 horas.
- Enfatiza que el contexto debe ser **conciso** (1-2 párrafos) porque se inyecta en **cada** prompt.
- Las reglas deben ser **específicas y accionables** (no "escribir buen código", sino "incluir escenarios de error").
- Si el grupo usa un tech stack diferente, pueden personalizar el contexto.