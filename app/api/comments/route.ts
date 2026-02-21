import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, UnauthorizedError } from '@/backend/lib/errors';
import { createCommentSchema } from '@/backend/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession(request);
    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    // Validate that at least one parent is provided
    if (!validated.reviewId && !validated.postId && !validated.complaintId) {
      return NextResponse.json(
        { error: 'Must provide reviewId, postId, or complaintId' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: validated.content,
        authorId: user.id,
        reviewId: validated.reviewId,
        postId: validated.postId,
        complaintId: validated.complaintId,
        parentId: validated.parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            votes: true,
            replies: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

