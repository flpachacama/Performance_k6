# Conclusiones de performance - Login

**Fecha de analisis:** 15 de abril de 2026  
**Endpoint evaluado:** `POST https://fakestoreapi.com/auth/login`

## Criterios de aceptacion

- Baseline inicial: `20 TPS`
- `http_req_duration p(95) < 1500 ms`
- `http_req_failed < 3%`

## Corridas ejecutadas y evidencia actual

Se mantiene evidencia completa para escenario baseline (dos corridas historicas) y se deja preparada la estructura para `ramp`, `stress` y `spike`.

- Baseline run 1: `~19.88 req/s`, `p95 402.54 ms`, `error rate 0.00%`
- Baseline run 2: `~19.90 req/s`, `p95 398.01 ms`, `error rate 0.00%`
- Outliers puntuales detectados en run 2: maximo `6.55 s` sin impacto en p95

## Tabla comparativa obligatoria entre escenarios

| Escenario | TPS | p95 (ms) | Error Rate | VUs usados | Resultado |
| --------- | --- | -------- | ---------- | ---------- | --------- |
| Baseline  | 19.90 | 398.01 | 0.00% | ~13/50 (max 200) | Cumple |
| Ramp-Up   | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Stress    | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Spike     | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

## Interpretacion

- **Punto de degradacion:** pendiente de confirmar en `ramp` (se espera mayor latencia al acercarse a 100 VUs).
- **Punto de quiebre:** pendiente de identificar en `stress` (donde sube error rate y cae throughput efectivo).
- **Capacidad maxima sostenible:** con evidencia actual solo se confirma estabilidad en baseline.
- **Resiliencia ante picos:** pendiente de validar con `spike`.

## Estado del proyecto frente al workflow v2

- Escenarios implementados: `baseline`, `ramp`, `stress`, `spike` con `TEST_TYPE`.
- Thresholds y checks estandarizados para comparabilidad entre corridas.
- Resumen versionado por corrida en `results/{test_type}_{timestamp}_summary.json`.
- Export de `metrics.json` habilitado via `--out json=results\metrics.json`.

## Siguiente paso recomendado

Ejecutar y registrar al menos una corrida por cada escenario (`ramp`, `stress`, `spike`) para completar la tabla comparativa y determinar degradacion/quiebre con evidencia objetiva.
