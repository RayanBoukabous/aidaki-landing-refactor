"use client";

import { useState, useEffect } from "react";
import { useQuizResponses } from "../hooks/useQuizResponses";
import {
  Brain,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Play,
  Flag,
  Link as LinkIcon,
  Check,
  X,
} from "lucide-react";

interface InteractiveQuizProps {
  quizData: any;
  quizId: number;
  t: (key: string) => string;
  isRTL: boolean;
  onComplete?: (result: any) => void;
  onClose?: () => void;
}

interface QuestionFeedback {
  isCorrect: boolean;
  showFeedback: boolean;
  userAnswer: any;
  correctAnswer: any;
  feedbackMessage?: string;
}

export const InteractiveQuiz = ({
  quizData,
  quizId,
  t,
  isRTL,
  onComplete,
  onClose,
}: InteractiveQuizProps) => {
  const {
    submitAnswer,
    completeQuizAttempt,
    startQuizAttempt,
    currentAttempt,
    loading,
    error,
    submitting,
  } = useQuizResponses();

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // answers must start as null for ALL questions on mount
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [autoStarting, setAutoStarting] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState<{
    [key: number]: QuestionFeedback;
  }>({});
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [showMatchingFeedback, setShowMatchingFeedback] = useState(false);

  const totalQuestions = quizData?.questions?.length || 0;
  const currentQuestion = quizData?.questions?.[currentQuestionIndex];

  // Initialize all answers to null on mount (and when quizData first arrives)
  useEffect(() => {
    const qs = quizData?.questions;
    if (qs && qs.length > 0) {
      // Only initialize if we haven't already set answers for these ids
      const needInit = qs.some((q: any) => !(q.id in answers));
      if (needInit) {
        const init: { [key: number]: null } = {};
        qs.forEach((q: any) => {
          init[q.id] = null;
        });
        setAnswers((prev) => ({ ...init, ...prev }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizData]);

  // Auto-start quiz when component loads
  useEffect(() => {
    if (
      !quizStarted &&
      !quizCompleted &&
      !autoStarting &&
      quizId &&
      totalQuestions > 0
    ) {
      setAutoStarting(true);
      handleStartQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, totalQuestions]);

  // Reset question start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
    // Clear matching feedback when changing questions
    if (currentQuestion?.type === "matching") {
      setShowMatchingFeedback(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  const handleStartQuiz = async () => {
    try {
      const attempt = await startQuizAttempt(quizId);
      setAttemptId(attempt?.id ?? null);
      setQuizStarted(true);
    } catch (e) {
      // error is already handled in hook's `error`
    } finally {
      setAutoStarting(false);
    }
  };

  // Check correctness per question type
  const checkAnswerCorrectness = (question: any, userAnswer: any) => {
    if (!question) return false;

    switch (question.type) {
      case "multiple-choice": {
        // correctAnswer can be index or letter (a,b,c,d)
        let correctIndex = question.correctAnswer;
        if (typeof correctIndex === "string") {
          const letterToIndex: Record<string, number> = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
          };
          correctIndex = letterToIndex[correctIndex.toLowerCase()];
        }
        return Number(userAnswer) === Number(correctIndex);
      }

      case "true-false": {
        // Assume correctAnswer is boolean; userAnswer is 0 (true) or 1 (false) based on UI labels
        const mapIndexToBool = (idx: number) => (idx === 0 ? true : false);
        return mapIndexToBool(userAnswer) === Boolean(question.correctAnswer);
      }

      case "fill-in-blank": {
        const ua = String(userAnswer ?? "").trim();
        const ca = String(question.correctAnswer ?? "").trim();
        if (!ua) return false;
        // Case-insensitive exact match after trimming
        return ua.toLowerCase() === ca.toLowerCase();
      }

      case "matching": {
        if (
          !Array.isArray(userAnswer) ||
          !Array.isArray(question.correctMatches)
        )
          return false;
        if (userAnswer.length !== question.correctMatches.length) return false;

        return question.correctMatches.every((correctMatch: any) =>
          userAnswer.some(
            (userMatch: any) =>
              userMatch.item === correctMatch.item &&
              userMatch.match === correctMatch.match
          )
        );
      }

      default:
        return false;
    }
  };

  // Get correct answer display based on question type
  const getCorrectAnswerDisplay = (question: any) => {
    if (!question) return null;

    switch (question.type) {
      case "multiple-choice": {
        if (typeof question.correctAnswer === "string") {
          const letterToIndex: Record<string, number> = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
          };
          return question.options[
            letterToIndex[question.correctAnswer.toLowerCase()]
          ];
        }
        return question.options[question.correctAnswer];
      }

      case "true-false":
        return question.correctAnswer
          ? t("lesson.quiz.true")
          : t("lesson.quiz.false");

      case "fill-in-blank":
        return question.correctAnswer;

      case "matching":
        return (
          <div className="space-y-2">
            {Object.entries(question.columnA || {}).map(([key, value]) => {
              const correctMatch = question.correctMatches.find(
                (m: any) => m.item === key
              );
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="font-medium">
                    {key}. {value as string}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span className="text-green-600 font-medium">
                    {correctMatch?.match}.{" "}
                    {question.columnB?.[correctMatch?.match]}
                  </span>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  // Store answer and show feedback immediately for T/F and Fill-in-blank (requirement 2)
  const handleAnswerChange = (value: any) => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;

    // Store the answer
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // For matching questions, feedback handled separately
    if (currentQuestion.type !== "matching") {
      // Only show feedback if the answer is not null/empty
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        const isCorrect = checkAnswerCorrectness(currentQuestion, value);
        setQuestionFeedback((prev) => ({
          ...prev,
          [questionId]: {
            isCorrect,
            showFeedback: true,
            userAnswer: value,
            correctAnswer: currentQuestion.correctAnswer,
            feedbackMessage: isCorrect
              ? t("lesson.quiz.correctAnswer")
              : t("lesson.quiz.incorrectAnswer"),
          },
        }));
      } else {
        // Clear feedback if answer is null/empty
        setQuestionFeedback((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            showFeedback: false,
          },
        }));
      }
    }
  };

  // Handle matching question answer changes
  const handleMatchingChange = (item: string, match: string) => {
    if (!currentQuestion) return;
    const currentMatches = Array.isArray(answers[currentQuestion.id])
      ? answers[currentQuestion.id]
      : [];
    const updatedMatches = currentMatches.filter((m: any) => m.item !== item);

    if (match) {
      updatedMatches.push({ item, match });
    }

    // Store the updated matches
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updatedMatches,
    }));

    // Check if all items are matched
    const isComplete =
      updatedMatches.length ===
      Object.keys(currentQuestion.columnA || {}).length;

    // Only show feedback if all items are matched AND there are matches
    if (isComplete && updatedMatches.length > 0) {
      const isCorrect = checkAnswerCorrectness(currentQuestion, updatedMatches);
      setShowMatchingFeedback(true);
      setQuestionFeedback((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          isCorrect,
          showFeedback: true,
          userAnswer: updatedMatches,
          correctAnswer: currentQuestion.correctMatches,
          feedbackMessage: isCorrect
            ? t("lesson.quiz.correctAnswer")
            : t("lesson.quiz.incorrectAnswer"),
        },
      }));
    } else {
      // Clear feedback if not complete
      setShowMatchingFeedback(false);
      setQuestionFeedback((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          showFeedback: false,
        },
      }));
    }
  };

  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    console.log(currentQuestion, answer);
    if (answer === undefined || answer === null) return false;

    // For matching questions, check if all items are matched
    if (currentQuestion.type === "matching") {
      const requiredMatches = Object.keys(currentQuestion.columnA || {}).length;
      return Array.isArray(answer) && answer.length === requiredMatches;
    }

    // For fill-in--blank, require at least some text
    if (currentQuestion.type === "fill-in-blank") {
      return String(answer).trim().length > 0;
    }

    // For other question types
    return true;
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    // Optionally submit per-question answer here
    try {
      if (attemptId != null) {
        const payloadAnswer =
          currentQuestion.type === "true-false"
            ? answers[currentQuestion.id] === 0 // 0 means true, 1 means false
            : answers[currentQuestion.id];

        await submitAnswer({
          attemptId,
          questionId: currentQuestion.id,
          answer: payloadAnswer,
          timeSpentMs: Date.now() - questionStartTime,
        });
      }
    } catch {
      // Swallow per-question submit errors to allow navigation
    }

    // If last question, confirm submit
    if (currentQuestionIndex === totalQuestions - 1) {
      setShowConfirmSubmit(true);
      return;
    }

    // Move to next question
    const nextIndex = Math.min(currentQuestionIndex + 1, totalQuestions - 1);
    const nextQuestionId = quizData.questions[nextIndex].id;

    // Reset answer for the next question
    setAnswers((prev) => ({
      ...prev,
      [nextQuestionId]: null,
    }));

    setCurrentQuestionIndex(nextIndex);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleCompleteQuiz = async () => {
    try {
      if (attemptId != null) {
        // Submit remaining current question if needed
        const cq = currentQuestion;
        if (cq) {
          const payloadAnswer =
            cq.type === "true-false" ? answers[cq.id] === 0 : answers[cq.id];
          await submitAnswer({
            attemptId,
            questionId: cq.id,
            answer: payloadAnswer,
            timeSpentMs: Date.now() - questionStartTime,
          }).catch(() => void 0);
        }

        const result = await completeQuizAttempt(attemptId);
        setQuizCompleted(true);
        onComplete?.(result);
      } else {
        setQuizCompleted(true);
      }
    } catch {
      // error handled upstream as needed
      setQuizCompleted(true);
    }
  };

  const renderFeedback = (question: any) => {
    const feedback = questionFeedback[question.id];
    const answer = answers[question.id];

    // Don't show feedback if there's no feedback or answer is null/empty
    if (
      !feedback ||
      !feedback.showFeedback ||
      answer === null ||
      answer === undefined ||
      (typeof answer === "string" && answer.trim() === "") ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      return null;
    }

    return (
      <div
        className={`mt-4 p-4 rounded-lg ${
          feedback.isCorrect ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {feedback.isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <span
            className={`font-medium ${
              feedback.isCorrect ? "text-green-800" : "text-red-800"
            }`}
          >
            {feedback.feedbackMessage}
          </span>
        </div>

        {!feedback.isCorrect && (
          <>
            <div className="flex items-center gap-2 mt-3">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-medium">
                {t("lesson.quiz.correctAnswerIs")}:
              </span>
            </div>
            <div className="mt-2 p-3 bg-white border border-green-200 rounded-md">
              {getCorrectAnswerDisplay(question)}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const answer = answers[currentQuestion.id];

    const feedback = questionFeedback[currentQuestion.id];
    const isAnswered = Boolean(feedback?.showFeedback);

    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = answer === index;
              const isCorrect = checkAnswerCorrectness(currentQuestion, index);
              return (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected && isAnswered
                      ? isCorrect
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
                  } ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={isSelected || false}
                    onChange={() => handleAnswerChange(index)}
                    className="w-4 h-4 text-sky-500"
                  />
                  <span className={`text-gray-800 ${isRTL ? "mr-3" : "ml-3"}`}>
                    {option}
                  </span>
                  {isAnswered && !isCorrect && isSelected && (
                    <X className="w-4 h-4 text-red-600 ml-2" />
                  )}
                  {isAnswered && isCorrect && isSelected && (
                    <Check className="w-4 h-4 text-green-600 ml-2" />
                  )}
                </label>
              );
            })}
            {isAnswered && renderFeedback(currentQuestion)}
          </div>
        );

      case "true-false":
        // Do not show feedback until a choice is made; show after selection and before Next
        return (
          <div className="space-y-4">
            {[t("lesson.quiz.true"), t("lesson.quiz.false")].map(
              (option, index) => {
                const isSelected = answer === index;
                const isCorrect = checkAnswerCorrectness(
                  currentQuestion,
                  index
                );
                return (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected && isAnswered
                        ? isCorrect
                          ? "border-green-400 bg-green-50"
                          : "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
                    } ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={Boolean(isSelected)}
                      onChange={() => handleAnswerChange(index)}
                      className="w-4 h-4 text-sky-500"
                    />
                    <span
                      className={`text-gray-800 ${isRTL ? "mr-3" : "ml-3"}`}
                    >
                      {option}
                    </span>
                    {isAnswered &&
                      isSelected &&
                      (isCorrect ? (
                        <Check className="w-4 h-4 text-green-600 ml-2" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 ml-2" />
                      ))}
                  </label>
                );
              }
            )}
            {isAnswered && renderFeedback(currentQuestion)}
          </div>
        );

      case "fill-in-blank":
        // No feedback before typing; show after user input (before Next)
        return (
          <div className="space-y-4">
            <textarea
              placeholder={t("lesson.quiz.fillInPlaceholder")}
              value={answer ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleAnswerChange(val);
              }}
              rows={3}
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none resize-none border-gray-200 focus:border-sky-400"
              dir={isRTL ? "rtl" : "ltr"}
            />
            {isAnswered && renderFeedback(currentQuestion)}
          </div>
        );

      case "matching": {
        const currentMatches = Array.isArray(answer) ? answer : [];
        const getMatchForItem = (item: string) => {
          const match = currentMatches.find((m: any) => m.item === item);
          return match ? match.match : "";
        };

        const isMatchingComplete =
          currentMatches.length ===
          Object.keys(currentQuestion.columnA || {}).length;
        const isMatchingCorrect = isMatchingComplete
          ? checkAnswerCorrectness(currentQuestion, currentMatches)
          : false;

        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">
                  {t("lesson.quiz.matchingInstructions") ||
                    "Match each item on the left with its corresponding answer on the right"}
                </h4>
              </div>
              <p className="text-blue-700 text-sm">
                {t("lesson.quiz.matchingDescription") ||
                  "Select the correct match for each item from the dropdown menu."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Object.entries(currentQuestion.columnA || {}).map(
                ([key, value]) => {
                  const selectedMatch = getMatchForItem(key);
                  const correctMatch = currentQuestion.correctMatches.find(
                    (m: any) => m.item === key
                  );
                  const isCorrectMatch = selectedMatch === correctMatch?.match;

                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <div
                        className={`flex items-center gap-4 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Left side - Item */}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {key}. {value as string}
                          </div>
                        </div>

                        {/* Right side - Answer selection */}
                        <div className="flex-1">
                          <select
                            value={selectedMatch}
                            onChange={(e) =>
                              handleMatchingChange(key, e.target.value)
                            }
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                              showMatchingFeedback && isCorrectMatch
                                ? "border-green-400 focus:ring-green-500"
                                : showMatchingFeedback && !isCorrectMatch
                                ? "border-red-400 focus:ring-red-500"
                                : "border-gray-300 focus:ring-sky-500"
                            }`}
                          >
                            <option value="">
                              {t("lesson.quiz.selectMatch") ||
                                "Select a match..."}
                            </option>
                            {Object.entries(currentQuestion.columnB || {}).map(
                              ([optKey, optValue]) => (
                                <option key={optKey} value={optKey}>
                                  {optKey}. {optValue as string}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {isMatchingComplete && (
              <div className="mt-2">
                {showMatchingFeedback && (
                  <div
                    className={`p-4 rounded-lg ${
                      isMatchingCorrect ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isMatchingCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span
                        className={`font-medium ${
                          isMatchingCorrect ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {isMatchingCorrect
                          ? t("lesson.quiz.correctAnswer")
                          : t("lesson.quiz.incorrectAnswer")}
                      </span>
                    </div>
                    {!isMatchingCorrect && (
                      <>
                        <div className="flex items-center gap-2 mt-3">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-800 font-medium">
                            {t("lesson.quiz.correctAnswerIs")}:
                          </span>
                        </div>
                        <div className="mt-2 p-3 bg-white border border-green-200 rounded-md">
                          {getCorrectAnswerDisplay(currentQuestion)}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-sky-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {quizData.title}
        </h2>
        <p className="text-gray-600 mb-6">{quizData.description}</p>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <Play className="w-5 h-5 text-sky-600 mt-0.5" />
            <div className="text-sm text-sky-800">
              <p className="font-medium mb-1">
                {t("lesson.quiz.startingQuiz")}
              </p>
              <p className="text-xs">{t("lesson.quiz.pleaseWait")}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            {(loading || autoStarting) && (
              <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            )}
            <span className="text-sky-600">
              {t("lesson.quiz.initializing")}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{String(error)}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Completed Screen
  if (quizCompleted) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {t("lesson.quiz.completed")}
        </h2>
        <p className="text-gray-600 mb-6">
          {t("lesson.quiz.completedDescription")}
        </p>

        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-800 mb-2">
            {currentAttempt?.score || 0}%
          </div>
          <div className="text-gray-600">{t("lesson.quiz.yourScore")}</div>
        </div>

        <div className="flex justify-center gap-4">
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {t("lesson.quiz.close")}
            </button>
          )}
          <button
            onClick={() => {
              setShowCorrectAnswers(true);
              setCurrentQuestionIndex(0);
              setQuizCompleted(false);
            }}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            {t("lesson.quiz.reviewAnswers")}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t("lesson.quiz.retake")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl mx-auto ${isRTL ? "text-right" : ""}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {quizData?.title}
        </h3>
        <p className="text-gray-600">
          {t("lesson.quiz.question")} {currentQuestionIndex + 1}{" "}
          {t("lesson.quiz.of")} {totalQuestions}
        </p>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="text-gray-800 font-medium mb-4">
          {currentQuestion?.question}
        </div>
        {renderQuestion()}
      </div>

      {/* Navigation */}
      <div
        className={`flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("lesson.quiz.previous")}
        </button>

        <div className="text-sm text-gray-600">
          {questionFeedback[currentQuestion?.id || -1]?.showFeedback ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              {t("lesson.quiz.answered")}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t("lesson.quiz.notAnswered")}
            </div>
          )}
        </div>

        {!showCorrectAnswers ? (
          <button
            onClick={handleNextQuestion}
            disabled={!isCurrentQuestionAnswered() || submitting}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Flag className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {currentQuestionIndex === totalQuestions - 1
              ? t("lesson.quiz.finish")
              : t("lesson.quiz.next")}
          </button>
        ) : (
          <button
            onClick={() => setShowCorrectAnswers(false)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("lesson.quiz.backToQuiz")}
          </button>
        )}
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {t("lesson.quiz.confirmSubmit")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("lesson.quiz.confirmSubmitDescription")}
            </p>
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t("lesson.quiz.cancel")}
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleCompleteQuiz();
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t("lesson.quiz.submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
