import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import {
  BASE_URL,
  LOGIN_ENDPOINT,
  HEADERS,
  LOGIN_SUCCESS_STATUS_CODES,
  MAX_P95_MS,
  TEST_TYPE,
  buildOptions,
} from './config.js';
import {
  parseCsvUsers,
  getRandomUser,
  buildLoginUrl,
  createLoginPayload,
  normalizeTestType,
  buildRunId,
  buildScenarioSummaryPath,
} from './utils.js';

export const options = buildOptions();

const users = new SharedArray('users for login test', () => {
  const csvRaw = open('../data/users.csv');
  return parseCsvUsers(csvRaw);
});

const loginUrl = buildLoginUrl(BASE_URL, LOGIN_ENDPOINT);
const normalizedTestType = normalizeTestType(TEST_TYPE);
const runId = buildRunId();

export default function () {
  const user = getRandomUser(users);
  const payload = createLoginPayload(user);

  const response = http.post(loginUrl, payload, {
    headers: HEADERS,
    tags: {
      endpoint: 'login',
      test_type: normalizedTestType,
    },
  });

  check(response, {
    'status is 200 or 201': (res) => LOGIN_SUCCESS_STATUS_CODES.includes(res.status),
    [`response time < ${MAX_P95_MS} ms`]: (res) => res.timings.duration < MAX_P95_MS,
    'response body is not empty': (res) => Boolean(res.body),
  });
}

export function handleSummary(data) {
  const scenarioSummaryPath = buildScenarioSummaryPath(normalizedTestType, runId);
  return {
    'results/summary.json': JSON.stringify(data, null, 2),
    [scenarioSummaryPath]: JSON.stringify(data, null, 2),
  };
}
