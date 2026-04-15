# load-test-login

Proyecto de pruebas de performance para `POST /auth/login` con K6, ajustado al workflow final en `load-test-login/AI_Protocol/AI_Workflow_v2.md`.

## Objetivos base (SLA)

- `20 TPS` (baseline inicial)
- `http_req_duration p(95) < 1500 ms`
- `http_req_failed < 3%`

## Escenarios soportados

El script `load-test-login/scripts/login_test.js` usa `TEST_TYPE` para seleccionar el escenario:

- `baseline`: carga constante de `20 TPS` con `constant-arrival-rate`
- `ramp`: incremento progresivo `20 -> 50 -> 100 VUs`
- `stress`: incremento para detectar punto de quiebre (`50 -> 100 -> 150 -> 200 VUs`)
- `spike`: pico abrupto (`20 -> 200 -> 20 VUs`)

## Configuracion por variables de entorno

- `BASE_URL` (default: `https://fakestoreapi.com`)
- `TEST_TYPE` (default: `baseline`)
- `TEST_DURATION` (solo `baseline`, default: `1m`)
- `PRE_ALLOCATED_VUS` (solo `baseline`, default: `50`)
- `MAX_VUS` (solo `baseline`, default: `200`)

## Ejecucion en Windows (`cmd.exe`)

```bat
cd load-test-login

REM Baseline
k6 run scripts\login_test.js --env TEST_TYPE=baseline

REM Ramp-Up
k6 run scripts\login_test.js --env TEST_TYPE=ramp

REM Stress
k6 run scripts\login_test.js --env TEST_TYPE=stress

REM Spike
k6 run scripts\login_test.js --env TEST_TYPE=spike
```

## Exportacion de resultados

`login_test.js` ya genera automaticamente:

- `results/summary.json`
- `results/{test_type}_{timestamp}_summary.json`

Para `metrics.json` (serie completa), ejecutar con salida JSON:

```bat
cd load-test-login
k6 run scripts\login_test.js --env TEST_TYPE=baseline --out json=results\metrics.json
```

## Convencion recomendada para versionado

Para mantener evidencia comparable por corrida:

- `results/baseline_YYYYMMDD_HHMMSS_summary.json`
- `results/ramp_YYYYMMDD_HHMMSS_summary.json`
- `results/stress_YYYYMMDD_HHMMSS_summary.json`
- `results/spike_YYYYMMDD_HHMMSS_summary.json`

## Metricas clave para analisis

- `http_req_duration` (`p95`, `p99`)
- `http_req_failed`
- `iterations`
- `vus` / `vus_max`
- throughput real (`http_reqs`)

## Estructura relevante

```text
load-test-login/
|-- data/users.csv
|-- results/
|-- scripts/
|   |-- config.js
|   |-- login_test.js
|   `-- utils.js
`-- AI_Protocol/AI_Workflow_v2.md
```