import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'heritage-admin-session';
const ISSUER = 'heritage-admin';

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET is missing or too short (min 16 chars).');
  }

  return new TextEncoder().encode(secret);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

export async function createAdminSession() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyAdminSession(token: string | undefined) {
  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export function verifyPin(candidate: string) {
  const expected = process.env.ADMIN_PIN;

  if (!expected) {
    throw new Error('ADMIN_PIN is not set.');
  }

  return candidate === expected;
}
