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

    const body = await request.json();
    const { voteType } = body;

    if (!voteType || (voteType !== 'UP' && voteType !== 'DOWN')) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be UP or DOWN' },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundError('Complaint not found');
    }

    const existingVote = await prisma.complaintVote.findUnique({
      where: {
        userId_complaintId: {
          userId: user.id,
          complaintId: id,
        },
      },
    });

    let helpfulCount: number;
    let downVoteCount: number;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote
        await prisma.complaintVote.delete({
          where: { id: existingVote.id },
        });

        const updateData: any = {};
        if (voteType === 'UP') {
          updateData.helpfulCount = { decrement: 1 };
        } else {
          updateData.downVoteCount = { decrement: 1 };
        }

        const updated = await prisma.complaint.update({
          where: { id },
          data: updateData,
          select: {
            helpfulCount: true,
            downVoteCount: true,
          },
        });

        helpfulCount = updated.helpfulCount;
        downVoteCount = updated.downVoteCount;
      } else {
        // Switch vote
        await prisma.complaintVote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });

        const updateData: any = {};
        if (voteType === 'UP') {
          updateData.helpfulCount = { increment: 1 };
          updateData.downVoteCount = { decrement: 1 };
        } else {
          updateData.helpfulCount = { decrement: 1 };
          updateData.downVoteCount = { increment: 1 };
        }

        const updated = await prisma.complaint.update({
          where: { id },
          data: updateData,
          select: {
            helpfulCount: true,
            downVoteCount: true,
          },
        });

        helpfulCount = updated.helpfulCount;
        downVoteCount = updated.downVoteCount;
      }
    } else {
      // New vote
      await prisma.complaintVote.create({
        data: {
          userId: user.id,
          complaintId: id,
          voteType,
        },
      });

      const updateData: any = {};
      if (voteType === 'UP') {
        updateData.helpfulCount = { increment: 1 };
      } else {
        updateData.downVoteCount = { increment: 1 };
      }

      const updated = await prisma.complaint.update({
        where: { id },
        data: updateData,
        select: {
          helpfulCount: true,
          downVoteCount: true,
        },
      });

      helpfulCount = updated.helpfulCount;
      downVoteCount = updated.downVoteCount;
    }

    const currentVote = await prisma.complaintVote.findUnique({
      where: {
        userId_complaintId: {
          userId: user.id,
          complaintId: id,
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

