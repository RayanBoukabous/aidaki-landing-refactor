'use client'

import { useState } from 'react';
import { useScratchCards } from '../../hooks/useScratchCards';

const ScratchCardRedeem = ({ onRedeemSuccess }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  const {
    redeemCard,
    redemptionResult,
    loading,
    error,
    validatePrivateKey,
    clearError
  } = useScratchCards();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate private key
    const validation = validatePrivateKey(privateKey);
    if (!validation.isValid) {
      return;
    }

    const result = await redeemCard(privateKey);
    if (result) {
      setShowResult(true);
      if (onRedeemSuccess) {
        onRedeemSuccess(result);
      }
    }
  };

  const handleReset = () => {
    setPrivateKey('');
    setShowResult(false);
    clearError();
  };

  const validation = validatePrivateKey(privateKey);

  if (showResult && redemptionResult) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Carte rachetée avec succès!</h2>
          <p className="text-gray-600 mb-6">Votre carte à gratter a été validée.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Détails de la rédemption:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">ID:</span> {redemptionResult.id}</p>
              <p><span className="font-medium">Carte ID:</span> {redemptionResult.cardId}</p>
              <p><span className="font-medium">Utilisateur ID:</span> {redemptionResult.userId}</p>
              <p><span className="font-medium">Abonnement ID:</span> {redemptionResult.subscriptionId}</p>
              <p><span className="font-medium">Racheté le:</span> {new Date(redemptionResult.redeemedAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Racheter une autre carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Racheter une carte à gratter</h2>
        <p className="text-gray-600 mt-2">Entrez votre clé privée pour racheter votre carte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              privateKey && !validation.isValid ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {privateKey && !validation.isValid && (
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
          disabled={loading || !validation.isValid || !privateKey}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Rachat en cours...' : 'Racheter la carte'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Format attendu: PK_suivi de caractères alphanumériques</p>
      </div>
    </div>
  );
};

export default ScratchCardRedeem;