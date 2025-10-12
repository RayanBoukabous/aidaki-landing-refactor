"use client";

import React from "react";
import { useStudySessionContext } from "../StudySessionProvider";

/**
 * Streak Widget Component
 * Displays current streak information and encouragement
 */
export const StreakWidget = ({
  showDetails = true,
  showCalendar = false,
  className = "",
}) => {
  const { streak, currentStreak, hasStudiedToday } = useStudySessionContext();

  if (!streak) {
    return (
      <div className={`streak-widget ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const getStreakEmoji = (streakCount) => {
    if (streakCount === 0) return "🌱";
    if (streakCount < 7) return "🔥";
    if (streakCount < 30) return "🚀";
    if (streakCount < 100) return "⭐";
    return "👑";
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "text-gray-500";
    if (currentStreak < 7) return "text-orange-500";
    if (currentStreak < 30) return "text-red-500";
    if (currentStreak < 100) return "text-blue-500";
    return "text-purple-500";
  };

  return (
    <div className={`streak-widget ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Study Streak</h3>
          <div className="text-2xl">{getStreakEmoji(currentStreak)}</div>
        </div>

        <div className="text-center">
          <div className={`text-4xl font-bold ${getStreakColor()} mb-2`}>
            {currentStreak}
          </div>
          <div className="text-gray-600 text-sm mb-3">
            {currentStreak === 1 ? "day" : "days"}
          </div>
        </div>

        {!hasStudiedToday && currentStreak > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};

/**
 * Study Time Widget Component
 * Displays daily and weekly study time
 */
export const StudyTimeWidget = ({
  showWeekly = true,
  showGoal = true,
  className = "",
}) => {
  const { streak } = useStudySessionContext();

  if (!streak) {
    return (
      <div className={`study-time-widget ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const dailyGoal = 30; // Default daily goal in minutes
  const progressPercentage = Math.min(
    (streak.minutesToday / dailyGoal) * 100,
    100
  );

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  return (
    <div className={`study-time-widget ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Study Time</h3>
          <div className="text-xl">📚</div>
        </div>

        {/* Today's Progress - Centered */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Today</div>
          <div className="text-3xl font-bold text-blue-600">
            {formatTime(streak.minutesToday)}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Progress Ring Widget Component
 * Circular progress indicator for course completion
 */
export const ProgressRingWidget = ({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  title = "Overall Progress",
  subtitle = "",
  showPercentage = true,
  color = "#3b82f6",
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = (progress) => {
    if (progress < 25) return "#ef4444"; // red
    if (progress < 50) return "#f97316"; // orange
    if (progress < 75) return "#eab308"; // yellow
    return "#22c55e"; // green
  };

  const progressColor = color === "auto" ? getProgressColor(progress) : color;

  return (
    <div className={`progress-ring-widget ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

          <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={progressColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {showPercentage && (
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round(progress)}%
                  </div>
                )}
                {subtitle && (
                  <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Calendar Widget Component
 * Study calendar heatmap
 */
export const CalendarWidget = ({
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  studyDays = [],
  showNavigation = true,
  className = "",
}) => {
  const today = new Date();
  const isCurrentMonth =
    month === today.getMonth() && year === today.getFullYear();

  // Generate calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create study days map
  const studyDaysMap = {};
  studyDays.forEach((day) => {
    studyDaysMap[day.date] = day.totalMinutes;
  });

  const getIntensityColor = (minutes) => {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 15) return "bg-green-200";
    if (minutes < 30) return "bg-green-300";
    if (minutes < 60) return "bg-green-400";
    return "bg-green-500";
  };

  const calendar = [];
  let week = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    week.push(null);
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const minutes = studyDaysMap[date] || 0;
    const isToday = isCurrentMonth && day === today.getDate();

    week.push({
      day,
      date,
      minutes,
      isToday,
      hasStudied: minutes > 0,
    });

    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  // Add remaining cells
  while (week.length < 7 && week.length > 0) {
    week.push(null);
  }
  if (week.length > 0) {
    calendar.push(week);
  }

  return (
    <div className={`calendar-widget ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h3>
          <div className="text-xl">📅</div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="text-center text-xs text-gray-500 py-2"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {calendar.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="aspect-square flex items-center justify-center text-xs relative"
                >
                  {day ? (
                    <div
                      className={`
                        w-full h-full rounded flex items-center justify-center
                        ${getIntensityColor(day.minutes)}
                        ${day.isToday ? "ring-2 ring-blue-500" : ""}
                        ${day.hasStudied ? "text-white" : "text-gray-600"}
                        hover:scale-110 transition-transform cursor-pointer
                      `}
                      title={`${day.date}: ${day.minutes} minutes`}
                    >
                      {day.day}
                    </div>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <div className="w-3 h-3 bg-green-300 rounded"></div>
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <div className="w-3 h-3 bg-green-500 rounded"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Quick Stats Widget Component
 * Shows key statistics at a glance
 */
export const QuickStatsWidget = ({ stats = {}, className = "" }) => {
  const { overallProgress } = useStudySessionContext();

  const defaultStats = {
    totalCourses: overallProgress?.totalCourses || 0,
    completedCourses: overallProgress?.completedCourses || 0,
    totalLessons: overallProgress?.totalLessons || 0,
    completedLessons: overallProgress?.completedLessons || 0,
    ...stats,
  };

  const statItems = [
    {
      label: "Courses",
      value: `${defaultStats.completedCourses}/${defaultStats.totalCourses}`,
      icon: "📚",
      color: "text-blue-600",
    },
    {
      label: "Lessons",
      value: `${defaultStats.completedLessons}/${defaultStats.totalLessons}`,
      icon: "📝",
      color: "text-green-600",
    },
    {
      label: "Average",
      value: `${Math.round(overallProgress?.averageProgress || 0)}%`,
      icon: "📊",
      color: "text-purple-600",
    },
  ];

  return (
    <div className={`quick-stats-widget ${className}`}>
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Stats
        </h3>

        <div className="space-y-4">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className={`font-semibold ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  StreakWidget,
  StudyTimeWidget,
  ProgressRingWidget,
  CalendarWidget,
  QuickStatsWidget,
};
