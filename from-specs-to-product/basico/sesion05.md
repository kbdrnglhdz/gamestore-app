# 📘 Sesión 5: Exploración con `/opsx:explore` (3 horas)

## 🎯 Objetivos de la sesión
- Usar `/opsx:explore` para investigar un problema sin crear un cambio.
- Aprender a hacer preguntas abiertas y específicas a la IA.
- Documentar hallazgos, causas raíz y posibles soluciones.
- Comparar opciones y preparar una recomendación.
- **No se crea ningún cambio**; solo se genera un archivo de investigación.

## 📦 Material necesario
- Proyecto `gamestore-workshop` con OpenSpec inicializado (sesiones anteriores completadas).
- Terminal abierta en la raíz del proyecto.
- Editor de código.
- Asistente IA configurado (Claude Code, Cursor, etc.).

---

## ⏱️ Cronograma de la sesión (3 horas)

| Hora        | Actividad                                       | Duración |
| ----------- | ----------------------------------------------- | -------- |
| 0:00 - 0:15 | Repaso del bug de paginación (contexto)         | 15 min   |
| 0:15 - 0:30 | Teoría: `/opsx:explore` y casos de uso          | 15 min   |
| 0:30 - 1:15 | Exploración inicial con la IA                   | 45 min   |
| 1:15 - 2:00 | Profundización y análisis de alternativas       | 45 min   |
| 2:00 - 2:30 | Documentación de hallazgos (archivo markdown)   | 30 min   |
| 2:30 - 2:50 | Preparación de recomendación para cambio futuro | 20 min   |
| 2:50 - 3:00 | Cierre y entregables                            | 10 min   |

---

## 🐛 Actividad 1: Contexto del bug de paginación (15 min)

**Instructor:**  
> "En la especificación de `catalog` documentamos un bug: la página 2 muestra los mismos productos que la página 1. Vamos a investigar por qué ocurre y cómo solucionarlo, **sin crear un cambio todavía**."

**Verificar el bug manualmente (opcional):**
```bash
# Si el backend está corriendo
curl "http://localhost:3000/api/products?page=1&limit=10"
curl "http://localhost:3000/api/products?page=2&limit=10"
# Comparar resultados
```

**Revisar el spec actual:**
```bash
cat openspec/specs/catalog/spec.md | grep -A 15 "Product Pagination"
```

---

## 📖 Actividad 2: Teoría - `/opsx:explore` (15 min)

**Instructor explica:**

- **`/opsx:explore`** es para **investigar, no para crear**.  
- La IA puede leer archivos, buscar patrones, analizar código y proponer hipótesis.
- No genera artefactos ni carpetas en `changes/`.
- Puedes transicionar a un cambio después con: *"Crea un cambio basado en esta exploración"*.

**Casos de uso ideales:**
- Problemas difusos ("la app es lenta").
- Múltiples causas posibles.
- Antes de refactorizar.
- Comparar opciones técnicas.

**Ejemplo de prompt:**
```
/opsx:explore "Investiga por qué la paginación del catálogo devuelve los mismos productos en todas las páginas"
```

---

## 🔍 Actividad 3: Exploración inicial con la IA (45 min)

### 3.1 Ejecutar exploración básica

En el chat del asistente IA:

```
/opsx:explore "Investiga el bug de paginación en GameStore. El endpoint /api/products?page=2 devuelve los mismos productos que page=1. Analiza el código del backend y encuentra la causa raíz."
```

**La IA debería:**
1. Buscar el controlador de productos (`backend/src/controllers/productController.ts`).
2. Identificar la lógica de paginación (posiblemente `skip` y `take` mal calculados).
3. Señalar el error: `skip = (page - 1) * limit` pero quizás `page` no se está parseando como número.

### 3.2 Capturar hallazgos iniciales

Pide a la IA que resuma:

```
Usuario: Resume en 3 puntos los hallazgos principales.

AI: 1. El controlador usa `req.query.page` sin convertirlo a número, por lo que `(page - 1)` da NaN.
     2. Prisma `skip` recibe NaN, lo que se interpreta como 0.
     3. Siempre se devuelven los primeros `limit` productos.
```

### 3.3 Verificar el código manualmente (confirmación)

```bash
cat backend/src/controllers/productController.ts | grep -A 10 "getProducts"
```

Buscar la línea problemática.

---

## 🧠 Actividad 4: Profundización y análisis de alternativas (45 min)

### 4.1 Explorar soluciones posibles

```
Usuario: ¿Cuáles son las posibles soluciones? Compáralas en esfuerzo e impacto.
```

**La IA debería proponer:**

| Solución                                 | Esfuerzo | Impacto | Riesgo |
| ---------------------------------------- | -------- | ------- | ------ |
| Convertir `page` a número con `parseInt` | Bajo     | Alto    | Bajo   |
| Usar `Number(page)` o `+page`            | Bajo     | Alto    | Bajo   |
| Validar que `page` sea entero positivo   | Medio    | Alto    | Bajo   |
| Cambiar a cursor-based paginación        | Alto     | Medio   | Medio  |

### 4.2 Solicitar un diagrama del flujo actual vs corregido

```
Usuario: Muestra un diagrama de flujo de cómo funciona la paginación ahora y cómo debería funcionar.
```

**La IA puede dibujar algo como:**

```
ACTUAL:
page=2 → req.query.page = "2" (string)
→ skip = ("2" - 1) * limit → NaN
→ Prisma skip = 0 → primeros 10 productos

CORREGIDO:
page=2 → req.query.page = "2" → parseInt("2") → 2
→ skip = (2 - 1) * limit → 10
→ Prisma skip = 10 → productos 11-20
```

### 4.3 Identificar otros problemas relacionados

