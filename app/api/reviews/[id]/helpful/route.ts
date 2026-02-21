import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, UnauthorizedError, NotFoundError } from '@/backend/lib/errors';
import { emitReviewVoteUpdated } from '@/lib/socket-server';

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

    let helpfulCount: number;

    if (existing) {
      // Remove vote
      await prisma.helpfulVote.delete({
        where: { id: existing.id },
      });

      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            decrement: 1,
          },
        },
        select: {
          helpfulCount: true,
        },
      });

      helpfulCount = updatedReview.helpfulCount;

      // Emit socket event
      try {
        emitReviewVoteUpdated(id, helpfulCount);
      } catch (error) {
        console.error('Error emitting vote updated event:', error);
      }

      return NextResponse.json({ helpful: false });
    } else {
      // Add vote
      await prisma.helpfulVote.create({
        data: {
          userId: user.id,
          reviewId: id,
        },
      });

      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
        select: {
          helpfulCount: true,
        },
      });

      helpfulCount = updatedReview.helpfulCount;

      // Emit socket event
      try {
        emitReviewVoteUpdated(id, helpfulCount);
      } catch (error) {
        console.error('Error emitting vote updated event:', error);
      }

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

