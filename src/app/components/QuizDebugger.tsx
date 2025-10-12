'use client'

import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { useQuizResponses } from '../hooks/useQuizResponses';
import { AlertCircle, CheckCircle, Bug, Play, RefreshCw, Database } from 'lucide-react';

interface QuizDebuggerProps {
  lessonId?: string;
  t: (key: string) => string;
}

export const QuizDebugger = ({ lessonId, t }: QuizDebuggerProps) => {
  const { getQuizById, loading: quizLoading, error: quizError, debugHookState } = useQuiz();
  const { fetchUserAttempts, loading: responseLoading, error: responseError, attempts } = useQuizResponses();
  
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [apiTests, setApiTests] = useState<any>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Test functions
  const testQuizAPI = async (quizId: string) => {
    const results = [];
    
    try {
      // Test 1: Basic quiz fetch
      console.log('🧪 Testing basic quiz fetch...');
      const startTime = Date.now();
      const quizData = await getQuizById(quizId);
      const endTime = Date.now();
      
      results.push({
        test: 'Basic Quiz Fetch',
        status: quizData ? 'success' : 'failed',
        duration: `${endTime - startTime}ms`,
        data: quizData,
        issues: !quizData ? ['No data returned'] : []
      });

      // Test 2: Quiz data structure validation
      if (quizData) {
        console.log('🧪 Testing quiz data structure...');
        const hasTitle = !!quizData.title;
        const hasQuestions = !!(quizData.multipleChoiceQuestions || quizData.trueFalseQuestions);
        const questionCount = (quizData.multipleChoiceQuestions?.length || 0) + (quizData.trueFalseQuestions?.length || 0);
        
        results.push({
          test: 'Quiz Data Structure',
          status: hasTitle && hasQuestions ? 'success' : 'warning',
          data: {
            hasTitle,
            hasQuestions,
            questionCount,
            structure: {
              title: quizData.title,
              multipleChoice: quizData.multipleChoiceQuestions?.length || 0,
              trueFalse: quizData.trueFalseQuestions?.length || 0
            }
          },
          issues: [
            !hasTitle && 'Missing title',
            !hasQuestions && 'No questions found',
            questionCount === 0 && 'Zero questions'
          ].filter(Boolean)
        });
      }

      // Test 3: Quiz transformation capability
      if (quizData) {
        console.log('🧪 Testing quiz transformation...');
        try {
          const transformedQuestions: any[] = [];
          
          if (quizData.multipleChoiceQuestions) {
            quizData.multipleChoiceQuestions.forEach((mcq: any) => {
              transformedQuestions.push({
                id: mcq.id,
                type: "multiple-choice",
                question: mcq.question,
                options: [mcq.options?.a, mcq.options?.b, mcq.options?.c, mcq.options?.d].filter(Boolean),
                correctAnswer: ["a", "b", "c", "d"].indexOf(mcq.correctAnswer),
              });
            });
          }
          
          if (quizData.trueFalseQuestions) {
            quizData.trueFalseQuestions.forEach((tfq: any) => {
              transformedQuestions.push({
                id: tfq.id,
                type: "true-false",
                question: tfq.question,
                options: ['True', 'False'],
                correctAnswer: tfq.correctAnswer ? 0 : 1,
              });
            });
          }
          
          results.push({
            test: 'Quiz Transformation',
            status: transformedQuestions.length > 0 ? 'success' : 'failed',
            data: {
              originalQuestions: questionCount,
              transformedQuestions: transformedQuestions.length,
              sample: transformedQuestions[0]
            },
            issues: transformedQuestions.length === 0 ? ['Transformation failed'] : []
          });
        } catch (transformError) {
          results.push({
            test: 'Quiz Transformation',
            status: 'failed',
            data: { error: transformError },
            issues: ['Transformation error: ' + transformError]
          });
        }
      }

    } catch (error) {
      results.push({
        test: 'API Connection',
        status: 'failed',
        data: { error: error.message },
        issues: ['API request failed: ' + error.message]
      });
    }

    return results;
  };

  const testQuizResponses = async () => {
    const results = [];
    
    try {
      console.log('🧪 Testing quiz responses fetch...');
      const startTime = Date.now();
      await fetchUserAttempts();
      const endTime = Date.now();
      
      results.push({
        test: 'Quiz Responses Fetch',
        status: 'success',
        duration: `${endTime - startTime}ms`,
        data: { attemptsCount: attempts.length },
        issues: []
      });
    } catch (error) {
      results.push({
        test: 'Quiz Responses Fetch',
        status: 'failed',
        data: { error: error.message },
        issues: ['Responses fetch failed: ' + error.message]
      });
    }

    return results;
  };

  const runAllTests = async () => {
    if (!selectedQuizId) {
      alert('Please enter a Quiz ID to test');
      return;
    }

    setIsRunningTests(true);
    setTestResults([]);
    
    console.log('🚀 Starting comprehensive quiz tests...');
    
    try {
      // Run quiz API tests
      const quizResults = await testQuizAPI(selectedQuizId);
      
      // Run quiz responses tests
      const responseResults = await testQuizResponses();
      
      // Combine results
      const allResults = [...quizResults, ...responseResults];
      setTestResults(allResults);
      
      console.log('✅ All tests completed:', allResults);
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      setTestResults([{
        test: 'Test Suite',
        status: 'failed',
        data: { error: error.message },
        issues: ['Test suite execution failed']
      }]);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bug className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'failed': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Quiz Debugger & Tester
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Test Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz ID to Test:
              </label>
              <input
                type="text"
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                placeholder="Enter quiz ID (e.g., 1, 2, 3...)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunningTests || !selectedQuizId}
              className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isRunningTests ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunningTests ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>

          {lessonId && (
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <strong>Current Lesson ID:</strong> {lessonId}
            </div>
          )}
        </div>

        {/* Current State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Quiz Hook State
            </h4>
            <div className="space-y-2 text-sm">
              <div><strong>Loading:</strong> {quizLoading ? 'Yes' : 'No'}</div>
              <div><strong>Error:</strong> {quizError || 'None'}</div>
              <button
                onClick={debugHookState}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                Debug Hook State →
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Quiz Responses State
            </h4>
            <div className="space-y-2 text-sm">
              <div><strong>Loading:</strong> {responseLoading ? 'Yes' : 'No'}</div>
              <div><strong>Error:</strong> {responseError || 'None'}</div>
              <div><strong>Attempts:</strong> {attempts.length}</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Test Results:</h4>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  {result.duration && (
                    <span className="text-sm text-gray-600">{result.duration}</span>
                  )}
                </div>

                {result.issues && result.issues.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-sm text-red-700">Issues:</strong>
                    <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                      {result.issues.map((issue: string, i: number) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.data && (
                  <details className="mt-2">
                    <summary className="text-sm font-medium cursor-pointer text-gray-700">
                      View Data Details
                    </summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Enter a Quiz ID that you know exists in your database</li>
            <li>Click "Run Tests" to test the complete quiz functionality</li>
            <li>Check the console for detailed logs (F12 → Console)</li>
            <li>Review test results to identify any issues</li>
            <li>Fix any failed tests before using the quiz in production</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
