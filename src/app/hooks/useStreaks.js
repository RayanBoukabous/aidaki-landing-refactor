'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { streaksService, calendarUtils, streakNotifications } from '../services/streaks';

/**
 * Streaks Hook
 * Manages streak data, calendar, and related functionality
 */
export const useStreaks = (options = {}) => {
  const {
    autoFetch = true,
    pollInterval = null, // Set to number (ms) to enable polling
    onStreakChange = null,
    onMilestone = null
  } = options;

  // State
  const [state, setState] = useState({
    streak: null,
    calendar: null,
    leaderboard: [],
    loading: false,
    error: null,
    lastFetched: null
  });

  // Refs
  const pollIntervalRef = useRef(null);
  const previousStreakRef = useRef(0);

  /**
   * Fetch current streak data
   */
  const fetchCurrentStreak = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await streaksService.getCurrentStreak();
      
      setState(prev => {
        const newState = {
          ...prev,
          streak: response,
          loading: false,
          lastFetched: Date.now()
        };

        // Check for streak changes and milestones
        if (prev.streak && response.currentStreak !== prev.streak.currentStreak) {
          if (onStreakChange) {
            onStreakChange(response.currentStreak, prev.streak.currentStreak);
          }

          // Check for milestones
          const milestones = streakNotifications.checkStreakMilestones(
            response.currentStreak, 
            prev.streak.currentStreak
          );

          if (milestones.length > 0 && onMilestone) {
            milestones.forEach(milestone => onMilestone(milestone));
          }
        }

        return newState;
      });

      previousStreakRef.current = response.currentStreak;
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch streak data',
        loading: false
      }));
      throw error;
    }
  }, [onStreakChange, onMilestone]);

  /**
   * Fetch study calendar for specific month/year
   */
  const fetchCalendar = useCallback(async (year, month) => {
    try {
      const response = await streaksService.getStudyCalendar(year, month);
      
      setState(prev => ({
        ...prev,
        calendar: {
          ...response,
          grid: calendarUtils.generateCalendarGrid(year, month, response.studyDays)
        }
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch calendar data'
      }));
      throw error;
    }
  }, []);

  /**
   * Fetch current month calendar
   */
  const fetchCurrentMonthCalendar = useCallback(async () => {
    const now = new Date();
    return fetchCalendar(now.getFullYear(), now.getMonth() + 1);
  }, [fetchCalendar]);

  /**
   * Fetch streak leaderboard
   */
  const fetchLeaderboard = useCallback(async (limit = 10) => {
    try {
      const response = await streaksService.getStreakLeaderboard(limit);
      
      setState(prev => ({
        ...prev,
        leaderboard: response.leaderboard || response
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch leaderboard'
      }));
      throw error;
    }
  }, []);

  /**
   * Set daily study goal
   */
  const setDailyGoal = useCallback(async (targetMinutes) => {
    try {
      const response = await streaksService.setDailyGoal(targetMinutes);
      
      // Refresh streak data to get updated goal info
      await fetchCurrentStreak();
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to set daily goal');
    }
  }, [fetchCurrentStreak]);

  /**
   * Get daily goal progress
   */
  const getDailyGoalProgress = useCallback(async (date = null) => {
    try {
      const response = await streaksService.getDailyGoalProgress(date);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to get daily goal progress');
    }
  }, []);

  /**
   * Refresh all streak data
   */
  const refreshStreakData = useCallback(async () => {
    try {
      await Promise.all([
        fetchCurrentStreak(),
        fetchCurrentMonthCalendar(),
        fetchLeaderboard(10)
      ]);
    } catch (error) {
      console.error('Error refreshing streak data:', error);
    }
  }, [fetchCurrentStreak, fetchCurrentMonthCalendar, fetchLeaderboard]);

  /**
   * Check if user has studied today
   */
  const hasStudiedToday = useCallback(() => {
    return state.streak?.studiedToday || false;
  }, [state.streak]);

  /**
   * Get streak status message
   */
  const getStreakStatus = useCallback(() => {
    if (!state.streak) return 'Loading...';

    const { currentStreak, studiedToday, minutesToday } = state.streak;

    if (studiedToday && minutesToday >= 10) {
      return `${currentStreak} day streak! ${minutesToday} minutes today.`;
    } else if (studiedToday && minutesToday < 10) {
      return `Study ${10 - minutesToday} more minutes to continue your streak!`;
    } else if (currentStreak > 0) {
      return `${currentStreak} day streak at risk! Study today to keep it alive.`;
    } else {
      return 'Start your study streak today!';
    }
  }, [state.streak]);

  /**
   * Get calendar statistics
   */
  const getCalendarStats = useCallback(() => {
    if (!state.calendar?.studyDays) return null;
    return calendarUtils.getCalendarStats(state.calendar.studyDays);
  }, [state.calendar]);

  /**
   * Setup polling if enabled
   */
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        fetchCurrentStreak();
      }, pollInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [pollInterval, fetchCurrentStreak]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (autoFetch) {
      refreshStreakData();
    }
  }, [autoFetch, refreshStreakData]);

  return {
    // State
    ...state,
    
    // Actions
    fetchCurrentStreak,
    fetchCalendar,
    fetchCurrentMonthCalendar,
    fetchLeaderboard,
    setDailyGoal,
    getDailyGoalProgress,
    refreshStreakData,

    // Computed values
    hasStudiedToday: hasStudiedToday(),
    streakStatus: getStreakStatus(),
    calendarStats: getCalendarStats(),
    currentStreak: state.streak?.currentStreak || 0,
    longestStreak: state.streak?.longestStreak || 0,
    minutesToday: state.streak?.minutesToday || 0,
    isLoading: state.loading
  };
};

