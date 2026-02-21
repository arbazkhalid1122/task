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

    // Get comments for a review, post, or complaint
    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get('reviewId');
    const postId = searchParams.get('postId');
    const complaintId = searchParams.get('complaintId');

    const where: any = { parentId: null }; // Only get top-level comments
    if (reviewId) where.reviewId = reviewId;
    if (postId) where.postId = postId;
    if (complaintId) where.complaintId = complaintId;
    if (id && id !== 'list') where.id = id;

    const comments = await prisma.comment.findMany({
      where: id && id !== 'list' ? { id } : where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            verified: true,
          },
        },
        replies: {
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
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            reactions: true,
            votes: true,
            replies: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get user votes if logged in
    let commentsWithVotes = comments;
    if (user && comments.length > 0) {
      const commentIds = comments.flatMap(c => [
        c.id,
        ...c.replies.map(r => r.id)
      ]);
      const userVotes = await prisma.commentVote.findMany({
        where: {
          userId: user.id,
          commentId: { in: commentIds },
        },
        select: {
          commentId: true,
          voteType: true,
        },
      });

      const voteMap = new Map(
        userVotes.map(v => [v.commentId, v.voteType])
      );

      commentsWithVotes = comments.map(comment => ({
        ...comment,
        userVote: voteMap.get(comment.id) || null,
        replies: comment.replies.map(reply => ({
          ...reply,
          userVote: voteMap.get(reply.id) || null,
        })),
      }));
    } else {
      commentsWithVotes = comments.map(comment => ({
        ...comment,
        userVote: null,
        replies: comment.replies.map(reply => ({
          ...reply,
          userVote: null,
        })),
      }));
    }

    if (id && id !== 'list') {
      return NextResponse.json(commentsWithVotes[0] || null);
    }

    return NextResponse.json({ comments: commentsWithVotes });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

