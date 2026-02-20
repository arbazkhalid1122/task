import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, NotFoundError, UnauthorizedError } from '@/backend/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            verified: true,
            reputation: true,
          },
        },
        company: true,
        product: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: { reactions: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            helpfulVotes: true,
            comments: true,
            reactions: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    return NextResponse.json(review);
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

