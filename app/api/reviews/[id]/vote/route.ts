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

    const body = await request.json();
    const { voteType } = body; // 'UP' or 'DOWN'

    if (!voteType || (voteType !== 'UP' && voteType !== 'DOWN')) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be UP or DOWN' },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if user already voted
    const existingVote = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: id,
        },
      },
    });

    let helpfulCount: number;
    let downVoteCount: number;

    if (existingVote) {
      // User already voted - check if they're changing their vote
      if (existingVote.voteType === voteType) {
        // Same vote type - remove the vote (toggle off)
        await prisma.helpfulVote.delete({
          where: { id: existingVote.id },
        });

        // Decrement the appropriate count
        const updateData: any = {};
        if (voteType === 'UP') {
          updateData.helpfulCount = { decrement: 1 };
        } else {
          updateData.downVoteCount = { decrement: 1 };
        }

        const updatedReview = await prisma.review.update({
          where: { id },
          data: updateData,
          select: {
            helpfulCount: true,
            downVoteCount: true,
          },
        });

        helpfulCount = updatedReview.helpfulCount;
        downVoteCount = updatedReview.downVoteCount;
      } else {
        // Different vote type - switch the vote
        await prisma.helpfulVote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });

        // Decrement old vote type, increment new vote type
        const updateData: any = {};
        if (voteType === 'UP') {
          // Switching from DOWN to UP
          updateData.helpfulCount = { increment: 1 };
          updateData.downVoteCount = { decrement: 1 };
        } else {
          // Switching from UP to DOWN
          updateData.helpfulCount = { decrement: 1 };
          updateData.downVoteCount = { increment: 1 };
        }

        const updatedReview = await prisma.review.update({
          where: { id },
          data: updateData,
          select: {
            helpfulCount: true,
            downVoteCount: true,
          },
        });

        helpfulCount = updatedReview.helpfulCount;
        downVoteCount = updatedReview.downVoteCount;
      }
    } else {
      // New vote - create it
      await prisma.helpfulVote.create({
        data: {
          userId: user.id,
          reviewId: id,
          voteType,
        },
      });

      // Increment the appropriate count
      const updateData: any = {};
      if (voteType === 'UP') {
        updateData.helpfulCount = { increment: 1 };
      } else {
        updateData.downVoteCount = { increment: 1 };
      }

      const updatedReview = await prisma.review.update({
        where: { id },
        data: updateData,
        select: {
          helpfulCount: true,
          downVoteCount: true,
        },
      });

      helpfulCount = updatedReview.helpfulCount;
      downVoteCount = updatedReview.downVoteCount;
    }

    // Emit socket event with both counts
    try {
      emitReviewVoteUpdated(id, helpfulCount, downVoteCount);
    } catch (error) {
      console.error('Error emitting vote updated event:', error);
    }

    // Return the current vote state
    const currentVote = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: user.id,
          reviewId: id,
        },
      },
    });

    return NextResponse.json({
      voteType: currentVote?.voteType || null,
      helpfulCount,
      downVoteCount,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

