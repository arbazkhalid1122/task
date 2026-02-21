import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, NotFoundError } from '@/backend/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSession(request).catch(() => null);

    const complaint = await prisma.complaint.findUnique({
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
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        replies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            votes: true,
          },
        },
      },
    });

    if (!complaint) {
      throw new NotFoundError('Complaint not found');
    }

    // Get user vote if logged in
    let userVote = null;
    if (user) {
      const vote = await prisma.complaintVote.findUnique({
        where: {
          userId_complaintId: {
            userId: user.id,
            complaintId: id,
          },
        },
        select: {
          voteType: true,
        },
      });
      userVote = vote?.voteType || null;
    }

    return NextResponse.json({
      ...complaint,
      userVote,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

