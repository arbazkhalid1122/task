import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, UnauthorizedError, NotFoundError } from '@/backend/lib/errors';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSession(request);
    if (!user) {
      throw new UnauthorizedError();
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if already voted
    const existing = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: id,
        },
      },
    });

    if (existing) {
      // Remove vote
      await prisma.helpfulVote.delete({
        where: { id: existing.id },
      });

      await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ helpful: false });
    } else {
      // Add vote
      await prisma.helpfulVote.create({
        data: {
          userId: user.id,
          reviewId: id,
        },
      });

      await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ helpful: true });
    }
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

