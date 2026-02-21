// Client-side API utilities

const API_BASE = '/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include', // Include cookies for session management
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
    name?: string;
  }) => {
    return fetchApi<{ user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return fetchApi<{ user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return fetchApi('/auth/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return fetchApi<{ user: any }>('/auth/me');
  },
};

// Companies API
export const companiesApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);

    return fetchApi<{
      companies: any[];
      pagination: any;
    }>(`/companies?${query.toString()}`);
  },

  getBySlug: async (slug: string) => {
    return fetchApi<any>(`/companies/${slug}`);
  },
};

// Reviews API
export const reviewsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    companyId?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.category) query.set('category', params.category);
    if (params?.companyId) query.set('companyId', params.companyId);
    if (params?.status) query.set('status', params.status);

    return fetchApi<{
      reviews: any[];
      pagination: any;
    }>(`/reviews?${query.toString()}`);
  },

  get: async (id: string) => {
    return fetchApi<any>(`/reviews/${id}`);
  },

  create: async (data: {
    title: string;
    content: string;
    companyId?: string;
    productId?: string;
    overallScore: number;
    criteriaScores: Record<string, number>;
  }) => {
    return fetchApi<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  toggleHelpful: async (id: string) => {
    return fetchApi<{ helpful: boolean }>(`/reviews/${id}/helpful`, {
      method: 'POST',
    });
  },

  vote: async (id: string, voteType: 'UP' | 'DOWN') => {
    return fetchApi<{ 
      voteType: 'UP' | 'DOWN' | null;
      helpfulCount: number;
      downVoteCount: number;
    }>(`/reviews/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },
};

// Feed API
export const feedApi = {
  get: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.category) query.set('category', params.category);

    return fetchApi<{
      items: any[];
      pagination: any;
    }>(`/feed?${query.toString()}`);
  },
};

// Search API
export const searchApi = {
  search: async (params: {
    q: string;
    type?: 'all' | 'companies' | 'reviews' | 'users';
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    query.set('q', params.q);
    if (params.type) query.set('type', params.type);
    if (params.limit) query.set('limit', params.limit.toString());

    return fetchApi<{
      results: {
        companies?: any[];
        reviews?: any[];
        users?: any[];
      };
    }>(`/search?${query.toString()}`);
  },
};

// Trending API
export const trendingApi = {
  get: async (params?: {
    period?: 'week' | 'month';
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.limit) query.set('limit', params.limit.toString());

    return fetchApi<{
      trending: any[];
    }>(`/trending?${query.toString()}`);
  },
};

// Complaints API
export const complaintsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    companyId?: string;
    userId?: string;
    username?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.companyId) query.set('companyId', params.companyId);
    if (params?.userId) query.set('userId', params.userId);
    if (params?.username) query.set('username', params.username);

    return fetchApi<{
      complaints: any[];
      pagination: any;
    }>(`/complaints?${query.toString()}`);
  },

  get: async (id: string) => {
    return fetchApi<any>(`/complaints/${id}`);
  },

  create: async (data: {
    title: string;
    content: string;
    companyId?: string;
    productId?: string;
  }) => {
    return fetchApi<any>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  vote: async (id: string, voteType: 'UP' | 'DOWN') => {
    return fetchApi<{ 
      voteType: 'UP' | 'DOWN' | null;
      helpfulCount: number;
      downVoteCount: number;
    }>(`/complaints/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },

  reply: async (id: string, content: string) => {
    return fetchApi<any>(`/complaints/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// Comments API
export const commentsApi = {
  list: async (params: {
    reviewId?: string;
    postId?: string;
    complaintId?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.reviewId) query.set('reviewId', params.reviewId);
    if (params.postId) query.set('postId', params.postId);
    if (params.complaintId) query.set('complaintId', params.complaintId);

    return fetchApi<{
      comments: any[];
    }>(`/comments/list?${query.toString()}`);
  },

  create: async (data: {
    content: string;
    reviewId?: string;
    postId?: string;
    complaintId?: string;
    parentId?: string;
  }) => {
    return fetchApi<any>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  vote: async (id: string, voteType: 'UP' | 'DOWN') => {
    return fetchApi<{ 
      voteType: 'UP' | 'DOWN' | null;
      helpfulCount: number;
      downVoteCount: number;
    }>(`/comments/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },
};

