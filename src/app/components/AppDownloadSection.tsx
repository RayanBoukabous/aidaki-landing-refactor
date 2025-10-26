"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getDirection } from "../../i18n";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AppDownloadSection() {
  const t = useTranslations();
  const params = useParams();
  const currentLocale = params.locale as string;
  const direction = getDirection(currentLocale);
  const isRTL = direction === "rtl";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState<{ googlePlay: boolean }>({
    googlePlay: false,
  });

  const handleButtonClick = (button: 'googlePlay') => {
    setShowComingSoon(prev => ({ ...prev, [button]: true }));
    setTimeout(() => {
      setShowComingSoon(prev => ({ ...prev, [button]: false }));
    }, 2000);
  };

  // Mobile app images
  const mobileImages = [
    "/images/aidaki-mobile1.jpeg",
    "/images/aidaki-mobile2.jpeg", 
    "/images/aidaki-mobile4.jpeg"
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % mobileImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [mobileImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mobileImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mobileImages.length) % mobileImages.length);
  };

  // Animation directions based on RTL/LTR
  const getSlideAnimations = () => {
    const exitDirection = isRTL ? 300 : -300;
    const enterDirection = isRTL ? -300 : 300;

    return {
      initial: { opacity: 0, x: enterDirection, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: exitDirection, scale: 0.95 },
    };
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-500 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-300 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-reverse' : ''}`}>
          
          {/* Content Section */}
          <div className={`${isRTL ? 'lg:order-2' : 'lg:order-1'} space-y-8`}>
            {/* Header */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM13 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-medium text-sm">
                  {t("appDownload.badge")}
                </span>
              </div>

              <h2 className="text-4xl  font-bold text-gray-900 leading-normal">
                {t("appDownload.title.part1")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  {t("appDownload.title.highlight")}
                </span>{" "}
                {t("appDownload.title.part2")}
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                {t("appDownload.description")}
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((feature, index) => (
                <div key={feature} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {t(`appDownload.features.${feature}`)}
                  </span>
                </div>
              ))}
            </div>

            {/* Download Button - Google Play Only */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t("appDownload.downloadNow")}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("appDownload.availableOnGooglePlay")}
                </p>
                
                {/* Enhanced Availability Banner */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white text-lg font-bold rounded-2xl shadow-xl mb-6 border-2 border-orange-300"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {t("appDownload.comingSoon")}
                </motion.div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <AnimatePresence>
                    {showComingSoon.googlePlay && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg z-10 border-2 border-orange-300"
                      >
                        {t("appDownload.comingSoon")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleButtonClick('googlePlay')}
                    className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Google Play Logo */}
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-sm text-green-100">{t("appDownload.getItOn")}</div>
                        <div className="text-xl font-bold text-white">Google Play</div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("appDownload.secureDownload")}</h4>
                  <p className="text-sm text-gray-600">{t("appDownload.secureDescription")}</p>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("appDownload.freeDownload")}</h4>
                  <p className="text-sm text-gray-600">{t("appDownload.freeDescription")}</p>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("appDownload.updates")}</h4>
                  <p className="text-sm text-gray-600">{t("appDownload.updatesDescription")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Slider Section */}
          <div className={`${isRTL ? 'lg:order-1' : 'lg:order-2'} flex justify-center lg:justify-end`}>
            <div className="relative max-w-xs mx-auto">
              {/* Phone Frame Container */}
              <div className="relative w-80 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                  
                  {/* Image Slider */}
                  <div className="w-full h-full relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={mobileImages[currentImageIndex]}
                        alt={`${t("appDownload.imageAlt")} ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain bg-gray-50"
                        {...getSlideAnimations()}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      />
                    </AnimatePresence>
                  </div>

             
                </div>

                {/* Slider Navigation */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                  {/* Previous Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all duration-200 border-2 border-green-100"
                    aria-label="Previous image"
                  >
                    {isRTL ? (
                      <ChevronRight size={20} strokeWidth={2} />
                    ) : (
                      <ChevronLeft size={20} strokeWidth={2} />
                    )}
                  </motion.button>

                  {/* Pagination Dots */}
                  <div className="flex gap-2">
                    {mobileImages.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-green-500 shadow-md scale-125"
                            : "bg-gray-300 hover:bg-green-300"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all duration-200 border-2 border-green-100"
                    aria-label="Next image"
                  >
                    {!isRTL ? (
                      <ChevronRight size={20} strokeWidth={2} />
                    ) : (
                      <ChevronLeft size={20} strokeWidth={2} />
                    )}
                  </motion.button>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-500 rounded-full animate-bounce shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>

                <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-green-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .7;
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        /* RTL Support */
        [dir="rtl"] .flex {
          direction: rtl;
        }
      `}</style>
    </section>
  );
}