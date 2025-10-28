import { NextRequest, NextResponse } from "next/server";
import { chatbotDataFr } from "../../../data/chatbotDataFr";
import { chatbotDataEn } from "../../../data/chatbotDataEn";
import { chatbotDataAr } from "../../../data/chatbotDataAr";

// Fonction pour détecter la langue du message
function detectLanguage(message: string): 'fr' | 'ar' | 'en' {
    // Détecter si le message contient des caractères arabes
    if (/[\u0600-\u06FF]/.test(message)) {
        return 'ar';
    }
    // Détecter si le message contient des mots anglais communs
    const englishWords = /\b(hello|hi|good|morning|afternoon|evening|night|bye|thanks|thank|you|are|is|what|how|where|when|why|who|can|could|would|should|will|help|need|want|like|love|study|learn|course|lesson|teacher|student|school|university|college|exam|test|quiz|homework|assignment|book|video|online|free|price|cost|subscription|sign|up|register|login|account|profile|dashboard|progress|score|grade|pass|fail|success|fail|error|problem|issue|question|answer|yes|no|maybe|sure|okay|ok|fine|great|good|bad|excellent|amazing|wonderful|fantastic|awesome|cool|nice|beautiful|perfect|best|worst|easy|hard|difficult|simple|complex|interesting|boring|fun|exciting|amazing|incredible|unbelievable|wow|oh|ah|hmm|well|so|then|now|here|there|this|that|these|those|my|your|his|her|our|their|me|you|him|her|us|them|i|we|they|he|she|it)\b/i;
    if (englishWords.test(message)) {
        return 'en';
    }
    // Par défaut, français
    return 'fr';
}

// Fonction pour obtenir les données du chatbot selon la langue
function getChatbotData(language: 'fr' | 'ar' | 'en'): string {
    switch (language) {
        case 'ar':
            return chatbotDataAr;
        case 'en':
            return chatbotDataEn;
        default:
            return chatbotDataFr;
    }
}

// Fonction intelligente de recherche dans les données
function findResponse(userMessage: string, data: string): string {
    const message = userMessage.toLowerCase().trim();

    // Parse le fichier pour créer un dictionnaire de mots-clés
    const lines = data.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    const keywordMap: { [key: string]: string } = {};

    // Construire le dictionnaire à partir du format "mot-clé: réponse"
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const keyword = line.substring(0, colonIndex).trim().toLowerCase();
            const response = line.substring(colonIndex + 1).trim();
            keywordMap[keyword] = response;
        }
    });

    // Fonction pour sélectionner une réponse aléatoire si plusieurs options
    function getRandomResponse(responseString: string): string {
        if (responseString.includes('|')) {
            const responses = responseString.split('|').map(r => r.trim());
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responseString;
    }

    // Recherche exacte d'abord
    if (keywordMap[message]) {
        return getRandomResponse(keywordMap[message]);
    }

    // Recherche par mots-clés partiels - améliorée
    const messageWords = message.split(/\s+/);
    for (const word of messageWords) {
        if (word.length > 2) { // Ignorer les mots trop courts
            for (const [keyword, response] of Object.entries(keywordMap)) {
                // Recherche plus flexible
                if (keyword.includes(word) || word.includes(keyword) ||
                    keyword.includes(word.replace(/[^a-zA-Z0-9]/g, '')) ||
                    word.replace(/[^a-zA-Z0-9]/g, '').includes(keyword)) {
                    return getRandomResponse(response);
                }
            }
        }
    }

    // Recherche par phrases complètes - PRIORITÉ AUX CORRESPONDANCES EXACTES ET PLUS LONGUES
    const sortedKeywords = Object.entries(keywordMap).sort((a, b) => b[0].length - a[0].length);

    for (const [keyword, response] of sortedKeywords) {
        if (message.includes(keyword) && keyword.length > 5) {
            return getRandomResponse(response);
        }
    }

    // Recherche dans les réponses existantes pour des mots-clés
    for (const [keyword, response] of Object.entries(keywordMap)) {
        if (message.includes(keyword)) {
            return getRandomResponse(response);
        }
    }

    // Réponses par défaut intelligentes basées sur le contexte
    if (message.includes('aide') || message.includes('help')) {
        return keywordMap['aide'] || "Je peux vous aider avec des informations sur AIDAKI ! Posez-moi n'importe quelle question sur nos cours, abonnements, ou services. 😊";
    }

    if (message.includes('merci') || message.includes('thanks')) {
        return keywordMap['merci'] || "Avec plaisir ! 😄 Et si tu veux me remercier pour de vrai, viens tester AIDAKI pendant 72h, c'est gratuit 😉";
    }

    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
        return keywordMap['bonjour'] || "Salut toi ! Prêt(e) à faire chauffer les neurones aujourd'hui ? 😎 C'est une belle journée pour apprendre quelque chose de nouveau ! 🌞";
    }

    // Réponse par défaut avec suggestions
    const defaultResponses = [
        "Je suis là pour vous aider avec AIDAKI ! Posez-moi des questions sur nos cours, abonnements, ou fonctionnalités. 🤖✨",
        "Comment puis-je vous aider avec AIDAKI aujourd'hui ? Vous pouvez me demander des informations sur nos cours, nos tarifs, ou nos services ! 📚",
        "Je peux vous renseigner sur AIDAKI ! Essayez de me poser des questions comme 'Qu'est-ce qu'AIDAKI ?' ou 'Comment s'inscrire ?' 😊"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: "Message requis" },
                { status: 400 }
            );
        }

        // Détecter la langue du message
        const language = detectLanguage(message);

        // Obtenir les données du chatbot selon la langue détectée
        const chatbotData = getChatbotData(language);

        // Générer une réponse
        const response = findResponse(message, chatbotData);

        return NextResponse.json(
            { response, language },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erreur dans l'API chatbot:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// Méthode GET pour tester l'API
export async function GET() {
    return NextResponse.json(
        {
            message: "API Chatbot AIDAKI fonctionnelle",
            status: "active",
            timestamp: new Date().toISOString()
        },
        { status: 200 }
    );
}
