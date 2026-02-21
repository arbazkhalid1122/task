import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { getSession } from '@/backend/lib/auth';
import { handleError, UnauthorizedError, NotFoundError } from '@/backend/lib/errors';
import { z } from 'zod';

const createReplySchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSession(request);
    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const validated = createReplySchema.parse(body);

    // Check if complaint exists
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!complaint) {
      throw new NotFoundError('Complaint not found');
    }

    // Check if user is associated with the company
    // For now, we'll check if user is a company admin or if companyId matches
    // You may need to adjust this logic based on your auth system
    if (!complaint.companyId) {
      return NextResponse.json(
        { error: 'Complaint does not have an associated company' },
        { status: 400 }
      );
    }

    // Check if user is company admin (you may need to add this to your User model)
    // For now, we'll allow any authenticated user to reply (you can restrict this later)
    const company = await prisma.company.findUnique({
      where: { id: complaint.companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 400 }
      );
    }

    // Create company reply
    const reply = await prisma.complaintReply.create({
      data: {
        content: validated.content,
        complaintId: id,
        companyId: complaint.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    // Update complaint status to IN_PROGRESS if it was OPEN
    if (complaint.status === 'OPEN') {
      await prisma.complaint.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    const errorResponse = handleError(error);
    return NextResponse.json(
      { error: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