```
Usuario: Además del parseo, ¿hay otros problemas de paginación? Revisa el frontend.
```

La IA puede encontrar que el frontend no maneja correctamente el número total de páginas o que el endpoint no devuelve metadatos.

---

## 📝 Actividad 5: Documentación de hallazgos (30 min)

### 5.1 Crear archivo de investigación

```bash
mkdir -p docs/investigations
```

**Copiar y pegar todo el bloque para crear el archivo:**

```bash
cat > docs/investigations/pagination-bug.md << 'EOF'
# Investigación: Bug de paginación en catálogo

**Fecha:** $(date +%Y-%m-%d)
**Exploración:** `/opsx:explore`
**Investigador:** [Nombre del participante]

## Problema
El endpoint `GET /api/products?page=2&limit=10` devuelve los mismos productos que `page=1`.

## Causa raíz
En `backend/src/controllers/productController.ts`:

```typescript
const page = req.query.page;        // string | undefined
const limit = req.query.limit;      // string | undefined
const skip = (page - 1) * limit;    // page es string → NaN
```

`page` se usa directamente en operaciones aritméticas sin convertirlo a número, resultando en `NaN`. Prisma interpreta `NaN` como `0`, por lo que siempre se salta 0 registros.

## Hallazgos adicionales
- El frontend no muestra el número total de páginas.
- No hay validación para `page` negativo o no numérico.
- El endpoint no devuelve metadatos de paginación (total, totalPages).

## Soluciones propuestas

| Solución                            | Esfuerzo | Impacto | Riesgo |
| ----------------------------------- | -------- | ------- | ------ |
| Convertir con `parseInt(page, 10)`  | Bajo     | Alto    | Bajo   |
| Usar `Number(page)` y validar       | Bajo     | Alto    | Bajo   |
| Implementar paginación cursor-based | Alto     | Medio   | Medio  |

## Recomendación
**Solución elegida:** Convertir `page` a número con `parseInt` y agregar validación.
**Razón:** Bajo esfuerzo, resuelve el bug inmediatamente, bajo riesgo.

## Pasos siguientes
1. Crear cambio `fix-pagination` con `/opsx:propose` o `/opsx:new`.
2. Implementar la corrección en backend.
3. Agregar metadatos de paginación en la respuesta.
4. Actualizar frontend para usar los metadatos.

## Código de ejemplo (corrección)
```typescript
const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
const limit = Math.min(100, parseInt(req.query.limit as string, 10) || 10);
const skip = (page - 1) * limit;
```
EOF
```

### 5.2 Verificar que el archivo se creó

```bash
cat docs/investigations/pagination-bug.md | head -20
```

---

## 📋 Actividad 6: Preparación para cambio futuro (20 min)

### 6.1 Resumir la recomendación ejecutiva

```bash
cat > docs/investigations/pagination-recommendation.md << 'EOF'
# Recomendación para cambio: fix-pagination

## Prioridad: Alta
## Esfuerzo estimado: 2 horas

## Cambio propuesto
- **Nombre:** `fix-pagination`
- **Tipo:** Bug fix
- **Dominio:** catalog

## Pasos concretos (para tasks.md)
1. Modificar `productController.ts` para parsear `page` y `limit` correctamente.
2. Agregar validación (valores mínimos y máximos).
3. Incluir metadatos en la respuesta: `{ data, total, page, totalPages }`.
4. Actualizar frontend para mostrar paginación con números.
5. Probar con diferentes valores de página.

## Riesgos
- Bajo. Solo afecta al endpoint de listado.
- Compatibilidad: frontend espera solo array, habrá que actualizarlo también.

## Rollback
- Revertir el cambio en el controlador y frontend.
EOF
```

### 6.2 Verificar que no se creó ningún cambio en OpenSpec

```bash
openspec list --changes
```

Debe mostrar **ningún cambio activo** (solo los archivados de sesiones anteriores).

---

## 📦 Entregables de la sesión

Al finalizar la sesión, cada participante debe tener:

- [ ] Archivo `docs/investigations/pagination-bug.md` con el análisis completo.
- [ ] Archivo `docs/investigations/pagination-recommendation.md` con los pasos para el cambio.
- [ ] Comprensión de cómo usar `/opsx:explore` para investigar problemas.
- [ ] Capacidad de documentar hallazgos de forma estructurada.
- [ **No se ha creado ningún cambio**; el cambio se hará en la Sesión 6.

---

## ❓ Preguntas frecuentes (para el instructor)

| Problema                                  | Solución                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| La IA no encuentra el código fuente       | Asegurar que el proyecto está en la raíz y que la IA tiene acceso a los archivos.                    |
| La exploración es demasiado genérica      | Refinar el prompt: "Analiza específicamente el archivo `productController.ts` líneas 20-30".         |
| No sé cómo transicionar a un cambio       | Usar: *"Crea un cambio `fix-pagination` basado en esta exploración"* (se hará en la próxima sesión). |
| Los archivos de documentación no se crean | Verificar que el directorio `docs/investigations/` existe o crearlo manualmente.                     |

---

## 📚 Recursos adicionales (para el participante)

- [Comando `/opsx:explore` - documentación oficial](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md#opsxexplore)
- [Workflow exploratorio](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md#exploratory)

---

## 🧠 Nota para el instructor

- La sesión es **100% autocontenida**; no se crean cambios, solo documentación.
- Si el grupo es rápido, pueden ejecutar también una exploración adicional (ej. el bug del filtro de precios).
- Al final, deben tener claro que la exploración es el paso previo a crear un cambio informado.
- Enfatiza que los archivos de investigación **no son artefactos de OpenSpec** (están fuera de `openspec/`), pero sirven como insumo.