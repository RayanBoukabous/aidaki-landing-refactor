'use client'

import { useState } from 'react';
import ScratchCardRedeem from './ScratchCardRedeem';
import ScratchCardVerify from './ScratchCardVerify';
import ScratchCardPlanInfo from './ScratchCardPlanInfo';
import ScratchCardPreview from './ScratchCardPreview';

const ScratchCardManager = () => {
  const [activeTab, setActiveTab] = useState('redeem');
  const [notifications, setNotifications] = useState([]);

  const tabs = [
    { id: 'redeem', label: 'Racheter', icon: '🎫' },
    { id: 'verify', label: 'Vérifier', icon: '🔍' },
    { id: 'plan-info', label: 'Infos Plan', icon: '📋' },
    { id: 'preview', label: 'Aperçu', icon: '👁️' }
  ];

  const addNotification = (message, type = 'success') => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRedeemSuccess = (result) => {
    addNotification(`Carte rachetée avec succès! Abonnement ID: ${result.subscriptionId}`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Cartes à Gratter</h1>
          <p className="text-gray-600">Rachetez, vérifiez et consultez vos cartes à gratter</p>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
                  notification.type === 'success' ? 'border-l-4 border-green-400' :
                  notification.type === 'error' ? 'border-l-4 border-red-400' :
                  'border-l-4 border-blue-400'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {notification.type === 'success' ? (
                        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : notification.type === 'error' ? (
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.351 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <span className="sr-only">Fermer</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'redeem' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Racheter une carte à gratter</h2>
                <p className="text-gray-600 mt-1">Utilisez votre clé privée pour racheter votre carte et activer votre abonnement</p>
              </div>
              <ScratchCardRedeem onRedeemSuccess={handleRedeemSuccess} />
            </div>
          )}

          {activeTab === 'verify' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Vérifier une carte à gratter</h2>
                <p className="text-gray-600 mt-1">Vérifiez le statut détaillé de votre carte avec vos clés publique et privée</p>
              </div>
              <ScratchCardVerify />
            </div>
          )}

          {activeTab === 'plan-info' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Informations du plan</h2>
                <p className="text-gray-600 mt-1">Consultez les détails du plan associé à votre carte</p>
              </div>
              <ScratchCardPlanInfo />
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Aperçu de la carte</h2>
                <p className="text-gray-600 mt-1">Prévisualisez les informations complètes de votre carte</p>
              </div>
              <ScratchCardPreview />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Toutes les communications avec l'API sont sécurisées</p>
          <p className="mt-1">Gardez vos clés privées confidentielles et ne les partagez jamais</p>
        </div>
      </div>
    </div>
  );
};

export default ScratchCardManager;