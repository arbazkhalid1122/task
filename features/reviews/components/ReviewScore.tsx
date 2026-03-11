"use client";

interface ReviewScoreProps {
  score: number;
}

export default function ReviewScore({ score }: ReviewScoreProps) {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  const emptyStars = Math.max(0, 10 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <span className="mr-4 text-lg font-bold leading-[14px] tracking-normal text-primary-dark">
      <span className="text-primary-lighter">{"★".repeat(fullStars)}</span>
      {hasHalfStar && <span className="text-primary-lighter">★</span>}
      <span className="text-gray-300">{"☆".repeat(emptyStars)}</span>
      <span className="ml-1 text-primary-lighter">{score.toFixed(1)}/10</span>
    </span>
  );
}
