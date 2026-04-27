# 📘 Sesión 15: Proyecto Final – Seguridad y Logout (3 horas)

## 🎯 Objetivos de la sesión
- Aplicar **todo lo aprendido** en un cambio completo y significativo.
- Crear un cambio `fix-security-basics` que resuelva:
  1. **Rate limiting en login** (5 intentos por minuto).
  2. **Logout funcional** (backend + frontend).
- Usar el schema personalizado `gamestore-schema` (con `security-review`).
- Generar artefactos de alta calidad siguiendo reglas y templates.
- Implementar con `/opsx:apply`, verificar con `/opsx:verify` y archivar.
- Presentar una mini-demo de 5 minutos al final.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado.
- Schema `gamestore-schema` (de Sesión 11) y configuración avanzada (Sesión 10).
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                               | Duración |
| ----------- | --------------------------------------- | -------- |
| 0:00 - 0:15 | Presentación del proyecto final         | 15 min   |
| 0:15 - 0:45 | Crear cambio con schema personalizado   | 30 min   |
| 0:45 - 1:15 | Revisar y ajustar artefactos generados  | 30 min   |
| 1:15 - 2:00 | Implementar con `/opsx:apply`           | 45 min   |
| 2:00 - 2:15 | Verificar con `/opsx:verify` y corregir | 15 min   |
| 2:15 - 2:30 | Sincronizar y archivar                  | 15 min   |
| 2:30 - 2:50 | Preparar mini-demo                      | 20 min   |
| 2:50 - 3:00 | Cierre y entregables                    | 10 min   |

---

## 🎯 Actividad 1: Presentación del proyecto final (15 min)

**Instructor:**  
> "Hoy integraremos todo lo aprendido. Resolveremos dos problemas de seguridad críticos en GameStore:
> 1. **Rate limiting en login**: evita ataques de fuerza bruta.
> 2. **Logout funcional**: permite cerrar sesión explícitamente.
>
> Usaremos el schema `gamestore-schema` que incluye el artefacto `security-review`.  
> El cambio se llamará `fix-security-basics`.  
> Al final, cada participante hará una mini-demo de 3-5 minutos mostrando el cambio funcionando."

### Requisitos detallados
| Requerimiento | Criterio de aceptación                                                |
| ------------- | --------------------------------------------------------------------- |
| Rate limiting | Después de 5 intentos fallidos en 1 minuto, devolver 429.             |
| Logout        | Endpoint `POST /api/auth/logout` invalida refresh token y cookie.     |
| Frontend      | Botón "Logout" en el header que llama al endpoint y redirige a login. |

---

## 🚀 Actividad 2: Crear cambio con schema personalizado (30 min)

### 2.1 Verificar que el schema `gamestore-schema` existe

```bash
openspec schemas | grep gamestore
```

Si no existe, créalo (Sesión 11):
```bash
openspec schema fork spec-driven gamestore-schema
```

### 2.2 Crear el cambio

```
/opsx:new fix-security-basics --schema gamestore-schema
```

### 2.3 Generar todos los artefactos con `/opsx:ff`

```
/opsx:ff fix-security-basics
```

### 2.4 Verificar la estructura

```bash
ls -la openspec/changes/fix-security-basics/
```

**Debe contener:** `proposal.md`, `specs/`, `design.md`, `security-review.md`, `tasks.md`.

---

## ✏️ Actividad 3: Revisar y ajustar artefactos (30 min)

### 3.1 Revisar `proposal.md`

```bash
cat openspec/changes/fix-security-basics/proposal.md
```

Debe incluir (si no, edítalo):
```markdown
## Impacto
- Backend: agregar rate-limiting middleware y endpoint logout.
- Frontend: agregar botón de logout.
- Base de datos: no requiere cambios.

## Riesgos
- Rate limiting podría afectar usuarios legítimos si es muy bajo.  
  Mitigación: 5 intentos/minuto es estándar.
- Logout debe invalidar el refresh token en servidor.  
  Mitigación: usar blacklist o borrar cookie.

## Complejidad: Media
```

