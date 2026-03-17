export const queryKeys = {
  profile: (username: string) => ["profile", username] as const,
  profileReviews: (username: string, page?: number) =>
    (page !== undefined ? ["profile-reviews", username, page] : ["profile-reviews", username]) as const,
  profileComplaints: (username: string, page?: number) =>
    (page !== undefined ? ["profile-complaints", username, page] : ["profile-complaints", username]) as const,
  profileFollowers: (username: string) => ["profile-followers", username] as const,
  profileFollowing: (username: string) => ["profile-following", username] as const,
  followStatusBulk: (viewerId: string | null, usernames: string[]) =>
    ["follow-status-bulk", viewerId ?? "anon", [...usernames].sort()] as const,
};
