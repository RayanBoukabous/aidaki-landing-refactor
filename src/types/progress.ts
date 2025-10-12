// Progress Tracking Type Definitions

export type ActivityType = 'lesson' | 'quiz' | 'chat' | 'notes' | 'general';

// Study Session Interfaces
export interface StudySession {
  sessionId: number;
  userId: number;
  lessonId?: number;
  activity: ActivityType;
  startTime: string;
  endTime?: string;
  duration?: number; // seconds
  isActive: boolean;
}

export interface StudySessionRequest {
  lessonId?: number;
  activity: ActivityType;
}

export interface HeartbeatRequest {
  sessionId: number;
  isActive: boolean;
  timestamp: number;
  metadata?: {
    currentUrl?: string;
    isVisible?: boolean;
    isFocused?: boolean;
    videoProgress?: number;
    scrollPosition?: number;
  };
}

export interface HeartbeatResponse {
  message: string;
  sessionActive: boolean;
  totalActiveTime: number;
}

// Streak Interfaces
export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studiedToday: boolean;
  minutesToday: number;
}

export interface StudyDay {
  date: string;
  totalMinutes: number;
}

export interface StudyCalendar {
  year: number;
  month: number;
  studyDays: StudyDay[];
  currentStreak: number;
  longestStreak: number;
  totalStudyDaysThisMonth: number;
}

export interface StreakLeaderboard {
  userId: number;
  username: string;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

// Course Progress Interfaces
export interface LessonCompletion {
  id: number;
  userId: number;
  lessonId: number;
  completedAt: string;
  timeSpent: number;
  quizScore?: number;
  videoProgress?: number;
}

export interface CourseProgress {
  courseId: number;
  progress: number; // percentage 0-100
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface LessonCompletionRequest {
  timeSpentSeconds?: number;
  quizScore?: number;
  videoProgress?: number;
}

export interface LessonCompletionResponse {
  success: boolean;
  message: string;
  completion: LessonCompletion;
  courseProgress: CourseProgress;
}

// Study Statistics Interfaces
export interface StudyStats {
  totalStudyTime: number; // in minutes
  totalSessions: number;
  averageSessionLength: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  weeklyStudyTime: number;
  monthlyStudyTime: number;
}

export interface DailyStudyTime {
  date: string;
  totalMinutes: number;
  sessionCount: number;
  activities: {
    lesson: number;
    quiz: number;
    chat: number;
    notes: number;
    general: number;
  };
}

export interface WeeklyStudyTime {
  week: string; // ISO week format
  totalMinutes: number;
  dailyBreakdown: DailyStudyTime[];
}

export interface SubjectStudyTime {
  subject: string;
  totalMinutes: number;
  sessionCount: number;
  percentage: number;
}

// Dashboard Data Interface
export interface ProgressDashboard {
  user: {
    id: number;
    name: string;
  };
  courses: CourseProgress[];
  recentCompletions: LessonCompletion[];
  studyStats: StudyStats;
  streak: UserStreak;
  dailyGoal: {
    targetMinutes: number;
    completedMinutes: number;
    percentage: number;
  };
}

// Hook State Interfaces
export interface StudySessionState {
  currentSession: StudySession | null;
  isTracking: boolean;
  isActive: boolean;
  totalActiveTime: number;
  error: string | null;
  loading: boolean;
}

export interface StreakState {
  streak: UserStreak | null;
  calendar: StudyCalendar | null;
  leaderboard: StreakLeaderboard[];
  loading: boolean;
  error: string | null;
}

export interface ProgressState {
  courses: CourseProgress[];
  completedLessons: LessonCompletion[];
  studyStats: StudyStats | null;
  dashboard: ProgressDashboard | null;
  loading: boolean;
  error: string | null;
}

// Activity Tracker Interfaces
export interface ActivityState {
  isActive: boolean;
  lastActivity: number;
  isVisible: boolean;
  isFocused: boolean;
  idleThreshold: number; // milliseconds
}

export interface ActivityEvent {
  type: 'mouse' | 'keyboard' | 'scroll' | 'touch' | 'visibility' | 'focus';
  timestamp: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Notification Interfaces
export interface ProgressNotification {
  id: string;
  type: 'streak' | 'completion' | 'milestone' | 'reminder';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationState {
  notifications: ProgressNotification[];
  unreadCount: number;
}
