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
    const user = await getSession(request);

    // Build feed: reviews + posts
    const where: any = {
      status: 'APPROVED',
      ...(category && { company: { category } }),
    };

    const reviews = await prisma.review.findMany({
      where,
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
        _count: {
          select: {
            helpfulVotes: true,
            comments: true,
            reactions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.review.count({ where });

    return NextResponse.json({
      items: reviews,
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

