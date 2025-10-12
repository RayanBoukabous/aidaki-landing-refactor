"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getDirection } from "@/i18n";

interface Professor {
  id: number;
  name: string;
  title: string;
  subject: string;
  avatar: string;
  isActive?: boolean;
  avatarKey: keyof typeof profAvatarsData;
}

const ProfAvatars = () => {
  const t = useTranslations("profAvatars");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRTL = direction === "rtl";

  const [selectedProfId, setSelectedProfId] = useState<number | null>(null);
  const [hoveredProfId, setHoveredProfId] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Professor data with translation keys
  const profAvatarsData = {
    economy: {
      key: "economy",
      subject: "الاقتصاد والتجارة",
      avatar: "/images/avatar-economy.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/Economy.mp4",
    },
    arab: {
      key: "arab",
      subject: "الأدب والنحو",
      avatar: "/images/avatar-arabic.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/ARABE.mp4",
    },
    droit: {
      key: "droit",
      avatar: "/images/avatar-law.png",
      subject: "القانون المدني",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/DROIT.mp4",
    },
    physics: {
      key: "physics",
      subject: "الفيزياء",
      avatar: "/images/avatar-physics.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/Physic.mp4",
    },
    gp: {
      key: "gp",
      subject: "هندسة العمليات",
      avatar: "/images/avatar-gp.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/GP.mp4",
    },
    german: {
      key: "german",
      subject: "اللغة الألمانية",
      avatar: "/images/avatar-german.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/German.mp4",
    },
    sciences: {
      key: "sciences",
      subject: "العلوم الطبيعية",
      avatar: "/images/avatar-science.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/Science.mp4",
    },
    english: {
      key: "english",
      subject: "اللغة الإنجليزية",
      avatar: "/images/avatar-english.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/English.mp4",
    },
    geography: {
      key: "geography",
      subject: "الجغرافيا",
      avatar: "/images/avatar-geo.png",
      video:
        "https://aidaki-public-bucket.s3.us-east-1.amazonaws.com/avatar+with+logo/Geo.mp4",
    },
  } as const;

  // Generate professors with translations
  const professors: Professor[] = Object.entries(profAvatarsData).map(
    ([key, data], index) => ({
      id: index + 1,
      name: t(`${key}.title`),
      title: "مستوى الثالثة ثانوي",
      subject: data.subject,
      avatar: data.avatar,
      avatarKey: key as keyof typeof profAvatarsData,
    })
  );

  // Enhanced responsive breakpoints - larger sizes for mobile
  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setItemsToShow(1);
      } else if (width < 640) {
        setItemsToShow(1);
      } else if (width < 768) {
        setItemsToShow(2);
      } else if (width < 1024) {
        setItemsToShow(2);
      } else if (width < 1280) {
        setItemsToShow(3);
      } else if (width < 1536) {
        setItemsToShow(4);
      } else {
        setItemsToShow(4);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);

    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  // Reset current index when items to show changes
  useEffect(() => {
    if (currentIndex >= professors.length - itemsToShow + 1) {
      setCurrentIndex(Math.max(0, professors.length - itemsToShow));
    }
  }, [itemsToShow, currentIndex, professors.length]);

  // Autoplay functionality
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = professors.length - itemsToShow;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  }, [professors.length, itemsToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = professors.length - itemsToShow;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  }, [professors.length, itemsToShow]);

  // Start autoplay
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isAutoPlaying && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
  }, [isAutoPlaying, isPaused, nextSlide]);

  // Stop autoplay
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Initialize autoplay
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // Pause autoplay on hover/interaction
  const handleMouseEnterContainer = () => {
    setIsPaused(true);
    stopAutoPlay();
  };

  const handleMouseLeaveContainer = () => {
    setIsPaused(false);
    startAutoPlay();
  };

  const handleProfClick = (profId: number) => {
    setSelectedProfId(profId);
    setShowVideo(true);
    stopAutoPlay();
  };

  const handleMouseEnter = (profId: number) => {
    setHoveredProfId(profId);
  };

  const handleMouseLeave = () => {
    setHoveredProfId(null);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setSelectedProfId(null);
    startAutoPlay();
  };

  const handleManualNavigation = (direction: "next" | "prev") => {
    setIsPaused(true);
    stopAutoPlay();

    if (direction === "next") {
      nextSlide();
    } else {
      prevSlide();
    }

    setTimeout(() => {
      setIsPaused(false);
      startAutoPlay();
    }, 8000);
  };

  const goToSlide = (slideIndex: number) => {
    setIsPaused(true);
    stopAutoPlay();
    setCurrentIndex(slideIndex * itemsToShow);

    setTimeout(() => {
      setIsPaused(false);
      startAutoPlay();
    }, 8000);
  };

  const toggleAutoplay = () => {
    setIsAutoPlaying((prev) => !prev);
    if (!isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  };

  const visibleProfessors = professors.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  const isHighlighted = (profId: number) => {
    return selectedProfId === profId || hoveredProfId === profId;
  };

  const totalPages = Math.ceil(professors.length / itemsToShow);
  const currentPage = Math.floor(currentIndex / itemsToShow);

  return (
    <div
      className="relative w-full py-8 sm:py-6 md:py-8 lg:py-12 xl:py-16 2xl:py-20"
      dir={direction}
    >
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-8xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Professors Grid */}
        <div
          className="flex justify-center items-center gap-4 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 md:-translate-y-8 lg:-translate-y-12 xl:-translate-y-16 2xl:-translate-y-20"
          onMouseEnter={handleMouseEnterContainer}
          onMouseLeave={handleMouseLeaveContainer}
        >
          {/* Previous Arrow */}
          {professors.length > itemsToShow && (
            <div className="flex items-center">
              <button
                onClick={() => handleManualNavigation("prev")}
                className="w-12 h-12 xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group touch-manipulation border border-gray-200 hover:border-gray-300 active:scale-95"
                aria-label={isRTL ? "الأساتذة التالون" : "Previous professors"}
              >
                {isRTL ? (
                  <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-600 group-hover:text-gray-800 transition-colors" />
                ) : (
                  <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-600 group-hover:text-gray-800 transition-colors" />
                )}
              </button>
            </div>
          )}

          {visibleProfessors.map((prof) => (
            <div
              key={prof.id}
              className={`group cursor-pointer transition-all duration-500 transform hover:scale-105 active:scale-95 relative touch-manipulation ${
                isHighlighted(prof.id) ? "scale-105 z-10" : ""
              } ${
                (hoveredProfId !== null || selectedProfId !== null) &&
                !isHighlighted(prof.id)
                  ? "opacity-40 scale-95"
                  : "opacity-100"
              }`}
              onClick={() => handleProfClick(prof.id)}
              onMouseEnter={() => handleMouseEnter(prof.id)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseEnter(prof.id)}
              onTouchEnd={handleMouseLeave}
            >
              {/* Glowing border effect */}
              {isHighlighted(prof.id) && (
                <div className="absolute -inset-2 sm:-inset-2 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-400 to-green-400 blur-sm opacity-75 animate-pulse"></div>
              )}

              {/* Avatar Card */}
              <div
                className={`relative rounded-xl sm:rounded-xl lg:rounded-2xl xl:rounded-3xl overflow-hidden transition-all duration-500 bg-white shadow-lg ${
                  isHighlighted(prof.id) ? "shadow-2xl" : "shadow-md"
                }`}
              >
                {/* Avatar Image - Significantly larger on mobile */}
                <div className="relative">
                  <img
                    src={prof.avatar}
                    alt={prof.name}
                    className={`w-64 h-80 xs:w-64 xs:h-80 sm:w-44 sm:h-60 md:w-52 md:h-72 lg:w-60 lg:h-80 xl:w-72 xl:h-96 2xl:w-80 2xl:h-[28rem] object-cover transition-all duration-500 ${
                      isHighlighted(prof.id)
                        ? "brightness-110 saturate-110"
                        : ""
                    }`}
                    loading="lazy"
                  />

                  {/* Overlay glow effect */}
                  {isHighlighted(prof.id) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20"></div>
                  )}

                  {/* Play icon overlay */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      isHighlighted(prof.id)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="w-16 h-16 xs:w-16 xs:h-16 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                      <svg
                        className={`w-8 h-8 xs:w-8 xs:h-8 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-gray-800 ${
                          isRTL ? "mr-1 sm:mr-1" : "ml-1 sm:ml-1"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedProfId === prof.id && (
                    <div
                      className={`absolute top-3 ${
                        isRTL ? "left-3" : "right-3"
                      } sm:top-3 ${
                        isRTL ? "sm:left-3" : "sm:right-3"
                      } lg:top-4 ${
                        isRTL ? "lg:left-4" : "lg:right-4"
                      } xl:top-6 ${
                        isRTL ? "xl:left-6" : "xl:right-6"
                      } w-10 h-10 xs:w-10 xs:h-10 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce`}
                    >
                      <svg
                        className="w-5 h-5 xs:w-5 xs:h-5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Professor Info Overlay */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 xs:p-4 sm:p-4 lg:p-5 xl:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <h3 className="text-base xs:text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-2 leading-normal">
                      {prof.name}
                    </h3>
                    <p className="text-sm sm:text-sm md:text-base lg:text-lg opacity-90 mb-1 sm:mb-1 leading-normal">
                      {prof.subject}
                    </p>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base opacity-70 leading-normal">
                      {prof.title}
                    </p>
                  </div>
                </div>

                {/* Bottom accent line */}
                {isHighlighted(prof.id) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                )}
              </div>
            </div>
          ))}

          {/* Next Arrow */}
          {professors.length > itemsToShow && (
            <div className="flex items-center">
              <button
                onClick={() => handleManualNavigation("next")}
                className="w-12 h-12 xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group touch-manipulation border border-gray-200 hover:border-gray-300 active:scale-95"
                aria-label={isRTL ? "الأساتذة السابقون" : "Next professors"}
              >
                {isRTL ? (
                  <ChevronLeft className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-600 group-hover:text-gray-800 transition-colors" />
                ) : (
                  <ChevronRight className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-600 group-hover:text-gray-800 transition-colors" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Progress bar - Larger on mobile */}
        <div className="flex justify-center mt-6 sm:mt-6 md:mt-8">
          <div className="w-48 xs:w-48 sm:w-40 md:w-48 lg:w-56 xl:w-64 bg-gray-200 rounded-full h-2 sm:h-1.5">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pagination Dots - Larger on mobile */}
        <div
          className={`flex justify-center mt-5 sm:mt-4 md:mt-6 gap-2 sm:gap-2`}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 xs:w-3 xs:h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 touch-manipulation hover:scale-125 ${
                currentPage === index
                  ? "bg-green-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="rounded-xl sm:rounded-xl md:rounded-2xl overflow-hidden w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[85vh] relative shadow-2xl">
            {/* Close Button */}
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
                key={selectedProfId}
              >
                <source
                  src={
                    selectedProfId
                      ? profAvatarsData[
                          professors.find((p) => p.id === selectedProfId)
                            ?.avatarKey || "economy"
                        ].video
                      : "/videos/video1.mp4"
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div
              className={`p-5 sm:p-4 md:p-6 bg-white ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={direction}
            >
              {selectedProfId && (
                <>
                  <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-2 md:mb-3 leading-normal">
                    {professors.find((p) => p.id === selectedProfId)?.name}
                  </h2>
                  <p className="text-base sm:text-base md:text-lg lg:text-xl text-gray-600 mb-1 sm:mb-1 md:mb-2 leading-normal">
                    {professors.find((p) => p.id === selectedProfId)?.subject}
                  </p>
                  <p className="text-sm sm:text-sm md:text-base text-gray-500 leading-normal">
                    {professors.find((p) => p.id === selectedProfId)?.title}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfAvatars;
