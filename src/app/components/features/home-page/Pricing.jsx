"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Crown, Star, Zap, Users, Brain, Loader2, AlertCircle } from "lucide-react";
import { usePayment } from "@/app/hooks/usePayment";
import { usePlans } from "@/app/hooks/usePlans";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EnhancedPricingComponent() {
  const [viewMode, setViewMode] = useState("offers");
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale;

  const { loading: paymentLoading, error: paymentError, initiatePayment, clearError } = usePayment();
  const { plans: apiPlans, loading: plansLoading, error: plansError } = usePlans();

  const reorderFeatures = (features) => {
    const included = features.filter((f) => f.included);
    const notIncluded = features.filter((f) => !f.included);
    return [...included, ...notIncluded];
  };

  const getIcon = (name) => {
    const iconName = name?.toLowerCase() || '';
    if (iconName.includes('freemium')) return <Users className="w-6 h-6" />;
    if (iconName.includes('basic')) return <Brain className="w-6 h-6" />;
    if (iconName.includes('airium') && !iconName.includes('silver')) return <Zap className="w-6 h-6" />;
    if (iconName.includes('silver') || iconName.includes('gold')) return <Crown className="w-6 h-6" />;
    if (iconName.includes('bacculum') || iconName.includes('bacculium')) return <Star className="w-6 h-6" />;
    return <Users className="w-6 h-6" />;
  };

  const getPlanColor = (planTier) => {
    const colorMap = { 1: 'slate', 2: 'green', 3: 'purple', 4: 'gold', 5: 'green' };
    return colorMap[planTier] || 'slate';
  };

  const getHardcodedFeatures = (planName) => {
    const name = planName?.toLowerCase() || '';

    // Fonctionnalités traduites selon la langue
    const features = {
      fullLessons: t('pricing.hardcodedFeatures.freemium.fullLessons.text'),
      summaries: t('pricing.hardcodedFeatures.freemium.summaries.text'),
      audioLessons: t('pricing.hardcodedFeatures.freemium.audioLessons.text'),
      parentInterface: t('pricing.hardcodedFeatures.freemium.parentInterface.text'),
      educationalVideos: t('pricing.hardcodedFeatures.freemium.educationalVideos.text'),
      smartDashboard: t('pricing.hardcodedFeatures.freemium.smartDashboard.text'),
      interactiveTests: t('pricing.hardcodedFeatures.freemium.interactiveTests.text'),
      virtualAssistant: t('pricing.hardcodedFeatures.freemium.virtualAssistant.text')
    };

    // Ordre fixe des fonctionnalités pour tous les plans
    const allFeatures = [
      { key: 'fullLessons', text: features.fullLessons },
      { key: 'summaries', text: features.summaries },
      { key: 'audioLessons', text: features.audioLessons },
      { key: 'parentInterface', text: features.parentInterface },
      { key: 'educationalVideos', text: features.educationalVideos },
      { key: 'smartDashboard', text: features.smartDashboard },
      { key: 'interactiveTests', text: features.interactiveTests },
      { key: 'virtualAssistant', text: features.virtualAssistant }
    ];

    // Fonctionnalités hardcodées pour Freemium
    if (name.includes('freemium')) {
      return allFeatures.map(feature => ({
        text: feature.key === 'virtualAssistant' ? 'Chatbot (limité 10 questions)' : feature.text,
        included: true
      }));
    }

    // Fonctionnalités hardcodées pour Basicium
    if (name.includes('basic')) {
      return allFeatures.map(feature => ({
        text: feature.key === 'virtualAssistant' ? 'Chatbot' : feature.text,
        included: feature.key !== 'virtualAssistant'
      }));
    }

    // Fonctionnalités hardcodées pour Airium
    if (name.includes('airium') && !name.includes('silver')) {
      return allFeatures.map(feature => ({
        text: feature.key === 'virtualAssistant' ? 'Chatbot' : feature.text,
        included: true
      }));
    }

    // Fonctionnalités hardcodées pour Airium Silver
    if (name.includes('silver')) {
      return allFeatures.map(feature => ({
        text: feature.key === 'virtualAssistant' ? 'Chatbot (PLUS)' : feature.text,
        included: true
      }));
    }

    // Fonctionnalités hardcodées pour Bacculium
    if (name.includes('bacculum') || name.includes('bacculium')) {
      return allFeatures.map(feature => ({
        text: feature.key === 'virtualAssistant' ? 'Chatbot (illimité)' : feature.text,
        included: true
      }));
    }

    // Pour les autres plans, retourner un tableau vide pour l'instant
    return [];
  };

  const extractFeatures = (plan) => {
    // Prioriser les fonctionnalités hardcodées
    const hardcodedFeatures = getHardcodedFeatures(plan.name);
    if (hardcodedFeatures.length > 0) {
      return hardcodedFeatures;
    }

    // Fallback sur les fonctionnalités de l'API
    if (plan.details && plan.details.features && Array.isArray(plan.details.features)) {
      return plan.details.features.map(feature => ({ included: true, text: feature }));
    }
    return [];
  };

  const handleSubscribe = async (planId, e) => {
    e.stopPropagation();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (!token) { router.push('/login?redirect=/'); return; }
    if (!planId) { router.push('/register'); return; }
    try {
      setProcessingPlanId(planId);
      clearError();
      await initiatePayment(planId);
    } catch (err) {
      console.error('Payment error:', err);
      setProcessingPlanId(null);
    }
  };

  const plans = useMemo(() => {
    if (!apiPlans || apiPlans.length === 0) return [];
    const allPlans = [];

    apiPlans.forEach(plan => {
      let imageUrl = '';
      if (plan.planImage?.url) {
        imageUrl = plan.planImage.url;
      } else {
        const name = plan.name?.toLowerCase() || '';
        if (name.includes('freemium')) imageUrl = '/images/plans/freemium.png';
        else if (name.includes('basic')) imageUrl = '/images/plans/basicium.png';
        else if (name.includes('airium') && !name.includes('silver')) imageUrl = '/images/plans/airium.png';
        else if (name.includes('silver')) imageUrl = '/images/plans/airium-silver.png';
        else if (name.includes('bacculum') || name.includes('bacculium')) imageUrl = '/images/plans/bacculium.png';
        else imageUrl = '';
      }

      // Utiliser les traductions selon la langue
      let subtitle = '';
      if (plan.billingCycle === 'Monthly') {
        subtitle = t('pricing.monthlySubscription');
      } else if (plan.billingCycle === 'Yearly') {
        subtitle = t('pricing.yearlySubscription');
      } else {
        subtitle = t('pricing.weeklySubscription');
      }

      // Gérer la devise selon la langue
      const currencySymbol = currentLocale === 'ar' ? 'دج' : 'DA';
      const freeText = currentLocale === 'ar' ? 'مجاني' : 'Gratuit';

      const formattedPlan = {
        id: `plan-${plan.id}`,
        planId: plan.id,
        name: plan.name || 'Unknown',
        subtitle: subtitle,
        price: plan.price > 0 ? `${plan.price.toFixed(2)} ${currencySymbol}` : freeText,
        icon: getIcon(plan.name),
        img: imageUrl,
        color: getPlanColor(plan.planTier || 0),
        popular: plan.planTier === 3 || plan.planTier === 4,
        badge: (plan.planTier === 4 || plan.planTier === 5) ? 'MEILLEUR RAPPORT' : undefined,
        features: reorderFeatures(extractFeatures(plan)),
      };

      allPlans.push(formattedPlan);
    });

    allPlans.sort((a, b) => (apiPlans.find(p => p.id === a.planId)?.planTier || 0) - (apiPlans.find(p => p.id === b.planId)?.planTier || 0));
    return allPlans;
  }, [apiPlans, t]);

  const getColorClasses = (color) => {
    const colors = {
      slate: { border: "border-slate-200", bg: "bg-white", badge: "bg-slate-500 text-white", cardGradient: "from-green-500 via-green-600 to-green-700" },
      green: { border: "border-slate-200", bg: "bg-white", badge: "bg-green-500 text-white", cardGradient: "from-green-500 via-green-600 to-green-700" },
      purple: { border: "border-slate-200", bg: "bg-white", badge: "bg-purple-500 text-white", cardGradient: "from-green-500 via-green-600 to-green-700" },
      gold: { border: "border-slate-200", bg: "bg-white", badge: "bg-amber-500 text-white", cardGradient: "from-green-500 via-green-600 to-green-700" },
    };
    return colors[color] || colors.slate;
  };

  if (plansLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">{t("pricing.title") || "Nos Tarifs"}</h2></div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-slate-600">Chargement des plans...</span>
        </div>
      </div>
    );
  }


  const OffersView = () => (
    <div className={`grid gap-6 items-stretch ${plans.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"}`}>
      {plans.map((plan, index) => {
        const colors = getColorClasses(plan.color);
        const isProcessing = processingPlanId === plan.planId;
        const isFreemium = plan.name.toLowerCase().includes('freemium');

        return (
          <div key={plan.id} className="relative group perspective-1000 flex flex-col">
            {/* Effet de glow au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>

            {/* Carte principale avec design premium */}
            <div className={`relative border-0 rounded-2xl p-6 text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${colors.bg} flex flex-col flex-1 overflow-hidden`}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}>



              {/* Image de la carte d'abonnement avec design premium */}
              <div className="relative mx-auto flex items-center justify-center mb-6 mt-6">
                <div className="relative">
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>

                  {/* Container principal avec proportions correctes */}
                  <div className={`w-48 h-32 mx-auto overflow-hidden bg-gradient-to-br ${colors.cardGradient} rounded-xl relative animate-subtle-bounce animate-glow-pulse group-hover:shadow-3xl transition-all duration-500`}
                    style={{
                      transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)'
                    }}>

                    {/* Effet de profondeur avec gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-2xl"></div>

                    {/* L'image elle-même avec proportions correctes */}
                    <img
                      src={plan.img}
                      alt={plan.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = ''; }}
                    />

                    {/* Effet de survol avec brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>

                    {/* Overlay de qualité premium */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-2xl"></div>
                  </div>

                  {/* Effet de particules flottantes uniquement en vert */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-particle-float"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300 rounded-full animate-particle-float" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* Titre du plan avec typographie premium */}
              <h3 className="text-xl font-black text-center mb-3 group-hover:text-green-600 transition-colors duration-300 gradient-text">
                {plan.name}
              </h3>

              {/* Type d'abonnement avec design premium sophistiqué */}
              {plan.subtitle && (
                <div className="mb-6">
                  <div className="relative inline-block">
                    {/* Effet de glow au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badge principal avec design premium */}
                    <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-green-300 group-hover:bg-gradient-to-r group-hover:from-green-100 group-hover:to-emerald-100">
                      {/* Texte simple sans icônes */}
                      <span className="inline-flex items-center">
                        {plan.subtitle}
                      </span>

                      {/* Effet de brillance au survol */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prix avec design premium - Taille uniforme et gradient vert */}
              <div className="mb-6">
                <div className="text-2xl font-black mb-2 group-hover:text-green-600 transition-colors duration-300 gradient-text-green">
                  {plan.price}
                </div>
                {!isFreemium && (
                  <div className="text-xs text-gray-500 font-medium">
                    {t('pricing.securePayment')}
                  </div>
                )}
                {isFreemium && (
                  <div className="text-xs text-green-600 font-medium">
                    {t('pricing.noCardRequired')}
                  </div>
                )}
              </div>


              {/* Effet de bordure animée */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(34, 197, 94, 0.1), transparent)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const DetailsView = () => (
    <div className={`grid gap-6 ${plans.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"}`}>
      {plans.map((plan) => {
        const colors = getColorClasses(plan.color);
        const isProcessing = processingPlanId === plan.planId;
        return (
          <div key={plan.id} className={`relative border-2 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg min-h-[500px] flex flex-col ${colors.border} ${colors.bg}`}>
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 text-center">
              <div className="relative inline-block mb-3">
                <div className={`w-28 h-18 bg-gradient-to-br ${colors.cardGradient} rounded-lg shadow-lg transform rotate-1 transition-transform hover:rotate-0 duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <div className="text-white font-mono text-xs font-bold">**** 1234</div>
                    <div className="text-white text-center text-opacity-60 text-xs mt-0.5 truncate">{plan.name}</div>
                  </div>
                </div>
              </div>
              <h3 className="text-base text-center font-bold text-slate-900">{plan.name}</h3>
              {plan.subtitle && <p className="text-xs text-center text-slate-600">{plan.subtitle}</p>}
              <div className="mt-2 flex flex-col items-center"><span className="text-lg font-bold text-slate-900">{plan.price}</span></div>
            </div>
            <div className="p-3 flex-1">
              <h4 className="font-semibold text-slate-900 mb-2 text-xs">{t("pricing.features") || "Fonctionnalités:"}</h4>
              <div className="space-y-1.5 mb-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    {feature.included ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2 h-2 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-2 h-2 text-red-500" />
                      </div>
                    )}
                    <span className={`text-xs leading-tight ${feature.included ? "text-slate-700" : "text-slate-400"}`}>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div id="prices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style jsx global>{`
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
        }
        
        .animate-subtle-bounce {
          animation: subtle-bounce 3s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }
        
        .animate-particle-float {
          animation: particle-float 3s ease-in-out infinite;
        }
        
        .animate-subtle-bounce:hover {
          animation-play-state: paused;
          transform: translateY(-12px) scale(1.05);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px rgba(0, 0, 0, 0.25);
        }
        
        /* Effet de glassmorphism pour les cartes populaires */
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        /* Gradient text premium */
        .gradient-text {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-green {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <div className="text-center mb-16">
        {/* Badge avec icône comme les points de vente */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6">
          <Star className="w-4 h-4" />
          <span>{currentLocale === 'ar' ? 'أسعارنا' : 'NOS TARIFS'}</span>
          <Star className="w-4 h-4" />
        </div>

        {/* Titre principal avec gradient comme les points de vente */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-6 text-center font-cairo" lang={currentLocale}>
          {t("pricing.title") || "Nos Tarifs"}
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-cairo text-center" lang={currentLocale}>
          {t("pricing.description") || "Choisissez le plan qui vous convient le mieux"}
        </p>

        {/* Éléments décoratifs comme les points de vente */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        </div>
      </div>
      {plansError && !plansLoading && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">Impossible de charger les plans depuis l'API. Veuillez réessayer.</p>
        </div>
      )}
      {paymentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800">Erreur de paiement</h3>
            <p className="text-sm text-red-700 mt-1">{paymentError}</p>
          </div>
          <button onClick={clearError} className="text-red-600 hover:text-red-800 transition-colors"><X className="w-5 h-5" /></button>
        </div>
      )}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 p-1 rounded-full flex">
          <button onClick={() => setViewMode("offers")} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${viewMode === "offers" ? "bg-green-600 text-white" : "text-gray-600 hover:text-green-600"}`}>
            {t("pricing.offers") || "Offres"}
          </button>
          <button onClick={() => setViewMode("details")} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${viewMode === "details" ? "bg-green-600 text-white" : "text-gray-600 hover:text-green-600"}`}>
            {t("pricing.details") || "Détails"}
          </button>
        </div>
      </div>
      {viewMode === "offers" ? <OffersView /> : <DetailsView />}
    </div>
  );
}