import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { createReviewSchema, calculateOverallScore } from '@/backend/lib/utils';
import { handleError, UnauthorizedError } from '@/backend/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') as any;
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status') || 'APPROVED';

    const where: any = {
      ...(status && { status }),
      ...(category && { company: { category } }),
      ...(companyId && { companyId }),
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
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
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
      reviews,
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

export async function POST(request: NextRequest) {
  try {
    const user = await getSession(request);
    
    // For now, allow unauthenticated reviews but they need extra verification
    // In production, you might want to require authentication
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to submit a review. Authentication is required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createReviewSchema.parse(body);

    // Calculate overall score if not provided
    const overallScore = validated.overallScore || calculateOverallScore(validated.criteriaScores);

    const review = await prisma.review.create({
      data: {
        title: validated.title,
        content: validated.content,
        authorId: user.id,
        companyId: validated.companyId,
        productId: validated.productId,
        overallScore,
        criteriaScores: validated.criteriaScores,
        status: 'APPROVED', // Published immediately without review
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
        company: true,
        product: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { 
        error: errorResponse.message,
        ...(errorResponse.errors && { errors: errorResponse.errors })
      },
      { status: errorResponse.statusCode }
    );
  }
}

