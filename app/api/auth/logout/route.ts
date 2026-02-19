import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/backend/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('session');

  return response;
}

