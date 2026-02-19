import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { hashPassword, registerSchema } from '@/backend/lib/utils';
import { createSession } from '@/backend/lib/auth';
import { handleError } from '@/backend/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { username: validated.username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(validated.password);
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        username: validated.username,
        passwordHash,
        name: validated.name,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        verified: true,
        role: true,
      },
    });

    // Create session
    const token = await createSession(user.id);

    const response = NextResponse.json(
      { user, message: 'Registration successful' },
      { status: 201 }
    );

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

