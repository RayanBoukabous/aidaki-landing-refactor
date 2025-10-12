'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { motion } from 'framer-motion'

const FeaturesHomePagePricingHeader = () => {
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'
  const [isPlaying, setIsPlaying] = useState(false)

  const playVideo = () => {
    setIsPlaying(true)
  }

  const closeVideo = () => {
    setIsPlaying(false)
  }

  return (
    <section 
      className={`
        relative py-16 md:py-24 overflow-hidden 
        bg-gradient-to-br from-green-500 via-green-600 to-blue-600
        ${isArabic ? 'font-cairo' : 'font-nexa'}
      `}
      dir={isArabic ? 'rtl' : 'ltr'}
    >



      <div className="container mx-auto px-4 relative z-10">

        {/* Enhanced Section Title with proper typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block bg-white/15 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full mx-auto mb-6"></div>
            <h2 className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight
              ${isArabic ? 'tracking-normal font-cairo' : 'tracking-tight font-nexa'}
            `}>
              {t('pricingHeader.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-blue-300 rounded-full mx-auto"></div>
          </div>
        </motion.div>

        {/* Enhanced Video Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >

        

          {/* Main video container with enhanced styling */}
          <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-inner">

              {/* Video player or thumbnail */}
              {isPlaying ? (
                <div className="aspect-video relative">
               {   <video
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    controls
                    autoPlay
                  >
                    <source src="https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/Chatbot/chatbot+arab.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video> }

                  {/* Enhanced close button - RTL aware */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeVideo}
                    className={`
                      absolute top-4 ${isArabic ? 'left-4' : 'right-4'} z-10 
                      bg-red-500 hover:bg-red-600 text-white rounded-full 
                      w-10 h-10 flex items-center justify-center shadow-lg 
                      transition-colors duration-200
                    `}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="aspect-video relative cursor-pointer group"
                  onClick={playVideo}
                >
                  { <img
                    src="/images/demo-thumbnail.jpeg"
                    alt={t('pricingHeader.videoThumbnail')}
                    className="w-full h-full object-cover rounded-2xl"
                  />}

                  {/* Enhanced play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.9, 1, 0.9]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="relative"
                    >
                      {/* Glowing ring effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-lg opacity-60 scale-150"></div>

                      {/* Main play button */}
                      <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-2xl border-4 border-white/30">
                        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center">
                          <div className={`
                            w-0 h-0 border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent 
                           border-l-[16px] border-l-green-500 ml-1
                            }
                          `}></div>
                        </div>
                      </div>

                      {/* Sparkle effects */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
                    </motion.div>
                  </div>

          
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile badges - visible only on small screens */}
          <div className="sm:hidden flex justify-center space-x-4 mt-6">
            <div className="bg-white rounded-2xl py-3 px-4 shadow-lg border-2 border-green-200">
              <div className="text-center">
                <div className="text-lg mb-1">🎓</div>
                <p className={`
                  text-gray-800 font-bold text-xs
                  ${isArabic ? 'font-cairo' : 'font-nexa'}
                `}>
                  {t('pricingHeader.lessons')}
                </p>
              </div>
            </div>
         
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        /* Font definitions */
        .font-nexa {
          font-family: 'Nexa', 'Nunito', 'Poppins', system-ui, -apple-system, sans-serif;
        }
        
        .font-cairo {
          font-family: 'Cairo', 'Amiri', 'Tajawal', system-ui, -apple-system, sans-serif;
        }

        /* Ensure smooth performance */
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}

export default FeaturesHomePagePricingHeader