'use client'

import { useEffect, useState, useRef } from 'react';
import { useQuizResponses } from '../hooks/useQuizResponses';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

interface QuizStatisticsProps {
  quizId?: number;
  t: (key: string) => string;
  isRTL: boolean;
  showDetailedStats?: boolean;
}

export const QuizStatistics = ({ 
  quizId, 
  t, 
  isRTL, 
  showDetailedStats = true 
}: QuizStatisticsProps) => {
  const {
    attempts,
    loading,
    error,
    fetchUserAttempts
  } = useQuizResponses();

  const [detailedStats, setDetailedStats] = useState<any>(null);
  const hasInitialized = useRef(false);

  // Initialize data only once when component mounts
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (quizId) {
        fetchUserAttempts(quizId);
      } else {
        fetchUserAttempts(); // Fetch all attempts
      }
    }
  }, [quizId]); // Only depend on quizId

  // Calculate stats when attempts change
  useEffect(() => {
    if (attempts.length > 0) {
      calculateDetailedStats();
    } else {
      setDetailedStats(null);
    }
  }, [attempts, quizId]); // Only depend on attempts and quizId

  const calculateDetailedStats = () => {
    const filteredAttempts = quizId 
      ? attempts.filter(attempt => attempt.quizId === quizId)
      : attempts;

    if (filteredAttempts.length === 0) {
      setDetailedStats(null);
      return;
    }

    const completedAttempts = filteredAttempts.filter(attempt => attempt.status === 'COMPLETED');
    const scores = completedAttempts.map(attempt => attempt.score || 0);
    const times = completedAttempts.map(attempt => attempt.timeSpent || 0);

    // Basic stats
    const totalAttempts = filteredAttempts.length;
    const completed = completedAttempts.length;
    const bestScore = Math.max(...scores, 0);
    const worstScore = Math.min(...scores, 100);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    // Time stats
    const averageTime = times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length 
      : 0;
    const bestTime = Math.min(...times, Infinity);
    const totalTimeSpent = times.reduce((sum, time) => sum + time, 0);

    // Performance trends (last 5 attempts)
    const recentAttempts = completedAttempts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    const recentScores = recentAttempts.map(attempt => attempt.score || 0);
    const trend = recentScores.length > 1 
      ? recentScores[0] - recentScores[recentScores.length - 1]
      : 0;

    // Grade distribution
    const gradeDistribution = {
      excellent: scores.filter(score => score >= 90).length,
      good: scores.filter(score => score >= 80 && score < 90).length,
      average: scores.filter(score => score >= 70 && score < 80).length,
      needsImprovement: scores.filter(score => score < 70).length
    };

    // Consistency score (standard deviation)
    const variance = scores.length > 1 
      ? scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
      : 0;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - standardDeviation);

    setDetailedStats({
      totalAttempts,
      completed,
      bestScore,
      worstScore,
      averageScore,
      averageTime,
      bestTime,
      totalTimeSpent,
      trend,
      gradeDistribution,
      consistencyScore,
      recentScores: recentScores.reverse(), // Reverse to show chronological order
      completionRate: totalAttempts > 0 ? (completed / totalAttempts) * 100 : 0
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'excellent': return <Trophy className="w-4 h-4" />;
      case 'good': return <Star className="w-4 h-4" />;
      case 'average': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < -5) return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  if (loading && attempts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 animate-pulse ml-4">{t('lesson.quizStats.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!detailedStats || detailedStats.totalAttempts === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('lesson.quizStats.noData')}
        </h3>
        <p className="text-gray-600">
          {t('lesson.quizStats.noDataDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">
              {t('lesson.quizStats.attempts')}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {detailedStats.totalAttempts}
          </div>
          <div className="text-xs text-blue-600">
            {detailedStats.completed} {t('lesson.quizStats.completed')}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-6 h-6 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              {t('lesson.quizStats.bestScore')}
            </span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {Math.round(detailedStats.bestScore)}%
          </div>
          <div className="text-xs text-green-600">
            {t('lesson.quizStats.average')}: {Math.round(detailedStats.averageScore)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Timer className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">
              {t('lesson.quizStats.avgTime')}
            </span>
          </div>
          <div className="text-lg font-bold text-purple-800">
            {formatTime(Math.round(detailedStats.averageTime))}
          </div>
          <div className="text-xs text-purple-600">
            {t('lesson.quizStats.best')}: {formatTime(detailedStats.bestTime)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">
              {t('lesson.quizStats.consistency')}
            </span>
          </div>
          <div className="text-2xl font-bold text-yellow-800">
            {Math.round(detailedStats.consistencyScore)}%
          </div>
          <div className="text-xs text-yellow-600">
            {t('lesson.quizStats.reliability')}
          </div>
        </div>
      </div>

      {showDetailedStats && (
        <>
          {/* Performance Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800">
                {t('lesson.quizStats.performanceTrend')}
              </h3>
              <div className="flex items-center gap-2">
                {getTrendIcon(detailedStats.trend)}
                <span className={`text-sm font-medium ${
                  detailedStats.trend > 5 ? 'text-green-600' : 
                  detailedStats.trend < -5 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {detailedStats.trend > 0 ? '+' : ''}{Math.round(detailedStats.trend)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {detailedStats.recentScores.map((score: number, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 w-16">
                    #{detailedStats.recentScores.length - index}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getGradeColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-800 w-12">
                    {score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('lesson.quizStats.gradeDistribution')}
            </h3>
            
            <div className="space-y-3">
              {Object.entries(detailedStats.gradeDistribution).map(([grade, count]) => {
                const percentage = detailedStats.completed > 0 
                  ? ((count as number) / detailedStats.completed) * 100 
                  : 0;
                
                return (
                  <div key={grade} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-32">
                      {getGradeIcon(grade)}
                      <span className="text-sm font-medium text-gray-700">
                        {t(`lesson.quizStats.${grade}`)}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getGradeColor(
                          grade === 'excellent' ? 95 : 
                          grade === 'good' ? 85 : 
                          grade === 'average' ? 75 : 65
                        )}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 w-16">
                      {count} ({Math.round(percentage)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold text-gray-800">
                  {t('lesson.quizStats.completionRate')}
                </h4>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {Math.round(detailedStats.completionRate)}%
              </div>
              <div className="text-sm text-gray-600">
                {detailedStats.completed} / {detailedStats.totalAttempts} {t('lesson.quizStats.attemptsCompleted')}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <h4 className="font-semibold text-gray-800">
                  {t('lesson.quizStats.totalTime')}
                </h4>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {formatTime(detailedStats.totalTimeSpent)}
              </div>
              <div className="text-sm text-gray-600">
                {t('lesson.quizStats.timeSpent')}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-purple-500" />
                <h4 className="font-semibold text-gray-800">
                  {t('lesson.quizStats.scoreRange')}
                </h4>
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">
                {Math.round(detailedStats.worstScore)}% - {Math.round(detailedStats.bestScore)}%
              </div>
              <div className="text-sm text-gray-600">
                {t('lesson.quizStats.range')}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
