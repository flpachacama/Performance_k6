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

export function buildOptions(duration = DEFAULT_DURATION) {
  return {
    scenarios: {
      login_load_test: {
        executor: 'constant-arrival-rate',
        rate: TARGET_TPS,
        timeUnit: '1s',
        duration,
        preAllocatedVUs: DEFAULT_PRE_ALLOCATED_VUS,
        maxVUs: DEFAULT_MAX_VUS,
      },
    },
    thresholds: {
      http_req_duration: [`p(95)<${MAX_P95_MS}`],
      http_req_failed: [`rate<${MAX_ERROR_RATE}`],
    },
    summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'max'],
  };
}
