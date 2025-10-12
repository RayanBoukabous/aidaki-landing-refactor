'use client'

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

// Types
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Actions
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};

// Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] });

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Component
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem = ({ notification, onRemove }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTitleColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const getMessageColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-3 shadow-lg transform transition-all duration-300 ease-in-out ${getBackgroundColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${getTitleColor()}`}>
            {notification.title}
          </h4>
          {notification.message && (
            <p className={`text-sm mt-1 ${getMessageColor()}`}>
              {notification.message}
            </p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm font-medium underline mt-2 hover:no-underline transition-all"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Notification Container
export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// Quiz-specific notification helpers
export const useQuizNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyQuizStarted = (quizTitle: string) => {
    addNotification({
      type: 'info',
      title: 'Quiz démarré',
      message: `Vous avez commencé le quiz: ${quizTitle}`,
      duration: 3000
    });
  };

  const notifyQuizCompleted = (score: number, quizTitle: string) => {
    const type = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error';
    const title = score >= 80 ? 'Excellent travail!' : score >= 60 ? 'Bon travail!' : 'Continuez vos efforts';
    
    addNotification({
      type,
      title,
      message: `Quiz "${quizTitle}" terminé avec un score de ${score}%`,
      duration: 8000
    });
  };

  const notifyQuizSaved = () => {
    addNotification({
      type: 'success',
      title: 'Progression sauvegardée',
      message: 'Vos réponses ont été enregistrées avec succès',
      duration: 3000
    });
  };

  const notifyQuizError = (error: string) => {
    addNotification({
      type: 'error',
      title: 'Erreur du quiz',
      message: error,
      duration: 6000
    });
  };

  const notifyTimeWarning = (timeLeft: number) => {
    addNotification({
      type: 'warning',
      title: 'Attention au temps',
      message: `Il vous reste ${timeLeft} secondes pour terminer le quiz`,
      duration: 4000
    });
  };

  const notifyAnswerSubmitted = (questionNumber: number, isCorrect: boolean) => {
    addNotification({
      type: isCorrect ? 'success' : 'error',
      title: `Question ${questionNumber}`,
      message: isCorrect ? 'Réponse correcte!' : 'Réponse incorrecte',
      duration: 2000
    });
  };

  const notifyConnectionError = () => {
    addNotification({
      type: 'error',
      title: 'Problème de connexion',
      message: 'Vérifiez votre connexion internet et réessayez',
      duration: 6000,
      action: {
        label: 'Réessayer',
        onClick: () => window.location.reload()
      }
    });
  };

  const notifyDataSyncError = () => {
    addNotification({
      type: 'warning',
      title: 'Synchronisation échouée',
      message: 'Vos données seront synchronisées dès que la connexion sera rétablie',
      duration: 5000
    });
  };

  const notifyQuizResumed = () => {
    addNotification({
      type: 'info',
      title: 'Quiz repris',
      message: 'Vous avez repris votre quiz là où vous vous étiez arrêté',
      duration: 3000
    });
  };

  const notifyAchievementUnlocked = (achievement: string) => {
    addNotification({
      type: 'success',
      title: '🏆 Succès débloqué!',
      message: achievement,
      duration: 6000
    });
  };

  return {
    notifyQuizStarted,
    notifyQuizCompleted,
    notifyQuizSaved,
    notifyQuizError,
    notifyTimeWarning,
    notifyAnswerSubmitted,
    notifyConnectionError,
    notifyDataSyncError,
    notifyQuizResumed,
    notifyAchievementUnlocked
  };
};

// Error boundary for quiz components
export class QuizErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Quiz Error:', error, errorInfo);
    
    // You could send this to an error reporting service
    // reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Oops! Une erreur s'est produite
          </h2>
          <p className="text-red-700 mb-4">
            Le quiz a rencontré un problème inattendu. Veuillez rafraîchir la page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Rafraîchir la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
