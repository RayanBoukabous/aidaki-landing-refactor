/**
 * Maps API plan data to component-friendly format
 * @param {Array} apiPlans - Plans data from API
 * @param {Function} t - Translation function
 * @returns {Object} - Formatted plans object with monthly and annual arrays
 */
export const mapApiPlansToComponentFormat = (apiPlans, t) => {
  if (!apiPlans || !Array.isArray(apiPlans)) {
    return { monthly: [], annual: [] };
  }

  const monthly = [];
  const annual = [];

  apiPlans.forEach(plan => {
    // Extract features from details
    const features = extractFeatures(plan, t);
    
    const formattedPlan = {
      id: `plan-${plan.id}`,
      planId: plan.id,
      name: plan.name || 'Unknown',
      subtitle: plan.billingCycle === 'Monthly' 
        ? (t('monthlySubscription') || 'Mensuel')
        : plan.billingCycle === 'Yearly'
        ? (t('yearlySubscription') || 'Annuel')
        : (t('weeklySubscription') || 'Hebdomadaire'),
      price: plan.price > 0
        ? `${plan.price.toFixed(2)} DA`
        : (t('plans.freemium.price') || 'Gratuit'),
      description: plan.description || '',
      tokenLimit: plan.tokenLimit || 0,
      planTier: plan.planTier || 0,
      durationInDays: plan.durationInDays || 30,
      isActive: plan.isActive,
      isDefault: plan.isDefault,
      // Use the actual image URL from API
      img: plan.planImage?.url || plan.planImage?.fileName || 'default-plan.png',
      color: getPlanColor(plan.planTier || 0),
      popular: plan.planTier === 3 || plan.planTier === 4,
      badge: (plan.planTier === 4 || plan.planTier === 5) 
        ? (t('plans.bestValue') || 'MEILLEUR RAPPORT') 
        : undefined,
      features: features,
      barCode: plan.barCode || '',
      permissions: plan.permissions || [],
    };

    // Sort by billing cycle
    if (plan.billingCycle === 'Monthly') {
      monthly.push(formattedPlan);
    } else if (plan.billingCycle === 'Yearly') {
      annual.push(formattedPlan);
    } else if (plan.billingCycle === 'Weekly') {
      // Add freemium to monthly plans
      monthly.push(formattedPlan);
    }
  });

  // Sort by planTier
  monthly.sort((a, b) => a.planTier - b.planTier);
  annual.sort((a, b) => a.planTier - b.planTier);

  return { monthly, annual };
};

/**
 * Extract features from plan details
 */
const extractFeatures = (plan, t) => {
  const features = [];
  
  // Get features from details.features if available
  if (plan.details && plan.details.features && Array.isArray(plan.details.features)) {
    plan.details.features.forEach(feature => {
      features.push({
        included: true,
        text: feature
      });
    });
    return features;
  }
  
  // Fallback: Generate features based on permissions or plan tier
  const hasLessonAccess = plan.permissions?.some(p => 
    p.permission?.name?.includes('access_lesson')
  );
  const hasQuizAccess = plan.permissions?.some(p => 
    p.permission?.name?.includes('access_quiz')
  );
  const hasChatbotAccess = plan.permissions?.some(p => 
    p.permission?.name?.includes('access_chatbot')
  );
  const hasChatbotLimit = plan.permissions?.some(p => 
    p.permission?.name?.includes('limit_chatbot')
  );
  
  // Generate features based on available permissions
  if (hasLessonAccess) {
    features.push({
      included: true,
      text: t('plans.completeCourses') || 'Cours complets pour les bacheliers'
    });
    features.push({
      included: true,
      text: t('plans.quickSummaries') || 'Résumés pour une révision rapide'
    });
    features.push({
      included: true,
      text: t('plans.educationalVideos') || 'Vidéos éducatives avec des avatars de professeurs'
    });
    features.push({
      included: true,
      text: t('plans.intelligentDashboard') || 'Dashboard intelligent'
    });
  }
  
  if (hasQuizAccess) {
    features.push({
      included: true,
      text: t('plans.interactiveQuiz') || 'Quiz interactifs et évaluations'
    });
  }
  
  if (hasChatbotAccess) {
    features.push({
      included: true,
      text: t('plans.virtualAssistantUnlimited') || 'Assistant virtuel (Chatbot illimité)'
    });
  } else if (hasChatbotLimit) {
    features.push({
      included: true,
      text: t('plans.virtualAssistantLimited') || 'Assistant virtuel (Chatbot limité)'
    });
  } else {
    features.push({
      included: false,
      text: t('plans.virtualAssistant') || 'Assistant virtuel (Chatbot)'
    });
  }
  
  return features;
};

/**
 * Get plan color based on tier
 */
const getPlanColor = (planTier) => {
  const colorMap = {
    1: 'slate',  // Freemium
    2: 'green',  // Basic
    3: 'purple', // Airium
    4: 'gold',   // Airium Silver
    5: 'green',  // Bacculum (Annual)
  };
  return colorMap[planTier] || 'slate';
};

/**
 * Get icon component name based on plan name or tier
 */
export const getPlanIcon = (plan) => {
  const name = plan.name?.toLowerCase() || '';
  
  if (name.includes('freemium') || plan.planTier === 1) {
    return 'Users';
  } else if (name.includes('basic') || plan.planTier === 2) {
    return 'Brain';
  } else if (name.includes('airium') && !name.includes('silver') || plan.planTier === 3) {
    return 'Zap';
  } else if (name.includes('silver') || name.includes('gold') || plan.planTier === 4) {
    return 'Crown';
  } else if (name.includes('bacculum') || name.includes('bacculium') || plan.planTier === 5) {
    return 'Star';
  }
  
  return 'Users';
};

/**
 * Get image filename from plan data
 */
export const getPlanImageName = (plan) => {
  // First check if we have a planImage URL
  if (plan.planImage?.url) {
    return plan.planImage.url;
  }
  
  // Otherwise, generate default image name based on plan name
  const name = plan.name?.toLowerCase() || '';
  
  if (name.includes('freemium')) {
    return 'freemium.png';
  } else if (name.includes('basic')) {
    return 'basicium.png';
  } else if (name.includes('airium') && !name.includes('silver')) {
    return 'airium.png';
  } else if (name.includes('silver')) {
    return 'airium-silver.png';
  } else if (name.includes('bacculum') || name.includes('bacculium')) {
    return 'bacculium.png';
  }
  
  return 'default-plan.png';
};
