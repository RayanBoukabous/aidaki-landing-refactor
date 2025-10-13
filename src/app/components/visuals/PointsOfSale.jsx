"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";

const VisualsPointsOfSale = () => {
  const t = useTranslations("pointsOfSale");
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const locations = [t("locations.0")];

  return (
    <section
      id="points-of-sale"
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50"
    >
      {/* Wavy separator at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#ffffff"
            fillOpacity="1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Enhanced Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 rounded-full transform scale-110 opacity-20"></div>

              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-green-100">
                <div className="w-96 h-72 overflow-hidden rounded-2xl">
                  <img
                    src="/images/pointsOfSale.png"
                    alt={t("imageAlt")}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  Find Us! 📍
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Text and Buttons Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 text-center lg:text-right"
          >
            {/* Header with enhanced styling */}
            <div className="mb-12">
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto lg:ml-auto lg:mr-0 mb-6"></div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 rtl:text-right text-green-600 ">
                {t("title")}
              </h2>

              <p className="mb-8 rtl:text-right text-lg md:text-xl text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto lg:ml-auto lg:mr-0">
                {t("description")}
              </p>
            </div>

            {/* Enhanced Location Buttons */}
            <div className="space-y-4 max-w-md mx-auto lg:mr-0 lg:ml-auto mb-8">
              {locations.map((location, index) => (
                <a
                  target="_blank"
                  href="https://technostationery.com/nos-points-de-vente"
                  className="w-80 inline-flex justify-center gap-2 items-center bg-gradient-to-r  from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl py-4 px-6 text-white text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-green-200 group"
                >
                  <span>{location}</span>
                  <svg
                    className={`w-5 h-5  transition-transform duration-300 ${
                      hoveredLocation === index ? "translate-x-1" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              ))}
            </div>

            {/* Enhanced More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:border-green-300 rounded-full px-8 py-3 text-green-700 hover:text-green-800 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                {t("more")}
                <svg
                  className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        /* Ensure RTL text alignment works properly */
        [dir="rtl"] .rtl\\:text-right {
          text-align: right;
        }

        /* Ensure RTL margin adjustments */
        [dir="rtl"] .lg\\:mr-0 {
          margin-right: 0;
        }

        [dir="rtl"] .lg\\:ml-auto {
          margin-left: auto;
        }
      `}</style>
    </section>
  );
};

export default VisualsPointsOfSale;
