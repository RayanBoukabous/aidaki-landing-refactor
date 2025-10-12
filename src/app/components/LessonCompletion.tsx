"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface LessonCompletionProps {
  lessonId: string;
  sessionData?: any;
  totalStudyTime: number;
  onClose: () => void;
  onContinueToNext?: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

export const LessonCompletion = ({
  lessonId,
  sessionData,
  totalStudyTime,
  onClose,
  onContinueToNext,
  t,
  isRTL,
}: LessonCompletionProps) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Trigger celebration animation
    setShowCelebration(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center relative overflow-hidden">
          

          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("lesson.completion.congratulations")}
            </h2>
            <p className="text-green-100">
              {t("lesson.completion.performance.completed")}
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="p-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {t("lesson.completion.close")}
          </button>
        </div>
      </div>
    </div>
  );
};