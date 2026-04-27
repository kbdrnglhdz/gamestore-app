# 📘 Sesión 3: Implementación con `/opsx:apply` (3 horas)

## 🎯 Objetivos de la sesión
- Implementar las tareas del cambio `fix-session-timeout` usando `/opsx:apply`.
- Comprender cómo la IA actualiza `tasks.md` automáticamente.
- Manejar una interrupción simulada y retomar la implementación.
- Verificar el progreso con `openspec status`.
- **Dejar el cambio parcialmente implementado (backend completado, frontend pendiente)** para retomar en la Sesión 4.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con el cambio `fix-session-timeout` creado (Sesión 2 completada).
- Terminal abierta en la raíz del proyecto.
- Editor de código.
- Asistente IA configurado (Claude Code, Cursor, etc.).

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                               | Duración |
| ----------- | ------------------------------------------------------- | -------- |
| 0:00 - 0:15 | Repaso del cambio y verificación de artefactos          | 15 min   |
| 0:15 - 0:30 | Teoría: cómo funciona `/opsx:apply`                     | 15 min   |
| 0:30 - 1:30 | Implementación del backend (tareas 1.x)                 | 60 min   |
| 1:30 - 1:45 | Verificación de progreso y simulación de interrupción   | 15 min   |
| 1:45 - 2:30 | Implementación del frontend (tareas 2.x) - **opcional** | 45 min   |
| 2:30 - 2:50 | Verificación final y estado del cambio                  | 20 min   |
| 2:50 - 3:00 | Cierre y entregables                                    | 10 min   |

**Nota:** La implementación del frontend se puede dejar pendiente intencionalmente si el tiempo es ajustado. El instructor puede indicar que se complete solo el backend.

---

## 🔧 Actividad 1: Repaso y verificación del cambio (15 min)

### 1.1 Verificar que el cambio existe y está listo

```bash
# Listar cambios activos
openspec list --changes

# Ver el estado de los artefactos (todos deben estar en "done")
openspec status --change fix-session-timeout
```

**Salida esperada:**
```
Change: fix-session-timeout
Progress: 4/4 artifacts complete
[x] proposal
[x] specs
[x] design
[x] tasks
```

### 1.2 Revisar las tareas pendientes

```bash
cat openspec/changes/fix-session-timeout/tasks.md
```

**Ejemplo de tareas (pueden variar ligeramente):**
```markdown
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

## 📖 Actividad 2: Teoría - Cómo funciona `/opsx:apply` (15 min)

**Instructor explica:**  
- `/opsx:apply` lee `tasks.md` y detecta las tareas incompletas (las que no tienen `[x]`).
- Implementa una tarea por vez, marcándola como completada.
- Si se interrumpe, al volver a ejecutar `apply` retoma desde donde quedó.
- Puedes especificar el nombre del cambio si hay múltiples: `/opsx:apply fix-session-timeout`.

**Ejemplo de flujo:**
```
/opsx:apply
→ Tarea 1.1: implementa → marca [x]
→ Tarea 1.2: implementa → marca [x]
→ (interrupción)
/opsx:apply
→ Tarea 1.3: implementa → marca [x]
```

---

## ⚙️ Actividad 3: Implementación del backend (60 min)

### 3.1 Ejecutar `/opsx:apply` por primera vez

En el chat del asistente IA:

```
/opsx:apply fix-session-timeout
```

**Observa cómo la IA:**
1. Lee `tasks.md`.
2. Identifica la primera tarea incompleta (ej. 1.1).
3. Modifica el código fuente (ej. `prisma/schema.prisma` para agregar `lastActivity`).
4. Marca la tarea como `[x]` en `tasks.md`.
5. Continúa con la siguiente tarea.

### 3.2 Verificar el progreso después de cada tarea (opcional)

Puedes ejecutar en otra terminal (mientras la IA trabaja):

```bash
# Ver el estado actual de las tareas
cat openspec/changes/fix-session-timeout/tasks.md | grep -E "\[ \]|\[x\]"
```

### 3.3 Si la IA se detiene o necesitas pausar, simplemente cierra el chat

No hay problema. El progreso se guarda en `tasks.md`.

### 3.4 Continuar la implementación (si se interrumpió)

Vuelve a ejecutar:

```
/opsx:apply fix-session-timeout
```

La IA retomará desde la última tarea incompleta.

### 3.5 Al finalizar el backend, verificar que las tareas 1.x están completas

```bash
cat openspec/changes/fix-session-timeout/tasks.md | grep "## 1. Backend" -A 10
```

**Salida esperada:**
```markdown
## 1. Backend
- [x] 1.1 Agregar campo `lastActivity` al modelo de sesión
- [x] 1.2 Modificar middleware para actualizar `lastActivity`
- [x] 1.3 Cambiar TTL del refresh token a 60 minutos
- [x] 1.4 Implementar endpoint `/api/auth/refresh`
```

---

## ⏸️ Actividad 4: Simulación de interrupción y verificación (15 min)

### 4.1 Simular que el desarrollador debe detenerse (por ejemplo, fin de jornada)

**Instructor:**  
> "Vamos a simular que el tiempo se acaba y solo hemos completado el backend. El frontend queda pendiente para la próxima sesión."

### 4.2 Verificar el estado actual con `openspec status`

```bash
openspec status --change fix-session-timeout
```

**Salida esperada (si el backend está completo pero el frontend no):**
```
Change: fix-session-timeout
Progress: 4/4 artifacts complete
[x] proposal
[x] specs
[x] design
[x] tasks

