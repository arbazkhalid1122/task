import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { handleError, NotFoundError } from '@/backend/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            reviews: {
              where: { status: 'APPROVED' },
            },
            followers: true,
            products: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    // Calculate average score
    const reviews = await prisma.review.findMany({
      where: {
        companyId: company.id,
        status: 'APPROVED',
      },
      select: {
        overallScore: true,
      },
    });

    const avgScore = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length
      : 0;

    return NextResponse.json({
      ...company,
      averageScore: avgScore,
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

