import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export async function GET() {
  const cookieStore = cookies() as ReadonlyRequestCookies;
  const adminSession = cookieStore.get('admin_session')?.value;

  if (!adminSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
} 