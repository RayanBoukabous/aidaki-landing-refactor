"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fonction optimisée pour détecter le scroll
  const handleScroll = useCallback(() => {
    // Détecte si on a dépassé la section Header (environ 100vh)
    const scrollPosition = window.scrollY;
    const headerHeight = window.innerHeight;
    
    if (scrollPosition > headerHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Scroll vers le haut avec animation native optimisée
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  // Event listener optimisé avec throttling
  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [handleScroll]);

  // Rendu conditionnel pour éviter les re-renders inutiles
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Retour en haut de la page"
    >
      {/* Bouton principal avec gradient vert */}
      <div className="relative">
        {/* Effet de glow subtil */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
        
        {/* Bouton principal */}
        <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group-hover:scale-105 group-active:scale-95">
          <ChevronUp className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        
        {/* Indicateur de pulsation subtile */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
      </div>
    </button>
  );
};

export default BackToTop;
