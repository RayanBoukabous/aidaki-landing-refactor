'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import VisualsTopbar from '../../components/visuals/VisualsTopbar'
import Footer from '../../components/Footer'
import { Star, BookOpen, TrendingUp, Microscope, Calendar, Sparkles } from 'lucide-react'


export default function NewsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30
      ${isArabic ? 'font-cairo' : 'font-nexa'}
    `}>
      {/* NAVBAR FIRST - HIGHEST PRIORITY */}
      <div className="relative z-50">
        <VisualsTopbar />
      </div>

      {/* ULTRA PROFESSIONAL BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="px-4 md:px-8 py-4 md:py-6 relative z-0 pt-20" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* ULTRA PROFESSIONAL HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6">
            <BookOpen className="w-4 h-4" />
            <span>الأخبار والموارد التعليمية</span>
            <Star className="w-4 h-4" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-6 text-center font-cairo" lang="ar">
            {t('educationResources.title')}
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-cairo text-center" lang="ar">
            اكتشف أحدث الأخبار والموارد التعليمية والمبادرات المبتكرة في عالم التعليم
          </p>

          {/* DECORATIVE ELEMENTS */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* ULTRA PROFESSIONAL CONTENT GRID */}
        <div className="container mx-auto px-4 relative z-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ULTRA PROFESSIONAL IMAGE SECTION */}
            <motion.div
              initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* FLOATING PARTICLES */}
                <div className="absolute -top-6 -right-6 w-4 h-4 bg-emerald-400 rounded-full animate-pulse opacity-60" />
                <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-40" />
                <div className="absolute top-1/2 -right-8 w-2 h-2 bg-teal-400 rounded-full animate-pulse opacity-50" />

                {/* MAIN IMAGE WITH 3D EFFECT */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-200/50 group-hover:shadow-3xl transition-all duration-500">
                    <img
                      src="/images/news.png"
                      alt={t('educationResources.imageAlt')}
                      className="w-full h-auto mx-auto animate-subtle-bounce drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ULTRA PROFESSIONAL CARDS SECTION */}
            <motion.div
              initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="space-y-8"
            >
              {/* CARD 1: المبادرات والبرامج */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="group"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-cairo" lang="ar">
                      {t('educationResources.initiatives.title')}
                    </h3>
                  </div>
                  <p className="text-emerald-100 leading-relaxed font-cairo" lang="ar">
                    {t('educationResources.initiatives.description')}
                  </p>
                </div>
              </motion.div>

              {/* CARD 2: التوجهات التعليمية الحديثة */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="group"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-cairo" lang="ar">
                      {t('educationResources.trends.title')}
                    </h3>
                  </div>
                  <p className="text-green-100 leading-relaxed font-cairo" lang="ar">
                    {t('educationResources.trends.description')}
                  </p>
                </div>
              </motion.div>

              {/* CARD 3: الأبحاث والدراسات */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="group"
              >
                <div className="bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Microscope className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-cairo" lang="ar">
                      {t('educationResources.research.title')}
                    </h3>
                  </div>
                  <p className="text-teal-100 leading-relaxed font-cairo" lang="ar">
                    {t('educationResources.research.description')}
                  </p>
                </div>
              </motion.div>

              {/* CARD 4: الفعاليات والندوات */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="group"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-cairo" lang="ar">
                      {t('educationResources.events.title')}
                    </h3>
                  </div>
                  <p className="text-emerald-100 leading-relaxed font-cairo" lang="ar">
                    {t('educationResources.events.description')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <style jsx>{`
          /* ULTRA PROFESSIONAL ANIMATIONS */
          @keyframes subtle-bounce {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes glow-pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.05);
            }
          }

          @keyframes particle-float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-5px) translateX(3px);
            }
            50% {
              transform: translateY(-10px) translateX(0px);
            }
            75% {
              transform: translateY(-5px) translateX(-3px);
            }
          }

          .animate-subtle-bounce {
            animation: subtle-bounce 3s ease-in-out infinite;
          }

          .animate-glow-pulse {
            animation: glow-pulse 2s ease-in-out infinite;
          }

          .animate-particle-float {
            animation: particle-float 4s ease-in-out infinite;
          }

          /* Font definitions */
          .font-nexa {
            font-family: 'Nexa', 'Nunito', 'Poppins', system-ui, -apple-system, sans-serif;
          }
          
          .font-cairo {
            font-family: 'Cairo', 'Amiri', 'Tajawal', system-ui, -apple-system, sans-serif;
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

          /* Enhanced shadows */
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  )
}
