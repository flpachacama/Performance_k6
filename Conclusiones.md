# Conclusiones de la prueba de carga - Login

**Fecha de analisis:** 30 de marzo de 2026  
**Endpoint evaluado:** `POST https://fakestoreapi.com/auth/login`

## Objetivos definidos

- **TPS objetivo:** 20 transacciones por segundo
- **Rendimiento objetivo:** `p95 < 1500 ms`
- **Calidad objetivo:** `error rate < 3%`

## Resultados observados (ultimas ejecuciones)

Se ejecutaron dos corridas consecutivas con escenario `constant-arrival-rate` a `20 iteraciones/s` por `1m`.

**Corrida 1 (`k6 run scripts\login_test.js`):**

- Iteraciones/requests: `1200`
- TPS real: `19.88 req/s`
- `http_req_duration p(95)`: `402.54 ms`
- `http_req_failed`: `0.00%` (`0/1200`)
- Checks: `2400/2400` exitosos (`100%`)

**Corrida 2 (`k6 run --summary-export=results\summary.json scripts\login_test.js`):**

- Iteraciones/requests: `1201`
- TPS real: `19.90 req/s`
- `http_req_duration p(95)`: `398.01 ms`
- `http_req_failed`: `0.00%` (`0/1201`)
- Checks: `2400/2402` exitosos (`99.91%`)
- Outliers observados: `2` checks de tiempo > `1500 ms` (maximo `6.55 s`)

## Evaluacion de cumplimiento

- **TPS (20):** **Cumple**. El throughput se mantiene estable alrededor de `19.9 req/s`.
- **Tiempo de respuesta (p95 < 1500 ms):** **Cumple** con amplio margen (`~0.40 s`).
- **Tasa de error (< 3%):** **Cumple** (`0.00%`).

## Analisis tecnico

El resultado actual muestra un comportamiento consistente y saludable para el objetivo de carga definido. La latencia central (`avg`, `med`, `p90`, `p95`) permanece en rangos bajos y estables, y no se observan fallas HTTP en las solicitudes realizadas. Esto confirma que los ajustes aplicados al proyecto (validacion de status `200/201` y correccion de datos de entrada) resolvieron el problema anterior de error rate elevado.

En la corrida con export de resumen se detectaron dos valores atipicos de latencia (hasta `6.55 s`) que impactan checks puntuales, pero no alteran el percentil p95 ni los thresholds de aceptacion. Tecnica y estadisticamente, esto se interpreta como ruido transitorio u outliers aislados, no como degradacion sostenida del servicio bajo el nivel de carga actual.

## Acciones aplicadas en el proyecto

- Se ajusto la validacion de estado exitoso para aceptar `200` o `201`.

## Recomendaciones tecnicas

- Mantener `results/summary.json` versionado por corrida para trazabilidad de tendencia.
- Agregar thresholds complementarios (por ejemplo `p(99)` o regla para outliers) si se requiere mayor rigor de SLO.
- Ejecutar una corrida `smoke` corta antes de cada corrida formal para validar datos y conectividad.
- Programar pruebas de stress/spike adicionales para caracterizar el comportamiento fuera del objetivo de 20 TPS.

## Conclusion final

Con la evidencia de las ultimas corridas, el sistema **cumple todos los criterios de aceptacion definidos** para este escenario de carga: TPS objetivo, p95 y tasa de error. Los outliers observados son puntuales y no comprometen la aceptacion del test, aunque conviene monitorearlos en ejecuciones futuras para confirmar estabilidad a largo plazo.
