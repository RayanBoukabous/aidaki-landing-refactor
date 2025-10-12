'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getDirection } from '../../../i18n';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Move targetDate outside component to prevent recreation on every render
const TARGET_DATE = new Date('2025-10-15T00:00:00Z');

export default function ComingSoonBanner() {
  const { locale } = useParams();
  const t = useTranslations('ComingSoon');
  const direction = getDirection(locale as string);
  const isRTL = direction === 'rtl';
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Remove targetDate from dependencies since it's now a constant

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-green-700 to-green-800 border-2 border-green-500 p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-300 border-t-white"></div>
          <span className="ml-3 text-white text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  const timeBlocks = [
    { value: timeLeft.days, label: t('days') },
    { value: timeLeft.hours, label: t('hours') },
    { value: timeLeft.minutes, label: t('minutes') },
    { value: timeLeft.seconds, label: t('seconds') },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800 border-2 border-green-400/50 p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-pulse-slow">
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-transparent to-green-500/20 animate-gradient-x"></div>
      
      {/* Enhanced background pattern with animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-green-300 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-green-200 rounded-full mix-blend-overlay filter blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-400 rounded-full mix-blend-overlay filter blur-2xl animate-pulse-gentle"></div>
      </div>

      {/* Animated dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 w-2 h-2 bg-green-200 rounded-full animate-twinkle"></div>
        <div className="absolute bottom-6 left-12 w-1 h-1 bg-green-300 rounded-full animate-twinkle-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-green-100 rounded-full animate-twinkle-slow"></div>
      </div>
      
      {/* Mobile Layout (< md) */}
      <div className="md:hidden relative z-10 space-y-4">
        
        {/* Logo and Title Section */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative w-12 h-12 flex-shrink-0 group">
            <div className="absolute inset-0 bg-green-300/30 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 animate-float-gentle"></div>
            <div className="relative w-full h-full bg-white rounded-xl shadow-lg border-2 border-green-300 p-1.5 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/4.png"
                alt="Aidaki Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
          </div>
          <div className={`${isRTL ? 'text-right' : 'text-left'} space-y-1 flex-1`}>
            <h3 className="text-white font-bold text-base sm:text-lg tracking-tight drop-shadow-md">
              {t('title')}
            </h3>
            <p className="text-green-100 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse shadow-sm shadow-green-300"></span>
              {t('october1st')}
            </p>
          </div>
        </div>

        {/* Center Text */}
        <div className="text-center px-2">
          <div className="relative">
            <p className="text-white text-center text-sm sm:text-base font-semibold mb-2 leading-tight drop-shadow-md">
              {t('centerText')}
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent mx-auto shadow-sm shadow-green-300/50"></div>
          </div>
        </div>

        {/* Countdown - Mobile Grid Layout */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {timeBlocks.map((block, index) => (
            <div key={block.label} className="text-center group">
              <div className="relative">
                {/* Enhanced glowing background */}
                <div className="absolute inset-0 bg-green-300/40 rounded-lg blur-sm group-hover:bg-green-200/60 transition-colors duration-300 animate-pulse-gentle"></div>
                
                {/* Main container with enhanced styling */}
                <div className="relative bg-white/95 backdrop-blur-sm border-2 border-green-300 rounded-lg px-2 py-2 sm:px-3 sm:py-3 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 hover:bg-white">
                  <div className="text-green-800 font-mono font-bold text-lg sm:text-xl leading-none mb-1 tabular-nums">
                    {String(block.value).padStart(2, '0')}
                  </div>
                  <div className="text-green-600 sm:hidden text-[8px] sm:text-[10px] uppercase font-bold tracking-wider leading-tight">
                    {block.label[0]}
                  </div>
                  <div className="text-green-600 hidden sm:block text-[8px] sm:text-[10px] uppercase font-bold tracking-wider leading-tight">
                    {block.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout (>= md) */}
      <div className={`hidden md:flex relative z-10 items-center justify-between gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        
        {/* Enhanced Logo and Title */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative w-16 h-16 flex-shrink-0 group">
            <div className="absolute inset-0 bg-green-300/30 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 animate-float-gentle"></div>
            <div className="relative w-full h-full bg-white rounded-xl shadow-xl border-2 border-green-300 p-2 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/4.png"
                alt="Aidaki Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          </div>
          <div className={`${isRTL ? 'text-right' : 'text-left'} space-y-1`}>
            <h3 className="text-white font-bold text-lg tracking-tight drop-shadow-md">
              {t('title')}
            </h3>
            <p className="text-green-100 text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-sm shadow-green-300"></span>
              {t('october1st')}
            </p>
          </div>
        </div>

        {/* Enhanced Center Text */}
        <div className="text-center flex-1 px-6">
          <div className="relative">
            <p className="text-white text-center text-lg font-semibold mb-2 leading-tight drop-shadow-md">
              {t('centerText')}
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent mx-auto shadow-sm shadow-green-300/50"></div>
          </div>
        </div>

        {/* Enhanced Countdown with enhanced animations */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {timeBlocks.map((block, index) => (
            <div key={block.label} className="text-center min-w-[60px] group relative">
              <div className="relative">
                {/* Enhanced glowing background */}
                <div className="absolute inset-0 bg-green-300/40 rounded-xl blur-sm group-hover:bg-green-200/60 transition-colors duration-300 animate-pulse-gentle"></div>
                
                {/* Main container with enhanced styling */}
                <div className="relative bg-white/95 backdrop-blur-sm border-2 border-green-300 rounded-xl px-3 py-3 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 hover:bg-white">
                  <div className="text-green-800 font-mono font-bold text-xl leading-none mb-1 tabular-nums">
                    {String(block.value).padStart(2, '0')}
                  </div>
                  <div className="text-green-600 text-[10px] uppercase font-bold tracking-wider">
                    {block.label}
                  </div>
                </div>
              </div>
              
              {/* Enhanced separator */}
              {index < timeBlocks.length - 1 && (
                <div className={`absolute top-1/2 ${isRTL ? 'right-0' : 'left-full'} transform -translate-y-1/2 ${isRTL ? 'translate-x-1/2' : 'translate-x-1/2'} text-green-200 font-bold text-lg animate-pulse drop-shadow-sm`}>
                  :
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes twinkle-delayed {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          33% {
            opacity: 0.8;
            transform: scale(1.1);
          }
          66% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        
        @keyframes twinkle-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delayed {
          animation: twinkle-delayed 3s ease-in-out infinite;
        }
        
        .animate-twinkle-slow {
          animation: twinkle-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}