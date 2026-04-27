# 📘 Sesión 12: Templates por Dominio y Reglas Avanzadas (3 horas)

## 🎯 Objetivos de la sesión
- Crear templates específicos para los dominios `auth`, `catalog` y `payments`.
- Configurar el `config.yaml` para que la IA sepa qué template usar según el dominio.
- Modificar el schema `gamestore-schema` para incluir los nuevos templates.
- Probar los templates generando cambios para cada dominio.
- Verificar que los artefactos sigan la estructura esperada.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con los schemas de la sesión anterior.
- Schema `gamestore-schema` ya creado.
- Terminal, editor de código y asistente IA.

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                                     | Duración |
| ----------- | ------------------------------------------------------------- | -------- |
| 0:00 - 0:15 | Teoría: templates por dominio y herencia                      | 15 min   |
| 0:15 - 0:45 | Crear templates específicos para auth, catalog, payments      | 30 min   |
| 0:45 - 1:15 | Configurar reglas en `config.yaml` para selección de template | 30 min   |
| 1:15 - 1:45 | Modificar el schema `gamestore-schema` para usar templates    | 30 min   |
| 1:45 - 2:15 | Probar con cambios para cada dominio                          | 30 min   |
| 2:15 - 2:45 | Verificar resultados y hacer ajustes                          | 30 min   |
| 2:45 - 3:00 | Cierre y entregables                                          | 15 min   |

---

## 📖 Actividad 1: Teoría - Templates por dominio (15 min)

**Instructor explica:**

### ¿Por qué templates por dominio?
- Cada dominio (auth, catalog, payments) tiene requisitos específicos (seguridad, rendimiento, compliance).
- Un template genérico no captura esas particularidades.
- Los templates por dominio **no son automáticos** en OpenSpec; hay que indicarle a la IA mediante reglas o contexto cuál usar.

### Estrategia
1. Crear templates en `openspec/schemas/gamestore-schema/templates/domains/`.
2. En el `config.yaml`, agregar reglas que digan: "Para cambios que afecten auth, usa el template `auth-spec.md`".
3. La IA leerá esas reglas y aplicará el template correspondiente.

### Estructura de un template de dominio
```markdown
# Delta for [DOMAIN]

## ADDED Requirements

### Requirement: {{FEATURE_NAME}}
<!-- Descripción específica del dominio -->

#### Scenario: Caso exitoso
- GIVEN ...
- WHEN ...
- THEN ...

#### Scenario: Caso de error
- GIVEN ...
- WHEN ...
- THEN ...
```

---

## 📝 Actividad 2: Crear templates específicos (30 min)

### 2.1 Crear directorio para templates de dominio

```bash
mkdir -p openspec/schemas/gamestore-schema/templates/domains
```

### 2.2 Template para `auth` (seguridad y autenticación)

```bash
cat > openspec/schemas/gamestore-schema/templates/domains/auth-spec.md << 'EOF'
# Delta for Auth

## ADDED Requirements

### Requirement: {{FEATURE_NAME}}
<!-- Ejemplo: Two-Factor Authentication, Password Reset, etc. -->

#### Scenario: Successful authentication flow
- GIVEN a user with valid credentials
- WHEN the user initiates {{FEATURE_NAME}}
- THEN the system completes the action successfully
- AND a JWT token is issued (if login)
- AND a refresh token is stored in HTTP-only cookie

#### Scenario: Failed authentication
- GIVEN invalid or expired credentials
- WHEN the user attempts {{FEATURE_NAME}}
- THEN an error message "{{ERROR_MESSAGE}}" is displayed
- AND no token is issued

#### Scenario: Rate limiting (if login)
- GIVEN 5 failed attempts in 1 minute
- WHEN a 6th attempt is made
- THEN HTTP 429 (Too Many Requests) is returned

## Security Requirements (always include)
- Passwords MUST be hashed with bcrypt (cost factor 12)
- Tokens MUST expire after {{TOKEN_EXPIRY_MINUTES}} minutes
- Refresh tokens MUST be stored in HTTP-only cookies
- All auth endpoints MUST have rate limiting (5 attempts/minute)
EOF
```

