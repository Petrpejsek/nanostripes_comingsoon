import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface Subscriber {
  id: number;
  email: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Middleware pro kontrolu přihlášení
async function checkAuth() {
  const cookieStore = cookies() as ReadonlyRequestCookies;
  return !!cookieStore.get('admin_session')?.value;
}

export async function GET(): Promise<NextResponse<ApiResponse<Subscriber[]>>> {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fetch subscribers error:', error.message);
    } else {
      console.error('Fetch subscribers error:', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse<ApiResponse<void>>> {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Delete subscriber error:', error.message);
    } else {
      console.error('Delete subscriber error:', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
} 