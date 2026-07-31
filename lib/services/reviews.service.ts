import api from '@/lib/api';

const getErrorMessage = (err: any, fallback: string): string => {
  return err.response?.data?.message || err.message || fallback;
};

export type ReviewRelationshipType =
  | 'EMPLOYER_TO_CANDIDATE'
  | 'CANDIDATE_TO_EMPLOYER'
  | 'STUDENT_TO_COURSE'
  | 'STUDENT_TO_TRAINER'
  | 'CLIENT_TO_FREELANCER'
  | 'FREELANCER_TO_CLIENT';

export type ReviewStatus = 'PUBLISHED' | 'UNDER_REVIEW' | 'HIDDEN' | 'REMOVED';
export type ReviewReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface ReviewItem {
  id: string;
  reviewerUserId: string;
  subjectUserId?: string | null;
  courseId?: string | null;
  relationshipType: ReviewRelationshipType;
  relationshipId: string;
  rating: number;
  title?: string | null;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  reviewer?: {
    id: string;
    email?: string;
    avatarUrl?: string | null;
    candidateProfile?: { fullName: string } | null;
    employerProfile?: { companyName: string } | null;
  };
  subjectUser?: {
    id: string;
    email?: string;
    candidateProfile?: { fullName: string } | null;
    employerProfile?: { companyName: string } | null;
  };
  course?: {
    id: string;
    title: string;
  };
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewListResponse {
  summary: RatingSummary;
  reviews: ReviewItem[];
}

export interface CreateReviewPayload {
  relationshipType: ReviewRelationshipType;
  relationshipId: string;
  subjectUserId?: string;
  courseId?: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReportReviewPayload {
  reason: string;
  details?: string;
}

export class ReviewsService {
  /**
   * Create a new verified review.
   */
  static async createReview(payload: CreateReviewPayload): Promise<ReviewItem> {
    try {
      const res = await api.post('/reviews', payload);
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to submit review'));
    }
  }

  /**
   * Get single review by ID.
   */
  static async getReviewById(id: string): Promise<ReviewItem> {
    try {
      const res = await api.get(`/reviews/${id}`);
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to fetch review'));
    }
  }

  /**
   * Update review content/rating.
   */
  static async updateReview(id: string, payload: UpdateReviewPayload): Promise<ReviewItem> {
    try {
      const res = await api.patch(`/reviews/${id}`, payload);
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to update review'));
    }
  }

  /**
   * Delete a review.
   */
  static async deleteReview(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await api.delete(`/reviews/${id}`);
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to delete review'));
    }
  }

  /**
   * Get reviews for a subject user (Candidate, Employer, Trainer).
   */
  static async getReviewsForUser(userId: string): Promise<ReviewListResponse> {
    try {
      const res = await api.get(`/reviews/user/${userId}`);
      return res.data;
    } catch (err: any) {
      return {
        summary: { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
        reviews: [],
      };
    }
  }

  /**
   * Get reviews for a course.
   */
  static async getReviewsForCourse(courseId: string): Promise<ReviewListResponse> {
    try {
      const res = await api.get(`/reviews/course/${courseId}`);
      return res.data;
    } catch (err: any) {
      return {
        summary: { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
        reviews: [],
      };
    }
  }

  /**
   * Get reviews given by logged-in user.
   */
  static async getMyGivenReviews(): Promise<ReviewItem[]> {
    try {
      const res = await api.get('/reviews/me/given');
      return res.data;
    } catch (err: any) {
      return [];
    }
  }

  /**
   * Get reviews received by logged-in user.
   */
  static async getMyReceivedReviews(): Promise<ReviewListResponse> {
    try {
      const res = await api.get('/reviews/me/received');
      return res.data;
    } catch (err: any) {
      return {
        summary: { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
        reviews: [],
      };
    }
  }

  /**
   * Report a review for moderation.
   */
  static async reportReview(reviewId: string, payload: ReportReviewPayload): Promise<any> {
    try {
      const res = await api.post(`/reviews/${reviewId}/report`, payload);
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to report review'));
    }
  }

  /**
   * Admin: List all reviews.
   */
  static async getAdminReviews(status?: ReviewStatus): Promise<ReviewItem[]> {
    try {
      const params = status ? { status } : {};
      const res = await api.get('/admin/reviews', { params });
      return res.data;
    } catch (err: any) {
      return [];
    }
  }

  /**
   * Admin: List all reported reviews.
   */
  static async getAdminReports(status?: ReviewReportStatus): Promise<any[]> {
    try {
      const params = status ? { status } : {};
      const res = await api.get('/admin/reviews/reports', { params });
      return res.data;
    } catch (err: any) {
      return [];
    }
  }

  /**
   * Admin: Moderate a review.
   */
  static async moderateReview(id: string, status: ReviewStatus): Promise<ReviewItem> {
    try {
      const res = await api.patch(`/admin/reviews/${id}/moderate`, { status });
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to moderate review'));
    }
  }

  /**
   * Admin: Resolve a review report.
   */
  static async resolveReport(id: string, status: ReviewReportStatus): Promise<any> {
    try {
      const res = await api.patch(`/admin/review-reports/${id}/resolve`, { status });
      return res.data;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'Failed to resolve report'));
    }
  }
}
