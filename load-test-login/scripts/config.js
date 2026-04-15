const DEFAULT_DURATION = __ENV.TEST_DURATION || '1m';
const DEFAULT_PRE_ALLOCATED_VUS = Number(__ENV.PRE_ALLOCATED_VUS || 50);
const DEFAULT_MAX_VUS = Number(__ENV.MAX_VUS || 200);

export const BASE_URL = __ENV.BASE_URL || 'https://fakestoreapi.com';
export const LOGIN_ENDPOINT = '/auth/login';
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const TARGET_TPS = 20;
export const MAX_P95_MS = 1500;
export const MAX_ERROR_RATE = 0.03;
export const LOGIN_SUCCESS_STATUS_CODES = [200, 201];
export const SUPPORTED_TEST_TYPES = ['baseline', 'ramp', 'stress', 'spike'];

function parsePositiveNumber(envValue, fallback) {
  const parsed = Number(envValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function resolveTestType(rawTestType = __ENV.TEST_TYPE || 'baseline') {
  const normalized = String(rawTestType).trim().toLowerCase();
  if (!SUPPORTED_TEST_TYPES.includes(normalized)) {
    throw new Error(
      `TEST_TYPE invalido: "${rawTestType}". Valores permitidos: ${SUPPORTED_TEST_TYPES.join(', ')}`,
    );
  }

  return normalized;
}

function buildScenario(testType, duration) {
  const preAllocatedVUs = parsePositiveNumber(__ENV.PRE_ALLOCATED_VUS, DEFAULT_PRE_ALLOCATED_VUS);
  const maxVUs = parsePositiveNumber(__ENV.MAX_VUS, DEFAULT_MAX_VUS);

  if (testType === 'baseline') {
    return {
      login_baseline: {
        executor: 'constant-arrival-rate',
        rate: TARGET_TPS,
        timeUnit: '1s',
        duration,
        preAllocatedVUs,
        maxVUs,
      },
    };
  }

  if (testType === 'ramp') {
    return {
      login_ramp_up: {
        executor: 'ramping-vus',
        startVUs: 1,
        stages: [
          { duration: '1m', target: 20 },
          { duration: '2m', target: 50 },
          { duration: '2m', target: 100 },
        ],
        gracefulRampDown: '30s',
      },
    };
  }

  if (testType === 'stress') {
    return {
      login_stress: {
        executor: 'ramping-vus',
        startVUs: 1,
        stages: [
          { duration: '1m', target: 50 },
          { duration: '2m', target: 100 },
          { duration: '2m', target: 150 },
          { duration: '2m', target: 200 },
          { duration: '1m', target: 0 },
        ],
        gracefulRampDown: '30s',
      },
    };
  }

  return {
    login_spike: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 20 },
      ],
      gracefulRampDown: '15s',
    },
  };
}

export const TEST_TYPE = resolveTestType();

export function buildOptions(duration = DEFAULT_DURATION, testType = TEST_TYPE) {
  return {
    scenarios: buildScenario(testType, duration),
    thresholds: {
      http_req_duration: [`p(95)<${MAX_P95_MS}`],
      http_req_failed: [`rate<${MAX_ERROR_RATE}`],
      checks: ['rate>0.97'],
    },
    summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'max'],
    tags: {
      test_type: testType,
    },
  };
}
