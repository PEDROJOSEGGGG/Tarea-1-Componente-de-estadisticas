// mock-server.js
// Servidor local para desarrollo: JSON Server para /employees + una imitación
// de los endpoints de autenticación de la API-RH (/api/v1/auth/*), con las
// mismas respuestas que la API real. Así la app funciona sin la instancia en la nube.
import jsonServer from 'json-server';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT) || 3001;
const ACCESS_TTL = 15 * 60;            // 15 minutos
const REFRESH_TTL = 7 * 24 * 60 * 60;  // 7 días

// Cuentas de prueba, una por rol
const users = [
  { id: 'u-admin', email: 'admin@empresa.com', password: 'Admin123!', firstName: 'Roberto', lastName: 'Silva', role: { code: 'ADMIN', name: 'Administrador' } },
  { id: 'u-hr', email: 'rrhh@empresa.com', password: 'Rrhh123!', firstName: 'Carlos', lastName: 'Martínez', role: { code: 'HR_MANAGER', name: 'Gerente RRHH' } },
  { id: 'u-employee', email: 'empleado@empresa.com', password: 'Empleado123!', firstName: 'Ana', lastName: 'García', role: { code: 'EMPLOYEE', name: 'Empleado' } },
];

// refresh tokens vigentes -> id de usuario. Al renovar se borra el usado (rotación).
const refreshTokens = new Map();

const base64url = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

// Token con forma de JWT (header.payload.firma). La firma es falsa: el
// frontend solo lee el "exp" del payload, nunca la verifica.
function fakeJwt(user, ttl) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: user.id, email: user.email, role: user.role.code, iat: now, exp: now + ttl, jti: randomUUID() };
  return `${base64url({ alg: 'none', typ: 'JWT' })}.${base64url(payload)}.mock`;
}

function authResponse(user) {
  const accessToken = fakeJwt(user, ACCESS_TTL);
  const refreshToken = fakeJwt(user, REFRESH_TTL);
  refreshTokens.set(refreshToken, user.id);

  const { password: _password, ...publicUser } = user;
  return {
    success: true,
    data: {
      user: { ...publicUser, isActive: true },
      tokens: { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: ACCESS_TTL, refreshExpiresIn: REFRESH_TTL },
    },
  };
}

const fail = (res, status, code, message) =>
  res.status(status).json({ success: false, error: { code, message } });

const server = jsonServer.create();
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.post('/api/v1/auth/login', (req, res) => {
  const { email = '', password = '' } = req.body ?? {};
  const user = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  res.json(authResponse(user));
});

server.post('/api/v1/auth/refresh', (req, res) => {
  const token = req.body?.refreshToken;
  const userId = refreshTokens.get(token);
  if (!userId) return fail(res, 401, 'UNAUTHORIZED', 'Invalid or expired refresh token');

  refreshTokens.delete(token);
  res.json(authResponse(users.find((u) => u.id === userId)));
});

server.post('/api/v1/auth/logout', (req, res) => {
  refreshTokens.delete(req.body?.refreshToken);
  res.json({ success: true, data: null });
});

// Todo lo demás (/employees...) lo resuelve JSON Server con db.json
server.use(jsonServer.router('db.json'));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API en http://localhost:${PORT}`);
  console.log('Cuentas de prueba:');
  users.forEach((u) => console.log(`  ${u.role.code.padEnd(10)} ${u.email} / ${u.password}`));
});
