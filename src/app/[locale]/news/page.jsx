'use client'

import { useTranslations, useLocale } from 'next-intl'
import VisualsTopbar from '../../components/visuals/VisualsTopbar'
import Footer from '../../components/Footer'
import CountDown from '../../components/visuals/CountDown'


export default function NewsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50
      ${isArabic ? 'font-cairo' : 'font-nexa'}
    `}>
      <CountDown/>
      <VisualsTopbar />
      <div className="px-4 md:px-8 py-4 md:py-6" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Enhanced header section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block">
            <h2 className={`
              text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 leading-normal
              ${isArabic ? 'tracking-normal font-cairo' : 'tracking-tight font-nexa'}
            `}>
              {t('educationResources.title')}
            </h2>
          </div>
        </div>

        <div className="py-2 md:py-4">
          <div className="mt-4 md:mt-8 relative">
            {/* Enhanced background with multiple layers */}
            <div className="absolute inset-0 z-0 mt-4 md:mt-8">
              {/* Primary background pattern */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div
                  className="w-full h-full bg-repeat"
                  style={{ backgroundImage: "url('/images/pattern-bg.svg')" }}
                ></div>
              </div>

              {/* Additional decorative elements - RTL aware positioning */}
              <div className={`
                absolute top-10 ${isArabic ? 'right-10' : 'left-10'} 
                w-24 h-24 bg-blue-200 rounded-full opacity-10 blur-2xl
              `}></div>
              <div className={`
                absolute bottom-16 ${isArabic ? 'left-12' : 'right-12'} 
                w-32 h-32 bg-purple-200 rounded-full opacity-10 blur-2xl
              `}></div>
              <div className={`
                absolute top-1/2 ${isArabic ? 'right-1/4' : 'left-1/4'} 
                w-20 h-20 bg-green-200 rounded-full opacity-10 blur-xl
              `}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              {/* Enhanced Central Layout */}
              <div className="relative w-full max-w-6xl mx-auto">
                {/* Enhanced center puzzle image - MADE BIGGER */}
                <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 lg:w-96">
                  <div className="relative">
                    {/* Glow effect behind image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl scale-110"></div>
                    <img
                      src="/images/news.png"
                      alt={t('educationResources.imageAlt')}
                      className="w-full h-auto mx-auto float-animation relative z-10"
                    />
                  </div>
                </div>

                {/* Enhanced Cards container */}
                <div className="md:h-[500px] grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-0 md:block">
                  {/* Top Right/Left: المبادرات والبرامج - RTL aware positioning */}
                  <div className={`
                    md:absolute md:top-0 ${isArabic ? 'md:left-0' : 'md:right-0'} 
                    w-full sm:w-auto md:w-64 lg:w-72 group
                  `}>
                    {/* Enhanced center image for mobile */}
                    <div className="flex justify-center mb-6 md:hidden">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl scale-110"></div>
                        <img
                          src="/images/1.png"
                          alt={t('educationResources.mobileImageAlt')}
                          className="w-28 h-auto float-animation relative z-10 drop-shadow-lg"
                        />
                      </div>
                    </div>

                    <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl py-3 md:py-4 px-4 md:px-6 text-center mb-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-blue-300">
                        <h3 className={`
                          text-base sm:text-lg md:text-xl font-bold drop-shadow-sm
                          ${isArabic ? 'font-cairo' : 'font-nexa'}
                        `}>
                          {t('educationResources.initiatives.title')}
                        </h3>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100">
                        <p className={`
                          text-gray-700 leading-relaxed text-sm
                          ${isArabic ? 'text-center md:text-right font-cairo' : 'text-center md:text-left font-nexa'}
                        `}>
                          {t('educationResources.initiatives.description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top Left/Right: التوجهات التعليمية الحديثة */}
                  <div className={`
                    md:absolute md:top-0 ${isArabic ? 'md:right-0' : 'md:left-0'} 
                    w-full sm:w-auto md:w-64 lg:w-72 group
                  `}>
                    <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl py-3 md:py-4 px-4 md:px-6 text-center mb-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-green-300">
                        <h3 className={`
                          text-base sm:text-lg md:text-xl font-bold drop-shadow-sm
                          ${isArabic ? 'font-cairo' : 'font-nexa'}
                        `}>
                          {t('educationResources.trends.title')}
                        </h3>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100">
                        <p className={`
                          text-gray-700 leading-relaxed text-sm
                          ${isArabic ? 'text-center md:text-right font-cairo' : 'text-center md:text-left font-nexa'}
                        `}>
                          {t('educationResources.trends.description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Left/Right: الأبحاث والدراسات */}
                  <div className={`
                    md:absolute md:bottom-0 ${isArabic ? 'md:right-0' : 'md:left-0'} 
                    w-full sm:w-auto md:w-64 lg:w-72 group
                  `}>
                    <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl py-3 md:py-4 px-4 md:px-6 text-center mb-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-purple-300">
                        <h3 className={`
                          text-base sm:text-lg md:text-xl font-bold drop-shadow-sm
                          ${isArabic ? 'font-cairo' : 'font-nexa'}
                        `}>
                          {t('educationResources.research.title')}
                        </h3>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100">
                        <p className={`
                          text-gray-700 leading-relaxed text-sm
                          ${isArabic ? 'text-center md:text-right font-cairo' : 'text-center md:text-left font-nexa'}
                        `}>
                          {t('educationResources.research.description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right/Left: الفعاليات والندوات */}
                  <div className={`
                    md:absolute md:bottom-0 ${isArabic ? 'md:left-0' : 'md:right-0'} 
                    w-full sm:w-auto md:w-64 lg:w-72 group
                  `}>
                    <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl py-3 md:py-4 px-4 md:px-6 text-center mb-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-red-300">
                        <h3 className={`
                          text-base sm:text-lg md:text-xl font-bold drop-shadow-sm
                          ${isArabic ? 'font-cairo' : 'font-nexa'}
                        `}>
                          {t('educationResources.events.title')}
                        </h3>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100">
                        <p className={`
                          text-gray-700 leading-relaxed text-sm
                          ${isArabic ? 'text-center md:text-right font-cairo' : 'text-center md:text-left font-nexa'}
                        `}>
                          {t('educationResources.events.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Enhanced float animation */
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-8px) rotate(1deg);
            }
            50% {
              transform: translateY(-15px) rotate(0deg);
            }
            75% {
              transform: translateY(-8px) rotate(-1deg);
            }
          }

          .float-animation {
            animation: float 8s ease-in-out infinite;
          }

          /* Enhanced glow effect */
          @keyframes glow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.05);
            }
          }

          /* Font definitions */
          .font-nexa {
            font-family: 'Nexa', 'Nunito', 'Poppins', system-ui, -apple-system, sans-serif;
          }
          
          .font-cairo {
            font-family: 'Cairo', 'Amiri', 'Tajawal', system-ui, -apple-system, sans-serif;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .float-animation {
              animation-duration: 6s;
            }
          }

          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }

          /* Custom backdrop blur for older browsers */
          @supports not (backdrop-filter: blur(12px)) {
            .backdrop-blur-sm {
              background-color: rgba(255, 255, 255, 0.9);
            }
          }
        `}</style>
      </div>
      
      {/* Add Footer */}
      <Footer />
    </div>
  )
}
