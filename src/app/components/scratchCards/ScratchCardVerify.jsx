'use client'

import { useState } from 'react';
import { useScratchCards } from '../../hooks/useScratchCards';

const ScratchCardVerify = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  const {
    verifyCard,
    cardData,
    loading,
    error,
    validateKeys,
    getCardStatusText,
    formatExpirationDate,
    clearError
  } = useScratchCards();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await verifyCard(publicKey, privateKey);
    if (result) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setPublicKey('');
    setPrivateKey('');
    setShowResult(false);
    clearError();
  };

  const validation = validateKeys(publicKey, privateKey);

  if (showResult && cardData) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Carte vérifiée avec succès</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Informations de la carte</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium">{cardData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clé publique:</span>
                <span className="font-medium text-xs">{cardData.publicKey}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className={`font-medium ${
                  cardData.status === 'ACTIVATED' ? 'text-green-600' :
                  cardData.status === 'REDEEMED' ? 'text-blue-600' :
                  cardData.status === 'EXPIRED' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {getCardStatusText(cardData.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée (jours):</span>
                <span className="font-medium">{cardData.durationInDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rachats max:</span>
                <span className="font-medium">{cardData.maxRedemptions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rachats actuels:</span>
                <span className="font-medium">{cardData.currentRedemptions}</span>
              </div>
            </div>
          </div>

          {/* Dates Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Dates importantes</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Créée le:</span>
                <span className="font-medium">{new Date(cardData.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              {cardData.activatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Activée le:</span>
                  <span className="font-medium">{new Date(cardData.activatedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {cardData.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Expire le:</span>
                  <span className="font-medium">{formatExpirationDate(cardData.expiresAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Plan ID:</span>
                <span className="font-medium">{cardData.planId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Batch ID:</span>
                <span className="font-medium">{cardData.batchId}</span>
              </div>
            </div>
          </div>
        </div>
        
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
        <h2 className="text-xl font-bold text-gray-900">Vérifier une carte à gratter</h2>
        <p className="text-gray-600 mt-2">Entrez vos clés pour vérifier le statut de votre carte</p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700 mb-1">
            Clé privée
          </label>
          <input
            type="text"
            id="privateKey"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="PK_123456abcdef"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {!validation.isValid && (publicKey || privateKey) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <ul className="text-red-700 text-sm space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Vérification en cours...' : 'Vérifier la carte'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Format clé publique: SK_... | Format clé privée: PK_...</p>
      </div>
    </div>
  );
};

export default ScratchCardVerify;