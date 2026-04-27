# 📘 Sesión 1: Setup y documentación inicial (3 horas)

## 🎯 Objetivos de la sesión
- Instalar OpenSpec globalmente.
- Inicializar OpenSpec en el proyecto GameStore.
- Crear las primeras especificaciones (`auth` y `catalog`) documentando el comportamiento actual (con bugs).
- Validar que las especificaciones sean correctas.

## 📦 Material necesario
- Computadora con Node.js 20.19+ y npm.
- Proyecto `gamestore-workshop` clonado (https://github.com/kbdrnglhdz/gamestore-workshop).
- Terminal abierta en la raíz del proyecto.
- Editor de código (VS Code recomendado).

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                     | Duración |
| ----------- | --------------------------------------------- | -------- |
| 0:00 - 0:30 | Teoría mínima + verificación de requisitos    | 30 min   |
| 0:30 - 0:45 | Instalación de OpenSpec                       | 15 min   |
| 0:45 - 1:15 | Inicialización del proyecto (`openspec init`) | 30 min   |
| 1:15 - 2:30 | Creación de especificaciones (copiar-pegar)   | 75 min   |
| 2:30 - 2:50 | Validación y exploración con CLI              | 20 min   |
| 2:50 - 3:00 | Cierre y entregables                          | 10 min   |

---

## 🔧 Actividad 1: Verificación de requisitos (10 min)

**Instructor:**  
Abre una terminal en la raíz del proyecto `gamestore-workshop` y ejecuta los siguientes comandos para asegurar que todo está listo.

```bash
# Verificar versión de Node.js (debe ser >= 20.19)
node --version

# Verificar npm
npm --version

# Verificar que estamos en el directorio correcto (debe mostrar "gamestore-workshop")
pwd
ls -la
```

**Solución de problemas:**  
Si la versión de Node.js es anterior, instalar desde [nodejs.org](https://nodejs.org) o usar nvm.

---

## 🔧 Actividad 2: Instalación global de OpenSpec (15 min)

Copia y pega el siguiente comando en la terminal:

```bash
npm install -g @fission-ai/openspec@latest
```

Verifica que la instalación fue exitosa:

```bash
openspec --version
```

**Salida esperada:** `0.5.0` o superior.

---

## 🔧 Actividad 3: Inicialización de OpenSpec (30 min)

### 3.1 Ejecutar `openspec init`

```bash
openspec init
```

El comando es **interactivo**. Responde de la siguiente manera (copiar y pegar las respuestas exactas):

1. **¿Qué herramientas deseas configurar?**  
   Usa las flechas para seleccionar `claude` y `cursor`. Luego presiona **Espacio** para marcar, y **Enter** para continuar.  
   *Si no usas esas herramientas, igual selecciónalas (no afecta).*

2. **¿Configurar un esquema por defecto?**  
   Responde: `Y` (yes)

3. **Selecciona el esquema por defecto:**  
   Elige `spec-driven` (es la opción por defecto).

4. **¿Habilitar comandos de workflow expandido?**  
   Responde: `N` (no, por ahora usaremos el perfil core).

5. **¿Deseas crear un archivo de configuración del proyecto?**  
   Responde: `Y` (yes). Acepta los valores por defecto.

### 3.2 Verificar la estructura creada

```bash
ls -la openspec/
```

Deberías ver:

```
openspec/
├── config.yaml
├── specs/
│   └── .gitkeep
└── changes/
    └── .gitkeep
```

### 3.3 Verificar que los skills/commands se generaron

```bash
# Para Claude Code (si lo usas)
ls .claude/skills/ | grep openspec

# Para Cursor
ls .cursor/commands/ | grep opsx
```

**Nota:** Si no ves los skills, ejecuta `openspec update`.

---

## 📝 Actividad 4: Crear especificaciones (75 min)

### 4.1 Crear directorio para el dominio `auth`

```bash
mkdir -p openspec/specs/auth
```

### 4.2 Crear archivo `spec.md` para autenticación (copiar todo el bloque)

Copia exactamente el siguiente contenido y pégalo en la terminal (o usa un editor para crear el archivo).  
**Comando para crear el archivo directamente (copiar y pegar todo el bloque):**

```bash
cat > openspec/specs/auth/spec.md << 'EOF'
 # Auth Specification

## Purpose
Authentication and session management for GameStore.

## Requirements

### Requirement: User Login
Users SHALL authenticate with email and password.

#### Scenario: Valid credentials
- **WHEN** the user submits login form with email "test@example.com" and password "secret"
- **THEN** a JWT access token is returned
- **AND** a refresh token is stored in HTTP-only cookie

#### Scenario: Invalid credentials
- **WHEN** the user submits login form with invalid email or password
- **THEN** an error message "Invalid credentials" is displayed
- **AND** no tokens are issued

### Requirement: Session Persistence
Users SHALL maintain session for 15 minutes after login.

#### Scenario: Session timeout
- **WHEN** 15 minutes pass without any request
- **THEN** the session expires
- **AND** the user must log in again

### Requirement: Password Storage
Users SHALL store passwords securely.

#### Scenario: Password is encrypted
- **WHEN** a user creates or updates their password
- **THEN** the password is stored encrypted in the database

### Requirement: Logout
Users SHALL be able to end their session.

#### Scenario: User logout
- **WHEN** the user clicks logout
- **THEN** the session is terminated
- **AND** tokens are cleared
EOF
```

### 4.3 Crear directorio para el dominio `catalog`

```bash
mkdir -p openspec/specs/catalog
```

### 4.4 Crear archivo `spec.md` para catálogo (copiar todo el bloque)

```bash
cat > openspec/specs/catalog/spec.md << 'EOF'
# Catalog Specification

## Purpose
Product listing, filtering, and pagination for GameStore.

## Requirements

### Requirement: Product Pagination
Users SHALL view products paginated in pages of 10 items.

#### Scenario: First page
- **WHEN** the user requests page 1 with 50 products in database
- **THEN** products 1-10 are returned

#### Scenario: Second page
- **WHEN** the user requests page 2 with 50 products in database
- **THEN** products 11-20 are returned

### Requirement: Price Filter
Users SHALL filter products by price range.

#### Scenario: Filter by price
- **WHEN** the user applies filter price between 10 and 30
- **THEN** products with price 15 and 25 are shown

### Requirement: Product Images
Users SHALL see product images displayed correctly.

#### Scenario: Image loads from CDN
- **WHEN** a product has an image configured
- **THEN** the image loads from CDN URL
EOF
```

### 4.5 Verificar que los archivos se crearon correctamente

```bash
ls -la openspec/specs/auth/
ls -la openspec/specs/catalog/
cat openspec/specs/auth/spec.md | head -10
cat openspec/specs/catalog/spec.md | head -10
```

---

## ✅ Actividad 5: Validación y exploración (20 min)

### 5.1 Validar todas las especificaciones

```bash
openspec validate --specs
```

**Salida esperada:** Ambas especificaciones deben ser válidas (posibles warnings por formato, pero no errores críticos).

### 5.2 Validar una especificación específica

```bash
openspec validate auth --type spec
openspec validate catalog --type spec
```

### 5.3 Listar las especificaciones

```bash
openspec list --specs
```

**Salida esperada:**
```
Specs:
  auth     Authentication and session management
  catalog  Product listing and filtering
```

### 5.4 Mostrar el contenido de una especificación

```bash
openspec show auth --type spec
openspec show catalog --type spec --requirements
```

### 5.5 Probar el dashboard interactivo (opcional)

```bash
openspec view
```

Usa las flechas para navegar, `Enter` para seleccionar, `q` para salir.

---

## 📦 Entregables de la sesión

Al finalizar la sesión, cada participante debe tener:

- [ ] OpenSpec instalado globalmente.
- [ ] Proyecto inicializado (`openspec/` con `config.yaml`).
- [ ] Archivos `openspec/specs/auth/spec.md` y `openspec/specs/catalog/spec.md` completos (copiados).
- [ ] Validación exitosa con `openspec validate --specs`.
- [ ] Comprensión básica de los comandos `list`, `show`, `validate`.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                                   | Solución                                                                   |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| `command not found: openspec`                              | Reinstalar con `npm install -g @fission-ai/openspec@latest`                |
| `openspec init` no crea skills                             | Ejecutar `openspec update` después del init                                |
| El comando `cat > archivo << 'EOF'` no funciona en Windows | Usar Git Bash o PowerShell; o crear los archivos manualmente con el editor |
| La validación muestra warnings por formato                 | Los warnings son aceptables; lo importante es que no haya errores críticos |

---

## 📚 Recursos adicionales (para el participante)

- [Documentación oficial de OpenSpec (CLI)](https://github.com/Fission-AI/OpenSpec)
- [Comandos básicos - cheatsheet](sesion1-cheatsheet.md) (proporcionar como handout)

---

## 🧠 Nota para el instructor

- Asegúrate de que todos los participantes tengan el repositorio `gamestore-workshop` clonado **antes** de empezar.
- Durante la creación de los archivos `spec.md`, los participantes pueden simplemente copiar y pegar los bloques completos. No es necesario que escriban nada manualmente.
- Si alguien tiene problemas con `cat << EOF`, puede crear los archivos con su editor de texto (VS Code) y copiar el contenido desde el material del taller.