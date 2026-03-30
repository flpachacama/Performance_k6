# AI Workflow

## 1. Analisis del problema

Se identificó la necesidad de validar desempeño del endpoint de login con objetivos cuantificables (20 TPS, p95 < 1500 ms y error rate < 3%). También se priorizaron mantenibilidad y modularidad.

## 2. Diseno de la solucion

Se definio una arquitectura en capas:

- `scripts/config.js` para configuracion centralizada
- `scripts/utils.js` para funciones reutilizables
- `scripts/login_test.js` para el flujo de prueba
- `data/users.csv` para datos parametrizados

## 3. Seleccion de herramientas

Se selecciono **K6** por su enfoque en pruebas de rendimiento, soporte de `constant-arrival-rate`, thresholds y carga eficiente de datos con `SharedArray`.

## 4. Implementacion

Se implemento un script modular con:

- lectura de usuarios desde CSV
- seleccion aleatoria por iteracion
- request HTTP POST con headers y payload JSON
- validaciones funcionales y de rendimiento mediante `check()` y `thresholds`

## 5. Ejecucion de pruebas

Se definieron comandos estandar de ejecucion y export de resultados (`summary.json` y `metrics.json`) para analisis y trazabilidad.

## 6. Analisis de resultados

La interpretacion se centra en tres indicadores clave:

- estabilidad de 20 TPS
- cumplimiento de `p(95)<1500`
- `http_req_failed<0.03`

Los resultados deben evaluarse por corrida y por entorno para detectar variaciones operativas.

## 7. Conclusiones

La solucion propuesta cumple los requisitos funcionales y tecnicos a nivel de diseno e implementacion. El siguiente paso es ejecutar en entorno objetivo y comparar evidencia contra los criterios de aceptacion para declarar PASS/FAIL formal.
