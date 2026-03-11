import { formatDistanceToNow } from "date-fns";

type TranslationFn = (key: string) => string;

export function formatReviewTimeAgo(dateString: string, fallback: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return fallback;
  }
}

export function translateWithFallback(t: TranslationFn, key: string, fallback: string) {
  try {
    const result = t(key);
    return result === key ? fallback : result;
  } catch {
    return fallback;
  }
}
