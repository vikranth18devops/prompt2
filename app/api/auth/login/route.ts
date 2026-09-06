import { NextRequest, NextResponse } from 'next/server';
import { setAdminSessionCookie } from '@/lib/auth';
import { trackEvent } from '@/lib/azure/telemetry';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Default admin credentials check (or DB lookup)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@azure-ai.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminPayload = {
        id: 'admin-1',
        email: ADMIN_EMAIL,
        name: 'Azure AI System Admin',
        role: 'SUPERADMIN',
      };

      await setAdminSessionCookie(adminPayload);
      trackEvent('AdminLoginSuccess', { email });

      return NextResponse.json({
        success: true,
        user: adminPayload,
      });
    }

    trackEvent('AdminLoginFailed', { email });
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login error' }, { status: 500 });
  }
}
