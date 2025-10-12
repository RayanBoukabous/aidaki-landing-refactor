'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  BookOpen, Play, Clock, Star, Users, ArrowLeft, CheckCircle, 
  Circle, Award, Target, Calendar, Download, Lock 
} from 'lucide-react'
import { useUsersService } from '../services/users'

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const { getCurrentUserInfo } = useUsersService()

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserInfo()
        setUser(userInfo)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
    fetchUserInfo()
  }, [])

  // Mock course data - in real app, fetch from API
  const courseData = {
    1: {
      id: 1,
      title: 'Les fractions et décimaux',
      subject: 'Mathématiques',
      level: 'Primaire',
      description: 'Apprends les bases des fractions et des nombres décimaux avec des exercices ludiques et des exemples concrets tirés de la vie quotidienne.',
      longDescription: 'Ce cours complet te permettra de maîtriser les fractions et les nombres décimaux. Tu découvriras comment les utiliser dans des situations réelles comme partager une pizza, calculer des distances ou comprendre les prix. Avec des exercices interactifs et des jeux, l\'apprentissage devient amusant !',
      duration: '45 min',
      totalLessons: 12,
      completedLessons: 7,
      difficulty: 'Facile',
      rating: 4.8,
      enrolled: 234,
      progress: 60,
      thumbnail: '🔢',
      color: 'bg-blue-100',
      instructor: 'Mme. Dubois',
      objectives: [
        'Comprendre ce qu\'est une fraction',
        'Savoir convertir les fractions en décimaux',
        'Comparer et ordonner les fractions',
        'Résoudre des problèmes avec les décimaux',
        'Appliquer les fractions dans la vie quotidienne'
      ],
      lessons: [
        {
          id: 1,
          title: 'Qu\'est-ce qu\'une fraction ?',
          duration: '8 min',
          completed: true,
          type: 'video'
        },
        {
          id: 2,
          title: 'Les parties d\'une fraction',
          duration: '6 min',
          completed: true,
          type: 'video'
        },
        {
          id: 3,
          title: 'Exercices : Identifier les fractions',
          duration: '10 min',
          completed: true,
          type: 'exercise'
        },
        {
          id: 4,
          title: 'Fractions équivalentes',
          duration: '12 min',
          completed: true,
          type: 'video'
        },
        {
          id: 5,
          title: 'Quiz : Fractions équivalentes',
          duration: '5 min',
          completed: true,
          type: 'quiz'
        },
        {
          id: 6,
          title: 'Conversion fractions vers décimaux',
          duration: '15 min',
          completed: true,
          type: 'video'
        },
        {
          id: 7,
          title: 'Exercices pratiques',
          duration: '20 min',
          completed: true,
          type: 'exercise'
        },
        {
          id: 8,
          title: 'Comparer les fractions',
          duration: '10 min',
          completed: false,
          type: 'video'
        },
        {
          id: 9,
          title: 'Ordonner les nombres décimaux',
          duration: '8 min',
          completed: false,
          type: 'video'
        },
        {
          id: 10,
          title: 'Problèmes de la vie quotidienne',
          duration: '18 min',
          completed: false,
          type: 'exercise'
        },
        {
          id: 11,
          title: 'Quiz final',
          duration: '12 min',
          completed: false,
          type: 'quiz'
        },
        {
          id: 12,
          title: 'Projet : Ma recette en fractions',
          duration: '25 min',
          completed: false,
          type: 'project'
        }
      ]
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const courseId = parseInt(params.id)
      setCourse(courseData[courseId] || null)
      setLoading(false)
    }, 500)
  }, [params.id])

  const getLessonIcon = (type, completed) => {
    const iconClass = completed ? 'text-green-500' : 'text-gray-400'
    
    switch (type) {
      case 'video':
        return <Play className={`w-5 h-5 ${iconClass}`} />
      case 'exercise':
        return <Target className={`w-5 h-5 ${iconClass}`} />
      case 'quiz':
        return <CheckCircle className={`w-5 h-5 ${iconClass}`} />
      case 'project':
        return <Award className={`w-5 h-5 ${iconClass}`} />
      default:
        return <BookOpen className={`w-5 h-5 ${iconClass}`} />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Vidéo'
      case 'exercise': return 'Exercice'
      case 'quiz': return 'Quiz'
      case 'project': return 'Projet'
      default: return 'Leçon'
    }
  }

  const getNextLesson = () => {
    if (!course) return null
    return course.lessons.find(lesson => !lesson.completed)
  }

  // Check if lesson is accessible based on subscription
  const isLessonAccessible = (lesson) => {
    // If user has active subscription, all lessons are accessible
    if (user?.hasActiveSubscription) {
      return true
    }
    // If no active subscription, only the first lesson is accessible
    return lesson.id === 1
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cours introuvable</h2>
          <p className="text-gray-600 mb-6">Ce cours n'existe pas ou n'est plus disponible.</p>
          <Link href="/courses" className="btn-primary">
            Retour aux cours
          </Link>
        </div>
      </div>
    )
  }

  const nextLesson = getNextLesson()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/courses" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 mr-6">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour aux cours</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{course.thumbnail}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">{course.subject} • {course.level}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Hero */}
            <div className="card overflow-hidden">
              <div className={`${course.color} p-8 text-center relative`}>
                <div className="text-8xl mb-4 animate-bounce-gentle">
                  {course.thumbnail}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {course.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-1" />
                      <span>{course.enrolled} élèves</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression du cours</span>
                    <span className="text-sm font-medium text-green-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completedLessons} sur {course.totalLessons} leçons terminées
                  </p>
                </div>

                {nextLesson ? (
                  isLessonAccessible(nextLesson) ? (
                    <Link href={`/courses/${course.id}/lesson/${nextLesson.id}`}>
                      <button className="w-full btn-primary text-lg py-3">
                        <Play className="w-5 h-5 mr-2" />
                        {course.progress > 0 ? 'Continuer la leçon suivante' : 'Commencer le cours'}
                      </button>
                    </Link>
                  ) : (
                    <button className="w-full btn-secondary text-lg py-3 opacity-50 cursor-not-allowed" disabled>
                      <Lock className="w-5 h-5 mr-2" />
                      Abonnement requis
                    </button>
                  )
                ) : (
                  <button className="w-full btn-secondary text-lg py-3" disabled>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Cours terminé !
                  </button>
                )}
              </div>
            </div>

            {/* Course Description */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">À propos de ce cours</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{course.longDescription}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Ce que tu vas apprendre :</h4>
                <ul className="space-y-2">
                  {course.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>Enseigné par {course.instructor}</span>
              </div>
            </div>

            {/* Lessons List */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contenu du cours</h3>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => {
                  const isAccessible = isLessonAccessible(lesson)
                  
                  return (
                    <div 
                      key={lesson.id} 
                      className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                        lesson.completed 
                          ? 'bg-green-50 border-green-200' 
                          : isAccessible 
                            ? 'bg-gray-50 border-gray-200 hover:border-green-300'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            lesson.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          {getLessonIcon(lesson.type, lesson.completed)}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-medium ${lesson.completed ? 'text-green-900' : 'text-gray-900'}`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span>{getTypeLabel(lesson.type)}</span>
                            <span>•</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {lesson.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : isAccessible ? (
                          <Link href={`/courses/${course.id}/lesson/${lesson.id}`}>
                            <button className="btn-secondary px-4 py-2 text-sm">
                              {lesson.id === nextLesson?.id ? 'Suivant' : 'Jouer'}
                            </button>
                          </Link>
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tes progrès</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-1">{course.progress}%</div>
                <p className="text-gray-600 text-sm">Terminé</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Leçons terminées</span>
                  <span className="font-medium">{course.completedLessons}/{course.totalLessons}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Temps estimé restant</span>
                  <span className="font-medium">25 min</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Dernière activité</span>
                  <span className="font-medium">Hier</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger les ressources
                </button>
                <button className="w-full btn-secondary justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Programmer une session
                </button>
                <button className="w-full btn-secondary justify-center">
                  <Award className="w-4 h-4 mr-2" />
                  Voir mes badges
                </button>
              </div>
            </div>

            {/* Encouragement */}
            <div className="card p-6 bg-gradient-green text-white">
              <h3 className="font-bold mb-2">Continue comme ça ! 🎉</h3>
              <p className="text-green-100 text-sm mb-4">
                Tu es à {100 - course.progress}% de terminer ce cours. Encore quelques leçons et tu auras maîtrisé les fractions !
              </p>
              <div className="bg-green-400 rounded-full p-2 text-center">
                <span className="text-sm font-medium">Motivation: Excellent !</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}