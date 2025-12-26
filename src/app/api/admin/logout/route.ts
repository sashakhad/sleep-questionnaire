import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_authenticated';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