### 3.2 Revisar delta specs (`specs/auth/spec.md`)

```bash
cat openspec/changes/fix-security-basics/specs/auth/spec.md
```

**Debe incluir:**
- ADDED: Rate limiting requirement (con escenarios)
- ADDED: Logout requirement

Si faltan, edita:

```bash
code openspec/changes/fix-security-basics/specs/auth/spec.md
```

Pega (reemplaza) con:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Rate Limiting on Login
The system SHALL limit login attempts to 5 per minute per IP address.

#### Scenario: Too many attempts
- GIVEN 5 failed login attempts in 1 minute from the same IP
- WHEN a 6th attempt is made
- THEN HTTP 429 (Too Many Requests) is returned
- AND no token is issued

#### Scenario: Normal flow
- GIVEN less than 5 attempts
- WHEN a valid login is attempted
- THEN login proceeds normally

### Requirement: Logout Functionality
The system SHALL provide a logout endpoint that invalidates the session.

#### Scenario: Successful logout
- GIVEN an authenticated user with a valid refresh token
- WHEN the user calls POST /api/auth/logout
- THEN the refresh token is invalidated
- AND the HTTP-only cookie is cleared
- AND the user is redirected to login page

#### Scenario: Unauthenticated logout
- GIVEN no active session
- WHEN the user calls POST /api/auth/logout
- THEN HTTP 401 (Unauthorized) is returned
```

### 3.3 Revisar `design.md`

```bash
code openspec/changes/fix-security-basics/design.md
```

Agrega tabla de decisiones:

```markdown
## Architecture Decisions

| Decision                                      | Alternatives         | Why                             |
| --------------------------------------------- | -------------------- | ------------------------------- |
| Rate limiting en memoria (express-rate-limit) | Redis, base de datos | Simplicidad, bajo volumen       |
| Logout invalidando token en servidor          | Cliente borra cookie | Seguridad: token debe revocarse |
```

### 3.4 Revisar `security-review.md`

```bash
cat openspec/changes/fix-security-basics/security-review.md
```

Debe tener checklists. Si no, edita.

### 3.5 Revisar `tasks.md`

```bash
cat openspec/changes/fix-security-basics/tasks.md
```

Ajusta para que incluya:

```markdown
## 1. Backend
- [ ] 1.1 Instalar express-rate-limit
- [ ] 1.2 Agregar limiter al endpoint POST /api/auth/login
- [ ] 1.3 Implementar endpoint POST /api/auth/logout
- [ ] 1.4 Invalidar refresh token (opcional: blacklist en memoria)

## 2. Frontend
- [ ] 2.1 Agregar botón "Logout" en header/navigation
- [ ] 2.2 Llamar a /api/auth/logout al hacer click
- [ ] 2.3 Limpiar localStorage y redirigir a /login

