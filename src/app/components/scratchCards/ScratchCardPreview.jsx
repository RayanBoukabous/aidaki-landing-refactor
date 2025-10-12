'use client'

import { useState } from 'react';
import { useScratchCards } from '../../hooks/useScratchCards';

const ScratchCardPreview = ({ publicKey: initialPublicKey }) => {
  const [publicKey, setPublicKey] = useState(initialPublicKey || '');
  const [previewData, setPreviewData] = useState(null);
  
  const {
    previewCard,
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

    const result = await previewCard(publicKey);
    if (result) {
      setPreviewData(result);
    }
  };

  const handleReset = () => {
    setPublicKey('');
    setPreviewData(null);
    clearError();
  };

  const validation = validatePublicKey(publicKey);

  if (previewData) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Aperçu de la carte à gratter</h2>
            {previewData.isValid ? (
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Carte valide
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Carte invalide
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {previewData.isValid ? (
            <div className="space-y-6">
              {/* Plan Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">{previewData.planInfo.name}</h3>
                    <p className="text-blue-700 mt-1">{previewData.planInfo.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">{previewData.planInfo.price}€</div>
                    <div className="text-sm text-blue-600">{previewData.planInfo.billingCycle}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-900">{previewData.planInfo.durationInDays}</div>
                    <div className="text-xs text-blue-600">Jours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-900">Tier {previewData.planInfo.planTier}</div>
                    <div className="text-xs text-blue-600">Niveau</div>
                  </div>
                  {previewData.planInfo.details?.maxCourses && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-900">{previewData.planInfo.details.maxCourses}</div>
                      <div className="text-xs text-blue-600">Cours max</div>
                    </div>
                  )}
                  {previewData.planInfo.details?.supportLevel && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-900 capitalize">{previewData.planInfo.details.supportLevel}</div>
                      <div className="text-xs text-blue-600">Support</div>
                    </div>
                  )}
                </div>
                
                {previewData.planInfo.features && previewData.planInfo.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Fonctionnalités incluses:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {previewData.planInfo.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-blue-700">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Status */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  État de la carte
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-lg font-semibold ${
                      canRedeem(previewData.cardInfo) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {canRedeem(previewData.cardInfo) ? 'Oui' : 'Non'}
                    </div>
                    <div className="text-xs text-gray-600">Rachetable</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{previewData.cardInfo.remainingRedemptions}</div>
                    <div className="text-xs text-gray-600">Rachats restants</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-lg font-semibold ${
                      previewData.cardInfo.status === 'ACTIVATED' ? 'text-green-600' :
                      previewData.cardInfo.status === 'REDEEMED' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {getCardStatusText(previewData.cardInfo.status)}
                    </div>
                    <div className="text-xs text-gray-600">Statut</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-lg font-semibold ${
                      previewData.cardInfo.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {previewData.cardInfo.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs text-gray-600">État</div>
                  </div>
                </div>
                
                {previewData.cardInfo.expiresAt && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-800">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">
                        Expire le: {formatExpirationDate(previewData.cardInfo.expiresAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              {canRedeem(previewData.cardInfo) && (
                <div className="text-center">
                  <div className="inline-flex items-center px-6 py-3 bg-green-100 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 font-medium">Cette carte peut être rachetée!</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.351 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Carte non trouvée ou inactive</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {previewData.message || 'Cette carte n\'existe pas ou n\'est plus active. Vérifiez votre clé publique.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Prévisualiser une autre carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Aperçu de la carte</h2>
        <p className="text-gray-600 mt-2">Entrez la clé publique pour prévisualiser la carte</p>
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
          {loading ? 'Chargement...' : 'Prévisualiser la carte'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Format attendu: SK_suivi de caractères alphanumériques</p>
      </div>
    </div>
  );
};

export default ScratchCardPreview;
