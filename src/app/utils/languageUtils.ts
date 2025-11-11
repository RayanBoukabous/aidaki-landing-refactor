// Utilitaires pour la détection de langue et gestion RTL/LTR
export const LanguageUtils = {
    // Détecter la langue d'un texte
    detectLanguage: (text: string): 'fr' | 'ar' | 'en' => {
        // Détecter si le texte contient des caractères arabes
        if (/[\u0600-\u06FF]/.test(text)) {
            return 'ar';
        }
        // Détecter si le texte contient des mots anglais communs
        const englishWords = /\b(hello|hi|good|morning|afternoon|evening|night|bye|thanks|thank|you|are|is|what|how|where|when|why|who|can|could|would|should|will|help|need|want|like|love|study|learn|course|lesson|teacher|student|school|university|college|exam|test|quiz|homework|assignment|book|video|online|free|price|cost|subscription|sign|up|register|login|account|profile|dashboard|progress|score|grade|pass|fail|success|fail|error|problem|issue|question|answer|yes|no|maybe|sure|okay|ok|fine|great|good|bad|excellent|amazing|wonderful|fantastic|awesome|cool|nice|beautiful|perfect|best|worst|easy|hard|difficult|simple|complex|interesting|boring|fun|exciting|amazing|incredible|unbelievable|wow|oh|ah|hmm|well|so|then|now|here|there|this|that|these|those|my|your|his|her|our|their|me|you|him|her|us|them|i|we|they|he|she|it)\b/i;
        if (englishWords.test(text)) {
            return 'en';
        }
        // Par défaut, français
        return 'fr';
    },

    // Obtenir la direction du texte
    getTextDirection: (language: 'fr' | 'ar' | 'en') => {
        return language === 'ar' ? 'rtl' : 'ltr';
    },

    // Obtenir les styles pour le texte selon la langue
    getTextStyles: (language: 'fr' | 'ar' | 'en') => {
        return {
            direction: language === 'ar' ? 'rtl' : 'ltr',
            textAlign: language === 'ar' ? 'right' : 'left',
            fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'
        };
    },

    // Messages de bienvenue multilingues
    getWelcomeMessage: (language: 'fr' | 'ar' | 'en') => {
        switch (language) {
            case 'ar':
                return "مرحباً! أنا مساعد الذكي. كيف يمكنني مساعدتك اليوم؟";
            case 'en':
                return "Hello! I'm the AIDAKI assistant. How can I help you today?";
            default:
                return "Bonjour ! Je suis l'assistant AIDAKI. Comment puis-je vous aider aujourd'hui ?";
        }
    },

    // Messages d'erreur multilingues
    getErrorMessage: (language: 'fr' | 'ar' | 'en') => {
        switch (language) {
            case 'ar':
                return "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.";
            case 'en':
                return "Sorry, an error occurred. Please try again.";
            default:
                return "Désolé, une erreur s'est produite. Veuillez réessayer.";
        }
    },

    // Messages de traitement multilingues
    getProcessingMessage: (language: 'fr' | 'ar' | 'en') => {
        switch (language) {
            case 'ar':
                return "عذراً، لم أتمكن من معالجة طلبك.";
            case 'en':
                return "Sorry, I couldn't process your request.";
            default:
                return "Désolé, je n'ai pas pu traiter votre demande.";
        }
    },

    // Placeholders multilingues
    getInputPlaceholder: (language: 'fr' | 'ar' | 'en') => {
        switch (language) {
            case 'ar':
                return "اكتب رسالتك...";
            case 'en':
                return "Type your message...";
            default:
                return "Tapez votre message...";
        }
    }
};
