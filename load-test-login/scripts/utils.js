export function parseCsvUsers(csvContent) {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV invalido: se requiere cabecera y al menos un usuario.');
  }

  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(',').map((value) => value.trim());

  const usernameIndex = headers.indexOf('username');
  const passwordIndex = headers.indexOf('password');

  if (usernameIndex === -1 || passwordIndex === -1) {
    throw new Error("CSV invalido: cabeceras esperadas 'username,password'.");
  }

  return rows
    .map((row) => row.split(',').map((value) => value.trim()))
    .filter((columns) => columns.length >= 2)
    .map((columns) => ({
      username: columns[usernameIndex],
      password: columns[passwordIndex],
    }))
    .filter((user) => user.username && user.password);
}

export function getRandomUser(users) {
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error('No hay usuarios disponibles para ejecutar la prueba.');
  }

  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
}

export function buildLoginUrl(baseUrl, endpoint) {
  return `${baseUrl}${endpoint}`;
}

export function createLoginPayload(user) {
  return JSON.stringify({
    username: user.username,
    password: user.password,
  });
}

export function normalizeTestType(testType) {
  return String(testType || 'baseline').trim().toLowerCase();
}

export function buildRunId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

export function buildScenarioSummaryPath(testType, runId) {
  return `results/${testType}_${runId}_summary.json`;
}
