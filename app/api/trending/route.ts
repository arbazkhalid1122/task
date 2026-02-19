import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { handleError } from '@/backend/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'week'; // week, month
    const limit = parseInt(searchParams.get('limit') || '10');

    const daysAgo = period === 'week' ? 7 : 30;
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

    // Get top rated companies/products based on recent reviews
    const topRated = await prisma.review.groupBy({
      by: ['companyId'],
      where: {
        status: 'APPROVED',
        createdAt: {
          gte: dateThreshold,
        },
        companyId: {
          not: null,
        },
      },
      _avg: {
        overallScore: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _avg: {
          overallScore: 'desc',
        },
      },
      take: limit,
    });

    const companyIds = topRated
      .map((item) => item.companyId)
      .filter((id): id is string => id !== null);

    const companies = await prisma.company.findMany({
      where: {
        id: {
          in: companyIds,
        },
      },
      include: {
        _count: {
          select: {
            reviews: {
              where: {
                status: 'APPROVED',
                createdAt: {
                  gte: dateThreshold,
                },
              },
            },
          },
        },
      },
    });

    const results = companies.map((company) => {
      const stats = topRated.find((r) => r.companyId === company.id);
      return {
        ...company,
        averageScore: stats?._avg.overallScore || 0,
        reviewCount: stats?._count.id || 0,
      };
    });

    return NextResponse.json({ trending: results });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