## 3. Testing
- [ ] 3.1 Probar rate limiting con 6 intentos
- [ ] 3.2 Probar logout y verificar que token ya no funciona
```

---

## ⚙️ Actividad 4: Implementar con `/opsx:apply` (45 min)

### 4.1 Ejecutar apply

```
/opsx:apply fix-security-basics
```

La IA implementará secuencialmente las tareas.

### 4.2 Seguir el progreso

```bash
# En otra terminal, ver tareas completadas
watch -n 2 "grep -c '\[x\]' openspec/changes/fix-security-basics/tasks.md"
```

### 4.3 Si la IA se bloquea en alguna tarea, ayudarla manualmente

Por ejemplo, si no agrega el botón de logout en frontend, edita `frontend/src/components/Header.tsx`:

```tsx
<button onClick={handleLogout}>Cerrar sesión</button>
```

### 4.4 Verificar que todas las tareas están `[x]`

```bash
grep "\[ \]" openspec/changes/fix-security-basics/tasks.md
# No debe mostrar líneas
```

---

## ✅ Actividad 5: Verificar con `/opsx:verify` (15 min)

### 5.1 Ejecutar verificación

```
/opsx:verify fix-security-basics
```

**Salida esperada:** 0 critical issues.

### 5.2 Si hay errores, corregirlos y volver a verificar

Por ejemplo, si `verify` dice que falta el manejo de 429 en frontend, agrégalo:

```tsx
catch (error) {
  if (error.response?.status === 429) {
    alert("Demasiados intentos. Espera un minuto.");
  }
}
```

Luego re-ejecuta `verify`.

---

## 📦 Actividad 6: Sincronizar y archivar (15 min)

### 6.1 Sincronizar specs (opcional, pero muestra el comando)

```
/opsx:sync fix-security-basics
```

### 6.2 Archivar el cambio

```
/opsx:archive fix-security-basics
```

Responde `Y`.

**Salida esperada:**
```
✓ Synced delta specs to openspec/specs/auth/spec.md
✓ Moved to openspec/changes/archive/YYYY-MM-DD-fix-security-basics/
```

### 6.3 Verificar que el cambio ya no está activo

```bash
openspec list --changes
```

---

## 🎤 Actividad 7: Preparar mini-demo (20 min)

### 7.1 Estructura de la demo (5 min por persona)

```markdown
## Demo: fix-security-basics

1. **Problema (30s)**: GameStore no tiene rate limiting ni logout.

2. **Solución (1 min)**: 
   - Mostrar código del rate limiter en backend.
   - Mostrar endpoint de logout.

3. **Demostración (2 min)**: 
   - Intentar login 6 veces → ver 429.
   - Login correcto → botón logout → redirige.

4. **Artefactos (1 min)**: 
   - Mostrar `openspec show fix-security-basics --deltas-only` (desde archive).

5. **Lecciones (30s)**: Lo más fácil/difícil de OpenSpec.
```

### 7.2 Probar la demo localmente

Asegurar que el backend y frontend están corriendo:

```bash
cd backend && npm run dev &
cd frontend && npm run dev &
```

Probar manualmente:

```bash
# Rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -w "\nHTTP %{http_code}\n"
  sleep 1
done
# El sexto debe devolver 429

# Logout (requiere token primero)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login ... | jq -r '.token')
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### 7.3 Preparar diapositiva (opcional)

Pueden crear un archivo `demo.md` con los comandos y capturas.

---

## 📦 Entregables de la sesión

- [ ] Cambio `fix-security-basics` completamente implementado.
- [ ] Verificación exitosa con `verify`.
- [ ] Cambio archivado.
- [ ] Demo presentada (oral o por escrito).
- [ ] Especificaciones `auth/spec.md` actualizadas con rate limiting y logout.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                        | Solución                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| El cambio no usa `gamestore-schema`             | Pasar `--schema gamestore-schema` explícitamente.                         |
| `security-review.md` no se genera               | Verificar que el artifact está en `schema.yaml` y que el template existe. |
| La IA no completa el logout en frontend         | Ayudar manualmente; luego marcar tarea como `[x]`.                        |
| `verify` falla aunque la funcionalidad funciona | Revisar que los escenarios del spec coinciden con la implementación.      |

---

## 📚 Recursos adicionales

- [Guía de buenas prácticas](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md)
- [Comandos de OpenSpec](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md)

---

## 🧠 Nota para el instructor

- Esta sesión es el **culmen del workshop**; asegúrate de que todos los participantes tengan al menos un cambio archivado al final.
- Si el grupo es grande, pueden trabajar en parejas.
- La demo no necesita ser perfecta; el objetivo es que reflexionen sobre el proceso.
- Al final, felicita a los participantes por completar las 15 sesiones.

---

**🎉 Fin del Workshop de 15 Sesiones. ¡Felicidades!**