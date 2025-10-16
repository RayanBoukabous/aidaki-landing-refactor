"use client";

import { Play, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/i18n";

const VideoShowcase = () => {
  const t = useTranslations("profAvatars");
  const tVideos = useTranslations("videoShowcase");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRTL = direction === "rtl";
  const [selectedVideo, setSelectedVideo] = useState(null);
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
      gradient: "from-green-400/80 to-emerald-600/80",
    },
    {
      id: 2,
      key: "droit",
      thumbnail: "/images/law-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+droit.mp4",
      gradient: "from-teal-500/80 to-green-600/80",
    },
    {
      id: 3,
      key: "economy",
      thumbnail: "/images/eco-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+economie.mp4",
      gradient: "from-emerald-500/80 to-teal-600/80",
    },
    {
      id: 4,
      key: "french",
      thumbnail: "/images/french-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+franc%CC%A7ais.mp4",
      gradient: "from-green-600/80 to-cyan-600/80",
    },
    {
      id: 5,
      key: "gp",
      thumbnail: "/images/gp-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+Genie+des+proceder.mp4",
      gradient: "from-lime-500/80 to-green-600/80",
    },
    {
      id: 6,
      key: "geography",
      thumbnail: "/images/geo-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+geographie.mp4",
      gradient: "from-green-500/80 to-teal-600/80",
    },
    {
      id: 7,
      key: "history",
      thumbnail: "/images/history-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+histoir.mp4",
      gradient: "from-emerald-600/80 to-green-700/80",
    },
    {
      id:8,
      key:"english",
      thumbnail: "/images/english-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+english.mp4",
      gradient: "from-emerald-600/80 to-green-700/80",
    },
    {
      id:9,
      key:"",
      thumbnail: "/images/philo-thumbnail.png",
      videoUrl: "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/1+minute+-+WEBSITE/1+minute+philo.mp4",
      gradient: "from-emerald-600/80 to-green-700/80",
    }
  ];

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="relative w-full py-12 sm:py-12 md:py-16" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-center text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            {tVideos("sectionTitle")}
          </h2>
          <p className="text-center text-base sm:text-base md:text-lg text-gray-600 mt-3">
            {tVideos("sectionDescription")}
          </p>
        </div>
        
        {/* Mobile: Enhanced Horizontal Swiper */}
        {isMobile ? (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex-none w-[85vw] snap-center"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl active:shadow-2xl transition-all duration-300 active:scale-95">
                    {/* Fixed aspect ratio matching image dimensions (2868 × 1572 ≈ 16:9) */}
                    <div className="aspect-video">
                      {/* Background Thumbnail - object-contain */}
                      <div className="absolute inset-0 bg-gray-900">
                        <img
                          src={video.thumbnail}
                          alt={t(`${video.key}.title`)}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${video.gradient} opacity-40`}
                      ></div>

                      {/* Center: Enhanced Play Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                          <Play
                            className={`w-10 h-10 text-green-600 ${
                              isRTL ? "mr-1" : "ml-1"
                            }`}
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      {/* Bottom: Enhanced Title */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        <h3 className="font-bold text-lg text-white leading-tight drop-shadow-lg mb-2">
                          {t(`${video.key}.title`)}
                        </h3>
                      </div>

                      {/* Subtle border effect */}
                      <div className="absolute inset-0 ring-2 ring-white/20 rounded-2xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Scroll Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="h-1.5 w-10 rounded-full bg-gray-300 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: Uniform Grid Layout */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {videos.map((video) => {
              return (
                <div
                  key={video.id}
                  className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  onClick={() => handleVideoClick(video)}
                  onMouseEnter={() => setHoveredVideo(video.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  {/* Aspect ratio matching image dimensions (2868 × 1572 ≈ 16:9) */}
                  <div className="aspect-video relative">
                    {/* Background Thumbnail - object-contain */}
                    <div className="absolute inset-0 bg-gray-900">
                      <img
                        src={video.thumbnail}
                        alt={t(`${video.key}.title`)}
                        className={`w-full h-full object-contain transition-transform duration-700 ${
                          hoveredVideo === video.id ? "scale-105" : "scale-100"
                        }`}
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${video.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
                    ></div>

                    {/* Center: Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                        <Play
                          className={`w-8 h-8 sm:w-10 sm:h-10 text-green-600 ${
                            isRTL ? "mr-1" : "ml-1"
                          }`}
                          fill="currentColor"
                        />
                      </div>
                    </div>

                    {/* Bottom: Title */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-5 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <h3 className="font-bold text-base md:text-lg text-white leading-tight drop-shadow-lg mb-1">
                        {t(`${video.key}.title`)}
                      </h3>
                    </div>

                    {/* Subtle border on hover */}
                    <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/40 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="rounded-xl sm:rounded-xl md:rounded-2xl overflow-hidden w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[85vh] relative shadow-2xl">
            {/* Enhanced Close Button */}
            <button
              onClick={closeVideo}
              className={`absolute top-3 ${
                isRTL ? "left-3" : "right-3"
              } sm:top-3 ${isRTL ? "sm:left-3" : "sm:right-3"} md:top-4 ${
                isRTL ? "md:left-4" : "md:right-4"
              } z-10 w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 touch-manipulation backdrop-blur-sm hover:scale-110 active:scale-95`}
              aria-label={isRTL ? "إغلاق الفيديو" : "Close video"}
            >
              <X className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            {/* Video Player */}
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
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Enhanced Video Info */}
            <div
              className={`p-5 sm:p-4 md:p-6 bg-white ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={direction}
            >
              <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-2 md:mb-3 leading-normal">
                {t(`${selectedVideo.key}.title`)}
              </h2>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VideoShowcase;