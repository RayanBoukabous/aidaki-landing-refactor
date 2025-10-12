'use client'

import { useEffect, useState, useRef } from 'react';
import { useQuizResponses } from '../hooks/useQuizResponses';
import { 
  generateStudyRecommendations, 
  getPerformanceLevel,
  calculateQuizStatistics
} from '../utils/quizUtils';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen,
  Clock,
  Award,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Trophy,
  Zap,
  RefreshCw
} from 'lucide-react';

interface QuizAnalysisProps {
  quizId?: number;
  t: (key: string) => string;
  isRTL: boolean;
  onActionClick?: (action: string) => void;
}

export const QuizAnalysis = ({ 
  quizId, 
  t, 
  isRTL, 
  onActionClick 
}: QuizAnalysisProps) => {
  const {
    attempts,
    loading,
    error,
    fetchUserAttempts
  } = useQuizResponses();

  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const hasInitialized = useRef(false);

  // Initialize data only once when component mounts
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (quizId) {
        fetchUserAttempts(quizId);
      } else {
        fetchUserAttempts(); // Fetch all attempts for global analysis
      }
    }
  }, [quizId]); // Only depend on quizId

  // Perform analysis when attempts change
  useEffect(() => {
    if (attempts.length > 0) {
      performAnalysis();
    } else {
      setAnalysisData(null);
    }
  }, [attempts, quizId]); // Only depend on attempts and quizId

  const performAnalysis = () => {
    const stats = calculateQuizStatistics(attempts, quizId);
    const performanceLevel = getPerformanceLevel(stats);
    const recommendations = generateStudyRecommendations(stats, t);
    
    // Additional analysis
    const recentAttempts = attempts
      .filter(attempt => quizId ? attempt.quizId === quizId : true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const improvementRate = calculateImprovementRate(recentAttempts);
    const weeklyProgress = calculateWeeklyProgress(attempts, quizId);
    const strengths = identifyStrengths(stats);
    const weaknesses = identifyWeaknesses(stats);

    setAnalysisData({
      stats,
      performanceLevel,
      recommendations,
      improvementRate,
      weeklyProgress,
      strengths,
      weaknesses,
      recentAttempts
    });
  };

  const calculateImprovementRate = (recentAttempts) => {
    if (recentAttempts.length < 2) return 0;
    
    const firstScore = recentAttempts[recentAttempts.length - 1].score || 0;
    const lastScore = recentAttempts[0].score || 0;
    
    return lastScore - firstScore;
  };

  const calculateWeeklyProgress = (attempts, quizId) => {
    const filteredAttempts = quizId 
      ? attempts.filter(attempt => attempt.quizId === quizId)
      : attempts;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyAttempts = filteredAttempts.filter(attempt => 
      new Date(attempt.createdAt) >= oneWeekAgo
    );

    return {
      attemptsThisWeek: weeklyAttempts.length,
      averageScoreThisWeek: weeklyAttempts.length > 0 
        ? weeklyAttempts.reduce((sum, att) => sum + (att.score || 0), 0) / weeklyAttempts.length 
        : 0,
      timeSpentThisWeek: weeklyAttempts.reduce((sum, att) => sum + (att.timeSpent || 0), 0)
    };
  };

  const identifyStrengths = (stats) => {
    const strengths = [];
    
    if (stats.averageScore >= 85) {
      strengths.push({
        type: 'accuracy',
        icon: '🎯',
        title: t('quiz.analysis.highAccuracy'),
        description: t('quiz.analysis.highAccuracyDesc')
      });
    }
    
    if (stats.consistency >= 80) {
      strengths.push({
        type: 'consistency',
        icon: '📈',
        title: t('quiz.analysis.consistent'),
        description: t('quiz.analysis.consistentDesc')
      });
    }
    
    if (stats.completionRate >= 90) {
      strengths.push({
        type: 'completion',
        icon: '✅',
        title: t('quiz.analysis.reliableCompletion'),
        description: t('quiz.analysis.reliableCompletionDesc')
      });
    }

    if (stats.trend > 10) {
      strengths.push({
        type: 'improvement',
        icon: '📊',
        title: t('quiz.analysis.improving'),
        description: t('quiz.analysis.improvingDesc')
      });
    }

    return strengths;
  };

  const identifyWeaknesses = (stats) => {
    const weaknesses = [];
    
    if (stats.averageScore < 70) {
      weaknesses.push({
        type: 'accuracy',
        icon: '📚',
        title: t('quiz.analysis.needsReview'),
        description: t('quiz.analysis.needsReviewDesc'),
        severity: 'high'
      });
    }
    
    if (stats.consistency < 60) {
      weaknesses.push({
        type: 'consistency',
        icon: '🎯',
        title: t('quiz.analysis.inconsistent'),
        description: t('quiz.analysis.inconsistentDesc'),
        severity: 'medium'
      });
    }
    
    if (stats.completionRate < 70) {
      weaknesses.push({
        type: 'completion',
        icon: '⏱️',
        title: t('quiz.analysis.timeManagement'),
        description: t('quiz.analysis.timeManagementDesc'),
        severity: 'medium'
      });
    }

    if (stats.trend < -10) {
      weaknesses.push({
        type: 'declining',
        icon: '📉',
        title: t('quiz.analysis.declining'),
        description: t('quiz.analysis.decliningDesc'),
        severity: 'high'
      });
    }

    return weaknesses;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleRecommendationAction = (recommendation, index) => {
    setSelectedRecommendation(selectedRecommendation === index ? null : index);
    if (onActionClick) {
      onActionClick(recommendation.type);
    }
  };

  if (loading && attempts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 animate-pulse ml-4">{t('quiz.analysis.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error || t('quiz.analysis.noData')}</p>
        </div>
      </div>
    );
  }

  const { stats, performanceLevel, recommendations, improvementRate, weeklyProgress, strengths, weaknesses } = analysisData;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {t('quiz.analysis.performanceOverview')}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${performanceLevel.color}`}>
                {performanceLevel.icon}
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="text-xl font-bold text-gray-800">
                  {performanceLevel.description}
                </h4>
                <p className="text-gray-600">
                  {t('quiz.analysis.overallPerformance')}
                </p>
              </div>
            </div>

            <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
              <div className="text-3xl font-bold text-gray-800">
                {Math.round(stats.averageScore)}%
              </div>
              <div className="text-sm text-gray-600">
                {t('quiz.analysis.averageScore')}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className={`w-5 h-5 ${improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {t('quiz.analysis.improvement')}
                </span>
              </div>
              <div className={`text-xl font-bold ${improvementRate >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {improvementRate >= 0 ? '+' : ''}{Math.round(improvementRate)}%
              </div>
              <div className="text-xs text-gray-600">
                {t('quiz.analysis.lastFiveAttempts')}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t('quiz.analysis.consistency')}
                </span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {Math.round(stats.consistency)}%
              </div>
              <div className="text-xs text-gray-600">
                {t('quiz.analysis.scoreStability')}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t('quiz.analysis.weeklyActivity')}
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-700">
                {weeklyProgress.attemptsThisWeek}
              </div>
              <div className="text-xs text-gray-600">
                {t('quiz.analysis.attemptsThisWeek')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Trophy className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-800">
                {t('quiz.analysis.strengths')}
              </h4>
            </div>
          </div>
          <div className="p-6">
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-lg">{strength.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-green-800 mb-1">
                        {strength.title}
                      </h5>
                      <p className="text-sm text-green-700">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  {t('quiz.analysis.noStrengthsYet')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-800">
                {t('quiz.analysis.areasForImprovement')}
              </h4>
            </div>
          </div>
          <div className="p-6">
            {weaknesses.length > 0 ? (
              <div className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(weakness.severity)}`}>
                    <div className="text-lg">{weakness.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium mb-1">
                        {weakness.title}
                      </h5>
                      <p className="text-sm">
                        {weakness.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">
                  {t('quiz.analysis.noWeaknessesFound')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">
              {t('quiz.analysis.recommendations')}
            </h4>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => handleRecommendationAction(recommendation, index)}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="text-2xl">{recommendation.icon}</div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h5 className="font-medium text-gray-800">
                        {recommendation.title}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedRecommendation === index ? 'rotate-90' : ''
                  } ${isRTL ? 'rotate-180' : ''}`} />
                </div>
                
                {selectedRecommendation === index && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 mb-3">
                        {t(`quiz.recommendations.${recommendation.type}Detail`)}
                      </p>
                      <div className="flex gap-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                          <BookOpen className="w-4 h-4" />
                          {t('quiz.analysis.startAction')}
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                          {t('quiz.analysis.remindLater')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};