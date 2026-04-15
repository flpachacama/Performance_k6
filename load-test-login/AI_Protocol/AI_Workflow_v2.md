# AI Workflow_v2 - Pruebas de Performance con K6

## 1. Analisis del problema

Se identificó la necesidad de validar el desempeño del endpoint de login con objetivos cuantificables:

* 20 TPS (baseline inicial)
* p95 < 1500 ms
* error rate < 3%

Sin embargo, se detectó que esta carga es insuficiente para estresar el sistema, evidenciado por:

* Bajo uso de VUs (≈13 de 50 preasignados y 200 máximos)
* Baja presión sobre el sistema bajo prueba

### Enfoque mejorado

Se amplía el alcance para incluir:

* Evaluación con carga progresiva (ramp-up)
* Pruebas de estrés (stress test)
* Pruebas de picos (spike test)
* Análisis detallado de métricas
* Comparación formal entre corridas

---

## 2. Diseño de la solución

Se mantiene la arquitectura modular existente:

* `scripts/config.js` → configuración centralizada
* `scripts/utils.js` → funciones reutilizables
* `scripts/login_test.js` → flujo principal de prueba
* `data/users.csv` → datos parametrizados

### Extensión del diseño

Se incorporan múltiples escenarios dentro del mismo script:

* Baseline
* Ramp-Up
* Stress
* Spike

Configurados dinámicamente mediante variables de entorno (`TEST_TYPE`).

---

## 3. Selección de herramientas

Se selecciona **K6** por:

* Soporte de `constant-arrival-rate` y `ramping-vus`
* Manejo eficiente de concurrencia
* Thresholds nativos
* Exportación de métricas (`summary.json`, `metrics.json`)
* Integración con análisis posterior

---

## 4. Implementación

### 4.1 Tipos de escenarios

#### Baseline

* 20 TPS constantes
* Validación inicial de SLA

#### Ramp-Up

* Incremento progresivo de carga
* Permite observar degradación del sistema

Ejemplo:

```javascript
stages: [
  { duration: '1m', target: 20 },
  { duration: '2m', target: 50 },
  { duration: '2m', target: 100 }
]
```

---

#### Stress Test

* Incremento hasta encontrar el punto de quiebre
* Identifica capacidad máxima del sistema

---

#### Spike Test

* Incremento abrupto de carga

Ejemplo:

```javascript
stages: [
  { duration: '30s', target: 20 },
  { duration: '30s', target: 200 },
  { duration: '30s', target: 20 }
]
```

---

### 4.2 Manejo de VUs

* Ajuste dinámico según escenario
* Monitoreo de:

    * `vus`
    * `vus_max`

Objetivo:

* Detectar saturación de concurrencia
* Validar uso real de recursos

---

### 4.3 Validaciones

Se implementan:

* `check()` para validaciones funcionales
* `thresholds` para criterios de aceptación

Se amplía a:

* Evaluación de degradación progresiva
* Comparación entre escenarios

---

### 4.4 Manejo de datos

* Lectura de usuarios desde `data/users.csv`
* Uso de `SharedArray`
* Selección aleatoria por iteración

---

## 5. Ejecución de pruebas

### Ejecución por tipo de prueba

```bash
k6 run scripts/login_test.js --env TEST_TYPE=baseline
k6 run scripts/login_test.js --env TEST_TYPE=ramp
k6 run scripts/login_test.js --env TEST_TYPE=stress
k6 run scripts/login_test.js --env TEST_TYPE=spike
```

---

### Exportación de resultados

Se generan:

* `summary.json`
* `metrics.json`

### Versionado de resultados

```text
results/
  baseline_run1.json
  ramp_run1.json
  stress_run1.json
  spike_run1.json
```

---

## 6. Análisis de resultados

### 6.1 Métricas clave (obligatorio analizar)

* `http_req_duration` (p95, p99)
* `http_req_failed`
* `iterations`
* `vus` / `vus_max`
* throughput real

---

### 6.2 Análisis de metrics.json

Se debe analizar explícitamente:

* Tendencias de latencia
* Picos de respuesta
* Comportamiento bajo carga
* Saturación del sistema

---

### 6.3 Tabla comparativa entre corridas (OBLIGATORIA)

| Escenario | TPS | p95 (ms) | Error Rate | VUs usados | Resultado |
| --------- | --- | -------- | ---------- | ---------- | --------- |
| Baseline  | 20  | ---      | ---        | ---        | ---       |
| Ramp-Up   | --- | ---      | ---        | ---        | ---       |
| Stress    | --- | ---      | ---        | ---        | ---       |
| Spike     | --- | ---      | ---        | ---        | ---       |

---

### 6.4 Interpretación

Se deben identificar:

* Punto de degradación
* Punto de quiebre
* Capacidad máxima sostenible
* Comportamiento ante picos

---

## 7. Estrategia de pruebas

| Tipo     | Objetivo                       |
| -------- | ------------------------------ |
| Baseline | Validar SLA inicial            |
| Ramp-Up  | Evaluar degradación progresiva |
| Stress   | Encontrar límite del sistema   |
| Spike    | Evaluar resiliencia            |

---

## 8. Buenas prácticas

* No depender únicamente de cargas bajas
* Incluir siempre ramp-up en pruebas reales
* Analizar métricas, no solo generarlas
* Versionar resultados por corrida
* Comparar resultados entre escenarios
* No asumir capacidad sin evidencia
* Mantener scripts modulares y reutilizables

---

## 9. Evolución del workflow

### Antes

* Solo baseline (20 TPS)
* Bajo uso de VUs
* Sin escenarios avanzados
* Sin análisis profundo

### Ahora

* Múltiples escenarios (baseline, ramp, stress, spike)
* Carga progresiva y realista
* Análisis completo de métricas
* Comparación formal entre ejecuciones
* Identificación de límites del sistema

---

## 10. Conclusión

El workflow mejorado permite:

* Evaluar el sistema bajo condiciones reales
* Detectar límites de capacidad
* Identificar problemas de escalabilidad
* Generar evidencia objetiva y comparable

La solución evoluciona hacia un enfoque profesional de pruebas de performance, alineado con buenas prácticas de QA y observabilidad.

---
