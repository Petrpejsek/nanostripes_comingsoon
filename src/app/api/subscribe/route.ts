import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PrismaError {
  code: string;
  [key: string]: unknown;
}

interface SubscribeRequest {
  email: string;
}

interface SubscribeResponse {
  success: boolean;
  error?: string;
  subscriber?: {
    id: number;
    email: string;
    createdAt: string;
  };
}

export async function POST(request: Request): Promise<NextResponse<SubscribeResponse>> {
  try {
    const { email } = await request.json() as SubscribeRequest;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email }
    });

    return NextResponse.json({ 
      success: true,
      subscriber: {
        ...subscriber,
        createdAt: subscriber.createdAt.toISOString()
      }
    });
  } catch (error) {
    if (isPrismaError(error) && error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }
    if (error instanceof Error) {
      console.error('Subscribe error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error('Subscribe error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}

function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as PrismaError).code === 'string'
  );
} 