"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Minimize2, Bot, User, Trash2 } from "lucide-react";
import Image from "next/image";
import "../styles/chatbot-animations.css";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: 'fr' | 'ar' | 'en';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour ! Je suis l'assistant AIDAKI. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date(),
      language: 'fr',
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar' | 'en'>('fr');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBadgeAnimating, setIsBadgeAnimating] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fonction pour détecter si on est sur mobile
  const detectMobile = useCallback(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    
    return isMobileDevice || (isTouchDevice && isSmallScreen);
  }, []);

  // Fonction pour gérer le clavier virtuel
  const handleViewportChange = useCallback(() => {
    if (!isMobile) return;

    const visualViewport = (window as any).visualViewport;
    if (visualViewport) {
      const currentHeight = visualViewport.height;
      const windowHeight = window.innerHeight;
      const heightDifference = windowHeight - currentHeight;
      
      // Si la différence est significative (> 150px), le clavier est probablement ouvert
      const keyboardOpen = heightDifference > 150;
      setIsKeyboardOpen(keyboardOpen);
      setViewportHeight(currentHeight);
      
      // Ajuster la position du chatbot si le clavier est ouvert
      if (keyboardOpen && chatContainerRef.current) {
        const chatContainer = chatContainerRef.current;
        const maxTop = currentHeight - 400; // Hauteur du chatbot
        const newTop = Math.max(10, maxTop);
        chatContainer.style.transform = `translateY(${newTop}px)`;
        chatContainer.style.transition = 'transform 0.3s ease-in-out';
      } else if (chatContainerRef.current) {
        chatContainerRef.current.style.transform = 'translateY(0)';
      }
    } else {
      // Fallback pour les navigateurs sans Visual Viewport API
      const currentHeight = window.innerHeight;
      const initialHeight = viewportHeight || currentHeight;
      const heightDifference = initialHeight - currentHeight;
      
      if (heightDifference > 150) {
        setIsKeyboardOpen(true);
        if (chatContainerRef.current) {
          const chatContainer = chatContainerRef.current;
          const maxTop = currentHeight - 400;
          const newTop = Math.max(10, maxTop);
          chatContainer.style.transform = `translateY(${newTop}px)`;
          chatContainer.style.transition = 'transform 0.3s ease-in-out';
        }
      } else {
        setIsKeyboardOpen(false);
        if (chatContainerRef.current) {
          chatContainerRef.current.style.transform = 'translateY(0)';
        }
      }
    }
  }, [isMobile, viewportHeight]);

  // Fonction pour détecter la langue du texte
  const detectLanguage = (text: string): 'fr' | 'ar' | 'en' => {
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
  };

  // Fonction pour obtenir la direction du texte
  const getTextDirection = (language: 'fr' | 'ar' | 'en') => {
    return language === 'ar' ? 'rtl' : 'ltr';
  };

  // Fonction pour déclencher l'animation d'attention
  const triggerAttentionAnimation = useCallback(() => {
    setIsAnimating(true);
    setIsBadgeAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsBadgeAnimating(false);
    }, 1000);
  }, []);

  // Auto-scroll vers le dernier message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Initialisation de la détection mobile
  useEffect(() => {
    const mobile = detectMobile();
    setIsMobile(mobile);
    setViewportHeight(window.innerHeight);
  }, [detectMobile]);

  // Fonction pour gérer les changements d'orientation
  const handleOrientationChange = useCallback(() => {
    if (isMobile) {
      setTimeout(() => {
        setViewportHeight(window.innerHeight);
        handleViewportChange();
      }, 500);
    }
  }, [isMobile, handleViewportChange]);

  // Gestion du focus sur l'input pour mobile
  const handleInputFocus = useCallback(() => {
    if (isMobile) {
      // Petit délai pour laisser le clavier s'ouvrir
      setTimeout(() => {
        handleViewportChange();
        scrollToBottom();
      }, 300);
      
      // Scroll supplémentaire pour s'assurer que l'input est visible
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 500);
    }
  }, [isMobile, handleViewportChange, scrollToBottom]);

  const handleInputBlur = useCallback(() => {
    if (isMobile) {
      // Délai pour laisser le clavier se fermer
      setTimeout(() => {
        handleViewportChange();
      }, 300);
    }
  }, [isMobile, handleViewportChange]);

  // Gestion des événements de viewport pour le clavier virtuel
  useEffect(() => {
    if (!isMobile) return;

    const visualViewport = (window as any).visualViewport;
    
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleViewportChange);
      visualViewport.addEventListener('scroll', handleViewportChange);
    } else {
      // Fallback pour les navigateurs sans Visual Viewport API
      window.addEventListener('resize', handleViewportChange);
    }

    // Gestion des changements d'orientation
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleViewportChange);
        visualViewport.removeEventListener('scroll', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, handleViewportChange, handleOrientationChange]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Animation périodique pour attirer l'attention
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        // Animation complète (shake + badge) quand fermé
        triggerAttentionAnimation();
      } else {
        // Animation badge seulement quand ouvert
        setIsBadgeAnimating(true);
        setTimeout(() => setIsBadgeAnimating(false), 400);
      }
    }, 5000); // Animation toutes les 5 secondes

    return () => clearInterval(interval);
  }, [isOpen, triggerAttentionAnimation]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Envoyer un message
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const detectedLanguage = detectLanguage(inputValue.trim());
    setCurrentLanguage(detectedLanguage);

    // Mettre à jour le message de bienvenue si c'est le premier message de l'utilisateur
    if (messages.length === 1 && messages[0].isUser === false) {
      let welcomeMessage: string;
      switch (detectedLanguage) {
        case 'ar':
          welcomeMessage = "مرحباً! أنا مساعد أيداكي. كيف يمكنني مساعدتك اليوم؟";
          break;
        case 'en':
          welcomeMessage = "Hello! I'm the AIDAKI assistant. How can I help you today?";
          break;
        default:
          welcomeMessage = "Bonjour ! Je suis l'assistant AIDAKI. Comment puis-je vous aider aujourd'hui ?";
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === "1" 
          ? { ...msg, text: welcomeMessage, language: detectedLanguage }
          : msg
      ));
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
      language: detectedLanguage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue.trim() }),
      });

      const data = await response.json();

      let processingMessage: string;
      switch (detectedLanguage) {
        case 'ar':
          processingMessage = "عذراً، لم أتمكن من معالجة طلبك.";
          break;
        case 'en':
          processingMessage = "Sorry, I couldn't process your request.";
          break;
        default:
          processingMessage = "Désolé, je n'ai pas pu traiter votre demande.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || processingMessage,
        isUser: false,
        timestamp: new Date(),
        language: data.language || detectedLanguage,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      let errorText: string;
      switch (detectedLanguage) {
        case 'ar':
          errorText = "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.";
          break;
        case 'en':
          errorText = "Sorry, an error occurred. Please try again.";
          break;
        default:
          errorText = "Désolé, une erreur s'est produite. Veuillez réessayer.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        language: detectedLanguage,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  // Gérer la touche Entrée
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Toggle du chat
  const toggleChat = useCallback(() => {
    console.log('Toggle chat clicked!', { isOpen, isMinimized });
    if (isOpen) {
      setIsMinimized(!isMinimized);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [isOpen, isMinimized]);

  // Fermer le chat
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  // Vider la conversation
  const clearConversation = useCallback(() => {
    const welcomeMessage = currentLanguage === 'ar' 
      ? "مرحباً! أنا مساعد أيداكي. كيف يمكنني مساعدتك اليوم؟"
      : currentLanguage === 'en'
      ? "Hello! I'm the AIDAKI assistant. How can I help you today?"
      : "Bonjour ! Je suis l'assistant AIDAKI. Comment puis-je vous aider aujourd'hui ?";

    setMessages([
      {
        id: "1",
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        language: currentLanguage,
      },
    ]);
  }, [currentLanguage]);

  return (
    <>
      {/* Bouton flottant du chatbot */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 z-50 group cursor-pointer"
        aria-label="Ouvrir le chatbot AIDAKI"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="relative">
          {/* Effet de glow au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
          
          {/* Bouton principal avec shake */}
          <div className={`relative w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-105 group-active:scale-95 chatbot-subtle-bounce ${isAnimating ? 'chatbot-attention' : ''}`}>
            <Image
              src="/images/chatbot_img.png"
              alt="Assistant AIDAKI"
              width={80}
              height={80}
              className="object-contain lg:w-20 lg:h-20"
            />
          </div>
          
          {/* Badge de notification avec sursaut */}
          <div className={`absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold pointer-events-none ${isBadgeAnimating ? 'chatbot-badge-pop' : ''}`}>
            1
          </div>
        </div>
      </button>

      {/* Interface du chatbot */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`fixed bottom-4 left-2 right-2 sm:bottom-6 sm:left-6 sm:right-auto z-50 mb-4 chatbot-container ${
            isMobile ? 'chatbot-mobile-fix' : ''
          }`}
          style={{
            transform: isMobile && isKeyboardOpen ? 'translateY(-50px)' : 'translateY(0)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
            isMinimized ? "w-full sm:w-80 h-16" : "w-full sm:w-96 h-[400px] sm:h-[500px]"
          }`}>
            
            {/* Header du chatbot */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Assistant AIDAKI</h3>
                  <p className="text-emerald-100 text-xs">En ligne</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={clearConversation}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  aria-label="Vider la conversation"
                  title="Vider la conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  aria-label={isMinimized ? "Agrandir" : "Réduire"}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Zone des messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto h-[260px] sm:h-[360px] space-y-4 chatbot-messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${
                        message.isUser ? "flex-row-reverse" : "flex-row"
                      }`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isUser 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                            : "bg-gradient-to-r from-emerald-500 to-green-600"
                        }`}>
                          {message.isUser ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Message */}
                        <div className={`px-3 py-2 rounded-2xl ${
                          message.isUser
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          <p 
                            className="text-sm leading-relaxed"
                            dir={getTextDirection(message.language || 'fr')}
                            style={{ 
                              textAlign: message.language === 'ar' ? 'right' : 'left',
                              fontFamily: message.language === 'ar' ? 'Arial, sans-serif' : 'inherit'
                            }}
                          >
                            {message.text}
                          </p>
                          <p className={`text-xs mt-1 ${
                            message.isUser ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Indicateur de chargement */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder={currentLanguage === 'ar' ? "اكتب رسالتك..." : currentLanguage === 'en' ? "Type your message..." : "Tapez votre message..."}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent chatbot-input"
                      style={{
                        direction: getTextDirection(currentLanguage),
                        textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                        fontFamily: currentLanguage === 'ar' ? 'Arial, sans-serif' : 'inherit',
                        fontSize: '16px', // Minimum 16px pour éviter le zoom iOS
                        WebkitAppearance: 'none', // Éviter les styles par défaut iOS
                        borderRadius: '12px' // Forcer le border-radius
                      }}
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all duration-200"
                      aria-label="Envoyer le message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
