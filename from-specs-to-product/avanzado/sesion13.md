# 📘 Sesión 13: Multi‑idioma y Configuración Global (3 horas)

## 🎯 Objetivos de la sesión
- Configurar el idioma global de OpenSpec (español, portugués, etc.).
- Verificar que los artefactos se generan en el idioma configurado.
- Explorar los comandos de configuración global (`list`, `get`, `set`, `edit`, `profile`).
- Diferenciar entre configuración global (personal) y configuración del proyecto.
- Crear cambios de prueba en diferentes idiomas y archivarlos.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado.
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                  | Duración |
| ----------- | ------------------------------------------ | -------- |
| 0:00 - 0:15 | Teoría: configuración global vs proyecto   | 15 min   |
| 0:15 - 0:45 | Configurar idioma global (español)         | 30 min   |
| 0:45 - 1:15 | Probar generación de artefactos en español | 30 min   |
| 1:15 - 1:45 | Explorar comandos de configuración global  | 30 min   |
| 1:45 - 2:15 | Cambiar a portugués y probar               | 30 min   |
| 2:15 - 2:45 | Cambiar perfil con `config profile`        | 30 min   |
| 2:45 - 3:00 | Cierre y entregables                       | 15 min   |

---

## 📖 Actividad 1: Teoría - Configuración global vs proyecto (15 min)

**Instructor explica:**

### Jerarquía de configuración
```
CLI flag (--schema, --no-color)      ← Mayor prioridad
Change metadata (.openspec.yaml)
Project config (openspec/config.yaml)
Global config (~/.local/share/openspec/config.yaml) ← Hoy trabajamos aquí
Default values
```

### ¿Qué se configura globalmente?
| Configuración     | Comando                                 | Propósito                     |
| ----------------- | --------------------------------------- | ----------------------------- |
| Idioma            | `openspec config set language es`       | Generar artefactos en español |
| Nombre de usuario | `openspec config set user.name`         | Autor de cambios              |
| Email             | `openspec config set user.email`        | Contacto                      |
| Perfil            | `openspec config profile`               | Core vs custom                |
| Telemetría        | `openspec config set telemetry.enabled` | Privacidad                    |
| Concurrencia      | `openspec config set concurrency`       | Rendimiento                   |

### Ubicación del archivo global
```bash
openspec config path
```

---

## ⚙️ Actividad 2: Configurar idioma global (español) (30 min)

### 2.1 Ver configuración actual

```bash
openspec config list
```

### 2.2 Configurar idioma español

```bash
openspec config set language es
```

### 2.3 Verificar que se aplicó

```bash
openspec config get language
```

**Salida esperada:** `es`

### 2.4 Ver la configuración completa

```bash
openspec config list
```

**Debe aparecer:**
```yaml
language: es
```

### 2.5 Ver ubicación del archivo global

```bash
openspec config path
```

**Ejemplo de salida (Linux/macOS):**
```
~/.local/share/openspec/config.yaml
```

### 2.6 Ver el contenido del archivo global (opcional)

```bash
cat "$(openspec config path)"
```

---

## 🌐 Actividad 3: Probar generación de artefactos en español (30 min)

### 3.1 Crear un cambio de prueba

```
/opsx:propose test-spanish
```

### 3.2 Verificar que el `proposal.md` está en español

```bash
cat openspec/changes/test-spanish/proposal.md | head -20
```

**Debe contener (en español):**
```markdown
# Propuesta: test-spanish

## Intención
...
```

### 3.3 Verificar otros artefactos

```bash
cat openspec/changes/test-spanish/specs/*/spec.md | head -20
cat openspec/changes/test-spanish/design.md | head -20
cat openspec/changes/test-spanish/tasks.md | head -20
```

### 3.4 Archivar el cambio

```
/opsx:archive test-spanish --yes
```

### 3.5 Verificar que el spec principal no se modificó (no debería, era un cambio vacío)

```bash
openspec list --changes
```

---

## 🔧 Actividad 4: Explorar comandos de configuración global (30 min)

### 4.1 Listar toda la configuración

```bash
openspec config list
```

### 4.2 Obtener un valor específico

```bash
openspec config get language
openspec config get user.name  # puede estar vacío
```

### 4.3 Establecer valores adicionales

