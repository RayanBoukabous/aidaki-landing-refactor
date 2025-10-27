"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, ExternalLink, Star, Users, Clock, Shield, Award } from "lucide-react";

const VisualsPointsOfSale = () => {
  const t = useTranslations("pointsOfSale");
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const locations = [t("locations.0")];

  return (
    <section
      id="points-of-sale"
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30"
    >
      {/* ULTRA PROFESSIONAL BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* ULTRA PROFESSIONAL HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6">
            <MapPin className="w-4 h-4" />
            <span>NOS POINTS DE VENTE</span>
            <Star className="w-4 h-4" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-6 text-center font-cairo" lang="ar">
            {t("title")}
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-cairo" lang="ar">
            {t("description")}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ULTRA PROFESSIONAL IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* BACKGROUND GLOW EFFECT */}
            <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl blur-2xl opacity-20" />

            {/* MAIN IMAGE CONTAINER */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100/50 backdrop-blur-sm">

              {/* IMAGE WITH ENHANCED STYLING */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/images/pointsOfSale.png"
                  alt={t("imageAlt")}
                  className="w-full h-80 object-cover object-center transition-transform duration-700 hover:scale-105"
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
              </div>

              {/* FLOATING STATS CARDS */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl font-bold shadow-xl flex items-center gap-2 text-center">
                <MapPin className="w-4 h-4" />
                <span>📍 Techno Store</span>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white text-emerald-600 px-4 py-2 rounded-xl font-bold shadow-xl border border-emerald-200 flex items-center gap-2 text-center">
                <Users className="w-4 h-4" />
                <span>+1000 Clients</span>
              </div>
            </div>
          </motion.div>

          {/* ULTRA PROFESSIONAL INFO SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >

            {/* TECHNOSTORE FEATURES GRID */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center">Horaires Techno</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">Ouvert 7j/7 pour votre confort</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center">Garantie Techno</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">Produits certifiés et testés</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center">Expertise Techno</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">Conseils spécialisés</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center">Service Techno</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">Support personnalisé</p>
              </div>
            </div>

            {/* ULTRA PROFESSIONAL LOCATION BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <a
                target="_blank"
                href="https://technostationery.com/nos-points-de-vente"
                className="group block"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-2xl p-6 text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-center">Visitez Techno Store</h3>
                        <p className="text-emerald-100 text-center">Notre magasin spécialisé près de chez vous</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-center">Voir la carte</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* ADDITIONAL INFO BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 border-emerald-200 hover:border-emerald-300 rounded-xl px-8 py-4 text-emerald-700 hover:text-emerald-800 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 group"
              >
                <span className="font-cairo" lang="ar">{t("more")}</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ULTRA PROFESSIONAL STYLES */}
      <style jsx>{`
        /* ULTRA PROFESSIONAL ANIMATIONS */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        /* PREMIUM CARD EFFECTS */
        .premium-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .premium-card:hover {
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* GRADIENT TEXT EFFECT */
        .gradient-text {
          background: linear-gradient(135deg, #1f2937, #10b981, #059669);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        /* PREMIUM BUTTON EFFECTS */
        .premium-button {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }
        
        .premium-button:hover {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
          transform: translateY(-2px);
        }
        
        /* RESPONSIVE ENHANCEMENTS */
        @media (max-width: 768px) {
          .premium-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
        }
      `}</style>
    </section>
  );
};

export default VisualsPointsOfSale;