Implementation: 4/6 tasks complete
```

### 4.3 Ver las tareas pendientes en formato JSON (opcional)

```bash
openspec status --change fix-session-timeout --json | jq '.artifacts[] | select(.id=="tasks")'
```

---

## 🖥️ Actividad 5: Implementación del frontend (opcional, 45 min)

*Esta actividad se puede realizar si hay tiempo. Si no, se deja pendiente para la Sesión 4.*

### 5.1 Continuar con `/opsx:apply`

```
/opsx:apply fix-session-timeout
```

La IA implementará las tareas 2.1 y 2.2 (interceptor y UI).

### 5.2 Verificar que todas las tareas están completas

```bash
cat openspec/changes/fix-session-timeout/tasks.md | grep "\[ \]"
```

No debería mostrar ninguna línea con `[ ]`.

---

## ✅ Actividad 6: Verificación final y cierre (20 min)

### 6.1 Validar el cambio (aunque esté incompleto)

```bash
openspec validate fix-session-timeout
```

**Nota:** La validación solo revisa estructura, no que las tareas estén completas.

### 6.2 Ver el progreso general

```bash
openspec status --change fix-session-timeout
```

### 6.3 Hacer un commit del progreso (opcional, si usan Git)

```bash
git add .
git commit -m "WIP: fix-session-timeout - backend completed"
```

### 6.4 Registrar las tareas pendientes para la siguiente sesión

```bash
echo "Tareas pendientes para la Sesión 4:" > pending.md
grep "\[ \]" openspec/changes/fix-session-timeout/tasks.md >> pending.md
cat pending.md
```

---

## 📦 Entregables de la sesión

Al finalizar la sesión, cada participante debe tener:

- [ ] El backend del cambio `fix-session-timeout` completamente implementado.
- [ ] Comprensión de cómo `/opsx:apply` procesa las tareas secuencialmente.
- [ ] Capacidad de interrumpir y retomar la implementación sin pérdida de progreso.
- [ ] (Opcional) Frontend implementado si el tiempo lo permitió.
- [ ] El cambio está **parcialmente completado** y listo para finalizar en la Sesión 4.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                    | Solución                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| La IA no modifica el código                 | Verificar que los archivos fuente existen y que el asistente tiene permisos de escritura.     |
| Las tareas no se marcan como `[x]`          | Puede ser un problema de formato; editar manualmente `tasks.md` y marcar la tarea como `[x]`. |
| El endpoint `/api/auth/refresh` no funciona | Revisar que se haya agregado la ruta en `backend/src/routes/auth.ts`.                         |
| Quiero pausar pero la IA sigue              | Puedes cerrar el chat o presionar Ctrl+C en la terminal (si es CLI). El progreso se guarda.   |

---

## 📚 Recursos adicionales (para el participante)

- [Comando `/opsx:apply` - documentación oficial](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxapply)
- [Trabajando con tareas y checklists](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md#completing-a-change)

---

## 🧠 Nota para el instructor

- El objetivo no es completar todo el cambio, sino mostrar el flujo de trabajo incremental.
- Si el grupo es rápido, pueden completar el frontend y tener el cambio 100% listo para archivar en la Sesión 4.
- Si el grupo es lento, es aceptable terminar la sesión con solo el backend implementado.
- Asegúrate de que los participantes entiendan que pueden ejecutar `/opsx:apply` múltiples veces sin problemas.