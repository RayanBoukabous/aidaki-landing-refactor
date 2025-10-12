"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesHomePageFeatures = () => {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  // Check for mobile view and RTL direction
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkDirection = () => {
      const htmlDir = document.documentElement.dir;
      const computedDir = window.getComputedStyle(
        document.documentElement
      ).direction;
      const locale = document.documentElement.lang || "en";
      const rtlLocales = ["ar", "he", "fa", "ur"];

      setIsRTL(
        htmlDir === "rtl" ||
          computedDir === "rtl" ||
          rtlLocales.some((rtlLang) => locale.startsWith(rtlLang))
      );
    };

    checkMobile();
    checkDirection();

    window.addEventListener("resize", checkMobile);

    const observer = new MutationObserver(checkDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir", "lang"],
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  // All features data
  const features = [
    {
      title: t("features.feature5.title"),
      description: t("features.feature5.description"),
      image: "4.png",
    },
    {
      title: t("features.feature1.title"),
      description: t("features.feature1.description"),
      image: "2.png",
    },
    {
      title: t("features.feature4.title"),
      description: t("features.feature4.description"),
      image: "1.png",
    },
    {
      title: t("features.feature2.title"),
      description: t("features.feature2.description"),
      image: "5.png",
    },
    {
      title: t("features.feature3.title"),
      description: t("features.feature3.description"),
      image: "6.png",
    },

    {
      title: t("features.feature6.title"),
      description: t("features.feature6.description"),
      image: "7.png",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  // Auto-slide functionality for mobile
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isMobile]);

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
    <section className="relative text-center py-24 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
      <div className="flex justify-center items-center">
        <h3 className="text-4xl text-center mx-auto mb-12">
          {t("features.featureSectionTitle")}
        </h3>
      </div>

      {/* Header Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mb-20 px-4 relative z-10"
      >
        <div className="">
          <p className="text-gray-700 text-center leading-relaxed text-xl mb-6 font-medium">
            {t("features.header.description")}
          </p>
        </div>
      </motion.div>

      {/* Mobile Swiper */}
      {isMobile ? (
        <div className="relative max-w-sm mx-auto px-4">
          {/* Fun slide counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-2xl font-bold">{currentIndex + 1}</span>
              <span className="mx-3 text-green-200">/</span>
              <span className="text-lg">{features.length}</span>
            </div>
          </motion.div>

          {/* Feature Cards Container */}
          <div className="relative h-96 overflow-hidden mb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                {...getSlideAnimations()}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="absolute inset-0"
              >
                <FeatureCard
                  title={features[currentIndex].title}
                  description={features[currentIndex].description}
                  image={features[currentIndex].image}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex justify-center items-center gap-6">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all duration-200 border-2 border-green-100"
              aria-label="Previous slide"
            >
              {isRTL ? (
                <ChevronRight size={24} strokeWidth={2} />
              ) : (
                <ChevronLeft size={24} strokeWidth={2} />
              )}
            </motion.button>

            {/* Colorful Pagination Dots */}
            <div className="flex gap-2">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-green-500 shadow-md scale-125"
                      : "bg-gray-300 hover:bg-green-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all duration-200 border-2 border-green-100"
              aria-label="Next slide"
            >
              {!isRTL ? (
                <ChevronRight size={24} strokeWidth={2} />
              ) : (
                <ChevronLeft size={24} strokeWidth={2} />
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        /* Desktop Grid Layout */
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Top Row - 3 features */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, staggerChildren: 0.15 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  hover: { duration: 0.3 },
                }}
                viewport={{ once: true }}
                className="transform-gpu"
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Row - 3 features */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, staggerChildren: 0.2, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.slice(3, 6).map((feature, index) => (
              <motion.div
                key={index + 3}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  hover: { duration: 0.3 },
                }}
                viewport={{ once: true }}
                className="transform-gpu"
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        /* Smooth performance optimizations */
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* RTL Support for Navigation */
        [dir="rtl"] .flex {
          direction: rtl;
        }
      `}</style>
    </section>
  );
};

export default FeaturesHomePageFeatures;
