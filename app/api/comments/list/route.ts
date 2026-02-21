import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError } from '@/backend/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get('reviewId');
    const postId = searchParams.get('postId');
    const complaintId = searchParams.get('complaintId');
    const user = await getSession(request).catch(() => null);

    const where: any = { parentId: null }; // Only get top-level comments
    if (reviewId) where.reviewId = reviewId;
    if (postId) where.postId = postId;
    if (complaintId) where.complaintId = complaintId;

    const comments = await prisma.comment.findMany({
      where,
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
        helpfulCount: comment.helpfulCount || 0,
        downVoteCount: comment.downVoteCount || 0,
        replies: comment.replies.map(reply => ({
          ...reply,
          userVote: voteMap.get(reply.id) || null,
          helpfulCount: reply.helpfulCount || 0,
          downVoteCount: reply.downVoteCount || 0,
        })),
      }));
    } else {
      commentsWithVotes = comments.map(comment => ({
        ...comment,
        userVote: null,
        helpfulCount: comment.helpfulCount || 0,
        downVoteCount: comment.downVoteCount || 0,
        replies: comment.replies.map(reply => ({
          ...reply,
          userVote: null,
          helpfulCount: reply.helpfulCount || 0,
          downVoteCount: reply.downVoteCount || 0,
        })),
      }));
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

