/**
 * Safe error messages for UI. Never expose stack traces or internal details in production.
 */

const PRODUCTION_FALLBACK = "Something went wrong. Please try again.";

/** Messages we explicitly allow to show in production (user-facing, no secrets). */
const ALLOWED_MESSAGES = new Set([
  "Email and password are required",
  "Invalid email or password",
  "Invalid email address",
  "Password must be at least 8 characters",
  "Password is required",
  "Email, username, and password are required",
  "Username can only contain letters, numbers, and underscores",
  "Email is already registered",
  "Username is already taken",
  "Title and content are required",
  "Title must be at least 5 characters",
  "Review content must be at least 20 characters",
  "Validation failed",
  "Network error",
  "Too Many Requests",
]);

function isProduction(): boolean {
  return typeof process !== "undefined" && process.env.NODE_ENV === "production";
}

/**
 * Returns a user-safe error message. In production, only allowed messages or generic fallback.
 * Never returns stack traces or internal error details.
 */
export function safeApiMessage(rawError: string | undefined): string {
  if (!rawError || typeof rawError !== "string") return PRODUCTION_FALLBACK;
  const trimmed = rawError.trim();
  if (!trimmed) return PRODUCTION_FALLBACK;

  if (isProduction()) {
    if (ALLOWED_MESSAGES.has(trimmed)) return trimmed;
    if (trimmed.startsWith("Validation failed") || trimmed.includes("must be at least")) return trimmed;
    return PRODUCTION_FALLBACK;
  }

  if (trimmed.length > 500) return trimmed.slice(0, 500) + "...";
  return trimmed;
}
