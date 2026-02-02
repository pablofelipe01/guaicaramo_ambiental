import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-key-change-in-production'
);

export interface SessionPayload {
  userId: string;
  userRecordId: string;
  email: string;
  nombre: string;
  expiresAt: Date;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(data: Omit<SessionPayload, 'expiresAt'>): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
  const session = await encrypt({ ...data, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie?.value) {
    return null;
  }

  return decrypt(sessionCookie.value);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function updateSession(): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const newSession = await encrypt({ ...session, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
