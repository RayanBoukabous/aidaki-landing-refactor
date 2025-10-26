"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Crown, Star, Zap, Users, Brain, Loader2, AlertCircle } from "lucide-react";
import { usePayment } from "@/app/hooks/usePayment";
import { usePlans } from "@/app/hooks/usePlans";
import { useRouter } from "next/navigation";

export default function EnhancedPricingComponent() {
  const [viewMode, setViewMode] = useState("offers");
  const [flippedCards, setFlippedCards] = useState({});
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const t = useTranslations();
  const router = useRouter();

  const { loading: paymentLoading, error: paymentError, initiatePayment, clearError } = usePayment();
  const { plans: apiPlans, loading: plansLoading, error: plansError } = usePlans();

  const toggleCardFlip = (planId) => {
    setFlippedCards((prev) => ({ ...prev, [planId]: !prev[planId] }));
  };

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

  const extractFeatures = (plan) => {
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

      const formattedPlan = {
        id: `plan-${plan.id}`, planId: plan.id, name: plan.name || 'Unknown',
        subtitle: plan.billingCycle === 'Monthly' ? (t('monthlySubscription') || 'Mensuel')
          : plan.billingCycle === 'Yearly' ? (t('yearlySubscription') || 'Annuel')
            : (t('weeklySubscription') || '72 heures'),
        price: plan.price > 0 ? `${plan.price.toFixed(2)} DA` : (t('plans.freemium.price') || 'Gratuit'),
        icon: getIcon(plan.name), img: imageUrl, color: getPlanColor(plan.planTier || 0),
        popular: plan.planTier === 3 || plan.planTier === 4,
        badge: (plan.planTier === 4 || plan.planTier === 5) ? (t('plans.bestValue') || 'MEILLEUR RAPPORT') : undefined,
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

  const CardContent = ({ plan, colors, isBackSide = false }) => {
    const isProcessing = processingPlanId === plan.planId;
    if (!isBackSide) {
      return (
        <>
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative mx-auto flex items-center justify-center mb-6 max-w-[176px]">
              <div className={`w-36 mx-auto overflow-hidden bg-gradient-to-br ${colors.cardGradient} rounded-xl shadow-xl transform rotate-2 transition-transform hover:rotate-0 duration-300`}>
                <img src={plan.img} alt={plan.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; }} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">{plan.name}</h3>
            {plan.subtitle && <p className="text-sm text-center text-slate-600 mb-3">{plan.subtitle}</p>}
            <div className="text-3xl font-bold text-slate-900 mb-4">{plan.price}</div>
          </div>
          <button onClick={(e) => handleSubscribe(plan.planId, e)} disabled={isProcessing || paymentLoading}
            className="inline-block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isProcessing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("pricing.processing") || "Traitement..."}</>) : (t("pricing.subscribe") || "S'abonner")}
          </button>
        </>
      );
    }
    return (
      <>
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
        <div className="p-3 flex-1 overflow-y-auto max-h-[300px]">
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
        <div className="p-3">
          <button onClick={(e) => handleSubscribe(plan.planId, e)} disabled={isProcessing || paymentLoading}
            className="inline-block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isProcessing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("pricing.processing") || "Traitement..."}</>) : (t("pricing.subscribe") || "S'abonner")}
          </button>
        </div>
      </>
    );
  };

  const OffersView = () => (
    <div className={`grid gap-6 ${plans.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"}`}>
      {plans.map((plan) => {
        const colors = getColorClasses(plan.color);
        const isFlipped = flippedCards[plan.id];
        return (
          <div key={plan.id} className="perspective-1000 min-h-[500px]">
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`} style={{ transformStyle: "preserve-3d" }}>
              <div className={`absolute w-full h-full backface-hidden cursor-pointer border-2 rounded-xl p-8 text-center transition-all duration-200 hover:shadow-lg hover:scale-105 ${colors.border} ${colors.bg} flex flex-col justify-between`}
                style={{ backfaceVisibility: "hidden" }} onClick={() => toggleCardFlip(plan.id)}>
                <CardContent plan={plan} colors={colors} isBackSide={false} />
              </div>
              <div className={`absolute w-full h-full backface-hidden cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg ${colors.border} ${colors.bg}`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} onClick={() => toggleCardFlip(plan.id)}>
                <CardContent plan={plan} colors={colors} isBackSide={true} />
              </div>
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
            <div className="p-3 mt-auto">
              <button onClick={(e) => handleSubscribe(plan.planId, e)} disabled={isProcessing || paymentLoading}
                className="inline-block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isProcessing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("pricing.processing") || "Traitement..."}</>) : (t("pricing.subscribe") || "S'abonner")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div id="prices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style jsx global>{`.perspective-1000{perspective:1000px}.transform-style-3d{transform-style:preserve-3d}.backface-hidden{backface-visibility:hidden}.rotate-y-180{transform:rotateY(180deg)}`}</style>
      <div className="text-center mb-12">
        <h2 className="text-3xl text-center font-bold text-slate-900 mb-4">{t("pricing.title") || "Nos Tarifs"}</h2>
        <p className="text-slate-600 text-center max-w-2xl mx-auto">{t("pricing.description") || "Choisissez le plan qui vous convient le mieux"}</p>
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