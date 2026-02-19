import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/backend/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getSession(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}

