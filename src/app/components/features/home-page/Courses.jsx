"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FeaturesHomePageCourses = () => {
  const t = useTranslations("courses");
  const tSpecialization = useTranslations("courses.specialization");
  const locale = useLocale();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (label) => {
    setExpandedCard(expandedCard === label ? null : label);
  };

  const handleCloseExpansion = () => {
    setExpandedCard(null);
  };

  // BLOQUER LE SCROLL QUAND LE MODAL EST OUVERT
  useEffect(() => {
    if (expandedCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function pour réactiver le scroll quand le composant se démonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedCard]);

  return (
    <section
      id="courses"
      className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50"
    >
      {/* HEADER SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-6 font-cairo text-center" lang="ar"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-cairo" lang="ar"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        {/* DESIGN RÉVOLUTIONNAIRE RESPONSIVE - LAYOUT OPTIMISÉ SANS SUPERPOSITION */}
        <div className="relative max-w-7xl mx-auto py-12 sm:py-16 hidden sm:block">

          {/* CONTAINER PRINCIPAL AVEC ESPACEMENT OPTIMAL RESPONSIVE */}
          <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">

            {/* ROBOT À GAUCHE POUR FR/EN, À DROITE POUR AR - RESPONSIVE */}
            <div className={`col-span-12 lg:col-span-5 flex justify-center ${locale === 'ar' ? 'lg:order-2' : 'lg:order-1'} mt-8 lg:mt-0`}>
              <motion.div
                initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.2, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
                  <img
                    src="/images/module_avatar.png"
                    alt="AIDAKI Robot"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>

            {/* MODULES À DROITE POUR FR/EN, À GAUCHE POUR AR - RESPONSIVE */}
            <div className={`col-span-12 lg:col-span-7 ${locale === 'ar' ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* Ligne 1 */}
                <RevolutionaryModuleCard
                  label={t("specialization.mathematics")}
                  gradient="from-emerald-800 via-green-700 to-teal-800"
                  delay={0.3}
                  icon="🔢"
                  pattern="geometric"
                  onCardClick={handleCardClick}
                />
                <RevolutionaryModuleCard
                  label={t("specialization.technology")}
                  gradient="from-green-600 via-emerald-600 to-green-800"
                  delay={0.4}
                  icon="💻"
                  pattern="circuit"
                  onCardClick={handleCardClick}
                />

                {/* Ligne 2 */}
                <RevolutionaryModuleCard
                  label={t("specialization.languages")}
                  gradient="from-teal-500 via-green-500 to-emerald-600"
                  delay={0.5}
                  icon="🌐"
                  pattern="waves"
                  onCardClick={handleCardClick}
                />
                <RevolutionaryModuleCard
                  label={t("specialization.science")}
                  gradient="from-green-700 via-teal-700 to-emerald-800"
                  delay={0.6}
                  icon="🔬"
                  pattern="molecular"
                  onCardClick={handleCardClick}
                />

                {/* Ligne 3 */}
                <RevolutionaryModuleCard
                  label={t("specialization.literature")}
                  gradient="from-lime-600 via-green-500 to-emerald-600"
                  delay={0.7}
                  icon="📚"
                  pattern="texture"
                  onCardClick={handleCardClick}
                />
                <RevolutionaryModuleCard
                  label={t("specialization.management")}
                  gradient="from-emerald-600 via-green-500 to-teal-600"
                  delay={0.8}
                  icon="💼"
                  pattern="network"
                  onCardClick={handleCardClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Design Responsive - Ultra Professional */}
        <div className="sm:hidden px-4">
          {/* Mobile Logo Responsive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8 sm:mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-500/20 rounded-full blur-lg scale-110 sm:scale-125" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-white via-emerald-50 to-green-100 flex items-center justify-center shadow-xl border-3 border-emerald-200/50">
                <img
                  src="/images/logo-black.png"
                  alt="AIDAKI Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-md"
                />
              </div>
            </div>
          </motion.div>

          {/* Mobile Modules Grid Responsive */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-sm mx-auto">
            <SimpleMobileCard
              label={t("specialization.literature")}
              color="from-emerald-500 to-emerald-600"
              delay={0.2}
              onCardClick={handleCardClick}
            />
            <SimpleMobileCard
              label={t("specialization.mathematics")}
              color="from-emerald-600 to-emerald-700"
              delay={0.3}
              onCardClick={handleCardClick}
            />
            <SimpleMobileCard
              label={t("specialization.technology")}
              color="from-emerald-700 to-emerald-800"
              delay={0.4}
              onCardClick={handleCardClick}
            />
            <SimpleMobileCard
              label={t("specialization.languages")}
              color="from-green-500 to-green-600"
              delay={0.5}
              onCardClick={handleCardClick}
            />
            <SimpleMobileCard
              label={t("specialization.science")}
              color="from-green-600 to-green-700"
              delay={0.6}
              onCardClick={handleCardClick}
            />
            <SimpleMobileCard
              label={t("specialization.management")}
              color="from-green-700 to-green-800"
              delay={0.7}
              onCardClick={handleCardClick}
            />
          </div>
        </div>

        {/* STYLES CSS POUR ANIMATIONS AVANCÉES */}
        <style jsx>{`
        @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              opacity: 0.5;
          }
          50% {
              opacity: 0.8;
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 0.3;
            }
          }

          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(10px);
          }
          100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>

        {/* MODAL OVERLAY ULTRA PROFESSIONNEL AVEC BACKGROUND BLANC FLOU - RESPONSIVE */}
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-white/80 via-gray-50/70 to-white/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
            onClick={handleCloseExpansion}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200/50 relative mx-2 sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* BACKGROUND PATTERN BLANC NET */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/30" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-gray-200/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-200/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/10 to-gray-100/10 rounded-full blur-3xl" />
              </div>

              {/* HEADER MODAL RESPONSIVE AVEC POSITIONS INVERSÉES */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
                <div className="flex items-center gap-4 sm:gap-6 order-2 sm:order-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl border border-emerald-200/50">
                      <img
                        src="/images/robot_study.png"
                        alt="Robot Study"
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent font-cairo" lang="ar">
                      {expandedCard}
                    </h3>
                    <p className="text-sm sm:text-base text-emerald-600 font-medium font-cairo" lang="ar">{tSpecialization("programDetails")}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseExpansion}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 self-end sm:self-auto order-1 sm:order-2"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* CONTENU MODAL RESPONSIVE AVEC ROBOT WRITING */}
              <div className="relative z-10 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-emerald-200/50">
                    <img
                      src="/images/robot_writing.png"
                      alt="Robot Writing"
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain drop-shadow-lg"
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 font-cairo" lang="ar">{tSpecialization("includedSubjects")}</h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-300 to-green-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {getModuleDetailsForCard(expandedCard).map((subject, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-r from-white to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:border-emerald-300/70 opacity-0 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 text-sm sm:text-base mb-1 font-cairo" lang="ar">
                            {locale === 'ar' ? subject.arabic : subject.french}
                          </div>
                          <div className="text-emerald-600 text-xs sm:text-sm font-medium font-cairo" lang="ar">
                            {locale === 'ar' ? subject.french : subject.arabic}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-600 font-medium font-cairo" lang="ar">{tSpecialization("subjectAvailable")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER MODAL RESPONSIVE */}
              <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-emerald-200/50">
                <div className="flex justify-center items-center">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg border border-emerald-200/50">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base text-emerald-700 font-semibold font-cairo" lang="ar">
                      {tSpecialization("totalSubjects").replace("{count}", getModuleDetailsForCard(expandedCard).length)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// REVOLUTIONARY MODULE CARD - DESIGN COMPLÈTEMENT INNOVANT AVEC MODAL
const RevolutionaryModuleCard = ({
  label,
  gradient,
  delay,
  icon,
  pattern,
  onCardClick,
}) => {
  const getPatternSVG = () => {
    const patterns = {
      geometric: (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="currentColor" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
      circuit: (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
          <circle cx="70" cy="70" r="3" fill="currentColor" />
          <path d="M30,30 L70,70" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
      waves: (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <path d="M0,50 Q25,20 50,50 T100,50" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M0,60 Q25,30 50,60 T100,60" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      ),
      molecular: (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <circle cx="30" cy="30" r="8" fill="currentColor" />
          <circle cx="70" cy="30" r="8" fill="currentColor" />
          <circle cx="50" cy="70" r="8" fill="currentColor" />
          <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="2" />
          <line x1="70" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      texture: (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <rect x="10" y="10" width="20" height="20" fill="currentColor" />
          <rect x="40" y="40" width="20" height="20" fill="currentColor" />
          <rect x="70" y="70" width="20" height="20" fill="currentColor" />
        </svg>
      ),
      network: (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <circle cx="25" cy="25" r="5" fill="currentColor" />
          <circle cx="75" cy="25" r="5" fill="currentColor" />
          <circle cx="25" cy="75" r="5" fill="currentColor" />
          <circle cx="75" cy="75" r="5" fill="currentColor" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <line x1="25" y1="25" x2="75" y2="25" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="1" />
          <line x1="75" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="75" x2="75" y2="75" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="25" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="75" y1="25" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="75" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="75" y1="75" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
    };
    return patterns[pattern] || patterns.geometric;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        scale: 1.08,
        y: -8,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.4, type: "spring", stiffness: 300 }
      }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onCardClick(label)}
    >
      <div className="relative">
        {/* AURA DYNAMIQUE */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

        {/* CARD PRINCIPALE - DESIGN RÉVOLUTIONNAIRE */}
        <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-5 shadow-xl group-hover:shadow-2xl transition-all duration-400 min-h-[120px] flex flex-col justify-between border border-white/30 backdrop-blur-sm overflow-hidden`}>

          {/* PATTERN SVG BACKGROUND */}
          {getPatternSVG()}

          {/* CONTENU PRINCIPAL */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            {/* Icône */}
            <div className="text-3xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
              {icon}
            </div>

            {/* Flèche */}
            <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* TITRE */}
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-white/90 transition-colors duration-300 text-center font-cairo" lang="ar">
              {label}
            </h3>
          </div>

          {/* ÉLÉMENTS DÉCORATIFS DYNAMIQUES */}
          <div className="absolute top-3 right-3 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-1/2 left-2 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />

          {/* EFFET DE PROFONDEUR AVANCÉ */}
          <div className="absolute inset-0 rounded-2xl opacity-30" style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.1) 100%)`
          }} />

          {/* BORDURE DYNAMIQUE */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/25 group-hover:border-white/50 transition-colors duration-400" />

          {/* EFFET DE LUMIÈRE AU HOVER */}
          <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        </div>

      </div>
    </motion.div>
  );
};

// FONCTION HELPER POUR LES DÉTAILS DU MODAL - DONNÉES COMPLÈTES
const getModuleDetailsForCard = (label) => {
  switch (label) {
    // Mathématiques
    case 'شعبة رياضيات':
    case 'Mathématiques':
    case 'Mathématiques':
      return [
        { arabic: 'الرياضيات', french: 'Mathématiques' },
        { arabic: 'العلوم الفيزيائية', french: 'Sciences physiques' },
        { arabic: 'العلوم الطبيعية', french: 'Sciences naturelles' },
        { arabic: 'اللغة العربية', french: 'Langue arabe' },
        { arabic: 'اللغة الفرنسية', french: 'Langue française' },
        { arabic: 'اللغة الإنجليزية', french: 'Langue anglaise' },
        { arabic: 'التاريخ والجغرافيا', french: 'Histoire et géographie' },
        { arabic: 'الفلسفة', french: 'Philosophie' }
      ];

    // Sciences expérimentales
    case 'شعبة علوم تجريبية':
    case 'Sciences expérimentales':
    case 'Sciences expérimentales':
      return [
        { arabic: 'علوم الطبيعة', french: 'Sciences naturelles' },
        { arabic: 'العلوم الفيزيائية', french: 'Sciences physiques' },
        { arabic: 'الرياضيات', french: 'Mathématiques' },
        { arabic: 'اللغة العربية', french: 'Langue arabe' },
        { arabic: 'اللغة الفرنسية', french: 'Langue française' },
        { arabic: 'اللغة الإنجليزية', french: 'Langue anglaise' },
        { arabic: 'التاريخ والجغرافيا', french: 'Histoire et géographie' },
        { arabic: 'الفلسفة', french: 'Philosophie' }
      ];

    // Techniques mathématiques
    case 'شعبة تقني رياضي':
    case 'Techniques mathématiques':
    case 'Technologie':
      return [
        { arabic: 'الرياضيات', french: 'Mathématiques' },
        { arabic: 'العلوم الفيزيائية', french: 'Sciences physiques' },
        { arabic: 'الهندسة المدنية', french: 'Génie civil' },
        { arabic: 'الهندسة الكهربائية', french: 'Génie électrique' },
        { arabic: 'هندسة ميكانيكية', french: 'Génie mécanique' },
        { arabic: 'هندسة الطرائق', french: 'Génie des procédés' },
        { arabic: 'اللغة العربية', french: 'Langue arabe' },
        { arabic: 'اللغة الفرنسية', french: 'Langue française' },
        { arabic: 'اللغة الإنجليزية', french: 'Langue anglaise' },
        { arabic: 'التاريخ والجغرافيا', french: 'Histoire et géographie' },
        { arabic: 'الفلسفة', french: 'Philosophie' }
      ];

    // Gestion et économie
    case 'شعبة تسيير واقتصاد':
    case 'Gestion et économie':
    case 'Gestion et Économie':
      return [
        { arabic: 'التسيير المحاسبي', french: 'Gestion comptable' },
        { arabic: 'الرياضيات', french: 'Mathématiques' },
        { arabic: 'التاريخ والجغرافيا', french: 'Histoire et géographie' },
        { arabic: 'اقتصاد ومناجمنت', french: 'Économie et management' },
        { arabic: 'القانون', french: 'Droit' },
        { arabic: 'اللغة العربية', french: 'Langue arabe' },
        { arabic: 'اللغة الفرنسية', french: 'Langue française' },
        { arabic: 'اللغة الإنجليزية', french: 'Langue anglaise' },
        { arabic: 'الفلسفة', french: 'Philosophie' }
      ];

    // Lettres et philosophie
    case 'شعبة آداب و فلسفة':
    case 'Lettres et philosophie':
    case 'Littérature et Philosophie':
      return [
        { arabic: 'اللغة العربية', french: 'Langue arabe' },
        { arabic: 'الفلسفة', french: 'Philosophie' },
        { arabic: 'اللغة الفرنسية', french: 'Langue française' },
        { arabic: 'اللغة الإنجليزية', french: 'Langue anglaise' },
        { arabic: 'التاريخ والجغرافيا', french: 'Histoire et géographie' },
        { arabic: 'الرياضيات', french: 'Mathématiques' }
      ];

    // Langues étrangères
    case 'شعبة لغات أجنبية':
    case 'Langues étrangères':
    case 'Langues Étrangères':
      return [
        { arabic: 'اللغة العربية', french: 'Langue arabe' },
        { arabic: 'اللغة الفرنسية', french: 'Langue française' },
        { arabic: 'اللغة الإنجليزية', french: 'Langue anglaise' },
        { arabic: 'اللغة الإسبانية', french: 'Langue espagnole' },
        { arabic: 'اللغة الألمانية', french: 'Langue allemande' },
        { arabic: 'اللغة الإيطالية', french: 'Langue italienne' },
        { arabic: 'التاريخ والجغرافيا', french: 'Histoire et géographie' },
        { arabic: 'الفلسفة', french: 'Philosophie' },
        { arabic: 'الرياضيات', french: 'Mathématiques' }
      ];

    default:
      return [];
  }
};

// SIMPLE MOBILE CARD - SANS ICÔNES NI POURCENTAGES AVEC MODAL
const SimpleMobileCard = ({
  label,
  color,
  delay,
  onCardClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onCardClick(label)}
    >
      <div className="relative">
        {/* Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl blur-lg opacity-0 group-hover:opacity-15 transition-opacity duration-300`} />

        {/* Main Card */}
        <div className={`relative bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm`}>

          {/* Content */}
          <div className="flex items-center justify-between">
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-100 transition-colors duration-300 text-center font-cairo" lang="ar">
                {label}
              </h3>
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white/30 rounded-full" />
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturesHomePageCourses;