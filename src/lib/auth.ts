import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-change-in-production';

// Convert string to Uint8Array for Web Crypto
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate cryptographically secure random bytes as hex
function generateRandomHex(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Create HMAC signature using Web Crypto API
async function createHmacSignature(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, stringToUint8Array(data));
  return arrayBufferToHex(signature);
}

// Constant-time string comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function createSessionToken(): Promise<string> {
  const randomBytes = generateRandomHex(32);
  const timestamp = Date.now().toString();
  const data = `${timestamp}:${randomBytes}`;
  const signature = await createHmacSignature(data, SESSION_SECRET);
  return `${data}:${signature}`;
}

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) {
      return false;
    }

    const timestamp = parts[0];
    const randomBytes = parts[1];
    const signature = parts[2];

    if (!timestamp || !randomBytes || !signature) {
      return false;
    }

    const data = `${timestamp}:${randomBytes}`;
    const expectedSignature = await createHmacSignature(data, SESSION_SECRET);

    // Verify signature using constant-time comparison
    if (!secureCompare(signature, expectedSignature)) {
      return false;
    }

    // Check if session is expired (24 hours)
    const sessionTime = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (now - sessionTime > maxAge) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function createSession(): Promise<string> {
  const token = await createSessionToken();
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

  if (!session?.value) {
    return null;
  }

  const isValid = await verifySessionToken(session.value);
  if (!isValid) {
    return null;
  }

  return session.value;
}

export async function getSessionFromRequest(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    return null;
  }

  const isValid = await verifySessionToken(session.value);
  if (!isValid) {
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
