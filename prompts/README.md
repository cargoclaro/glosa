# Estructura de Prompts para Validación Aduanera

## Organización

Los prompts están organizados por tipo de documento y operación:

```
prompts/
├── system/
│   └── glosador-base.txt          # Prompt base del sistema
├── pedimento/
│   ├── impo/                      # Pedimento importación
│   │   ├── 01-numero-pedimento.txt
│   │   ├── 02-tipo-operacion.txt
│   │   ├── 03-origen-destino.txt
│   │   ├── 04-operacion-monetaria.txt
│   │   ├── 05-pesos-bultos.txt
│   │   ├── 06-datos-factura.txt
│   │   ├── 07-datos-transporte.txt
│   │   ├── 08-cuadro-liquidacion.txt
│   │   └── 09-partidas.txt
│   └── expo/                      # Pedimento exportación
│       ├── 01-numero-pedimento.txt
│       ├── 02-tipo-operacion.txt
│       ├── 03-origen-destino.txt
│       ├── 04-operacion-monetaria.txt
│       ├── 05-pesos-bultos.txt
│       ├── 06-datos-factura.txt
│       ├── 07-datos-transporte.txt
│       └── 09-partidas.txt
└── cove/
    ├── impo/                      # COVE importación
    │   ├── 01-datos-generales.txt
    │   ├── 02-datos-proveedor-destinatario.txt
    │   └── 03-validacion-mercancias.txt
    └── expo/                      # COVE exportación
        ├── 01-datos-generales.txt
        ├── 02-datos-proveedor-destinatario.txt
        └── 03-validacion-mercancias.txt
```

## Uso en Langfuse

Cada archivo representa una sección completa de validación que incluye todas las reglas aplicables a esa sección.

### Estructura del prompt en Langfuse:

**System Prompt:**
```
{{glosador-base}} + {instrucciones de la sección}
```

**User Prompt:**
```json
{
  "section": "nombre-seccion",
  "data": {
    // Datos del expediente específico
  }
}
```

## Objetivo

Esta estructura permite:
1. Iterar instrucciones por sección completa
2. Mantener golden datasets con los datos del expediente (user prompt)
3. Medir el impacto de cambios en las instrucciones sobre múltiples expedientes
4. Optimizar la calidad de las validaciones sección por sección