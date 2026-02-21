import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError } from '@/backend/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') as any;
    const user = await getSession(request).catch(() => null);

    // Build feed: reviews + complaints
    const reviewWhere: any = {
      status: 'APPROVED',
      ...(category && { company: { category } }),
    };

    const [reviews, complaints] = await Promise.all([
      prisma.review.findMany({
        where: reviewWhere,
        select: {
          id: true,
          title: true,
          content: true,
          overallScore: true,
          helpfulCount: true,
          downVoteCount: true,
          createdAt: true,
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
          _count: {
            select: {
              helpfulVotes: true,
              comments: true,
              reactions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.complaint.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          status: true,
          helpfulCount: true,
          downVoteCount: true,
          createdAt: true,
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
          _count: {
            select: {
              comments: true,
              reactions: true,
              votes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    ]);

    // Combine and sort by date
    const items = [
      ...reviews.map(r => ({ ...r, type: 'review' })),
      ...complaints.map(c => ({ ...c, type: 'complaint' })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice((page - 1) * limit, page * limit);

    const total = reviews.length + complaints.length;

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

