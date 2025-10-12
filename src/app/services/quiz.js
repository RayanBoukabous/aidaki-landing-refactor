'use client'

import api from './api';

// Quiz Service - API calls for quiz functionality
class QuizService {
  // Get quiz by ID with detailed debugging
  async getQuizById(id) {
    try {
      console.log(`🔍 QuizService: Fetching quiz with ID: ${id}`);
      const response = await api.get(`/quiz/${id}`);
      console.log(`✅ QuizService: Successfully fetched quiz ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ QuizService: Error fetching quiz with id ${id}:`, {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });

      return error
    }
  }

  // Get all quizzes
  async getAllQuizzes() {
    try {
      console.log('🔍 QuizService: Fetching all quizzes');
      const response = await api.get('/quiz');
      console.log('✅ QuizService: Successfully fetched all quizzes:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ QuizService: Error fetching all quizzes:', error);
      throw error;
    }
  }

  // Get quizzes by lesson ID
  async getQuizzesByLessonId(lessonId) {
    try {
      console.log(`🔍 QuizService: Fetching quizzes for lesson ID: ${lessonId}`);
      const response = await api.get(`/quiz?lessonId=${lessonId}`);
      console.log(`✅ QuizService: Successfully fetched quizzes for lesson ${lessonId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ QuizService: Error fetching quizzes for lesson ${lessonId}:`, error);
      throw error;
    }
  }

  // Create new quiz
  async createQuiz(quizData) {
    try {
      console.log('🔍 QuizService: Creating new quiz:', quizData);
      const response = await api.post('/quiz', quizData);
      console.log('✅ QuizService: Successfully created quiz:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ QuizService: Error creating quiz:', error);
      throw error;
    }
  }

  // Update quiz
  async updateQuiz(id, quizData) {
    try {
      console.log(`🔍 QuizService: Updating quiz with ID: ${id}`, quizData);
      const response = await api.put(`/quiz/${id}`, quizData);
      console.log(`✅ QuizService: Successfully updated quiz ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ QuizService: Error updating quiz with id ${id}:`, error);
      throw error;
    }
  }

  // Delete quiz
  async deleteQuiz(id) {
    try {
      console.log(`🔍 QuizService: Deleting quiz with ID: ${id}`);
      const response = await api.delete(`/quiz/${id}`);
      console.log(`✅ QuizService: Successfully deleted quiz ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ QuizService: Error deleting quiz with id ${id}:`, error);
      throw error;
    }
  }

  // Get quiz with questions details
  async getQuizWithQuestions(id) {
    try {
      console.log(`🔍 QuizService: Fetching quiz with questions for ID: ${id}`);
      const response = await api.get(`/quiz/${id}/questions`);
      console.log(`✅ QuizService: Successfully fetched quiz with questions ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ QuizService: Error fetching quiz with questions for id ${id}:`, error);
      // Fallback to regular quiz endpoint
      console.log('🔄 QuizService: Falling back to regular quiz endpoint');
      return this.getQuizById(id);
    }
  }

  // Validate quiz data structure
  validateQuizData(quizData) {
    if (!quizData) {
      throw new Error('Quiz data is null or undefined');
    }

    const issues = [];

    if (!quizData.title) {
      issues.push('Missing quiz title');
    }

    if (!quizData.multipleChoiceQuestions && !quizData.trueFalseQuestions) {
      issues.push('No questions found in quiz data');
    }

    if (quizData.multipleChoiceQuestions && !Array.isArray(quizData.multipleChoiceQuestions)) {
      issues.push('multipleChoiceQuestions is not an array');
    }

    if (quizData.trueFalseQuestions && !Array.isArray(quizData.trueFalseQuestions)) {
      issues.push('trueFalseQuestions is not an array');
    }

    const totalQuestions = (quizData.multipleChoiceQuestions?.length || 0) + 
                          (quizData.trueFalseQuestions?.length || 0);

    if (totalQuestions === 0) {
      issues.push('Quiz contains no questions');
    }

    if (issues.length > 0) {
      console.warn('⚠️ QuizService: Quiz data validation issues:', issues);
      return { valid: false, issues };
    }

    console.log('✅ QuizService: Quiz data validation passed');
    return { valid: true, issues: [] };
  }

  // Debug quiz structure
  debugQuizStructure(quizData) {
    console.log('🐛 QuizService: Quiz Data Structure Debug:', {
      hasData: !!quizData,
      type: typeof quizData,
      keys: quizData ? Object.keys(quizData) : [],
      title: quizData?.title,
      description: quizData?.description,
      multipleChoiceQuestions: {
        exists: !!quizData?.multipleChoiceQuestions,
        isArray: Array.isArray(quizData?.multipleChoiceQuestions),
        length: quizData?.multipleChoiceQuestions?.length || 0,
        sample: quizData?.multipleChoiceQuestions?.[0]
      },
      trueFalseQuestions: {
        exists: !!quizData?.trueFalseQuestions,
        isArray: Array.isArray(quizData?.trueFalseQuestions),
        length: quizData?.trueFalseQuestions?.length || 0,
        sample: quizData?.trueFalseQuestions?.[0]
      },
      rawData: quizData
    });
  }
}

// Create a singleton instance
const quizService = new QuizService();

// Export the service instance as default
export default quizService;

// Named exports for direct function access
export const {
  getAllQuizzes,
  getQuizById,
  getQuizzesByLessonId,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizWithQuestions,
  validateQuizData,
  debugQuizStructure
} = quizService;

// Export the service class for testing
export { QuizService };
