#!/bin/bash
# Script para validar todos los cambios de OpenSpec

echo "🔍 Validando OpenSpec..."

# Ejecutar validación y guardar JSON
OUTPUT=$(openspec validate --all --json 2>/dev/null)

# Extraer número de inválidos
INVALID=$(echo "$OUTPUT" | jq '.summary.invalid')

if [ "$INVALID" -eq "0" ]; then
    echo "✅ Todos los cambios son válidos"
    exit 0
else
    echo "❌ Se encontraron $INVALID cambios inválidos:"
    echo "$OUTPUT" | jq -r '.results.changes[] | select(.valid == false) | "  - \(.name): \(.errors[])"'
    exit 1
fi