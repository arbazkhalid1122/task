import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, UnauthorizedError } from '@/backend/lib/errors';
import { z } from 'zod';

const createComplaintSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  companyId: z.string().optional(),
  productId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const companyId = searchParams.get('companyId');
    const userId = searchParams.get('userId'); // For user's personal feed
    const username = searchParams.get('username'); // For username lookup

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (userId) where.authorId = userId;
    if (username) {
      // Find user by username first
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (user) {
        where.authorId = user.id;
      } else {
        // Return empty if user not found
        return NextResponse.json({
          complaints: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }
    }

    const user = await getSession(request).catch(() => null);

    const complaints = await prisma.complaint.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        helpfulCount: true,
        downVoteCount: true,
        reportCount: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        companyId: true,
        productId: true,
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
            comments: true,
            reactions: true,
            votes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get user vote status if logged in
    let complaintsWithVotes = complaints;
    if (user) {
      const complaintIds = complaints.map(c => c.id);
      const userVotes = await prisma.complaintVote.findMany({
        where: {
          userId: user.id,
          complaintId: { in: complaintIds },
        },
        select: {
          complaintId: true,
          voteType: true,
        },
      });

      const voteMap = new Map(
        userVotes.map(v => [v.complaintId, v.voteType])
      );

      complaintsWithVotes = complaints.map(complaint => ({
        ...complaint,
        userVote: voteMap.get(complaint.id) || null,
      }));
    } else {
      complaintsWithVotes = complaints.map(complaint => ({
        ...complaint,
        userVote: null,
      }));
    }

    const total = await prisma.complaint.count({ where });

    return NextResponse.json({
      complaints: complaintsWithVotes,
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
    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const validated = createComplaintSchema.parse(body);

    const complaint = await prisma.complaint.create({
      data: {
        title: validated.title,
        content: validated.content,
        authorId: user.id,
        companyId: validated.companyId,
        productId: validated.productId,
        status: 'OPEN',
      },
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
            comments: true,
            reactions: true,
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

