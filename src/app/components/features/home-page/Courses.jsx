"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";

const FeaturesHomePageCourses = () => {
  const t = useTranslations("courses");
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section
      id="courses"
      className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50"
    >
      {/* Main content */}
      <div className="relative z-10 py-16 md:py-24 px-4 md:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="grid items-center justify-center">
            <h2 className="flex justify-center items-center text-3xl sm:text-4xl md:text-5xl mb-12">
              {t("title")}
            </h2>

            <p className="text-gray-700 text-center max-w-3xl mx-auto mb-6 leading-relaxed text-lg font-medium">
              {t("description")}
            </p>
          </div>
        </motion.div>

        {/* Desktop/Tablet: Arc layout */}
        <div className="relative max-w-6xl mx-auto h-[400px] sm:h-[450px] lg:h-[500px] xl:h-[550px] hidden sm:block">
          {/* Animated background arcs */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-blue-200/30 rounded-full"
            style={{
              width: "500px",
              height: "500px",
              clipPath: "polygon(0 0, 100% 0, 100% 65%, 0 65%)",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-200/20 rounded-full"
            style={{
              width: "600px",
              height: "600px",
              clipPath: "polygon(0 0, 100% 0, 100% 65%, 0 65%)",
            }}
          />

          {/* Connector Lines */}
          <ConnectorLines />

          {/* Center logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute left-[48%] bottom-[15%] -translate-x-1/2 z-20"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full flex items-center justify-center">
              <img
                src="/images/logo-black.png"
                alt="AIDAKI Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
              />
            </div>
          </motion.div>

          {/* Subject cards positioned in arc formation */}
          <SubjectCard
            label={t("specialization.literature")}
            position="arc-left"
            delay={0.3}
            onHover={setHoveredCard}
            isHovered={hoveredCard === "literature"}
            color="from-blue-400 to-blue-500"
            icon="📚"
          />

          <SubjectCard
            label={t("specialization.management")}
            position="arc-left-center"
            delay={0.4}
            onHover={setHoveredCard}
            isHovered={hoveredCard === "management"}
            color="from-blue-500 to-blue-600"
            icon="💼"
          />

          <SubjectCard
            label={t("specialization.technology")}
            position="arc-center"
            delay={0.5}
            onHover={setHoveredCard}
            isHovered={hoveredCard === "technology"}
            color="from-blue-400 to-blue-500"
            icon="💻"
          />

          <SubjectCard
            label={t("specialization.mathematics")}
            position="arc-right-center"
            delay={0.6}
            onHover={setHoveredCard}
            isHovered={hoveredCard === "mathematics"}
            color="from-blue-600 to-blue-700"
            icon="🔢"
          />

          <SubjectCard
            label={t("specialization.science")}
            position="arc-right"
            delay={0.7}
            onHover={setHoveredCard}
            isHovered={hoveredCard === "science"}
            color="from-blue-500 to-blue-600"
            icon="🔬"
          />

          <SubjectCard
            label={t("specialization.languages")}
            position="arc-far-right"
            delay={0.8}
            onHover={setHoveredCard}
            isHovered={hoveredCard === "languages"}
            color="from-blue-600 to-blue-700"
            icon="🌐"
          />
        </div>

        {/* Mobile layout with enhanced cards */}
        <div className="sm:hidden">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div>
              <img
                src="/images/logo-black.png"
                alt="AIDAKI Logo"
                className="w-24 h-24"
              />
            </div>
          </motion.div>

          {/* Mobile Connector Lines */}
          <MobileConnectorLines />

          {/* Mobile Cards Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto relative z-10">
            <MobileCard
              label={t("specialization.literature")}
              icon="📚"
              color="from-blue-400 to-blue-500"
              delay={0.2}
            />
            <MobileCard
              label={t("specialization.management")}
              icon="💼"
              color="from-blue-500 to-blue-600"
              delay={0.3}
            />
            <MobileCard
              label={t("specialization.technology")}
              icon="💻"
              color="from-blue-400 to-blue-500"
              delay={0.4}
            />
            <MobileCard
              label={t("specialization.mathematics")}
              icon="🔢"
              color="from-blue-600 to-blue-700"
              delay={0.5}
            />
            <MobileCard
              label={t("specialization.science")}
              icon="🔬"
              color="from-blue-500 to-blue-600"
              delay={0.6}
            />
            <MobileCard
              label={t("specialization.languages")}
              icon="🌐"
              color="from-blue-600 to-blue-700"
              delay={0.7}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        @keyframes dash {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

// Connector Lines Component for Desktop
const ConnectorLines = () => (
  <div className="absolute inset-0 z-0">
    <svg className="w-full h-full" viewBox="0 0 800 400">
      {/* Animated dashed lines connecting cards */}
      <motion.path
        d="M 80 240 Q 150 180 250 100"
        stroke="url(#gradient1)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
        viewport={{ once: true }}
      />

      <motion.path
        d="M 130 140 Q 200 90 300 80"
        stroke="url(#gradient2)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3,8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 2.2, delay: 1.7, ease: "easeInOut" }}
        viewport={{ once: true }}
      />

      <motion.path
        d="M 300 80 Q 400 85 500 90"
        stroke="url(#gradient3)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4,12"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.35 }}
        transition={{ duration: 2.4, delay: 1.9, ease: "easeInOut" }}
        viewport={{ once: true }}
      />

      <motion.path
        d="M 500 90 Q 600 120 680 140"
        stroke="url(#gradient4)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6,10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 2.6, delay: 2.1, ease: "easeInOut" }}
        viewport={{ once: true }}
      />

      <motion.path
        d="M 680 140 Q 740 180 780 240"
        stroke="url(#gradient5)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 2.8, delay: 2.3, ease: "easeInOut" }}
        viewport={{ once: true }}
      />

      {/* Gradients for the lines */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Mobile Connector Lines Component
const MobileConnectorLines = () => (
  <div className="absolute inset-0 z-0">
    <svg className="w-full h-full max-w-sm mx-auto" viewBox="0 0 300 400">
      {/* Subtle grid-like connections */}
      <motion.line
        x1="75" y1="100" x2="225" y2="100"
        stroke="url(#mobileGradient1)"
        strokeWidth="1"
        strokeDasharray="3,6"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.25 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        viewport={{ once: true }}
      />

      <motion.line
        x1="75" y1="200" x2="225" y2="200"
        stroke="url(#mobileGradient2)"
        strokeWidth="1"
        strokeDasharray="4,8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1.7, delay: 1.0 }}
        viewport={{ once: true }}
      />

      <motion.line
        x1="75" y1="300" x2="225" y2="300"
        stroke="url(#mobileGradient3)"
        strokeWidth="1"
        strokeDasharray="3,6"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.25 }}
        transition={{ duration: 1.9, delay: 1.2 }}
        viewport={{ once: true }}
      />

      <motion.line
        x1="150" y1="50" x2="150" y2="350"
        stroke="url(#mobileGradient4)"
        strokeWidth="1"
        strokeDasharray="5,10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.2 }}
        transition={{ duration: 2.1, delay: 1.4 }}
        viewport={{ once: true }}
      />

      <defs>
        <linearGradient id="mobileGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="mobileGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="mobileGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="mobileGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Enhanced Subject Card Component for Desktop Arc Layout
const SubjectCard = ({
  label,
  position,
  delay,
  onHover,
  isHovered,
  icon,
  color,
}) => {
  const getPositionStyles = () => {
    // Perfect arc with mathematical precision - 6 cards evenly distributed on 180° semicircle
    // Responsive positioning for different screen sizes
    const positions = {
      "arc-left": "left-[8%] sm:left-[10%] md:left-[8%] lg:left-[8%] top-[60%] -translate-x-1/2 -translate-y-1/2", // 180° (leftmost)
      "arc-left-center":
        "left-[16%] sm:left-[18%] md:left-[16%] lg:left-[16%] top-[30%] -translate-x-1/2 -translate-y-1/2", // 144°
      "arc-center": "left-[36%] sm:left-[38%] md:left-[36%] lg:left-[36%] top-[15%] -translate-x-1/2 -translate-y-1/2", // 90° (top)
      "arc-right-center":
        "right-[30%] sm:right-[32%] md:right-[30%] lg:right-[30%] top-[15%] translate-x-1/2 -translate-y-1/2", // 36°
      "arc-right": "right-[8%] sm:right-[10%] md:right-[8%] lg:right-[8%] top-[30%] translate-x-1/2 -translate-y-1/2", // 0° (rightmost)
      "arc-far-right": "right-[2%] sm:right-[4%] md:right-[2%] lg:right-[2%] top-[60%] translate-x-1/2 -translate-y-1/2", // Extended position
    };
    return positions[position] || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05, y: -3 }}
      transition={{
        duration: 0.6,
        delay,
        hover: { duration: 0.3, type: "spring", stiffness: 300 },
      }}
      viewport={{ once: true }}
      className={`absolute ${getPositionStyles()} z-10`}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={`bg-gradient-to-br ${color} p-3 sm:p-4 md:p-4 lg:p-5 rounded-xl sm:rounded-2xl shadow-xl text-white cursor-pointer group transition-all duration-300 hover:shadow-2xl border-2 border-white/20`}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-full">
            {icon}
          </div>
          <div className="font-bold text-xs sm:text-sm md:text-sm lg:text-base leading-normal w-[80px] sm:w-[90px] md:w-[100px] lg:w-[120px]">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Mobile Card Component
const MobileCard = ({ label, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="cursor-pointer group"
  >
    <div
      className={`bg-gradient-to-br ${color} p-4 rounded-2xl shadow-lg text-white group-hover:shadow-xl transition-all duration-300 border-2 border-white/20`}
    >
      <div className="text-center">
        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="font-bold text-sm leading-normal">{label}</div>
      </div>
    </div>
  </motion.div>
);

export default FeaturesHomePageCourses;