import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-change-in-production';

function createSessionToken(): string {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  const data = `${timestamp}:${randomBytes}`;

  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');

  return `${data}:${signature}`;
}

function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;

    const [timestamp, randomBytes, signature] = parts;
    const data = `${timestamp}:${randomBytes}`;

    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');

    // Verify signature
    if (signature !== expectedSignature) return false;

    // Check if session is expired (24 hours)
    const sessionTime = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (now - sessionTime > maxAge) return false;

    return true;
  } catch {
    return false;
  }
}

export async function createSession(): Promise<string> {
  const token = createSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session?.value) return null;

  if (!verifySessionToken(session.value)) {
    return null;
  }

  return session.value;
}

export async function getSessionFromRequest(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  if (!session?.value) return null;

  if (!verifySessionToken(session.value)) {
    return null;
  }

  return session.value;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
