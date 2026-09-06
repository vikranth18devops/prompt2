import { NextResponse } from 'next/server';
import { getAdminFromCookies, clearAdminSessionCookie } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: admin });
}

export async function POST() {
  await clearAdminSessionCookie();
  return NextResponse.json({ success: true });
}
