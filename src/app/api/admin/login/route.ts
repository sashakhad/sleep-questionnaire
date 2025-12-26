import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Create a secure HMAC-signed session token
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
