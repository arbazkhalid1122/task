// Server-side data fetching utilities

import { prisma } from '@/backend/lib/db';

export async function getReviews(params?: {
  page?: number;
  limit?: number;
  category?: string;
  companyId?: string;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 20;

  const where: any = {
    status: 'APPROVED',
    ...(params?.category && { company: { category: params.category } }),
    ...(params?.companyId && { companyId: params.companyId }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
            category: true,
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
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, total, page, limit };
}

export async function getCompanyBySlug(slug: string) {
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

  if (!company) return null;

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

  const avgScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length
      : 0;

  return {
    ...company,
    averageScore: avgScore,
  };
}

export async function getTrending(period: 'week' | 'month' = 'week', limit = 10) {
  const daysAgo = period === 'week' ? 7 : 30;
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

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

  return companies.map((company) => {
    const stats = topRated.find((r) => r.companyId === company.id);
    return {
      ...company,
      averageScore: stats?._avg.overallScore || 0,
      reviewCount: stats?._count.id || 0,
    };
  });
}

export async function getAlerts() {
  // Get trending alert
  const trending = await prisma.review.findFirst({
    where: {
      status: 'APPROVED',
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    include: {
      company: true,
    },
    orderBy: {
      helpfulCount: 'desc',
    },
  });

  // Get scam alert (low-rated companies with many reports)
  const scamAlert = await prisma.review.findFirst({
    where: {
      status: 'APPROVED',
      reportCount: {
        gt: 10,
      },
      overallScore: {
        lt: 3,
      },
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
    include: {
      company: true,
    },
    orderBy: {
      reportCount: 'desc',
    },
  });

  return {
    trending: trending
      ? {
          type: 'trending',
          title: 'Trending now:',
          content: trending.company?.name || 'Best Hardware Wallets 2026',
        }
      : null,
    scam: scamAlert
      ? {
          type: 'scam',
          title: 'Latest Scam Alert:',
          content: scamAlert.company?.name || 'Awax Wallet',
          score: `${scamAlert.overallScore.toFixed(1)}/10`,
          reports: `${scamAlert.reportCount} reports in 24hrs`,
        }
      : null,
  };
}