### 2.3 Template para `catalog` (rendimiento y paginación)

```bash
cat > openspec/schemas/gamestore-schema/templates/domains/catalog-spec.md << 'EOF'
# Delta for Catalog

## ADDED Requirements

### Requirement: {{FEATURE_NAME}}
<!-- Ejemplo: Product Search, Filter by Category, etc. -->

#### Scenario: Successful operation
- GIVEN products exist in database
- WHEN user requests {{FEATURE_NAME}}
- THEN results are returned with pagination ({{PAGE_SIZE}} items per page)
- AND each item includes id, name, price, stock

#### Scenario: Empty results
- GIVEN no products match the criteria
- WHEN user requests {{FEATURE_NAME}}
- THEN an empty array is returned
- AND status code 200 (not 404)

## Performance Requirements (always include)
- Response time MUST be < 500ms for 100 products
- N+1 queries MUST be avoided (use Prisma `include`)
- Images MUST be lazy-loaded
- Cache TTL: 5 minutes for product lists
- Use `parseInt(page, 10)` to avoid NaN in pagination
EOF
```

### 2.4 Template para `payments` (PCI compliance)

```bash
cat > openspec/schemas/gamestore-schema/templates/domains/payments-spec.md << 'EOF'
# Delta for Payments

## ADDED Requirements

### Requirement: {{PAYMENT_METHOD}}
<!-- Ejemplo: Credit Card, PayPal, MercadoPago -->

#### Scenario: Successful payment
- GIVEN a user with items in cart
- WHEN the user completes checkout with valid payment details
- THEN the order status becomes "PAID"
- AND a confirmation email is sent
- AND the cart is cleared

#### Scenario: Failed payment
- GIVEN invalid payment details
- WHEN payment is attempted
- THEN error message "Payment failed: {{REASON}}" is shown
- AND cart remains unchanged
- AND order status is not updated

#### Scenario: Insufficient stock during checkout
- GIVEN a product with stock = {{STOCK}}
- WHEN user tries to buy more than available
- THEN payment is rejected
- AND error message "Product out of stock" is shown

## PCI Compliance Requirements (always include)
- NEVER log credit card details (numbers, CVV, expiry)
- Use payment processor SDK (Stripe/PayPal) – never store raw card data
- Store only payment reference ID (e.g., stripe_payment_intent_id)
- All payment requests MUST be over HTTPS
- Webhook endpoints MUST verify signatures
EOF
```

### 2.5 Verificar que los templates se crearon

```bash
ls -la openspec/schemas/gamestore-schema/templates/domains/
```

---

## ⚙️ Actividad 3: Configurar reglas en `config.yaml` (30 min)

### 3.1 Editar `config.yaml` para incluir reglas de selección de template

```bash
code openspec/config.yaml
```

Agrega al final (dentro de `rules:` o al final del archivo):

