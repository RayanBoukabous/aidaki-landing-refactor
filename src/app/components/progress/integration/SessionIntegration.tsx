'use client'

import React from 'react';
import { useStudySessionContext } from '../progress/StudySessionProvider';
import { 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  Flame,
  BookOpen,
  Timer,
  TrendingUp,
  Trophy,
  Bell
} from 'lucide-react';

/**
 * Session Status Badge Component
 * Shows current study session status in the navbar
 */
export const SessionStatusBadge = ({ 
  compact = false,
  showNotifications = true,
  className = ""
}) => {
  const {
    isSessionActive,
    sessionDuration,
    currentLessonId,
    isUserActive,
    currentStreak,
    hasStudiedToday,
    notifications
  } = useStudySessionContext();

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (!isSessionActive && compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Study Streak Indicator */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
            <Flame className="w-3 h-3" />
            <span>{currentStreak}</span>
          </div>
        )}
        
        {/* Notifications Badge */}
        {showNotifications && unreadNotifications > 0 && (
          <div className="relative">
            <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">
              <Bell className="w-3 h-3" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {unreadNotifications}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isSessionActive) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <BookOpen className="w-4 h-4" />
          <span>No active session</span>
        </div>
        
        {/* Study Streak */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
            <Flame className="w-4 h-4" />
            <span>{currentStreak} day streak</span>
          </div>
        )}
        
        {/* Notifications */}
        {showNotifications && unreadNotifications > 0 && (
          <div className="relative">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {unreadNotifications}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Active Session Indicator */}
      <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Timer className="w-4 h-4" />
        </div>
        <span className="font-mono text-sm">
          {formatTime(sessionDuration)}
        </span>
      </div>

      {/* Activity Status */}
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
        isUserActive 
          ? 'bg-green-100 text-green-700' 
          : 'bg-yellow-100 text-yellow-700'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isUserActive ? 'bg-green-500' : 'bg-yellow-500'
        }`} />
        <span>{isUserActive ? 'Active' : 'Away'}</span>
      </div>

      {/* Current Lesson */}
      {currentLessonId && (
        <div className="text-xs text-gray-600">
          Lesson {currentLessonId}
        </div>
      )}

      {/* Notifications */}
      {showNotifications && unreadNotifications > 0 && (
        <div className="relative">
          <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
            <Bell className="w-3 h-3" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadNotifications}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Sidebar Progress Summary Component
 * Shows condensed progress info in the sidebar
 */
export const SidebarProgressSummary = ({ 
  isCollapsed = false,
  className = ""
}) => {
  const {
    currentStreak,
    hasStudiedToday,
    isSessionActive,
    sessionDuration,
    overallProgress
  } = useStudySessionContext();

  if (isCollapsed) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Streak indicator */}
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
            hasStudiedToday ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <Flame className="w-4 h-4" />
          </div>
        </div>

        {/* Session indicator */}
        {isSessionActive && (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
              <Play className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">
            {Math.round(overallProgress?.averageProgress || 0)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        Progress Summary
      </h3>

      <div className="space-y-3">
        {/* Study Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={`w-4 h-4 ${hasStudiedToday ? 'text-orange-500' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-700">Streak</span>
          </div>
          <span className={`text-sm font-semibold ${
            currentStreak > 0 ? 'text-orange-600' : 'text-gray-500'
          }`}>
            {currentStreak} days
          </span>
        </div>

        {/* Active Session */}
        {isSessionActive && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700">Session</span>
            </div>
            <span className="text-sm font-mono text-green-600">
              {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Overall Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Overall</span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round(overallProgress?.averageProgress || 0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress?.averageProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Courses Progress */}
        <div className="text-xs text-gray-600 text-center">
          {overallProgress?.completedCourses || 0}/{overallProgress?.totalCourses || 0} courses completed
        </div>
      </div>
    </div>
  );
};

/**
 * Achievement Toast Component
 * Temporary notification for achievements
 */
export const AchievementToast = ({ 
  achievement,
  onClose,
  duration = 5000,
  className = ""
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'streak': return <Flame className="w-6 h-6 text-orange-500" />;
      case 'completion': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'milestone': return <Trophy className="w-6 h-6 text-yellow-500" />;
      default: return <Trophy className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getAchievementIcon(achievement.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">
            {achievement.title}
          </h4>
          <p className="text-gray-600 text-sm mt-1">
            {achievement.message}
          </p>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Quick Actions Menu Component
 * Floating action buttons for quick study actions
 */
export const QuickActionsMenu = ({ 
  position = 'bottom-right',
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    isSessionActive,
    startLessonSession,
    endCurrentSession,
    addNotification
  } = useStudySessionContext();

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const handleQuickStart = async () => {
    try {
      // This would typically open a lesson selector or start the last lesson
      addNotification({
        type: 'info',
        message: 'Quick start feature coming soon!',
        duration: 3000
      });
    } catch (error) {
      console.error('Quick start error:', error);
    }
  };

  const handleEndSession = async () => {
    try {
      await endCurrentSession();
      setIsOpen(false);
    } catch (error) {
      console.error('End session error:', error);
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40 ${className}`}>
      <div className="flex flex-col items-end gap-2">
        {/* Action Buttons (when expanded) */}
        {isOpen && (
          <div className="flex flex-col gap-2 mb-2">
            {!isSessionActive ? (
              <button
                onClick={handleQuickStart}
                className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                title="Quick Start Study Session"
              >
                <Play className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleEndSession}
                className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                title="End Current Session"
              >
                <Pause className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/dashboard/progress'}
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
              title="View Progress"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105
            ${isSessionActive 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-800 text-white'
            }
          `}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : isSessionActive ? (
            <Timer className="w-6 h-6" />
          ) : (
            <BookOpen className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Study Goal Progress Mini Widget
 * Small widget showing daily goal progress
 */
export const StudyGoalMiniWidget = ({ 
  goal = 30, // minutes
  className = ""
}) => {
  const { streak } = useStudySessionContext();
  const minutesToday = streak?.minutesToday || 0;
  const progress = Math.min((minutesToday / goal) * 100, 100);
  const isCompleted = minutesToday >= goal;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Daily Goal</span>
        <div className={`text-xs px-2 py-1 rounded-full ${
          isCompleted 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isCompleted ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{minutesToday}m studied</span>
        <span>{isCompleted ? '🎯 Goal reached!' : `${goal - minutesToday}m remaining`}</span>
      </div>
    </div>
  );
};

export default {
  SessionStatusBadge,
  SidebarProgressSummary,
  AchievementToast,
  QuickActionsMenu,
  StudyGoalMiniWidget
};
