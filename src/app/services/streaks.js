'use client'

import api from './api';

/**
 * Streaks Service
 * Handles all streak tracking and calendar related API calls
 */
export const streaksService = {
  /**
   * Get current user's streak information
   * @returns {Promise} API response with current streak data
   */
  async getCurrentStreak() {
    try {
      const response = await api.get('/streaks/my-streak');
      return response.data;
    } catch (error) {
      console.error('Error fetching current streak:', error);
      throw error;
    }
  },

  /**
   * Get study calendar data for a specific month/year
   * @param {number} year - Year (e.g., 2024)
   * @param {number} month - Month (1-12)
   * @returns {Promise} API response with calendar data
   */
  async getStudyCalendar(year, month) {
    try {
      const response = await api.get('/streaks/calendar', {
        params: { year, month }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching study calendar:', error);
      throw error;
    }
  },

  /**
   * Get study calendar for current month
   * @returns {Promise} API response with current month calendar data
   */
  async getCurrentMonthCalendar() {
    const now = new Date();
    return this.getStudyCalendar(now.getFullYear(), now.getMonth() + 1);
  },

  /**
   * Get study calendar for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} API response with calendar data for date range
   */
  async getCalendarRange(startDate, endDate) {
    try {
      const response = await api.get('/streaks/calendar-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar range:', error);
      throw error;
    }
  },

  /**
   * Get streak leaderboard
   * @param {number} limit - Number of top users to fetch (default: 10)
   * @returns {Promise} API response with leaderboard data
   */
  async getStreakLeaderboard(limit = 10) {
    try {
      const response = await api.get('/streaks/leaderboard', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching streak leaderboard:', error);
      throw error;
    }
  },

  /**
   * Get user's streak history
   * @param {number} months - Number of months to fetch (default: 6)
   * @returns {Promise} API response with streak history
   */
  async getStreakHistory(months = 6) {
    try {
      const response = await api.get('/streaks/history', {
        params: { months }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching streak history:', error);
      throw error;
    }
  },

  /**
   * Set daily study goal
   * @param {number} targetMinutes - Daily target in minutes
   * @returns {Promise} API response
   */
  async setDailyGoal(targetMinutes) {
    try {
      const response = await api.post('/streaks/daily-goal', { targetMinutes });
      return response.data;
    } catch (error) {
      console.error('Error setting daily goal:', error);
      throw error;
    }
  },

  /**
   * Get daily study goal progress
   * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
   * @returns {Promise} API response with goal progress
   */
  async getDailyGoalProgress(date = null) {
    try {
      const params = date ? { date } : {};
      const response = await api.get('/streaks/daily-goal-progress', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily goal progress:', error);
      throw error;
    }
  }
};

/**
 * Calendar Utility Functions
 * Helper functions for working with calendar data
 */
export const calendarUtils = {
  /**
   * Generate calendar grid for a given month/year
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @param {Array} studyDays - Array of study days with minutes
   * @returns {Array} Calendar grid with study data
   */
  generateCalendarGrid(year, month, studyDays = []) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Create study days map for quick lookup
    const studyDaysMap = {};
    studyDays.forEach(day => {
      studyDaysMap[day.date] = day.totalMinutes;
    });

    // Generate calendar grid
    const calendar = [];
    let week = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      week.push({ date: null, minutes: 0, isCurrentMonth: false });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const minutes = studyDaysMap[date] || 0;
      const isToday = this.isToday(new Date(year, month - 1, day));

      week.push({
        date,
        day,
        minutes,
        isCurrentMonth: true,
        isToday,
        hasStudied: minutes > 0,
        meetsDailyGoal: minutes >= 10 // 10+ minutes for streak
      });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Add empty cells for remaining days
    while (week.length < 7 && week.length > 0) {
      week.push({ date: null, minutes: 0, isCurrentMonth: false });
    }

    if (week.length > 0) {
      calendar.push(week);
    }

    return calendar;
  },

  /**
   * Check if a date is today
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is today
   */
  isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  },

  /**
   * Get intensity level for heatmap visualization
   * @param {number} minutes - Study minutes
   * @returns {number} Intensity level (0-4)
   */
  getIntensityLevel(minutes) {
    if (minutes === 0) return 0;
    if (minutes < 15) return 1;
    if (minutes < 30) return 2;
    if (minutes < 60) return 3;
    return 4;
  },

  /**
   * Calculate streak from calendar data
   * @param {Array} studyDays - Array of study days sorted by date
   * @param {number} minimumMinutes - Minimum minutes for streak (default: 10)
   * @returns {Object} Streak calculation result
   */
  calculateStreak(studyDays, minimumMinutes = 10) {
    if (!studyDays || studyDays.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort days by date (newest first)
    const sortedDays = [...studyDays].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date().toISOString().split('T')[0];

    // Check if studied today or yesterday for current streak
    let streakBroken = false;
    let checkDate = new Date();

    for (let i = 0; i < sortedDays.length; i++) {
      const studyDay = sortedDays[i];
      const studyDate = new Date(studyDay.date);
      const checkDateStr = checkDate.toISOString().split('T')[0];

      if (studyDay.date === checkDateStr && studyDay.totalMinutes >= minimumMinutes) {
        if (!streakBroken) {
          currentStreak++;
        }
        tempStreak++;
      } else if (studyDay.date === checkDateStr) {
        // Studied but didn't meet minimum - check previous day
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      } else {
        // Gap in study days - reset temp streak
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
        streakBroken = true;
      }

      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Final check for longest streak
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return { currentStreak, longestStreak };
  },

  /**
   * Get study statistics for a calendar period
   * @param {Array} studyDays - Array of study days
   * @returns {Object} Study statistics
   */
  getCalendarStats(studyDays) {
    if (!studyDays || studyDays.length === 0) {
      return {
        totalDays: 0,
        totalMinutes: 0,
        averageMinutes: 0,
        studyDaysCount: 0,
        studyDaysPercentage: 0
      };
    }

    const totalMinutes = studyDays.reduce((sum, day) => sum + day.totalMinutes, 0);
    const studyDaysCount = studyDays.filter(day => day.totalMinutes > 0).length;
    const averageMinutes = studyDaysCount > 0 ? Math.round(totalMinutes / studyDaysCount) : 0;
    const studyDaysPercentage = Math.round((studyDaysCount / studyDays.length) * 100);

    return {
      totalDays: studyDays.length,
      totalMinutes,
      averageMinutes,
      studyDaysCount,
      studyDaysPercentage
    };
  },

  /**
   * Format minutes into human readable string
   * @param {number} minutes - Minutes to format
   * @returns {string} Formatted time string
   */
  formatStudyTime(minutes) {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  },

  /**
   * Get relative date string
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {string} Relative date string
   */
  getRelativeDate(date) {
    const targetDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (targetDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (targetDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return targetDate.toLocaleDateString();
    }
  }
};

/**
 * Streak Notifications Utility
 * Handle streak-related notifications and achievements
 */
export const streakNotifications = {
  /**
   * Check for streak milestones
   * @param {number} currentStreak - Current streak count
   * @param {number} previousStreak - Previous streak count
   * @returns {Array} Array of milestone notifications
   */
  checkStreakMilestones(currentStreak, previousStreak = 0) {
    const milestones = [7, 14, 30, 60, 100, 365];
    const notifications = [];

    milestones.forEach(milestone => {
      if (currentStreak >= milestone && previousStreak < milestone) {
        notifications.push({
          id: `streak-${milestone}`,
          type: 'streak',
          title: `${milestone} Day Streak! 🔥`,
          message: `Congratulations! You've maintained a ${milestone}-day study streak!`,
          timestamp: Date.now(),
          milestone
        });
      }
    });

    return notifications;
  },

  /**
   * Check for daily goal achievements
   * @param {number} minutesToday - Minutes studied today
   * @param {number} dailyGoal - Daily goal in minutes
   * @returns {Object|null} Goal achievement notification
   */
  checkDailyGoal(minutesToday, dailyGoal = 30) {
    if (minutesToday >= dailyGoal) {
      return {
        id: `daily-goal-${Date.now()}`,
        type: 'milestone',
        title: 'Daily Goal Achieved! 🎯',
        message: `Great job! You've completed your daily study goal of ${dailyGoal} minutes.`,
        timestamp: Date.now()
      };
    }
    return null;
  },

  /**
   * Generate streak reminder notification
   * @param {number} currentStreak - Current streak count
   * @param {boolean} studiedToday - Whether user studied today
   * @returns {Object|null} Reminder notification
   */
  getStreakReminder(currentStreak, studiedToday) {
    if (studiedToday) return null;

    const messages = [
      "Keep your streak alive! Start studying now.",
      `Don't break your ${currentStreak}-day streak! Study for at least 10 minutes.`,
      "Your streak is waiting for you! Time to study.",
      `${currentStreak} days strong! Don't stop now.`
    ];

    return {
      id: `streak-reminder-${Date.now()}`,
      type: 'reminder',
      title: 'Streak Reminder 📚',
      message: currentStreak > 0 
        ? messages[Math.floor(Math.random() * messages.length)]
        : "Start your study streak today! Study for at least 10 minutes.",
      timestamp: Date.now(),
      actionUrl: '/dashboard/lessons'
    };
  }
};

export default streaksService;
