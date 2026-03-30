# load-test-login

Proyecto de prueba de carga para el endpoint de autenticacion `POST /auth/login` de Fake Store API usando K6.

## Objetivo

Validar que el servicio de login cumpla los siguientes criterios de desempeno:

- **20 TPS** (20 iteraciones por segundo)
- **p95 < 1500 ms**
- **error rate < 3%**

## Tecnologia usada

- **K6** (recomendado: `v0.49.0` o superior)

## Estructura del proyecto

```text
load-test-login/
|-- data/
|   `-- users.csv
|-- scripts/
|   |-- config.js
|   |-- login_test.js
|   `-- utils.js
|-- results/
|-- README.md
|-- conclusiones.txt
`-- AI_Workflow.md
```

## Instalacion paso a paso

1. Instala K6 en Windows (Chocolatey):

```bat
choco install k6
```

2. Verifica la instalacion:

```bat
k6 version
```

## Datos de entrada

El archivo `data/users.csv` contiene usuarios para la prueba y se carga con `SharedArray` para optimizar memoria.

## Configuracion

La configuracion central esta en `scripts/config.js`.

Variables opcionales por entorno:

- `BASE_URL` (default: `https://fakestoreapi.com`)
- `TEST_DURATION` (default: `1m`)
- `PRE_ALLOCATED_VUS` (default: `50`)
- `MAX_VUS` (default: `200`)

Ejemplo de uso en Windows (`cmd.exe`):

```bat
set TEST_DURATION=2m
set PRE_ALLOCATED_VUS=60
set MAX_VUS=250
k6 run scripts\login_test.js
```

## Como ejecutar la prueba

Ejecucion basica:

```bat
k6 run scripts\login_test.js
```

Ejecucion con export de resumen JSON:

```bat
k6 run --summary-export=results\summary.json scripts\login_test.js
```

Ejecucion con stream de metricas en JSON (analisis posterior):

```bat
k6 run --out json=results\metrics.json scripts\login_test.js
```

## Ejemplo de ejecucion

```bat
set TEST_DURATION=1m
k6 run --summary-export=results\summary.json scripts\login_test.js
```

## Explicacion de metricas

- **TPS (Transactions Per Second):** en este test se controla con `constant-arrival-rate` a `rate: 20` por segundo.
- **p95 (http_req_duration):** el 95% de las respuestas debe ser menor a `1500 ms`.
- **error rate (http_req_failed):** menos del `3%` de requests fallidos.

## Generacion y lectura de reportes

- `results/summary.json`: resumen final para seguimiento y evidencia.
- `results/metrics.json`: serie detallada por muestra para analisis profundo.

Puedes versionar `summary.json` para comparar ejecuciones entre cambios de codigo o infraestructura.
