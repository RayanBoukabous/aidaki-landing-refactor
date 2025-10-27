"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDirection } from '../i18n';

/**
 * DirectionManager component handles dynamic RTL/LTR direction updates
 * when the language is switched via URL navigation
 */
export default function DirectionManager() {
  const { locale } = useParams();

  useEffect(() => {
    if (!locale) return;

    const direction = getDirection(locale as string);
    const isArabic = locale === 'ar';

    // Update HTML dir attribute
    document.documentElement.dir = direction;
    document.documentElement.lang = locale as string;

    // Update body classes
    const body = document.body;
    
    // Remove existing direction and language classes
    body.classList.remove('rtl', 'ltr', 'font-cairo', 'font-poppins');
    
    // Add new direction class
    body.classList.add(direction);
    
    // Add appropriate font class based on language
    if (isArabic) {
      body.classList.add('font-cairo');
    } else {
      body.classList.add('font-poppins');
    }

    // Set text direction CSS property as backup
    body.style.direction = direction;

    // Dispatch a custom event to notify other components of direction change
    window.dispatchEvent(new CustomEvent('directionchange', { 
      detail: { direction, locale } 
    }));

  }, [locale]);

  return null; // This component doesn't render anything
}
