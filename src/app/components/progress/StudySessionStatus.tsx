"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  Square,
  Timer,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { useStudySession } from "../hooks/useStudySession";

interface StudySessionStatusProps {
  lessonId: string;
  onSessionEnd?: (sessionData: any) => void;
  onLessonComplete?: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

export const StudySessionStatus = ({
  lessonId,
  onSessionEnd,
  onLessonComplete,
  t,
  isRTL,
}: StudySessionStatusProps) => {
  const {
    isTracking,
    isActive,
    currentSession,
    sessionDuration,
    totalActiveTime,
    loading,
    error,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    getSessionStatus,
  } = useStudySession({
    lessonId: parseInt(lessonId),
    activity: "lesson",
    autoStart: false,
    onSessionEnd: onSessionEnd,
  });

  const [showDetails, setShowDetails] = useState(false);
  const [studyGoal, setStudyGoal] = useState(1800); // 30 minutes default
  const [canMarkComplete, setCanMarkComplete] = useState(false);

  // Check if lesson can be marked complete (minimum 10 minutes of study)
  useEffect(() => {
    const minStudyTime = 600; // 10 minutes
    setCanMarkComplete(totalActiveTime >= minStudyTime);
  }, [totalActiveTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return Math.min(Math.round((totalActiveTime / studyGoal) * 100), 100);
  };

  const getStatusColor = () => {
    if (!isTracking) return "text-gray-500";
    if (!isActive) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusIcon = () => {
    if (loading)
      return (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      );
    if (!isTracking) return <Square className="w-4 h-4" />;
    if (!isActive) return <Pause className="w-4 h-4" />;
    return <Play className="w-4 h-4" />;
  };

  const handleStartSession = async () => {
    try {
      await startSession(parseInt(lessonId), "lesson");
    } catch (error) {
      console.error("Failed to start study session:", error);
    }
  };

  const handleEndSession = async () => {
    try {
      const sessionData = await endSession();
      if (onSessionEnd) {
        onSessionEnd(sessionData);
      }
    } catch (error) {
      console.error("Failed to end study session:", error);
    }
  };

  const handleCompleteLesson = () => {
    if (onLessonComplete && canMarkComplete) {
      onLessonComplete();
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className={getStatusColor()}>{getStatusIcon()}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("lesson.studySession.title")}
            </h3>
            {isTracking && (
              <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {t("lesson.studySession.active")}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showDetails
              ? t("lesson.studySession.hide")
              : t("lesson.studySession.details")}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Session Controls */}
        <div
          className={`flex items-center justify-between mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-800">
              {formatTime(totalActiveTime)}
            </div>
            <div className="text-sm text-gray-600">
              {t("lesson.studySession.totalTime")}
            </div>
          </div>

          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {!isTracking ? (
              <button
                onClick={handleStartSession}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <Play className="w-5 h-5" />
                {t("lesson.studySession.start")}
              </button>
            ) : (
              <>
                {isActive ? (
                  <button
                    onClick={pauseSession}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    {t("lesson.studySession.pause")}
                  </button>
                ) : (
                  <button
                    onClick={resumeSession}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    {t("lesson.studySession.resume")}
                  </button>
                )}

                <button
                  onClick={handleEndSession}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  {t("lesson.studySession.end")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            className={`flex items-center justify-between mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="text-sm text-gray-600">
              {t("lesson.studySession.progress")}
            </div>
            <div className="text-sm font-medium text-gray-800">
              {getProgressPercentage()}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t("lesson.studySession.goal")}: {formatTime(studyGoal)}
          </div>
        </div>

        {/* Complete Lesson Button */}
        {canMarkComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-green-800">
                  {t("lesson.studySession.readyToComplete")}
                </div>
                <div className="text-sm text-green-600">
                  {t("lesson.studySession.minTimeReached")}
                </div>
              </div>
              <button
                onClick={handleCompleteLesson}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                {t("lesson.studySession.markComplete")}
              </button>
            </div>
          </div>
        )}

        {/* Detailed Stats (Collapsible) */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Session */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div
                  className={`flex items-center gap-2 mb-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Timer className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {t("lesson.studySession.currentSession")}
                  </span>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {formatTime(sessionDuration)}
                </div>
              </div>

              {/* Study Streak */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div
                  className={`flex items-center gap-2 mb-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    {t("lesson.studySession.todayGoal")}
                  </span>
                </div>
                <div className="text-xl font-bold text-orange-600">
                  {Math.round((totalActiveTime / studyGoal) * 100)}%
                </div>
              </div>

              {/* Status */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div
                  className={`flex items-center gap-2 mb-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    {t("lesson.studySession.status")}
                  </span>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  {isTracking
                    ? isActive
                      ? t("lesson.studySession.studying")
                      : t("lesson.studySession.paused")
                    : t("lesson.studySession.stopped")}
                </div>
              </div>
            </div>

            {/* Session Info */}
            {currentSession && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>{t("lesson.studySession.sessionId")}:</strong>{" "}
                    {currentSession.sessionId}
                  </div>
                  <div>
                    <strong>{t("lesson.studySession.startTime")}:</strong>{" "}
                    {new Date(currentSession.startTime).toLocaleString()}
                  </div>
                  <div>
                    <strong>{t("lesson.studySession.activity")}:</strong>{" "}
                    {currentSession.activity}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