/**
 * Calendar Hook
 * Specialized hook for calendar functionality
 */
export const useCalendar = (initialYear = null, initialMonth = null) => {
  const currentDate = new Date();
  const [year, setYear] = useState(initialYear || currentDate.getFullYear());
  const [month, setMonth] = useState(initialMonth || currentDate.getMonth() + 1);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch calendar data for current year/month
   */
  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await streaksService.getStudyCalendar(year, month);
      const grid = calendarUtils.generateCalendarGrid(year, month, response.studyDays);
      
      setCalendarData({
        ...response,
        grid,
        stats: calendarUtils.getCalendarStats(response.studyDays)
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  /**
   * Navigate to previous month
   */
  const goToPreviousMonth = useCallback(() => {
    if (month === 1) {
      setYear(prev => prev - 1);
      setMonth(12);
    } else {
      setMonth(prev => prev - 1);
    }
  }, [month]);

  /**
   * Navigate to next month
   */
  const goToNextMonth = useCallback(() => {
    if (month === 12) {
      setYear(prev => prev + 1);
      setMonth(1);
    } else {
      setMonth(prev => prev + 1);
    }
  }, [month]);

  /**
   * Go to current month
   */
  const goToCurrentMonth = useCallback(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  }, []);

  /**
   * Go to specific month/year
   */
  const goToMonth = useCallback((targetYear, targetMonth) => {
    setYear(targetYear);
    setMonth(targetMonth);
  }, []);

  /**
   * Get month name
   */
  const getMonthName = useCallback((monthNum = month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNum - 1];
  }, [month]);

  /**
   * Check if current month is being viewed
   */
  const isCurrentMonth = useCallback(() => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  }, [year, month]);

  // Fetch data when year/month changes
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return {
    // State
    year,
    month,
    calendarData,
    loading,
    error,

    // Actions
    fetchCalendarData,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    goToMonth,

    // Computed values
    monthName: getMonthName(),
    isCurrentMonth: isCurrentMonth(),
    canGoNext: !isCurrentMonth(), // Prevent going beyond current month
    
    // Calendar utilities
    formatStudyTime: calendarUtils.formatStudyTime,
    getIntensityLevel: calendarUtils.getIntensityLevel,
    getRelativeDate: calendarUtils.getRelativeDate
  };
};

/**
 * Streak Notifications Hook
 * Manages streak-related notifications and achievements
 */
export const useStreakNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Add notification
   */
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      ...prev,
      { ...notification, id: notification.id || Date.now().toString() }
    ]);
  }, []);

  /**
   * Remove notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  }, []);

  /**
   * Check for streak milestones
   */
  const checkMilestones = useCallback((currentStreak, previousStreak = 0) => {
    const milestones = streakNotifications.checkStreakMilestones(currentStreak, previousStreak);
    milestones.forEach(milestone => addNotification(milestone));
    return milestones;
  }, [addNotification]);

  /**
   * Check daily goal achievement
   */
  const checkDailyGoal = useCallback((minutesToday, dailyGoal = 30) => {
    const goalNotification = streakNotifications.checkDailyGoal(minutesToday, dailyGoal);
    if (goalNotification) {
      addNotification(goalNotification);
    }
    return goalNotification;
  }, [addNotification]);

  /**
   * Generate streak reminder
   */
  const generateReminder = useCallback((currentStreak, studiedToday) => {
    const reminder = streakNotifications.getStreakReminder(currentStreak, studiedToday);
    if (reminder) {
      addNotification(reminder);
    }
    return reminder;
  }, [addNotification]);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    checkMilestones,
    checkDailyGoal,
    generateReminder
  };
};

export default useStreaks;
