'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../services/auth';
import { useYearOfStudy } from '../hooks/useYearOfStudy';
import { useSpecializations } from '../hooks/useSpecializations';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedYearOfStudy, setSelectedYearOfStudy] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Use hooks for years and specializations
  const {
    yearsOfStudy,
    loading: yearsLoading,
    fetchYearsOfStudy
  } = useYearOfStudy();

  const {
    specializations,
    loading: specializationsLoading,
    fetchSpecializations
  } = useSpecializations();

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Charger les données au démarrage
    fetchYearsOfStudy();
    fetchSpecializations();
  }, [router, fetchYearsOfStudy, fetchSpecializations]);

  // Get specializations for selected year
  const getSpecializationsForYear = (yearId) => {
    return specializations?.filter(spec => spec.yearOfStudyId === yearId) || [];
  };

  const handleYearSelect = (yearId) => {
    setSelectedYearOfStudy(yearId);
    setSelectedSpecialization('');
    setCurrentStep(2);
  };

  const handleSpecializationSelect = (specializationId) => {
    setSelectedSpecialization(specializationId);
    // Just set the specialization, don't auto-complete
  };

  const handleComplete = (specializationId = selectedSpecialization) => {
    // Save user preferences (you can implement API call here)
    console.log('Onboarding completed:', {
      yearOfStudy: selectedYearOfStudy,
      specialization: specializationId
    });
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / 2) * 100;
  const loading = yearsLoading || specializationsLoading;

  // Get data for current step
  const availableSpecializations = selectedYearOfStudy ? getSpecializationsForYear(parseInt(selectedYearOfStudy)) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Bienvenue sur <span className="text-green-600">AIDAKI</span>
          </h1>
          <p className="text-slate-600 mb-6">Personnalisons ton expérience d'apprentissage</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500">Étape {currentStep} sur 2</p>
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Step 1: Year of Study Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Quel est ton niveau scolaire ?
              </h2>
              <p className="text-slate-600">
                Sélectionne ton niveau actuel pour personnaliser tes cours
              </p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chargement...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {yearsOfStudy?.map((year) => (
                  <button
                    key={year.id}
                    onClick={() => handleYearSelect(year.id)}
                    className="p-6 border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <div className="text-lg font-medium text-slate-800">
                      {year.title}
                    </div>
                    {year.description && (
                      <div className="text-sm text-slate-600 mt-1">
                        {year.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Specialization Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Choisis ta spécialisation
              </h2>
              <p className="text-slate-600">
                Sélectionne le domaine qui t'intéresse le plus pour commencer ton apprentissage
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSpecializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleSpecializationSelect(spec.id)}
                  className={`p-6 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-left ${
                    selectedSpecialization === spec.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="text-lg font-medium text-slate-800 mb-2">
                    {spec.title}
                  </div>
                  {spec.description && (
                    <div className="text-sm text-slate-600 mb-3">
                      {spec.description}
                    </div>
                  )}
                  <div className="text-sm text-green-600 font-medium">
                    {spec.studyModules?.length || 0} module{(spec.studyModules?.length || 0) > 1 ? 's' : ''} disponible{(spec.studyModules?.length || 0) > 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>

            {availableSpecializations.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Aucune spécialisation disponible pour ce niveau pour le moment.
              </div>
            )}
            
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Précédent
              </button>
              
              {selectedSpecialization && (
                <button
                  onClick={() => handleComplete()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Terminer l'inscription
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}