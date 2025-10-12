'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Streaks Hook
 * Manages daily study streaks and milestone notifications
 */
export const useStreaks = (options = {}) => {
  const {
    autoFetch = true,
    refreshInterval = null,
    onMilestone = null,
    onStreakLost = null
  } = options;

  const [state, setState] = useState({
    streak: null,
    currentStreak: 0,
    longestStreak: 0,
    hasStudiedToday: false,
    studiedDays: [],
    loading: false,
    error: null,
    lastFetch: null
  });

  // Memoize callbacks to prevent infinite re-renders
  const memoizedOnMilestone = useCallback((milestone) => {
    if (onMilestone) {
      onMilestone(milestone);
    }
  }, [onMilestone]);

  const memoizedOnStreakLost = useCallback(() => {
    if (onStreakLost) {
      onStreakLost();
    }
  }, [onStreakLost]);

  /**
   * Calculate streak data from study sessions
   */
  const calculateStreakData = useCallback(() => {
    try {
      const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
      const completions = JSON.parse(localStorage.getItem('lesson_completions') || '{}');
      
      // Get unique study dates
      const studyDates = new Set();
      
      // Add dates from sessions (at least 10 minutes)
      sessions.forEach(session => {
        if (session.duration >= 600) { // 10 minutes minimum
          const date = new Date(session.startTime).toDateString();
          studyDates.add(date);
        }
      });
      
      // Add dates from lesson completions
      Object.values(completions).forEach((completion: any) => {
        const date = new Date(completion.completedAt).toDateString();
        studyDates.add(date);
      });

      const sortedDates = Array.from(studyDates).sort((a, b) => 
        new Date(a).getTime() - new Date(b).getTime()
      );

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      // Check if studied today
      const hasStudiedToday = studyDates.has(today);
      
      // Start from today or yesterday and work backwards
      let checkDate = hasStudiedToday ? today : yesterday;
      let currentCheckTime = hasStudiedToday ? Date.now() : Date.now() - 24 * 60 * 60 * 1000;
      
      while (studyDates.has(new Date(currentCheckTime).toDateString())) {
        currentStreak++;
        currentCheckTime -= 24 * 60 * 60 * 1000;
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate = null;

      sortedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        
        if (lastDate) {
          const dayDiff = Math.floor((date.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        
        lastDate = date;
      });
      longestStreak = Math.max(longestStreak, tempStreak);

      // Calculate total study time today
      const todaySessions = sessions.filter(session => 
        new Date(session.startTime).toDateString() === today
      );
      const minutesToday = Math.floor(
        todaySessions.reduce((total, session) => total + session.duration, 0) / 60
      );

      // Calculate study days for calendar
      const studiedDays = sortedDates.map(dateStr => {
        const date = new Date(dateStr);
        const daysSessions = sessions.filter(session => 
          new Date(session.startTime).toDateString() === dateStr
        );
        const totalMinutes = Math.floor(
          daysSessions.reduce((total, session) => total + session.duration, 0) / 60
        );
        
        return {
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          totalMinutes,
          sessionCount: daysSessions.length
        };
      });

      return {
        currentStreak,
        longestStreak,
        hasStudiedToday,
        minutesToday,
        studiedDays,
        totalStudyDays: sortedDates.length
      };
    } catch (error) {
      console.error('Error calculating streak data:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        hasStudiedToday: false,
        minutesToday: 0,
        studiedDays: [],
        totalStudyDays: 0
      };
    }
  }, []);

  /**
   * Refresh streak data
   */
  const refreshStreakData = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const streakData = calculateStreakData();
      const previousStreak = state.currentStreak;
      
      setState(prev => ({
        ...prev,
        streak: streakData,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        hasStudiedToday: streakData.hasStudiedToday,
        studiedDays: streakData.studiedDays,
        loading: false,
        lastFetch: Date.now()
      }));

      // Check for milestones (only if streak increased)
      if (streakData.currentStreak > previousStreak && streakData.currentStreak > 0) {
        checkMilestones(streakData.currentStreak);
      }

      // Check for streak loss (only if we had a streak before)
      if (previousStreak > 0 && streakData.currentStreak === 0) {
        memoizedOnStreakLost();
      }

    } catch (error) {
      console.error('Error refreshing streak data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to refresh streak data',
        loading: false
      }));
    }
  }, [state.loading, state.currentStreak, calculateStreakData, memoizedOnStreakLost]);

  /**
   * Check for streak milestones
   */
  const checkMilestones = useCallback((streak) => {
    const milestones = [
      { days: 3, title: '3-Day Streak!', message: 'Great start! Keep the momentum going!' },
      { days: 7, title: 'Week Warrior!', message: 'Amazing! You\'ve studied for a whole week!' },
      { days: 14, title: 'Two Week Champion!', message: 'Incredible dedication! 14 days strong!' },
      { days: 30, title: 'Monthly Master!', message: 'Outstanding! 30 days of consistent learning!' },
      { days: 50, title: 'Halfway to 100!', message: 'You\'re unstoppable! 50 days of commitment!' },
      { days: 100, title: 'Century Club!', message: 'LEGENDARY! 100 days of studying! 🏆' }
    ];

    const milestone = milestones.find(m => m.days === streak);
    if (milestone) {
      memoizedOnMilestone(milestone);
    }
  }, [memoizedOnMilestone]);

  /**
   * Mark today as studied (called when session ends or lesson completed)
   */
  const markTodayAsStudied = useCallback(() => {
    // This will be called by the StudySessionProvider when appropriate
    // We don't need to do anything here as refreshStreakData will handle the calculation
    setTimeout(refreshStreakData, 100); // Small delay to ensure data is saved
  }, [refreshStreakData]);

  // Auto-fetch on mount (only once)
  useEffect(() => {
    if (autoFetch && !state.lastFetch) {
      refreshStreakData();
    }
  }, [autoFetch, state.lastFetch, refreshStreakData]);

  // Optional refresh interval (only if specified and not too frequent)
  useEffect(() => {
    if (refreshInterval && refreshInterval >= 30000) { // Minimum 30 seconds
      const interval = setInterval(() => {
        const timeSinceLastFetch = Date.now() - (state.lastFetch || 0);
        if (timeSinceLastFetch >= refreshInterval) {
          refreshStreakData();
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, state.lastFetch, refreshStreakData]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    // Current state
    streak: state.streak,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    hasStudiedToday: state.hasStudiedToday,
    studiedDays: state.studiedDays,
    loading: state.loading,
    error: state.error,
    
    // Actions
    refreshStreakData,
    markTodayAsStudied,
    
    // Utilities
    calculateStreakData
  }), [
    state.streak,
    state.currentStreak,
    state.longestStreak,
    state.hasStudiedToday,
    state.studiedDays,
    state.loading,
    state.error,
    refreshStreakData,
    markTodayAsStudied,
    calculateStreakData
  ]);
};

/**
 * Calendar Hook
 * Provides calendar-specific functionality for streak visualization
 */
export const useCalendar = (options = {}) => {
  const { 
    month = new Date().getMonth() + 1, // 1-based month
    year = new Date().getFullYear() 
  } = options;

  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);

  const streaks = useStreaks({ autoFetch: false });

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Get streak data
      const streakData = streaks.calculateStreakData();
      
      // Filter for the specified month/year
      const monthStudyDays = streakData.studiedDays.filter(day => {
        const date = new Date(day.date);
        return date.getMonth() === month - 1 && date.getFullYear() === year;
      });

      setCalendarData({
        month,
        year,
        studyDays: monthStudyDays,
        totalDaysStudied: monthStudyDays.length,
        totalMinutes: monthStudyDays.reduce((sum, day) => sum + day.totalMinutes, 0)
      });
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year, streaks]);

  // Fetch data when month/year changes
  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return useMemo(() => ({
    calendarData,
    loading,
    month,
    year,
    fetchCalendarData
  }), [calendarData, loading, month, year, fetchCalendarData]);
};

export default useStreaks;
