"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Crown, Star, Zap, Users, Brain, Loader2, AlertCircle, Receipt } from "lucide-react";
import { usePayment } from "../hooks/usePayment";
import { usePlans } from "../hooks/usePlans";
import { useRouter } from "next/navigation";

interface Feature {
  included: boolean;
  text: string;
}

interface Plan {
  id: string;
  planId: number;
  name: string;
  subtitle?: string;
  price: string;
  amount: number;
  users?: string;
  icon: React.ReactNode;
  color: string;
  popular: boolean;
  badge?: string;
  img: string;
  features: Feature[];
}

export default function PlansDisplayComponent() {
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
  const t = useTranslations();
  const router = useRouter();

  const { loading: paymentLoading, error: paymentError, initiatePayment, clearError } = usePayment();
  const { plans: apiPlans, loading: plansLoading, error: plansError } = usePlans();

  const reorderFeatures = (features: Feature[]): Feature[] => {
    const included = features.filter((f) => f.included);
    const notIncluded = features.filter((f) => !f.included);
    return [...included, ...notIncluded];
  };

  const getIcon = (name: string): React.ReactNode => {
    const iconName = name?.toLowerCase() || '';
    if (iconName.includes('freemium')) return <Users className="w-6 h-6" />;
    if (iconName.includes('basic')) return <Brain className="w-6 h-6" />;
    if (iconName.includes('airium') && !iconName.includes('silver')) return <Zap className="w-6 h-6" />;
    if (iconName.includes('silver') || iconName.includes('gold')) return <Crown className="w-6 h-6" />;
    if (iconName.includes('bacculum') || iconName.includes('bacculium')) return <Star className="w-6 h-6" />;
    return <Users className="w-6 h-6" />;
  };

  const getPlanColor = (planTier: number): string => {
    const colorMap: Record<number, string> = { 1: 'slate', 2: 'green', 3: 'purple', 4: 'gold', 5: 'green' };
    return colorMap[planTier] || 'slate';
  };

  const extractFeatures = (plan: any): Feature[] => {
    if (plan.details && plan.details.features && Array.isArray(plan.details.features)) {
      return plan.details.features.map((feature: string) => ({ included: true, text: feature }));
    }
    return [];
  };

  const handleSubscribe = async (planId: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { router.push("/login?redirect=/plans"); return; }
    if (!planId) { router.push("/register"); return; }
    try {
      setProcessingPlanId(planId);
      clearError();
      await initiatePayment(planId);
    } catch (err) {
      console.error("Payment error:", err);
      setProcessingPlanId(null);
    }
  };

  const plans = useMemo(() => {
    if (!apiPlans || apiPlans.length === 0) return { monthly: [], annual: [] };
    const monthly: Plan[] = [];
    const annual: Plan[] = [];

    apiPlans.forEach((plan: any) => {
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

      const formattedPlan: Plan = {
        id: `plan-${plan.id}`,
        planId: plan.id,
        name: plan.name || 'Unknown',
        subtitle: plan.billingCycle === 'Monthly' ? (t('monthlySubscription') || 'Mensuel')
          : plan.billingCycle === 'Yearly' ? (t('yearlySubscription') || 'Annuel')
          : (t('weeklySubscription') || '72 heures'),
        price: plan.price > 0 ? `${plan.price.toFixed(2)} DA` : (t('plans.freemium.price') || 'Gratuit'),
        amount: plan.price || 0,
        users: '1 utilisateur',
        icon: getIcon(plan.name),
        color: getPlanColor(plan.planTier || 0),
        popular: plan.planTier === 3 || plan.planTier === 4,
        badge: (plan.planTier === 4 || plan.planTier === 5) ? (t('plans.bestValue') || 'MEILLEUR RAPPORT') : undefined,
        img: imageUrl,
        features: reorderFeatures(extractFeatures(plan)),
      };

      if (plan.billingCycle === 'Monthly' || plan.billingCycle === 'Weekly') {
        monthly.push(formattedPlan);
      } else if (plan.billingCycle === 'Yearly') {
        annual.push(formattedPlan);
      }
    });

    monthly.sort((a, b) => (apiPlans.find((p: any) => p.id === a.planId)?.planTier || 0) - (apiPlans.find((p: any) => p.id === b.planId)?.planTier || 0));
    annual.sort((a, b) => (apiPlans.find((p: any) => p.id === a.planId)?.planTier || 0) - (apiPlans.find((p: any) => p.id === b.planId)?.planTier || 0));
    return { monthly, annual };
  }, [apiPlans, t]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; iconBg: string; iconText: string; badge: string }> = {
      slate: { border: "border-slate-200", bg: "bg-white", iconBg: "bg-slate-100", iconText: "text-slate-600", badge: "bg-slate-500 text-white" },
      green: { border: "border-slate-200", bg: "bg-white", iconBg: "bg-green-100", iconText: "text-green-600", badge: "bg-green-500 text-white" },
      purple: { border: "border-slate-200", bg: "bg-white", iconBg: "bg-purple-100", iconText: "text-purple-600", badge: "bg-purple-500 text-white" },
      gold: { border: "border-slate-200", bg: "bg-white", iconBg: "bg-amber-100", iconText: "text-amber-600", badge: "bg-amber-500 text-white" },
    };
    return colors[color] || colors.slate;
  };

  const currentPlans = billingCycle === "monthly" ? plans.monthly : plans.annual;

  if (plansLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">{t("plans.title") || "Nos Tarifs"}</h2></div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-slate-600">Chargement des plans...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("plans.title") || "Nos Tarifs"}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("plans.description") || "Choisissez le plan qui vous convient le mieux"}</p>
      </div>

      {/* Show Invoices Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => router.push("/dashboard/billing-history")}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Receipt className="w-5 h-5 mr-2" />
          {t("plans.showInvoices") || "Afficher mes factures"}
        </button>
      </div>

      {plansError && !plansLoading && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">Impossible de charger les plans depuis l'API.</p>
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

      <div className={`grid gap-6 ${currentPlans.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"}`}>
        {currentPlans.map((plan) => {
          const colors = getColorClasses(plan.color);
          const isProcessing = processingPlanId === plan.planId;
          const isFreePlan = plan.amount === 0;

          return (
            <div key={plan.id} className={`relative border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg flex flex-col ${colors.border} ${colors.bg}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors.badge}`}>{t("plans.popular") || "POPULAIRE"}</span>
                </div>
              )}

              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white">{plan.badge}</span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${colors.iconBg}`}>
                  <div className={colors.iconText}>{plan.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                {plan.subtitle && <p className="text-sm text-slate-600 mb-2">{plan.subtitle}</p>}
                <div className="text-2xl font-bold text-slate-900">{plan.price}</div>
                <div className="text-sm text-slate-600">{plan.users}</div>
              </div>

              <div className="space-y-3 flex-1 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-slate-700" : "text-slate-400"}`}>{feature.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={(e) => handleSubscribe(plan.planId, e)} 
                disabled={isProcessing || isFreePlan}
                className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("pricing.processing") || "Traitement..."}
                  </>
                ) : isFreePlan ? (
                  t("pricing.freePlan") || "Plan Gratuit"
                ) : (
                  t("pricing.subscribe") || "S'abonner"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
