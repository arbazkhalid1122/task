import { z } from "zod";

/** Match backend auth rules for consistent UX and fewer invalid requests. */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export const createReviewSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(20, "Review content must be at least 20 characters"),
  overallScore: z.number().min(0).max(10),
  criteriaScores: z.record(z.string(), z.number()).optional(),
  companyId: z.string().optional(),
  productId: z.string().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment must be at most 1000 characters"),
  reviewId: z.string().optional(),
  postId: z.string().optional(),
  complaintId: z.string().optional(),
  parentId: z.string().optional(),
});

export const createComplaintSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  content: z.string().min(1, "Content is required").max(5000, "Content must be at most 5000 characters"),
  companyId: z.string().optional(),
  productId: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
