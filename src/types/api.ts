// Supported locales from backend
export type Locale = 'en' | 'fr' | 'ar';

// Base interface for translatable content
export interface Translatable {
  titleTranslations?: Record<Locale, string> | null;
  descriptionTranslations?: Record<Locale, string> | null;
  supportedLocales: Locale[];
  defaultLocale: Locale;
  title: string;
  description: string;
}

// Year of Study interface
export interface YearOfStudy extends Translatable {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Study Module interface
export interface StudyModule extends Translatable {
  id: number;
  colorHex?: string | null;
  iconId?: number | null;
  createdAt: string;
  updatedAt: string;
  icon?: any | null;
}

// Specialization interface
export interface Specialization extends Translatable {
  id: number;
  yearOfStudyId: number;
  createdAt: string;
  updatedAt: string;
  yearOfStudy?: YearOfStudy;
  studyModules?: Array<{
    specializationId: number;
    studyModuleId: number;
    studyModule: StudyModule;
  }>;
}

// Media interface
export interface Media {
  id: number;
  url: string;
  fileName: string;
  objectName: string;
  mimeType: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  createdAt: string;
  updatedAt: string;
}

// Course interface
export interface Course extends Translatable {
  id: number;
  isActive: boolean;
  coverImageId?: number | null;
  studyModuleId: number;
  specializationId: number;
  createdAt: string;
  updatedAt: string;
  specialization?: Specialization;
  studyModule?: StudyModule;
  coverImage?: Media | null;
  lessons?: Lesson[];
  users?: Array<{ enrolledAt: string }>;
  isEnrolled?: boolean;
  enrollmentInfo?: { enrolledAt: string };
}

// Lesson interface
export interface Lesson extends Translatable {
  id: number;
  courseId: number;
  direction: 'LTR' | 'RTL';
  lessonIndex: number;
  lessVideoId?: number | null;
  lessonDocumentId?: number | null;
  isActive: boolean;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
  lessVideo?: Media;
  lessonDocument?: Media;
  quizzes?: any[];
}

// API Response interfaces
export interface ApiResponse<T> {
  message?: string;
  status?: string;
  data?: T;
  courses?: T; // For courses endpoint
  lesson?: T; // For lesson endpoint
}

export interface CoursesResponse extends ApiResponse<Course[]> {
  courses: Course[];
}

export interface LessonResponse extends ApiResponse<Lesson> {
  lesson: Lesson;
}

export interface SpecializationResponse extends ApiResponse<Specialization> {
  data: Specialization;
}

export interface YearOfStudyResponse extends ApiResponse<YearOfStudy[]> {
  data: YearOfStudy[];
}

export interface StudyModuleResponse extends ApiResponse<StudyModule> {
  data: StudyModule;
}
