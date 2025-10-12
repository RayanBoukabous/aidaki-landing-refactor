'use client'

import api from './api';

/**
 * Study Time Service
 * Handles all study session and time tracking related API calls
 */
export const studyTimeService = {
  /**
   * Start a new study session
   * @param {Object} sessionData - { lessonId?, activity }
   * @returns {Promise} API response with session data
   */
  async startSession(sessionData) {
    try {
      const response = await api.post('/study-time/start-session', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error starting study session:', error);
      throw error;
    }
  },

  /**
   * End an active study session
   * @param {number} sessionId - The session ID to end
   * @returns {Promise} API response with session summary
   */
  async endSession(sessionId) {
    try {
      const response = await api.put(`/study-time/end-session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error ending study session:', error);
      throw error;
    }
  },

  /**
   * Send heartbeat to maintain active session
   * @param {Object} heartbeatData - { sessionId, isActive, timestamp, metadata? }
   * @returns {Promise} API response with session status
   */
  async sendHeartbeat(heartbeatData) {
    try {
      const response = await api.post('/study-time/heartbeat', heartbeatData);
      return response.data;
    } catch (error) {
      console.error('Error sending heartbeat:', error);
      throw error;
    }
  },

  /**
   * Get user's study statistics
   * @returns {Promise} API response with study stats
   */
  async getStudyStats() {
    try {
      const response = await api.get('/study-time/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching study stats:', error);
      throw error;
    }
  },

  /**
   * Get daily study time for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} API response with daily study data
   */
  async getDailyStudyTime(startDate, endDate) {
    try {
      const response = await api.get('/study-time/daily', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily study time:', error);
      throw error;
    }
  },

  /**
   * Get weekly study time
   * @param {number} weeks - Number of weeks to fetch (default: 4)
   * @returns {Promise} API response with weekly study data
   */
  async getWeeklyStudyTime(weeks = 4) {
    try {
      const response = await api.get('/study-time/weekly', {
        params: { weeks }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly study time:', error);
      throw error;
    }
  },

  /**
   * Get study time by subject/activity
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} API response with subject breakdown
   */
  async getStudyTimeBySubject(startDate, endDate) {
    try {
      const response = await api.get('/study-time/by-subject', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching study time by subject:', error);
      throw error;
    }
  },

  /**
   * Get recent study sessions
   * @param {number} limit - Number of sessions to fetch (default: 10)
   * @returns {Promise} API response with recent sessions
   */
  async getRecentSessions(limit = 10) {
    try {
      const response = await api.get('/study-time/sessions', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      throw error;
    }
  }
};

/**
 * Activity Tracker Utility Class
 * Handles user activity detection and idle state management
 */
export class ActivityTracker {
  constructor(options = {}) {
    this.idleThreshold = options.idleThreshold || 120000; // 2 minutes
    this.isActive = true;
    this.lastActivity = Date.now();
    this.listeners = [];
    this.activityTimer = null;
    
    // Events that indicate user activity
    this.activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'dblclick'
    ];
    
    this.setupActivityListeners();
    this.setupVisibilityListener();
  }

  /**
   * Setup event listeners for user activity
   */
  setupActivityListeners() {
    const resetActivityTimer = () => {
      this.isActive = true;
      this.lastActivity = Date.now();
      this.clearActivityTimer();
      
      // Set timer for idle detection
      this.activityTimer = setTimeout(() => {
        this.isActive = false;
        this.notifyListeners({ type: 'idle', timestamp: Date.now() });
      }, this.idleThreshold);
      
      this.notifyListeners({ type: 'active', timestamp: Date.now() });
    };

    // Add event listeners for activity detection
    this.activityEvents.forEach(eventName => {
      const listener = resetActivityTimer;
      document.addEventListener(eventName, listener, true);
      this.listeners.push({ event: eventName, listener });
    });

    // Initial timer setup
    resetActivityTimer();
  }

  /**
   * Setup page visibility change listener
   */
  setupVisibilityListener() {
    const visibilityListener = () => {
      const isVisible = !document.hidden;
      this.notifyListeners({ 
        type: 'visibility', 
        isVisible, 
        timestamp: Date.now() 
      });
      
      // Reset activity when page becomes visible
      if (isVisible) {
        this.isActive = true;
        this.lastActivity = Date.now();
      }
    };

    document.addEventListener('visibilitychange', visibilityListener);
    this.listeners.push({ event: 'visibilitychange', listener: visibilityListener });
  }

  /**
   * Add listener for activity state changes
   * @param {Function} callback - Callback function to handle activity changes
   */
  onActivityChange(callback) {
    this.activityCallbacks = this.activityCallbacks || [];
    this.activityCallbacks.push(callback);
  }

  /**
   * Remove activity change listener
   * @param {Function} callback - Callback function to remove
   */
  removeActivityListener(callback) {
    if (this.activityCallbacks) {
      this.activityCallbacks = this.activityCallbacks.filter(cb => cb !== callback);
    }
  }

  /**
   * Notify all listeners about activity changes
   * @param {Object} event - Activity event data
   */
  notifyListeners(event) {
    if (this.activityCallbacks) {
      this.activityCallbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in activity callback:', error);
        }
      });
    }
  }

  /**
   * Get current activity state
   * @returns {Object} Current activity state
   */
  getActivityState() {
    return {
      isActive: this.isActive,
      lastActivity: this.lastActivity,
      isVisible: !document.hidden,
      isFocused: document.hasFocus(),
      idleTime: Date.now() - this.lastActivity
    };
  }

  /**
   * Clear activity timer
   */
  clearActivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Cleanup all event listeners
   */
  destroy() {
    this.clearActivityTimer();
    
    // Remove all event listeners
    this.listeners.forEach(({ event, listener }) => {
      document.removeEventListener(event, listener, true);
    });
    
    this.listeners = [];
    this.activityCallbacks = [];
  }
}

/**
 * Study Session Manager Utility Class
 * Handles study session lifecycle and heartbeat management
 */
export class StudySessionManager {
  constructor(options = {}) {
    this.heartbeatInterval = options.heartbeatInterval || 45000; // 45 seconds
    this.sessionId = null;
    this.heartbeatTimer = null;
    this.activityTracker = new ActivityTracker();
    this.isTracking = false;
    
    // Setup activity tracking
    this.activityTracker.onActivityChange(this.handleActivityChange.bind(this));
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', this.cleanup.bind(this));
    window.addEventListener('pagehide', this.cleanup.bind(this));
  }

  /**
   * Start a new study session
   * @param {number} lessonId - Optional lesson ID
   * @param {string} activity - Activity type
   * @returns {Promise} Session start response
   */
  async startSession(lessonId = null, activity = 'lesson') {
    try {
      // End any existing session first
      if (this.sessionId) {
        await this.endSession();
      }

      const sessionData = { activity };
      if (lessonId) sessionData.lessonId = lessonId;

      const response = await studyTimeService.startSession(sessionData);
      
      if (response.session && response.session.sessionId) {
        this.sessionId = response.session.sessionId;
        this.isTracking = true;
        this.startHeartbeat();
        
        console.log('Study session started:', this.sessionId);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to start study session:', error);
      throw error;
    }
  }

  /**
   * End the current study session
   * @returns {Promise} Session end response
   */
  async endSession() {
    if (!this.sessionId) return null;

    try {
      this.stopHeartbeat();
      const response = await studyTimeService.endSession(this.sessionId);
      
      this.sessionId = null;
      this.isTracking = false;
      
      console.log('Study session ended');
      return response;
    } catch (error) {
      console.error('Failed to end study session:', error);
      throw error;
    }
  }

  /**
   * Start heartbeat timer
   */
  startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing timer
    
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval);
    
    // Send initial heartbeat
    this.sendHeartbeat();
  }

  /**
   * Stop heartbeat timer
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Send heartbeat to server
   */
  async sendHeartbeat() {
    if (!this.sessionId) return;

    try {
      const activityState = this.activityTracker.getActivityState();
      
      const heartbeatData = {
        sessionId: this.sessionId,
        isActive: activityState.isActive,
        timestamp: Date.now(),
        metadata: {
          currentUrl: window.location.pathname,
          isVisible: activityState.isVisible,
          isFocused: activityState.isFocused
        }
      };

      await studyTimeService.sendHeartbeat(heartbeatData);
    } catch (error) {
      console.error('Heartbeat failed:', error);
      // Continue heartbeat even if one fails
    }
  }

  /**
   * Handle activity state changes
   * @param {Object} event - Activity event
   */
  handleActivityChange(event) {
    // You can add custom logic here for activity changes
    if (event.type === 'idle' && this.isTracking) {
      console.log('User went idle during study session');
    } else if (event.type === 'active' && this.isTracking) {
      console.log('User became active during study session');
    }
  }

  /**
   * Get current session status
   * @returns {Object} Session status
   */
  getSessionStatus() {
    return {
      sessionId: this.sessionId,
      isTracking: this.isTracking,
      activityState: this.activityTracker.getActivityState()
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.sessionId) {
      // Try to end session, but don't wait for response
      studyTimeService.endSession(this.sessionId).catch(console.error);
    }
    
    this.stopHeartbeat();
    this.activityTracker.destroy();
  }
}

export default studyTimeService;
