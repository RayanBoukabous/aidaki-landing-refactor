'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, ArrowRight, BookOpen, Play, CheckCircle, 
  Clock, Target, Award, Volume2, VolumeX, RotateCcw,
  FileText, Download, Bookmark, MessageCircle
} from 'lucide-react'
import LessonChatbot from  "../../../../../components/lesson/LessonChatbot"
/* import { LessonStudyTracker } from '../../../../components/progress/StudySessionComponents'
*/
export default function LessonPage() {
  const params = useParams()
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  // Mock data - in real app, fetch from API
  const mockData = {
    course: {
      id: 1,
      title: 'Les fractions et décimaux',
      subject: 'Mathématiques',
      totalLessons: 12
    },
    lessons: {
      1: {
        id: 1,
        title: 'Qu\'est-ce qu\'une fraction ?',
        duration: '8 min',
        type: 'video',
        description: 'Découvre les bases des fractions avec des exemples simples et concrets.',
        videoUrl: '/videos/lesson-1.mp4',
        content: `
          <h2>Introduction aux fractions</h2>
          <p>Une fraction est un nombre qui représente une partie d'un tout. Par exemple, si tu coupes une pizza en 8 parts égales et que tu en prends 3 parts, tu as mangé 3/8 de la pizza.</p>
          
          <h3>Les composants d'une fraction</h3>
          <ul>
            <li><strong>Le numérateur</strong> : le nombre du haut (3 dans 3/8)</li>
            <li><strong>Le dénominateur</strong> : le nombre du bas (8 dans 3/8)</li>
            <li><strong>La barre de fraction</strong> : la ligne qui sépare les deux nombres</li>
          </ul>

          <h3>Exemples pratiques</h3>
          <p>Imaginons différentes situations où tu utilises des fractions :</p>
          <ul>
            <li>🍰 Tu partages un gâteau en 6 parts et tu en prends 2 : tu as 2/6 du gâteau</li>
            <li>⏰ Une demi-heure représente 1/2 heure, soit 30 minutes</li>
            <li>🧮 Sur 10 exercices de maths, si tu en réussis 7, tu as réussi 7/10</li>
          </ul>

          <div class="bg-blue-50 p-4 rounded-lg my-4">
            <h4>💡 Astuce</h4>
            <p>Pour mieux comprendre les fractions, pense toujours à des objets concrets : pizzas, chocolat, parts de gâteau, etc.</p>
          </div>
        `,
        transcript: `
Bonjour ! Aujourd'hui, nous allons découvrir ce qu'est une fraction.

Imagine que tu as une pizza délicieuse devant toi. Cette pizza entière représente le nombre 1. Mais si tu la coupes en 8 parts égales, chaque part représente 1/8 de la pizza.

Le nombre du haut, appelé numérateur, nous dit combien de parts nous avons pris. Le nombre du bas, appelé dénominateur, nous dit en combien de parts égales l'objet entier a été divisé.

Prenons d'autres exemples : si tu as un chocolat de 12 carrés et que tu en manges 5, tu as mangé 5/12 du chocolat. Simple, non ?

Les fractions sont partout dans notre vie quotidienne. Quand tu dis "j'ai fait la moitié de mes devoirs", tu parles de la fraction 1/2 !
        `,
        exercises: [
          {
            question: "Si une pizza est coupée en 6 parts et que tu en manges 2, quelle fraction as-tu mangée ?",
            options: ["1/6", "2/6", "2/4", "6/2"],
            correct: 1
          },
          {
            question: "Dans la fraction 3/7, quel est le dénominateur ?",
            options: ["3", "7", "3 et 7", "10"],
            correct: 1
          }
        ],
        nextLesson: 2,
        prevLesson: null
      },
      2: {
        id: 2,
        title: 'Les parties d\'une fraction',
        duration: '6 min',
        type: 'video',
        prevLesson: 1,
        nextLesson: 3
      }
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const courseId = parseInt(params.id)
      const lessonId = parseInt(params.lessonId)
      
      setCourse(mockData.course)
      setLesson(mockData.lessons[lessonId] || null)
      setLoading(false)
    }, 500)
  }, [params.id, params.lessonId])

  const handleVideoProgress = (progress) => {
    setVideoProgress(progress)
  }

  const handleVideoInteraction = (action) => {
    console.log('Video interaction:', action)
  }

  const handleLessonComplete = () => {
    // Mark lesson as complete and redirect to next lesson
    if (lesson.nextLesson) {
      window.location.href = `/courses/${params.id}/lesson/${lesson.nextLesson}`
    } else {
      window.location.href = `/courses/${params.id}`
    }
  }

  const toggleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la leçon...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Leçon introuvable</h2>
          <p className="text-gray-600 mb-6">Cette leçon n'existe pas ou n'est plus disponible.</p>
          <Link href={`/courses/${params.id}`} className="btn-primary">
            Retour au cours
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href={`/courses/${params.id}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au cours</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <div className="text-sm text-gray-500">
              Leçon {lesson.id} sur {course.totalLessons}
            </div>
          </div>
        </div>

        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {lesson.type === 'video' && <Play className="w-5 h-5 text-blue-500" />}
                {lesson.type === 'exercise' && <Target className="w-5 h-5 text-green-500" />}
                {lesson.type === 'quiz' && <CheckCircle className="w-5 h-5 text-purple-500" />}
                <span className="text-sm text-gray-500 capitalize">{lesson.type}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">{lesson.duration}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-600">{lesson.description}</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {lesson.type === 'video' && (
          <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
            <div className="relative bg-gray-900 aspect-video">
              {/* Video Player Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-lg mb-4">Lecteur vidéo</p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => {
                        setVideoPlaying(!videoPlaying)
                        handleVideoInteraction(videoPlaying ? 'pause' : 'play')
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      {videoPlaying ? (
                        <>
                          <div className="w-4 h-4 bg-white"></div>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Lecture</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setVideoProgress(0)
                        handleVideoInteraction('restart')
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">{Math.round(videoProgress)}%</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => {
                      // Simulate progress increase
                      const newProgress = Math.min(videoProgress + 10, 100)
                      setVideoProgress(newProgress)
                      handleVideoProgress(newProgress)
                    }}
                    className="text-white text-sm hover:text-blue-300"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      showTranscript 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Transcription</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-white text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <VolumeX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transcript */}
              {showTranscript && lesson.transcript && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Transcription</h4>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {lesson.transcript}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* Exercises */}
        {lesson.exercises && lesson.exercises.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Exercices pratiques</h3>
            <div className="space-y-6">
              {lesson.exercises.map((exercise, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Question {index + 1}: {exercise.question}
                  </h4>
                  <div className="space-y-2">
                    {exercise.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name={`question-${index}`} 
                          value={optionIndex}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {lesson.prevLesson && (
              <Link href={`/courses/${params.id}/lesson/${lesson.prevLesson}`}>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Leçon précédente</span>
                </button>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLessonComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Marquer comme terminée</span>
            </button>

            {lesson.nextLesson && (
              <Link href={`/courses/${params.id}/lesson/${lesson.nextLesson}`}>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                  <span>Leçon suivante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Chatbot - Fixed position floating chat */}
      <LessonChatbot 
        lessonId={params.lessonId} 
        lessonTitle={lesson?.title}
      />
    </div>
  )
}
