"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Crown, Star, Zap, Users, Brain, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlansComponent({ onSkip }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const t = useTranslations();
  const router = useRouter();

  // Reorder features to show included first
  const reorderFeatures = (features) => {
    const included = features.filter(f => f.included);
    const notIncluded = features.filter(f => !f.included);
    return [...included, ...notIncluded];
  };

  const plans = {
    monthly: [
      {
        id: "freemium",
        name: "FREEMIUM",
        subtitle: "(72 hours)",
        price: t("plans.freemium.price") || "Gratuit",
        users: t("plans.freemium.users") || "Gratuit",
        icon: <Users className="w-6 h-6" />,
        color: "slate",
        popular: false,
        features: reorderFeatures([
          {
            included: true,
            text: t("plans.freemium.firstLesson") || "Première leçon complète pour les bacheliers"
          },
          {
            included: true,
            text: t("plans.freemium.quickSummaries") || "Résumés pour une révision rapide du premier cours"
          },
          {
            included: true,
            text: t("plans.freemium.educationalVideos") || "Vidéos éducatives avec des avatars de professeurs (premier cours)"
          },
          {
            included: true,
            text: t("plans.freemium.intelligentDashboard") || "Dashboard intelligent pour analyser les performances"
          },
          {
            included: true,
            text: t("plans.freemium.interactiveQuiz") || "Quiz interactifs et évaluations (Quiz du cours)"
          },
          {
            included: true,
            text: t("plans.freemium.virtualAssistant") || "Assistant virtuel (Chatbot) pour répondre aux questions (10 questions)"
          }
        ])
      },
      {
        id: "basicium",
        name: "BASICIUM",
        price: "1500 DA",
        users: "1 utilisateur",
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        popular: false,
        features: reorderFeatures([
          {
            included: true,
            text: t("plans.basicium.completeCourses") || "Cours complets pour les bacheliers"
          },
          {
            included: true,
            text: t("plans.basicium.quickSummaries") || "Résumés pour une révision rapide"
          },
          {
            included: true,
            text: t("plans.basicium.intelligentDashboard") || "Dashboard intelligent pour analyser les performances et orienter"
          },
          {
            included: false,
            text: t("plans.basicium.educationalVideos") || "Vidéos éducatives avec des avatars de professeurs"
          },
          {
            included: true,
            text: t("plans.basicium.interactiveQuiz") || "Quiz interactifs et évaluations"
          },
          {
            included: true,
            text: t("plans.basicium.virtualAssistant") || "Assistant virtuel (Chatbot limité) pour répondre aux questions à tout moment"
          }
        ])
      },
      {
        id: "airium",
        name: "AIRIUM",
        price: "2400 DA",
        users: "1 utilisateur",
        icon: <Zap className="w-6 h-6" />,
        color: "purple",
        popular: true,
        features: reorderFeatures([
          {
            included: true,
            text: t("plans.airium.completeCourses") || "Cours complets pour les bacheliers"
          },
          {
            included: true,
            text: t("plans.airium.quickSummaries") || "Résumés pour une révision rapide"
          },
          {
            included: true,
            text: t("plans.airium.educationalVideos") || "Vidéos éducatives avec des avatars de professeurs"
          },
          {
            included: true,
            text: t("plans.airium.intelligentDashboard") || "Dashboard intelligent pour analyser les performances et orienter"
          },
          {
            included: true,
            text: t("plans.airium.interactiveQuiz") || "Quiz interactifs et évaluations"
          },
          {
            included: true,
            text: t("plans.airium.virtualAssistant") || "Assistant virtuel (Chatbot limité) pour répondre aux questions à tout moment"
          }
        ])
      },
      {
        id: "airiumSilver",
        name: "AIRIUM Silver",
        price: "3200 DA",
        users: "1 utilisateur",
        icon: <Crown className="w-6 h-6" />,
        color: "gold",
        popular: false,
        badge: t("plans.bestValue") || "MEILLEUR RAPPORT",
        features: reorderFeatures([
          {
            included: true,
            text: t("plans.airiumGold.completeCourses") || "Cours complets pour les bacheliers"
          },
          {
            included: true,
            text: t("plans.airiumGold.quickSummaries") || "Résumés pour une révision rapide"
          },
          {
            included: true,
            text: t("plans.airiumGold.educationalVideos") || "Vidéos éducatives avec des avatars de professeurs"
          },
          {
            included: true,
            text: t("plans.airiumGold.intelligentDashboard") || "Dashboard intelligent pour analyser les performances et orienter"
          },
          {
            included: true,
            text: t("plans.airiumGold.interactiveQuiz") || "Quiz interactifs et évaluations"
          },
          {
            included: true,
            text: t("plans.airiumGold.virtualAssistant") || "Assistant virtuel (Chatbot illimité) pour répondre aux questions à tout moment"
          }
        ])
      }
    ],
    annual: [
      {
        id: "bacculum",
        name: "BACCULUM",
        price: "22000 DA",
        users: "1 utilisateur",
        icon: <Star className="w-6 h-6" />,
        color: "green",
        popular: true,
        badge: t("plans.bestValue") || "MEILLEUR RAPPORT",
        features: reorderFeatures([
          {
            included: true,
            text: t("plans.bacculum.completeCourses") || "Cours complets pour les bacheliers"
          },
          {
            included: true,
            text: t("plans.bacculum.quickSummaries") || "Résumés pour une révision rapide"
          },
          {
            included: true,
            text: t("plans.bacculum.educationalVideos") || "Vidéos éducatives avec des avatars de professeurs"
          },
          {
            included: true,
            text: t("plans.bacculum.intelligentDashboard") || "Dashboard intelligent pour analyser les performances et orienter"
          },
          {
            included: true,
            text: t("plans.bacculum.interactiveQuiz") || "Quiz interactifs et évaluations"
          },
          {
            included: true,
            text: t("plans.bacculum.virtualAssistant") || "Assistant virtuel (Chatbot) pour répondre aux questions à tout moment"
          }
        ])
      }
    ]
  };

  const getColorClasses = (color, isSelected) => {
    const colors = {
      slate: {
        border: isSelected ? "border-green-500" : "border-slate-200 hover:border-slate-300",
        bg: isSelected ? "bg-green-50" : "bg-white",
        iconBg: "bg-slate-100",
        iconText: "text-slate-600",
        badge: "bg-slate-500 text-white"
      },
      green: {
        border: isSelected ? "border-green-500" : "border-slate-200 hover:border-slate-300",
        bg: isSelected ? "bg-green-50" : "bg-white",
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        badge: "bg-green-500 text-white"
      },
      purple: {
        border: isSelected ? "border-purple-500" : "border-slate-200 hover:border-slate-300",
        bg: isSelected ? "bg-purple-50" : "bg-white",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        badge: "bg-purple-500 text-white"
      },
      gold: {
        border: isSelected ? "border-amber-500" : "border-slate-200 hover:border-slate-300",
        bg: isSelected ? "bg-amber-50" : "bg-white",
        iconBg: "bg-amber-100",
        iconText: "text-amber-600",
        badge: "bg-amber-500 text-white"
      },
      green: {
        border: isSelected ? "border-green-500" : "border-slate-200 hover:border-slate-300",
        bg: isSelected ? "bg-green-50" : "bg-white",
        iconText: "text-green-600",
        iconBg: "bg-green-100",
        badge: "bg-green-500 text-white"
      }
    };
    return colors[color] || colors.slate;
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      // Save selected plan to localStorage or context if needed
      localStorage.setItem('selectedPlan', JSON.stringify({
        planId: selectedPlan,
        billingCycle
      }));

      // Navigate to dashboard/settings/cards
      router.push('/dashboard/settings/cards');
    }
  };

  const currentPlans = billingCycle === "monthly" ? plans.monthly : plans.annual;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("plans.title") || "Nos Tarifs"}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {t("plans.description") || "Choisissez le plan qui vous convient le mieux"}
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg bg-slate-100 p-1" role="group">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t("plans.monthly") || "MENSUEL"}
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${billingCycle === "annual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t("plans.annual") || "ANNUEL (12 MOIS)"}
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className={`grid gap-6 ${currentPlans.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
        {currentPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const colors = getColorClasses(plan.color, isSelected);

          return (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${colors.border} ${colors.bg} ${isSelected ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                    {t("plans.popular") || "POPULAIRE"}
                  </span>
                </div>
              )}

              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${colors.iconBg}`}>
                  <div className={colors.iconText}>
                    {plan.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                {plan.subtitle && (
                  <p className="text-sm text-slate-600 mb-2">{plan.subtitle}</p>
                )}
                <div className="text-2xl font-bold text-slate-900">
                  {plan.price}
                </div>
                <div className="text-sm text-slate-600">
                  {plan.users}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelect(plan.id);
                }}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isSelected ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {isSelected ? t("plans.selected") || "Sélectionné" : t("plans.select") || "Choisir"}
              </button>
            </div>
          );
        })}
      </div>

    

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={onSkip}
          className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          {t("plans.skip") || "Ignorer pour le moment"}
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {selectedPlan
            ? (t("plans.continue") || "Continuer avec ce plan")
            : (t("plans.selectPlan") || "Sélectionnez un plan")}
        </button>
      </div>
    </div>
  );
}
