'use client'

import { useState, useEffect } from 'react';
import { useScratchCards } from '../../hooks/useScratchCards';

const ScratchCardPlanInfo = ({ publicKey: initialPublicKey }) => {
  const [publicKey, setPublicKey] = useState(initialPublicKey || '');
  const [planData, setPlanData] = useState(null);
  
  const {
    fetchPlanInfo,
    loading,
    error,
    validatePublicKey,
    canRedeem,
    getCardStatusText,
    formatExpirationDate,
    clearError
  } = useScratchCards();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate public key
    const validation = validatePublicKey(publicKey);
    if (!validation.isValid) {
      return;
    }

    const result = await fetchPlanInfo(publicKey);
    if (result) {
      setPlanData(result);
    }
  };

  // Auto-fetch if initial public key is provided
  useEffect(() => {
    if (initialPublicKey) {
      const validation = validatePublicKey(initialPublicKey);
      if (validation.isValid) {
        fetchPlanInfo(initialPublicKey).then(result => {
          if (result) {
            setPlanData(result);
          }
        });
      }
    }
  }, [initialPublicKey, fetchPlanInfo, validatePublicKey]);

  const handleReset = () => {
    setPublicKey('');
    setPlanData(null);
    clearError();
  };

  const validation = validatePublicKey(publicKey);

  if (planData) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Informations du plan</h2>
          {planData.isValid ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Carte valide
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mt-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Carte invalide
            </div>
          )}
        </div>

        {planData.isValid ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Détails du plan
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-blue-900">{planData.planInfo.name}</h4>
                  <p className="text-sm text-blue-700 mt-1">{planData.planInfo.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Durée:</span>
                    <p className="font-medium">{planData.planInfo.durationInDays} jours</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Prix:</span>
                    <p className="font-medium">{planData.planInfo.price}€</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Niveau:</span>
                    <p className="font-medium">Tier {planData.planInfo.planTier}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Cycle:</span>
                    <p className="font-medium">{planData.planInfo.billingCycle}</p>
                  </div>
                </div>
                {planData.planInfo.features && planData.planInfo.features.length > 0 && (
                  <div>
                    <span className="text-blue-600 text-sm">Fonctionnalités:</span>
                    <ul className="list-disc list-inside text-sm text-blue-700 mt-1 space-y-1">
                      {planData.planInfo.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {planData.planInfo.details && (
                  <div className="pt-2 border-t border-blue-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {planData.planInfo.details.maxCourses && (
                        <div>
                          <span className="text-blue-600">Cours max:</span>
                          <p className="font-medium">{planData.planInfo.details.maxCourses}</p>
                        </div>
                      )}
                      {planData.planInfo.details.supportLevel && (
                        <div>
                          <span className="text-blue-600">Support:</span>
                          <p className="font-medium capitalize">{planData.planInfo.details.supportLevel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                État de la carte
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Peut être rachetée:</span>
                  <span className={`font-medium ${
                    canRedeem(planData.cardInfo) ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {canRedeem(planData.cardInfo) ? 'Oui' : 'Non'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Rachats restants:</span>
                  <span className="font-medium">{planData.cardInfo.remainingRedemptions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Statut:</span>
                  <span className={`font-medium ${
                    planData.cardInfo.status === 'ACTIVATED' ? 'text-green-700' :
                    planData.cardInfo.status === 'REDEEMED' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {getCardStatusText(planData.cardInfo.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Active:</span>
                  <span className={`font-medium ${
                    planData.cardInfo.isActive ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {planData.cardInfo.isActive ? 'Oui' : 'Non'}
                  </span>
                </div>
                {planData.cardInfo.expiresAt && (
                  <div>
                    <span className="text-green-600 text-sm">Expire le:</span>
                    <p className="font-medium text-sm">{formatExpirationDate(planData.cardInfo.expiresAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.351 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Carte non trouvée ou inactive</h3>
            <p className="text-gray-600">{planData.message || 'Cette carte n\'existe pas ou n\'est plus active.'}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Vérifier une autre carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Informations du plan</h2>
        <p className="text-gray-600 mt-2">Entrez la clé publique pour voir les détails du plan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700 mb-1">
            Clé publique
          </label>
          <input
            type="text"
            id="publicKey"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="SK_abcdef123456"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              publicKey && !validation.isValid ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {publicKey && !validation.isValid && (
            <p className="text-red-500 text-sm mt-1">{validation.error}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !validation.isValid || !publicKey}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Chargement...' : 'Voir les informations'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Format attendu: SK_suivi de caractères alphanumériques</p>
      </div>
    </div>
  );
};

export default ScratchCardPlanInfo;
