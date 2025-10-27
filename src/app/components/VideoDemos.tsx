"use client";

import { Play, X, Sparkles, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";

const VideoShowcase = () => {
  const t = useTranslations("videoSubjects");
  const tVideos = useTranslations("videoShowcase");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRTL = direction === "rtl";
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const videos = [
    {
      id: 1,
      key: "compta",
      thumbnail: "/images/compta-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+Comptabilite..mp4",
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      accentColor: "emerald",
      icon: "📊",
      pattern: "dots"
    },
    {
      id: 2,
      key: "droit",
      thumbnail: "/images/law-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+droit.mp4",
      gradient: "from-teal-500 via-emerald-600 to-green-700",
      accentColor: "teal",
      icon: "⚖️",
      pattern: "lines"
    },
    {
      id: 3,
      key: "economy",
      thumbnail: "/images/eco-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+economie.mp4",
      gradient: "from-green-500 via-emerald-600 to-teal-700",
      accentColor: "green",
      icon: "💰",
      pattern: "waves"
    },
    {
      id: 4,
      key: "french",
      thumbnail: "/images/french-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+franc%CC%A7ais.mp4",
      gradient: "from-emerald-600 via-green-600 to-cyan-600",
      accentColor: "emerald",
      icon: "🇫🇷",
      pattern: "circles"
    },
    {
      id: 5,
      key: "gp",
      thumbnail: "/images/gp-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+Genie+des+proceder.mp4",
      gradient: "from-lime-500 via-green-600 to-emerald-700",
      accentColor: "lime",
      icon: "⚙️",
      pattern: "hexagons"
    },
    {
      id: 6,
      key: "geography",
      thumbnail: "/images/geo-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+geographie.mp4",
      gradient: "from-green-500 via-teal-600 to-emerald-700",
      accentColor: "green",
      icon: "🌍",
      pattern: "grid"
    },
    {
      id: 7,
      key: "history",
      thumbnail: "/images/history-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+histoir.mp4",
      gradient: "from-emerald-600 via-green-700 to-teal-800",
      accentColor: "emerald",
      icon: "📜",
      pattern: "diagonal"
    },
    {
      id:8,
      key:"english",
      thumbnail: "/images/english-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+english.mp4",
      gradient: "from-emerald-600 via-green-700 to-teal-800",
      accentColor: "emerald",
      icon: "🇬🇧",
      pattern: "stars"
    },
    {
      id:9,
      key:"philo",
      thumbnail: "/images/philo-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+philo.mp4",
      gradient: "from-emerald-600 via-green-700 to-teal-800",
      accentColor: "emerald",
      icon: "🤔",
      pattern: "spiral"
    }
  ];

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  // COMPOSANT CARTE ULTRA PROFESSIONNELLE
  const UltraProVideoCard = ({ video, index, isMobile = false }: { video: any, index: number, isMobile?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const getPatternSVG = (pattern: string) => {
      switch (pattern) {
        case 'dots':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <defs>
                <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#dots)" />
            </svg>
          );
        case 'lines':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <defs>
                <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0,10 L20,10" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#lines)" />
            </svg>
          );
        case 'waves':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <path d="M0,50 Q25,25 50,50 T100,50" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M0,60 Q25,35 50,60 T100,60" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          );
        case 'circles':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="80" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          );
        case 'hexagons':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <polygon points="50,10 80,30 80,70 50,90 20,70 20,30" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          );
        case 'grid':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          );
        case 'diagonal':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <path d="M0,0 L100,100" stroke="currentColor" strokeWidth="2" />
              <path d="M0,100 L100,0" stroke="currentColor" strokeWidth="2" />
            </svg>
          );
        case 'stars':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />
            </svg>
          );
        case 'spiral':
          return (
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <path d="M50,50 Q50,25 75,25 Q100,25 100,50 Q100,75 75,75 Q50,75 50,50" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05, y: -10 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
        className="group cursor-pointer relative"
        onClick={() => handleVideoClick(video)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* BACKGROUND GLOW EFFECT */}
        <div className={`absolute -inset-4 bg-gradient-to-br ${video.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
        
        {/* MAIN CARD CONTAINER */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm">
          
          {/* PATTERN OVERLAY */}
          <div className="absolute inset-0 text-white">
            {getPatternSVG(video.pattern)}
          </div>
          
          {/* GRADIENT OVERLAY */}
          <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
          
          {/* CONTENT CONTAINER */}
          <div className="relative z-10 p-6">
            
            {/* HEADER WITH ICON AND TITLE */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${video.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <span className="text-2xl">{video.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {t(`${video.key}.title`)}
                  </h3>
                </div>
              </div>
            </div>
            
            {/* THUMBNAIL CONTAINER */}
            <div className="relative rounded-xl overflow-hidden mb-4 group-hover:rounded-2xl transition-all duration-500">
              <div className="aspect-video bg-gray-900">
                <img
                  src={video.thumbnail}
                  alt={t(`${video.key}.title`)}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* PLAY BUTTON OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <motion.div
                  animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
                >
                  <Play className="w-8 h-8 text-green-600 ml-1" fill="currentColor" />
                </motion.div>
              </div>
              
              {/* GRADIENT OVERLAY ON THUMBNAIL */}
              <div className={`absolute inset-0 bg-gradient-to-t ${video.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
            </div>
            
            {/* FOOTER WITH ACTION BUTTONS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">1 min</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">HD</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-4 h-4 text-white" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
          
          {/* BORDER GLOW EFFECT */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${video.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} style={{ padding: '2px' }}>
            <div className="w-full h-full bg-white rounded-2xl" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* ULTRA PROFESSIONAL HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-emerald-700 to-green-600 bg-clip-text text-transparent mb-6 font-poppins">
            {tVideos("sectionTitle")}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-poppins">
            {tVideos("sectionDescription")}
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
        
        {/* ULTRA PROFESSIONAL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((video, index) => (
            <UltraProVideoCard
                  key={video.id}
              video={video}
              index={index}
              isMobile={isMobile}
            />
              ))}
            </div>

        {/* CALL TO ACTION SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-16 sm:mt-20"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Prêt à découvrir plus de contenu ?
              </h3>
              <p className="text-emerald-100 text-lg mb-6">
                Rejoignez des milliers d'étudiants qui apprennent avec AIDAKI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Commencer maintenant
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105">
                  Voir tous les cours
                </button>
              </div>
            </div>
          </div>
        </motion.div>
                    </div>

      {/* ULTRA PROFESSIONAL VIDEO MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-4xl max-h-[90vh] relative"
            >
            {/* MODAL BACKGROUND WITH GRADIENT */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-emerald-50/50 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
              
              {/* HEADER SIMPLIFIED */}
              <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{selectedVideo.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        {t(`${selectedVideo.key}.title`)}
                      </h2>
                    </div>
                  </div>
                  
                  {/* CLOSE BUTTON */}
                  <button
                    onClick={closeVideo}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    aria-label="Fermer la vidéo"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
      </div>

              {/* VIDEO PLAYER CONTAINER */}
              <div className="relative">
            <div className="aspect-video bg-black">
              <video
                className="w-full h-full"
                controls
                autoPlay
                playsInline
                preload="metadata"
                key={selectedVideo.id}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la balise vidéo.
              </video>
            </div>

                {/* GRADIENT OVERLAY ON VIDEO */}
                <div className={`absolute inset-0 bg-gradient-to-t ${selectedVideo.gradient} opacity-0 pointer-events-none`} />
              </div>

              {/* SIMPLIFIED VIDEO INFO */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600 font-medium">1 minute</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-600 font-medium">Qualité HD</span>
                    </div>
                  </div>
            </div>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* ULTRA PROFESSIONAL STYLES */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
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
        
        /* PATTERN OVERLAYS */
        .pattern-dots {
          background-image: radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .pattern-lines {
          background-image: linear-gradient(45deg, rgba(16, 185, 129, 0.1) 25%, transparent 25%), 
                            linear-gradient(-45deg, rgba(16, 185, 129, 0.1) 25%, transparent 25%);
          background-size: 20px 20px;
        }
        
        /* RESPONSIVE ENHANCEMENTS */
        @media (max-width: 768px) {
          .premium-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
        }
      `}</style>
    </div>
  );
};

export default VideoShowcase;