```yaml
# Reglas para selección de templates por dominio
rules:
  specs:
    - "Para cambios que afecten el dominio 'auth', usa la estructura del template `domains/auth-spec.md`"
    - "Para cambios que afecten el dominio 'catalog', usa la estructura del template `domains/catalog-spec.md`"
    - "Para cambios que afecten el dominio 'payments', usa la estructura del template `domains/payments-spec.md`"
    - "Si el cambio afecta múltiples dominios, crea secciones separadas para cada uno"
    - "Mantén los requisitos de seguridad/rendimiento/compliance especificados en los templates"

# También podemos agregar contexto adicional
context: |
  ... (contexto existente)
  
  ## Domain-Specific Spec Templates
  
  When writing delta specs for specific domains, follow these templates:
  
  **Auth Domain** (`specs/auth/*.md`):
  - Include Security Requirements section (bcrypt, rate limiting, JWT expiry)
  - Use scenarios for success, failure, and rate limiting
  
  **Catalog Domain** (`specs/catalog/*.md`):
  - Include Performance Requirements section (response time, N+1, pagination)
  - Use pagination metadata (total, page, totalPages)
  
  **Payments Domain** (`specs/payments/*.md`):
  - Include PCI Compliance section
  - Never include card details in examples
```

### 3.2 Verificar la sintaxis

```bash
python3 -c "import yaml; yaml.safe_load(open('openspec/config.yaml'))"
echo "✓ YAML válido"
```

---

## 🔧 Actividad 4: Modificar el schema `gamestore-schema` (30 min)

### 4.1 Editar `schema.yaml` para usar templates por dominio (no es estrictamente necesario, pero podemos documentarlo)

```bash
code openspec/schemas/gamestore-schema/schema.yaml
```

No es necesario modificar la estructura, pero podemos agregar un comentario en `description`:

```yaml
description: GameStore workflow with security review and domain-specific spec templates (auth, catalog, payments)
```

### 4.2 Asegurar que los templates existen

```bash
openspec schema validate gamestore-schema
```

---

## 🧪 Actividad 5: Probar con cambios para cada dominio (30 min)

### 5.1 Crear cambio para dominio `auth`

```
/opsx:propose add-password-reset --schema gamestore-schema
```

```bash
# Ver el delta spec generado
cat openspec/changes/add-password-reset/specs/auth/spec.md
```

**Debe incluir:** sección de seguridad, bcrypt, rate limiting.

### 5.2 Crear cambio para dominio `catalog`

```
/opsx:propose add-category-filter --schema gamestore-schema
```

```bash
cat openspec/changes/add-category-filter/specs/catalog/spec.md
```

**Debe incluir:** requisitos de rendimiento (<500ms), paginación, evitar N+1.

### 5.3 Crear cambio para dominio `payments`

```
/opsx:propose add-paypal --schema gamestore-schema
```

```bash
cat openspec/changes/add-paypal/specs/payments/spec.md
```

**Debe incluir:** notas de PCI compliance, no almacenar datos de tarjeta.

---

## 🔍 Actividad 6: Verificar resultados y ajustar (30 min)

### 6.1 Checklist de verificación

| Template           | ¿Se aplicó? | Evidencia                        |
| ------------------ | ----------- | -------------------------------- |
| `auth-spec.md`     | [ ]         | ¿Aparecen bcrypt, rate limiting? |
| `catalog-spec.md`  | [ ]         | ¿Aparecen <500ms, paginación?    |
| `payments-spec.md` | [ ]         | ¿Aparece PCI compliance?         |

### 6.2 Si algún template no se aplicó, reforzar la regla

Por ejemplo, si el template de auth no incluyó bcrypt, edita `config.yaml`:

```yaml
rules:
  specs:
    - "Para cambios en auth, el delta spec DEBE incluir explícitamente: 'Passwords MUST be hashed with bcrypt (cost factor 12)'"
```

### 6.3 Re-generar un cambio de prueba para verificar la corrección

```
/opsx:propose test-auth-fix --schema gamestore-schema
```

### 6.4 Limpiar cambios de prueba

```bash
rm -rf openspec/changes/add-password-reset
rm -rf openspec/changes/add-category-filter
rm -rf openspec/changes/add-paypal
rm -rf openspec/changes/test-auth-fix
```

---

## 📦 Entregables de la sesión

- [ ] Templates de dominio para `auth`, `catalog`, `payments`.
- [ ] Reglas en `config.yaml` para seleccionar el template adecuado.
- [ ] Verificación de que los cambios generados siguen las plantillas.
- [ ] Comprensión de cómo extender OpenSpec con templates personalizados.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                         | Solución                                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| La IA ignora los templates por dominio           | Reforzar las reglas en `config.yaml` con ejemplos concretos.                                                                         |
| Los templates no se copian al cambio             | Los templates son solo guías; la IA lee las reglas y aplica la estructura, no copia el archivo.                                      |
| Quiero que un dominio use un template específico | Usa una regla como: "Para cambios en payments, el spec debe comenzar con '# Delta for Payments' y seguir la sección PCI Compliance". |

---

## 📚 Recursos adicionales

- [Customización de templates](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md#templates)
- [Reglas por artefacto](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md#project-configuration)

---

## 🧠 Nota para el instructor

- La sesión es autocontenida; los templates se crean y prueban en 3 horas.
- No esperes que la IA copie exactamente el template, sino que genere artefactos con estructura similar.
- Los templates por dominio son más efectivos cuando se combinan con ejemplos en el `context:`.