```bash
openspec config set user.name "Tu Nombre"
openspec config set user.email "tu@email.com"
openspec config set telemetry.enabled false
openspec config set concurrency 8
```

### 4.4 Verificar que se guardaron

```bash
openspec config get user.name
openspec config get telemetry.enabled
```

### 4.5 Editar la configuración directamente con el editor

```bash
openspec config edit
```

Se abrirá el editor (VS Code, nano, etc.). Puedes ver/modificar manualmente.

### 4.6 Eliminar una clave específica

```bash
openspec config unset user.email
openspec config get user.email  # debe estar vacío
```

### 4.7 Restablecer a valores predeterminados (¡cuidado!)

```bash
# Esto borra toda la configuración global
openspec config reset --all --yes
```

**Solo ejecutar si quieres empezar de cero.** Si lo haces, vuelve a configurar el idioma:

```bash
openspec config set language es
```

---

## 🇧🇷 Actividad 5: Cambiar a portugués y probar (30 min)

### 5.1 Configurar portugués (Brasil)

```bash
openspec config set language pt-BR
```

### 5.2 Verificar

```bash
openspec config get language
```

### 5.3 Crear cambio de prueba en portugués

```
/opsx:propose test-portuguese
```

### 5.4 Verificar que los artefactos están en portugués

```bash
cat openspec/changes/test-portuguese/proposal.md | head -15
```

**Debe contener:** `# Proposta:` o similar.

### 5.5 Archivar el cambio

```
/opsx:archive test-portuguese --yes
```

### 5.6 Volver a español (si es el idioma preferido)

```bash
openspec config set language es
```

---

## 👤 Actividad 6: Cambiar perfil con `config profile` (30 min)

### 6.1 Ver perfil actual

```bash
openspec config get profile
```

### 6.2 Ejecutar el asistente de perfil

```bash
openspec config profile
```

**Interacción esperada:**
```
Current configuration:
  Profile: custom
  Delivery: both
  Selected workflows: propose, explore, new, continue, apply, ff, sync, archive, bulk-archive, verify, onboard

What would you like to change?
  1) Change delivery + workflows
  2) Change delivery only
  3) Change workflows only
  4) Keep current settings
```

Selecciona `4` (Keep current settings) para salir sin cambios.

### 6.3 Cambiar a perfil `core` (solo comandos básicos)

```bash
openspec config profile core
```

**Salida esperada:**
```
✓ Profile set to core
  Workflows: propose, explore, apply, archive
Run 'openspec update' in your project to apply changes.
```

### 6.4 Verificar el cambio

```bash
openspec config get profile
```

### 6.5 Volver a perfil `custom` (todos los comandos)

```bash
openspec config profile custom
```

---

## 📦 Entregables de la sesión

- [ ] Idioma configurado a español y probado con un cambio.
- [ ] Idioma configurado a portugués y probado con un cambio.
- [ ] Conocimiento de los comandos `config list`, `get`, `set`, `unset`, `edit`.
- [ ] Capacidad de cambiar el perfil entre `core` y `custom`.
- [ ] Cambios de prueba archivados (test-spanish, test-portuguese).

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                 | Solución                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| El idioma no cambia en los artefactos    | Verificar que no hay `language:` en `openspec/config.yaml` (anula la global). |
| `openspec config edit` no abre el editor | Configurar `EDITOR` o `VISUAL`: `export EDITOR=code --wait`                   |
| `config profile` no muestra opciones     | Actualizar OpenSpec: `npm update -g @fission-ai/openspec`                     |
| Los cambios de perfil no afectan a la IA | Ejecutar `openspec update` en el proyecto.                                    |

---

## 📚 Recursos adicionales

- [Multi‑language Guide](https://github.com/Fission-AI/OpenSpec/blob/main/docs/multi-language.md)
- [CLI Configuration Commands](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md#configuration-commands)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida: se configuran idiomas, se prueban y se archivan cambios dentro de las 3 horas.
- Enfatiza la diferencia entre configuración global (personal, no se versiona) y proyecto (se comparte en Git).
- El cambio de perfil (`core` vs `custom`) es útil para demostrar que no todos los comandos están siempre disponibles.
- Si los participantes tienen problemas con el idioma, pueden usar `openspec config set language en` para volver al inglés.