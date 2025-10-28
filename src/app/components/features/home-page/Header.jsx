'use client'

import { useTranslations, useLocale } from 'next-intl'

const FeaturesHomePageHeader = () => {
  const t = useTranslations('features.header')
  const locale = useLocale()
  const isArabic = locale === 'ar'

  return (
    <div className="relative min-h-screen mt-5 w-full overflow-hidden bg-white">
      {/* Background Pattern with overlay for better text readability */}
      <div className="absolute inset-0 -top-24">
        <div
          className="absolute inset-0 opacity-70"
          style={{ backgroundImage: "url('/images/bg.svg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)]">
          {/* Content Section */}
          <div className={`flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 order-2 lg:order-1 ${isArabic ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900 bg-gradient-to-r from-gray-800 via-emerald-700 to-green-600 bg-clip-text text-transparent ${isArabic ? 'font-cairo' : 'font-poppins'}`} lang={locale}>
              {t('title')}
            </h1>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto ${isArabic ? 'font-cairo' : 'font-poppins'}`} lang={locale}>
              {t('description')}
            </p>
            <div className={`flex ${isArabic ? 'justify-end' : 'justify-start'} pt-2 sm:pt-4`}>
              <a
                href="/demo"
                className={`primary-bg-gradient hover:scale-105 active:scale-95 transition-all duration-300 ease-out text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-medium shadow-lg hover:shadow-xl ${isArabic ? 'font-cairo' : 'font-poppins'}`}
              >
                {t('cta')}
              </a>
            </div>
          </div>

          {/* Robot Section */}
          <div className="relative w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto order-1 lg:order-2">
            {/* Large oval background */}
            <div className="relative">
              <div className="primary-bg-gradient rounded-full w-[240px] h-[320px] xs:w-[280px] xs:h-[380px] sm:w-[320px] sm:h-[420px] md:w-[360px] md:h-[460px] lg:w-[400px] lg:h-[500px] xl:w-[450px] xl:h-[550px] flex items-center justify-center mx-auto shadow-2xl">
                {/* Robot image */}
                <img
                  src="/images/hero.png"
                  alt="Educational Robot"
                  className="w-[140px] xs:w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] xl:w-[260px] h-auto relative z-10"
                />

                {/* Speech Bubbles with improved positioning and animations */}
                <div className="absolute top-[18%] xs:top-[20%] sm:top-[22%] md:top-[24%] lg:top-[26%] -right-1 xs:-right-2 sm:-right-4 md:-right-6 lg:-right-8 z-20">
                  <div className={`primary-bg-gradient text-[10px] xs:text-xs sm:text-sm lg:text-base speech-bubble speech-bubble-1 text-white px-2 xs:px-3 sm:px-4 lg:px-6 py-1 xs:py-2 sm:py-2 lg:py-3 rounded-full min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] text-center font-medium shadow-lg ${isArabic ? 'font-cairo' : 'font-poppins'}`} lang={locale}>
                    {t('speechBubble1')}
                  </div>
                </div>

                <div className="absolute top-[52%] xs:top-[55%] sm:top-[58%] md:top-[60%] lg:top-[62%] -left-1 xs:-left-2 sm:-left-4 md:-left-6 lg:-left-10 z-20">
                  <div className={`primary-bg-gradient text-[10px] xs:text-xs sm:text-sm lg:text-base speech-bubble speech-bubble-2 text-white px-2 xs:px-3 sm:px-4 lg:px-4 py-1 xs:py-2 sm:py-2 lg:py-3 rounded-full min-w-[90px] xs:min-w-[110px] sm:min-w-[130px] md:min-w-[150px] lg:min-w-[180px] text-center font-medium shadow-lg ${isArabic ? 'font-cairo' : 'font-poppins'}`} lang={locale}>
                    {t('speechBubble2')}
                  </div>
                </div>

                <div className="absolute bottom-[6%] xs:bottom-[8%] sm:bottom-[10%] md:bottom-[12%] lg:bottom-[14%] -right-1 xs:-right-2 sm:-right-4 md:-right-6 lg:-right-8 z-20">
                  <div className={`speech-bubble speech-bubble-3 text-[10px] xs:text-xs sm:text-sm lg:text-base text-white p-1 xs:p-2 sm:p-3 lg:p-4 rounded-full primary-bg-gradient min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[170px] text-center font-medium shadow-lg ${isArabic ? 'font-cairo' : 'font-poppins'}`} lang={locale}>
                    {t('speechBubble3')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Wave Bottom - Fully responsive */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20 md:h-24 lg:h-32 xl:h-48"
        >
          {/* First wave layer (deeper) */}
          <path
            fill="#f1f5f9"
            fillOpacity="0.8"
            d="M0,64L60,80C120,96,240,128,360,144C480,160,600,160,720,144C840,128,960,96,1080,96C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>

          {/* Second wave layer (top) */}
          <path
            fill="#f8f9fa"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,224C672,224,768,192,864,186.7C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <style jsx>{`
        .speech-bubble {
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
          transform-origin: center;
          will-change: transform;
        }

        .speech-bubble-1 {
          animation: floatSlow 4s ease-in-out infinite;
        }

        .speech-bubble-2 {
          animation: floatMedium 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .speech-bubble-3 {
          animation: floatFast 3.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(0.5deg);
          }
          50% {
            transform: translateY(-12px) rotate(0deg);
          }
          75% {
            transform: translateY(-6px) rotate(-0.5deg);
          }
        }

        @keyframes floatMedium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(-0.3deg);
          }
          66% {
            transform: translateY(-15px) rotate(0.3deg);
          }
        }

        @keyframes floatFast {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          20% {
            transform: translateY(-6px) rotate(0.4deg);
          }
          40% {
            transform: translateY(-12px) rotate(0deg);
          }
          60% {
            transform: translateY(-8px) rotate(-0.4deg);
          }
          80% {
            transform: translateY(-4px) rotate(0.2deg);
          }
        }

        .primary-bg-gradient {
          background: linear-gradient(135deg, #0a7535 0%, #35b65f 50%, #22c55e 100%);
        }

        /* Enhanced responsiveness for very small screens */
        @media (max-width: 375px) {
          .speech-bubble {
            font-size: 0.7rem;
            padding: 0.4rem 0.6rem;
            min-width: 80px;
          }
        }

        /* Enhanced animations for larger screens */
        @media (min-width: 1024px) {
          .speech-bubble-1 {
            animation: floatSlow 4.5s ease-in-out infinite;
          }
          
          .speech-bubble-2 {
            animation: floatMedium 5.5s ease-in-out infinite;
            animation-delay: 1.2s;
          }
          
          .speech-bubble-3 {
            animation: floatFast 4s ease-in-out infinite;
            animation-delay: 0.8s;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .speech-bubble {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default FeaturesHomePageHeader