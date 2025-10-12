'use client'

import { useEffect, useState, useRef } from 'react';
import { useQuizResponses } from '../hooks/useQuizResponses';
import { 
  Clock, 
  Calendar, 
  Target, 
  Trophy, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Award,
  AlertTriangle
} from 'lucide-react';

interface QuizHistoryProps {
  quizId: number;
  t: (key: string) => string;
  isRTL: boolean;
  onStartQuiz?: () => void;
}

export const QuizHistory = ({ quizId, t, isRTL, onStartQuiz }: QuizHistoryProps) => {
  const {
    attempts,
    loading,
    error,
    fetchUserAttempts,
    getQuizStatistics
  } = useQuizResponses();

  const [expandedAttempt, setExpandedAttempt] = useState<number | null>(null);
  const [stats, setStats] = useState<any>(null);
  const hasInitialized = useRef(false);

  // Initialize data only once when component mounts
  useEffect(() => {
    if (!hasInitialized.current && quizId) {
      hasInitialized.current = true;
      fetchUserAttempts(quizId);
    }
  }, [quizId]); // Only depend on quizId

  // Calculate stats when attempts change
  useEffect(() => {
    if (attempts.length > 0) {
      const statistics = getQuizStatistics(quizId);
      setStats(statistics);
    } else {
      setStats(null);
    }
  }, [attempts, quizId, getQuizStatistics]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-700 bg-green-50';
      case 'IN_PROGRESS':
        return 'text-yellow-700 bg-yellow-50';
      default:
        return 'text-red-700 bg-red-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);

  if (loading && quizAttempts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 animate-pulse ml-4">{t('lesson.quizHistory.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {t('lesson.quizHistory.title')}
            </h3>
            {quizAttempts.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                {quizAttempts.length}
              </span>
            )}
          </div>
          {onStartQuiz && (
            <button
              onClick={onStartQuiz}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              {t('lesson.quizHistory.startNewAttempt')}
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Statistics Summary */}
        {stats && stats.totalAttempts > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
              <Trophy className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{stats.bestScore}%</div>
              <div className="text-xs text-green-600">{t('lesson.quizHistory.bestScore')}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{stats.averageScore}%</div>
              <div className="text-xs text-blue-600">{t('lesson.quizHistory.averageScore')}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
              <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{stats.totalAttempts}</div>
              <div className="text-xs text-purple-600">{t('lesson.quizHistory.totalAttempts')}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
              <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-800">{stats.completed}</div>
              <div className="text-xs text-yellow-600">{t('lesson.quizHistory.completed')}</div>
            </div>
          </div>
        )}

        {/* Attempts List */}
        {quizAttempts.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 mb-4">
              {t('lesson.quizHistory.recentAttempts')}
            </h4>
            {quizAttempts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Attempt Summary */}
                  <div
                    className={`p-4 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => setExpandedAttempt(expandedAttempt === attempt.id ? null : attempt.id)}
                  >
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {getStatusIcon(attempt.status)}
                        <div>
                          <div className="font-medium text-gray-800">
                            {t('lesson.quizHistory.attempt')} #{quizAttempts.length - index}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(attempt.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {attempt.status === 'COMPLETED' && (
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(attempt.score || 0)}`}>
                              {Math.round(attempt.score || 0)}%
                            </div>
                            <div className="text-xs text-gray-600">
                              {t('lesson.quizHistory.score')}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-800">
                            {formatDuration(attempt.timeSpent || 0)}
                          </div>
                          <div className="text-xs text-gray-600">
                            {t('lesson.quizHistory.duration')}
                          </div>
                        </div>
                        
                        {expandedAttempt === attempt.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedAttempt === attempt.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            {t('lesson.quizHistory.startedAt')}:
                          </span>
                          <div className="text-gray-600 mt-1">
                            {formatDate(attempt.startedAt || attempt.createdAt)}
                          </div>
                        </div>
                        {attempt.completedAt && (
                          <div>
                            <span className="font-medium text-gray-700">
                              {t('lesson.quizHistory.completedAt')}:
                            </span>
                            <div className="text-gray-600 mt-1">
                              {formatDate(attempt.completedAt)}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">
                            {t('lesson.quizHistory.questionsAnswered')}:
                          </span>
                          <div className="text-gray-600 mt-1">
                            {attempt.answeredQuestions || 0} / {attempt.totalQuestions || 0}
                          </div>
                        </div>
                        {attempt.status === 'COMPLETED' && (
                          <div>
                            <span className="font-medium text-gray-700">
                              {t('lesson.quizHistory.accuracy')}:
                            </span>
                            <div className={`mt-1 font-medium ${getScoreColor(attempt.score || 0)}`}>
                              {Math.round(attempt.score || 0)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('lesson.quizHistory.noHistory')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('lesson.quizHistory.noHistoryDescription')}
            </p>
            {onStartQuiz && (
              <button
                onClick={onStartQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 mx-auto transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                {t('lesson.quizHistory.startFirstAttempt')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
