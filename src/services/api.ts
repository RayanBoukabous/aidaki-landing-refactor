import {
  Course,
  Lesson,
  Specialization,
  StudyModule,
  YearOfStudy,
  CoursesResponse,
  LessonResponse,
  SpecializationResponse,
  StudyModuleResponse,
  YearOfStudyResponse,
  Locale
} from '@/types/api';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aidaki.ai/api';

class ApiService {
  private async fetchWithHeaders<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Specializations
  async getSpecialization(id: number): Promise<Specialization> {
    const response = await this.fetchWithHeaders<SpecializationResponse>(`/specializations/${id}`);
    return response.data!;
  }

  async getSpecializations(): Promise<Specialization[]> {
    const response = await this.fetchWithHeaders<{ data: Specialization[] }>('/specializations');
    return response.data || [];
  }

  // Years of Study
  async getYearsOfStudy(): Promise<YearOfStudy[]> {
    const response = await this.fetchWithHeaders<YearOfStudyResponse>('/year-of-study');
    return response.data || [];
  }

  async getYearOfStudy(id: number): Promise<YearOfStudy> {
    const response = await this.fetchWithHeaders<{ data: YearOfStudy }>(`/year-of-study/${id}`);
    return response.data!;
  }

  // Study Modules
  async getStudyModule(id: number): Promise<StudyModule> {
    const response = await this.fetchWithHeaders<StudyModuleResponse>(`/study-modules/${id}`);
    return response.data!;
  }

  async getStudyModules(): Promise<StudyModule[]> {
    const response = await this.fetchWithHeaders<{ data: StudyModule[] }>('/study-modules');
    return response.data || [];
  }

  // Courses
  async getActiveCourses(): Promise<Course[]> {
    const response = await this.fetchWithHeaders<CoursesResponse>('/courses/active');
    return response.courses || [];
  }

  async getCourse(id: number): Promise<Course> {
    const response = await this.fetchWithHeaders<{ data: Course }>(`/courses/${id}`);
    return response.data!;
  }

  async getCoursesBySpecialization(specializationId: number): Promise<Course[]> {
    const response = await this.fetchWithHeaders<CoursesResponse>(`/courses?specializationId=${specializationId}`);
    return response.courses || [];
  }

  async getCoursesByStudyModule(studyModuleId: number): Promise<Course[]> {
    const response = await this.fetchWithHeaders<CoursesResponse>(`/courses?studyModuleId=${studyModuleId}`);
    return response.courses || [];
  }

  // Lessons
  async getLesson(id: number): Promise<Lesson> {
    const response = await this.fetchWithHeaders<LessonResponse>(`/lessons/${id}`);
    return response.lesson!;
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    const response = await this.fetchWithHeaders<{ data: Lesson[] }>(`/lessons?courseId=${courseId}`);
    return response.data || [];
  }

  // Enrollment
  async enrollInCourse(courseId: number): Promise<{ message: string }> {
    return this.fetchWithHeaders<{ message: string }>(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async unenrollFromCourse(courseId: number): Promise<{ message: string }> {
    return this.fetchWithHeaders<{ message: string }>(`/courses/${courseId}/unenroll`, {
      method: 'DELETE',
    });
  }

  // Search and Filtering
  async searchCourses(query: string, filters?: {
    specializationId?: number;
    studyModuleId?: number;
    isActive?: boolean;
  }): Promise<Course[]> {
    const params = new URLSearchParams();
    params.append('q', query);

    if (filters?.specializationId) {
      params.append('specializationId', filters.specializationId.toString());
    }
    if (filters?.studyModuleId) {
      params.append('studyModuleId', filters.studyModuleId.toString());
    }
    if (filters?.isActive !== undefined) {
      params.append('isActive', filters.isActive.toString());
    }

    const response = await this.fetchWithHeaders<CoursesResponse>(`/courses/search?${params}`);
    return response.courses || [];
  }
}

// Singleton instance
export const apiService = new ApiService();

// Utility functions for working with translated API data
export const apiUtils = {
  /**
   * Sort translatable items by title in current locale
   */
  sortByTranslatedTitle<T extends { title: string; titleTranslations?: Record<Locale, string> | null }>(
    items: T[],
    locale: Locale,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    return [...items].sort((a, b) => {
      const titleA = a.titleTranslations?.[locale] || a.title || '';
      const titleB = b.titleTranslations?.[locale] || b.title || '';

      const comparison = titleA.localeCompare(titleB);
      return direction === 'desc' ? -comparison : comparison;
    });
  },

  /**
   * Filter items that have translations for specific locale
   */
  filterByLocaleSupport<T extends { supportedLocales: Locale[] }>(
    items: T[],
    locale: Locale
  ): T[] {
    return items.filter(item => item.supportedLocales.includes(locale));
  },

  /**
   * Group items by translation status
   */
  groupByTranslationStatus<T extends {
    titleTranslations?: Record<Locale, string> | null;
    supportedLocales: Locale[];
  }>(
    items: T[],
    locale: Locale
  ): {
    translated: T[];
    fallback: T[];
    missing: T[];
  } {
    const translated: T[] = [];
    const fallback: T[] = [];
    const missing: T[] = [];

    items.forEach(item => {
      if (item.titleTranslations?.[locale]) {
        translated.push(item);
      } else if (item.supportedLocales.includes(locale)) {
        fallback.push(item);
      } else {
        missing.push(item);
      }
    });

    return { translated, fallback, missing };
  },

  /**
   * Get translation statistics for a collection
   */
  getTranslationStats<T extends {
    titleTranslations?: Record<Locale, string> | null;
    descriptionTranslations?: Record<Locale, string> | null;
    supportedLocales: Locale[];
  }>(
    items: T[],
    locale: Locale
  ): {
    total: number;
    withTitleTranslation: number;
    withDescriptionTranslation: number;
    fullyTranslated: number;
    supported: number;
    percentage: {
      title: number;
      description: number;
      full: number;
      supported: number;
    };
  } {
    const total = items.length;
    let withTitleTranslation = 0;
    let withDescriptionTranslation = 0;
    let fullyTranslated = 0;
    let supported = 0;

    items.forEach(item => {
      const hasTitle = !!item.titleTranslations?.[locale];
      const hasDescription = !!item.descriptionTranslations?.[locale];
      const isSupported = item.supportedLocales.includes(locale);

      if (hasTitle) withTitleTranslation++;
      if (hasDescription) withDescriptionTranslation++;
      if (hasTitle && hasDescription) fullyTranslated++;
      if (isSupported) supported++;
    });

    return {
      total,
      withTitleTranslation,
      withDescriptionTranslation,
      fullyTranslated,
      supported,
      percentage: {
        title: total > 0 ? (withTitleTranslation / total) * 100 : 0,
        description: total > 0 ? (withDescriptionTranslation / total) * 100 : 0,
        full: total > 0 ? (fullyTranslated / total) * 100 : 0,
        supported: total > 0 ? (supported / total) * 100 : 0,
      }
    };
  }
};

export default apiService;
