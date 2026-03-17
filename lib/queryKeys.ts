export const queryKeys = {
  profile: (username: string) => ["profile", username] as const,
  profileReviews: (username: string, page?: number) =>
    ["profile-reviews", username, page ?? null] as const,
  profileComplaints: (username: string, page?: number) =>
    ["profile-complaints", username, page ?? null] as const,
  profileFollowers: (username: string) => ["profile-followers", username] as const,
  profileFollowing: (username: string) => ["profile-following", username] as const,
  followStatusBulk: (viewerId: string | null, usernames: string[]) =>
    ["follow-status-bulk", viewerId ?? "anon", [...usernames].sort()] as const,
};
