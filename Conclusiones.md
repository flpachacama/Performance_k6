# Conclusiones de la prueba de carga - Login

**Fecha de analisis:** 30 de marzo de 2026  
**Endpoint evaluado:** `POST https://fakestoreapi.com/auth/login`

## Objetivos definidos

- **TPS objetivo:** 20 transacciones por segundo
- **Rendimiento objetivo:** `p95 < 1500 ms`
- **Calidad objetivo:** `error rate < 3%`

## Resultados observados (ejecucion reportada)

- **Escenario:** `constant-arrival-rate`
- **Carga configurada:** `20 iteraciones/s` durante `1m`
- **Iteraciones totales:** `1201`
- **TPS real:** `19.84 it/s` (alineado con el objetivo)
- **p95 de latencia (`http_req_duration`):** `453.98 ms` ✅
- **Error rate (`http_req_failed`):** `18.65%` ❌
- **Checks:**
  - `status is 200`: `0/1201` ❌
  - `response time < 1500 ms`: `1201/1201` ✅

## Evaluacion de cumplimiento

- **TPS (20):** **Cumple**. El throughput se mantiene cerca del objetivo.
- **Tiempo de respuesta (p95 < 1500 ms):** **Cumple** con margen amplio.
- **Tasa de error (< 3%):** **No cumple**. La prueba falla por errores funcionales/HTTP.

## Analisis tecnico

1. El principal problema no es de performance, sino de **validacion funcional y calidad de respuesta HTTP**.
2. La latencia es buena y estable; el sistema responde rapido incluso bajo carga constante.
3. El error rate elevado sugiere combinacion de:
   - credenciales invalidas en parte del dataset,
   - criterio de validacion de status demasiado estricto (`200` unicamente),
   - posibles respuestas alternas del API (por ejemplo `201` en autenticacion exitosa).

## Acciones aplicadas en el proyecto

- Se ajustó la validacion de estado exitoso para aceptar `200` o `201`.

## Recomendaciones tecnicas

- Re-ejecutar la prueba con los ajustes y confirmar que `http_req_failed` baje de `3%`.
- Exportar resumen por corrida en `results/summary.json` para trazabilidad.
- Enriquecer observabilidad del script con metricas por codigo HTTP (2xx/4xx/5xx).
- Mantener un set de credenciales validado y versionado para evitar falsos negativos.
- Agregar una corrida `smoke` previa (30-60s) antes de la carga completa.

## Conclusion final

Con la evidencia de la corrida reportada, el sistema **cumple en TPS y latencia**, pero **no cumple en tasa de error**. Tras los ajustes ya aplicados al proyecto (dataset y validacion de status), se espera una mejora directa del indicador `http_req_failed`. El cierre formal de aceptacion debe hacerse con una nueva corrida y evidencia actualizada.
