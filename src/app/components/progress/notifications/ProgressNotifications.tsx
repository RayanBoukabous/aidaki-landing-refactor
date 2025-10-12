'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useStudySessionContext } from '../StudySessionProvider';

/**
 * Progress Notifications Component
 * Displays achievement and progress notifications
 */
export const ProgressNotifications = ({ 
  position = 'top-right',
  maxNotifications = 5,
  autoRemove = true,
  className = ""
}) => {
  const { notifications, removeNotification } = useStudySessionContext();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  // Update visible notifications when notifications change
  useEffect(() => {
    setVisibleNotifications(notifications.slice(-maxNotifications));
  }, [notifications, maxNotifications]);

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position] || positions['top-right'];
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      achievement: '🏆',
      streak: '🔥',
      milestone: '⭐',
      warning: '⚠️',
      info: 'ℹ️',
      error: '❌'
    };
    return icons[type] || icons.info;
  };

  const getNotificationColors = (type) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      achievement: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      streak: 'bg-orange-50 border-orange-200 text-orange-800',
      milestone: 'bg-purple-50 border-purple-200 text-purple-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      error: 'bg-red-50 border-red-200 text-red-800'
    };
    return colors[type] || colors.info;
  };

  const handleRemove = (notificationId) => {
    removeNotification(notificationId);
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      <div className="space-y-2 max-w-sm">
        {visibleNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={handleRemove}
            autoRemove={autoRemove}
            getIcon={getNotificationIcon}
            getColors={getNotificationColors}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Individual Notification Item Component
 */
const NotificationItem = ({ 
  notification, 
  onRemove, 
  autoRemove,
  getIcon,
  getColors
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-remove timer
  useEffect(() => {
    if (autoRemove && notification.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [autoRemove, notification.duration]);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        rounded-lg border shadow-lg p-4 max-w-sm
        ${getColors(notification.type)}
      `}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            {notification.title && (
              <div className="font-semibold text-sm mb-1">
                {notification.title}
              </div>
            )}
            <div className="text-sm leading-relaxed">
              {notification.message}
            </div>
            {notification.actionUrl && (
              <button
                onClick={() => window.location.href = notification.actionUrl}
                className="mt-2 text-xs underline hover:no-underline"
              >
                Take Action
              </button>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Achievement Banner Component
 * Special component for major achievements
 */
export const AchievementBanner = ({ 
  achievement,
  onClose,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('notifications');

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      // Auto-close after 8 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  if (!achievement) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-500"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      />
      
      {/* Achievement Modal */}
      <div
        className={`
          relative bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl
          transform transition-all duration-500
          ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
      >
        {/* Celebration Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-pulse absolute top-4 left-4 text-yellow-400">⭐</div>
          <div className="animate-bounce absolute top-6 right-6 text-yellow-400 animation-delay-200">✨</div>
          <div className="animate-pulse absolute bottom-8 left-6 text-yellow-400 animation-delay-400">🎉</div>
          <div className="animate-bounce absolute bottom-6 right-4 text-yellow-400 animation-delay-600">⭐</div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Achievement Content */}
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {achievement.title}
        </h2>
        <p className="text-gray-600 mb-6">
          {achievement.message}
        </p>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('achievement.awesome')}
        </button>
      </div>
    </div>
  );
};

/**
 * Streak Reminder Component
 * Gentle reminder to maintain study streak
 */
export const StreakReminder = ({ 
  streak,
  show = false,
  onDismiss,
  onStartStudying,
  className = ""
}) => {
  const t = useTranslations('notifications');

  if (!show || !streak) return null;

  const isAtRisk = streak.currentStreak > 0 && !streak.studiedToday;
  
  return (
    <div className={`streak-reminder ${className}`}>
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {isAtRisk ? '⚠️' : '💪'}
          </div>
          
          <div className="flex-1">
            <div className="font-semibold text-orange-800 mb-1">
              {isAtRisk 
                ? t('streak.atRisk', { days: streak.currentStreak })
                : t('streak.readyToStart')
              }
            </div>
            <div className="text-sm text-orange-700">
              {isAtRisk
                ? t('streak.studyToKeep')
                : t('streak.studyToStart')
              }
            </div>
          </div>
          
          <div className="flex gap-2">
            {onStartStudying && (
              <button
                onClick={onStartStudying}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                {t('streak.startStudying')}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-orange-600 hover:text-orange-700 transition-colors text-sm"
              >
                {t('common.dismiss')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Daily Goal Progress Component
 * Shows progress towards daily study goal
 */
export const DailyGoalProgress = ({ 
  minutesToday = 0,
  dailyGoal = 10,
  showRemaining = true,
  className = ""
}) => {
  const t = useTranslations('notifications');
  
  const progressPercentage = Math.min((minutesToday / dailyGoal) * 100, 100);
  const remainingMinutes = Math.max(dailyGoal - minutesToday, 0);
  const isCompleted = minutesToday >= dailyGoal;

  const formatTime = (minutes) => {
    if (minutes < 60) return t('time.minutes', { count: minutes });
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 
      ? t('time.hoursAndMinutes', { hours, minutes: mins })
      : t('time.hours', { count: hours });
  };

  return (
    <div className={`daily-goal-progress ${className}`}>
      <div className={`rounded-lg p-4 ${
        isCompleted 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {isCompleted ? '🎯' : '⏰'}
            </span>
            <span className={`font-semibold ${
              isCompleted ? 'text-green-800' : 'text-blue-800'
            }`}>
              {t('dailyGoal.title')}
            </span>
          </div>
          <span className={`text-sm font-medium ${
            isCompleted ? 'text-green-600' : 'text-blue-600'
          }`}>
            {formatTime(minutesToday)} / {formatTime(dailyGoal)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={isCompleted ? 'text-green-600' : 'text-blue-600'}>
            {t('dailyGoal.percentComplete', { percent: Math.round(progressPercentage) })}
          </span>
          
          {showRemaining && !isCompleted && (
            <span className="text-gray-600">
              {t('dailyGoal.remaining', { time: formatTime(remainingMinutes) })}
            </span>
          )}
          
          {isCompleted && (
            <span className="text-green-600 font-medium">
              {t('dailyGoal.goalAchieved')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Notification Center Component
 * Centralized view of all notifications
 */
export const NotificationCenter = ({ 
  isOpen = false,
  onClose,
  className = ""
}) => {
  const { notifications, removeNotification } = useStudySessionContext();
  const t = useTranslations('notifications');

  if (!isOpen) return null;

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const type = notification.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(notification);
    return groups;
  }, {});

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('center.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {Object.keys(groupedNotifications).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔔</div>
              <div>{t('center.noNotifications')}</div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {Object.entries(groupedNotifications).map(([type, typeNotifications]) => (
                <div key={type}>
                  <h3 className="text-sm font-medium text-gray-600 mb-2 capitalize">
                    {t(`types.${type}`, { defaultValue: type })} ({typeNotifications.length})
                  </h3>
                  <div className="space-y-2">
                    {typeNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg">
                            {notification.type === 'achievement' && '🏆'}
                            {notification.type === 'streak' && '🔥'}
                            {notification.type === 'success' && '✅'}
                            {notification.type === 'info' && 'ℹ️'}
                          </div>
                          <div className="flex-1 min-w-0">
                            {notification.title && (
                              <div className="font-medium text-sm text-gray-800 mb-1">
                                {notification.title}
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default {
  ProgressNotifications,
  AchievementBanner,
  StreakReminder,
  DailyGoalProgress,
  NotificationCenter
};