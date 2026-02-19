import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

export async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return token;
}

export async function getSession(request: NextRequest): Promise<SessionUser | null> {
  try {
    const token = request.cookies.get('session')?.value;
    
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role,
    };
  } catch (error) {
    return null;
  }
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}

export async function getCurrentUser(request: NextRequest): Promise<SessionUser | null> {
  return getSession(request);
}

