'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Play, Clock, Star, Users, ArrowLeft, Filter, Search } from 'lucide-react'

export default function CoursesPage() {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const subjects = [
    { id: 'all', name: 'Toutes les filières', icon: '📚' },
    { id: 'math', name: 'Mathématiques', icon: '🔢' },
    { id: 'french', name: 'Français', icon: '📝' },
    { id: 'science', name: 'Sciences', icon: '🔬' },
    { id: 'history', name: 'Histoire', icon: '🏛️' },
    { id: 'geography', name: 'Géographie', icon: '🌍' },
    { id: 'english', name: 'Anglais', icon: '🇬🇧' },
  ]

  const levels = [
    { id: 'all', name: 'Tous niveaux' },
    { id: 'primary', name: 'Primaire' },
    { id: 'middle', name: 'Collège' },
    { id: 'high', name: 'Lycée' },
  ]

  const courses = [
    {
      id: 1,
      title: 'Les fractions et décimaux',
      subject: 'math',
      level: 'primary',
      description: 'Apprends les bases des fractions et des nombres décimaux avec des exercices ludiques',
      duration: '45 min',
      lessons: 12,
      difficulty: 'Facile',
      rating: 4.8,
      enrolled: 234,
      progress: 60,
      thumbnail: '🔢',
      color: 'bg-blue-100',
    },
    {
      id: 2,
      title: 'La photosynthèse',
      subject: 'science',
      level: 'middle',
      description: 'Découvre comment les plantes fabriquent leur nourriture grâce à la lumière du soleil',
      duration: '30 min',
      lessons: 8,
      difficulty: 'Moyen',
      rating: 4.9,
      enrolled: 189,
      progress: 100,
      thumbnail: '🌱',
      color: 'bg-green-100',
    },
    {
      id: 3,
      title: 'L\'accord du participe passé',
      subject: 'french',
      level: 'middle',
      description: 'Maîtrise les règles d\'accord du participe passé avec des exemples concrets',
      duration: '25 min',
      lessons: 6,
      difficulty: 'Moyen',
      rating: 4.6,
      enrolled: 156,
      progress: 25,
      thumbnail: '📝',
      color: 'bg-purple-100',
    },
    {
      id: 4,
      title: 'La Révolution française',
      subject: 'history',
      level: 'high',
      description: 'Plonge dans l\'histoire de la Révolution française et ses conséquences',
      duration: '50 min',
      lessons: 15,
      difficulty: 'Difficile',
      rating: 4.7,
      enrolled: 98,
      progress: 0,
      thumbnail: '🏛️',
      color: 'bg-yellow-100',
    },
    {
      id: 5,
      title: 'Les continents et océans',
      subject: 'geography',
      level: 'primary',
      description: 'Explore le monde et apprends à localiser les continents et océans',
      duration: '35 min',
      lessons: 10,
      difficulty: 'Facile',
      rating: 4.5,
      enrolled: 267,
      progress: 80,
      thumbnail: '🌍',
      color: 'bg-indigo-100',
    },
    {
      id: 6,
      title: 'Present Simple & Present Continuous',
      subject: 'english',
      level: 'middle',
      description: 'Learn the difference between present simple and present continuous tenses',
      duration: '40 min',
      lessons: 9,
      difficulty: 'Moyen',
      rating: 4.4,
      enrolled: 145,
      progress: 40,
      thumbnail: '🇬🇧',
      color: 'bg-red-100',
    },
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSubject && matchesLevel && matchesSearch
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-700'
      case 'Moyen': return 'bg-yellow-100 text-yellow-700'
      case 'Difficile': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-200'
    if (progress < 50) return 'bg-yellow-500'
    if (progress < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 mr-6">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Mes Cours</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Découvre tes cours</h2>
          <p className="text-gray-600 text-lg">
            Choisis un cours et commence ton apprentissage dès maintenant !
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="card-hover group">
              {/* Course Thumbnail */}
              <div className={`${course.color} p-8 text-center relative overflow-hidden`}>
                <div className="text-6xl mb-4 group-hover:animate-bounce-gentle">
                  {course.thumbnail}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                {course.progress > 0 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white bg-opacity-80 rounded-full p-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                {/* Course Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.lessons} leçons
                    </span>
                  </div>
                </div>

                {/* Rating and Enrollment */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {course.enrolled} élèves
                  </div>
                </div>

                {/* Progress Status */}
                {course.progress > 0 ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progrès</span>
                      <span className="text-sm font-medium text-green-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : null}

                {/* Action Button */}
                <Link href={`/courses/${course.id}`}>
                  <button className="w-full btn-primary flex items-center justify-center group-hover:bg-green-600">
                    <Play className="w-4 h-4 mr-2" />
                    {course.progress > 0 ? 'Continuer' : 'Commencer'}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-600 mb-6">Essaie de modifier tes filtres ou ta recherche</p>
            <button 
              onClick={() => {
                setSelectedSubject('all')
                setSelectedLevel('all')
                setSearchTerm('')
              }}
              className="btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  )
}