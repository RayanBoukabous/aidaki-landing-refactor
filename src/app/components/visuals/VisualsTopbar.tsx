"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createPortal } from "react-dom";
import { getDirection } from "../../../i18n";
import { smoothScrollTo } from "../../../utils/smoothScroll";

export default function VisualsTopbar() {
  const { locale } = useParams();
  const t = useTranslations();
  const router = useRouter();
  const direction = getDirection(locale as string);
  const isRTL = direction === "rtl";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutDropdownOpen, setMobileAboutDropdownOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(locale as string);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{days:number;hours:number;minutes:number;seconds:number}>({days:0,hours:0,minutes:0,seconds:0});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown to 15 Dec 2025 00:00:00
  useEffect(() => {
    const target = new Date(2025, 11, 15, 0, 0, 0).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Calculate dropdown position using React refs (secure method)
  useEffect(() => {
    if (!aboutDropdownOpen || !mounted || !dropdownTriggerRef.current) {
      setDropdownPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!dropdownTriggerRef.current) return;
      const button = dropdownTriggerRef.current;
      const rect = button.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      const top = rect.bottom + scrollTop + 8;

      if (isRTL) {
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;
        const right = viewportWidth - rect.right - scrollLeft;
        setDropdownPosition({
          top,
          right: Math.max(right, 0),
        });
      } else {
        setDropdownPosition({
          top,
          left: rect.left + scrollLeft,
        });
      }
    };

    updatePosition();

    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [aboutDropdownOpen, mounted, isRTL]);

  // Handle dropdown link clicks
  const handleDropdownLinkClick = (href: string) => {
    setAboutDropdownOpen(false);
    if (href.includes('#')) {
      router.push(`/${locale}/about`);
      setTimeout(() => {
        const hash = href.split('#')[1];
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      router.push(href);
    }
  };

  // Navigation routes - Define explicit order for LTR and RTL
  const mainRoutes = useMemo(() => {
    const homeRoute = {
      name: "navHome",
      link: "/",
    };

    const aboutRoute = {
      name: "aboutUs.nav.aboutUs",
      hasDropdown: true,
      link: "/about",
      dropdownItems: [
        {
          name: "aboutUs.title",
          link: "/about",
        },
        {
          name: "aboutUs.nav.ourVision",
          link: "/about#vision",
        },
        {
          name: "aboutUs.nav.newEducationalApproach",
          link: "/about#new-approach",
        },
        {
          name: "aboutUs.nav.effectOfAvatars",
          link: "/about#avatar-technology",
        },
      ],
    };

    const pointsOfSaleRoute = {
      name: "pointsOfSale.title",
      link: "/#points-of-sale",
    };

    const newsRoute = {
      name: "educationResources.title",
      link: "/news",
    };

    const pricesRoute = {
      name: "navPrices",
      link: "/#prices",
    };

    const supportRoute = {
      name: "support.title",
      link: "/support-and-assistance",
    };

    if (isRTL) {
      // Arabic (RTL): display Support on the far right, Home on the far left
      return [
        supportRoute,
        pricesRoute,
        newsRoute,
        pointsOfSaleRoute,
        aboutRoute,
        homeRoute,
      ];
    }

    // LTR locales keep the standard left-to-right order
    return [
      homeRoute,
      aboutRoute,
      pointsOfSaleRoute,
      newsRoute,
      pricesRoute,
      supportRoute,
    ];
  }, [isRTL, locale, t]);

  const loginRoute = useMemo(() => ({
    name: "login",
    link: "/login",
  }), []);

  // Social media links (memoized)
  const socialLinks = useMemo(() => [
    {
      href: "https://www.instagram.com/aidaki.ai",
      label: "Instagram",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
      href: "https://www.facebook.com/profile.php?id=61580462821351",
      label: "Facebook",
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
      href: "https://www.tiktok.com/@aidaki.ai?_r=1&_t=ZM-91yi1H9x0wd",
      label: "TikTok",
      icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    },
  ], []);

  // Close mobile menu on larger screens
  const handleResize = () => {
    if (window.innerWidth >= 768 && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Close mobile menu when Escape key is pressed
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setMobileMenuOpen(false);
      setAboutDropdownOpen(false);
    }
  };

  const setLocale = (newLocale: string) => {
    setCurrentLocale(newLocale);
    // Navigate to the new locale
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    // Set initial direction based on locale
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // Add body class when mobile menu is open to prevent scrolling
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileMenuOpen, isRTL]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setAboutDropdownOpen(false);
    };

    if (aboutDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [aboutDropdownOpen]);

  // Get dropdown items from mainRoutes
  const aboutRoute = mainRoutes.find(route => route.hasDropdown);

  return (
    <>
      {/* Ultra Modern Countdown Banner */}
      <div className="w-full relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800 border-2 border-green-400/50 shadow-2xl" style={{fontFamily:"Poppins, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.45),transparent_35%),radial-gradient(circle_at_85%_120%,rgba(255,255,255,0.35),transparent_45%)]"></div>

        {/* Main content */}
        <div className={`relative z-10 mx-auto px-2.5 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 max-w-7xl ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-center gap-2.5 sm:gap-3 md:gap-4`}>
            
            {/* Countdown - First in RTL, Last in LTR */}
            {isRTL && (
              <div className={`flex items-center gap-1 sm:gap-1.5 md:gap-2.5 flex-row-reverse`}>
                {/* Days */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      يوم
                    </div>
                  </div>
                </div>

                <div className="text-white/60 font-bold text-sm md:text-lg lg:text-xl animate-pulse">:</div>

                {/* Hours */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      سا
                    </div>
                  </div>
                </div>

                <div className="text-white/60 font-bold text-sm md:text-lg lg:text-xl animate-pulse">:</div>

                {/* Minutes */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      د
                    </div>
                  </div>
                </div>

                <div className="text-white/60 font-bold text-sm md:text-lg lg:text-xl animate-pulse">:</div>

                {/* Seconds */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105 animate-pulse-soft">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      ث
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message and Hero - Middle section */}
            <div className={`flex flex-col ${isRTL ? 'items-end md:flex-row-reverse' : 'items-start md:flex-row'} gap-2 md:gap-3`}>
              {/* Hero Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse-glow"></div>
                <img 
                  src="/images/hero.png" 
                  alt="AIDAKI Hero" 
                  className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain animate-bounce-subtle"
                />
              </div>

              {/* Text content */}
              <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'} gap-1.5 md:gap-2`}>
                {/* Main question */}
                <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-white drop-shadow-lg animate-text-glow ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL
                    ? 'جاهز للنجاح في البكالوريا؟'
                    : currentLocale === 'fr'
                      ? 'Prêt à réussir au baccalauréat ?'
                      : 'Ready to succeed in the baccalaureate?'}
                </h2>

                {/* Subtitle */}
                <div className={`flex flex-wrap items-center gap-1.5 md:gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-300 text-xs md:text-sm font-semibold text-white">
                    {isRTL
                      ? 'نصل قريبًا'
                      : currentLocale === 'fr'
                        ? "On arrive bientôt"
                        : "We're coming soon"}
                  </span>
                  <span className="hidden sm:inline px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-300 text-xs md:text-sm font-semibold text-white">
                    {isRTL
                      ? '15 ديسمبر 2025'
                      : currentLocale === 'fr'
                        ? '15 décembre 2025'
                        : 'Dec 15, 2025'}
                  </span>
                  <span className="text-xl md:text-2xl animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>🚀</span>
                </div>
              </div>
            </div>

            {/* Countdown - Last in LTR, hidden in RTL (already shown above) */}
            {!isRTL && (
              <div className={`flex items-center gap-1 sm:gap-1.5 md:gap-2.5`}>
                {/* Days */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      {currentLocale === 'fr' ? 'J' : 'D'}
                    </div>
                  </div>
                </div>

                <div className="text-white/60 font-bold text-sm md:text-lg lg:text-xl animate-pulse">:</div>

                {/* Hours */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      {currentLocale === 'fr' ? 'H' : 'H'}
                    </div>
                  </div>
                </div>

                <div className="text-white/60 font-bold text-sm md:text-lg lg:text-xl animate-pulse">:</div>

                {/* Minutes */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      {currentLocale === 'fr' ? 'M' : 'M'}
                    </div>
                  </div>
                </div>

                <div className="text-white/60 font-bold text-sm md:text-lg lg:text-xl animate-pulse">:</div>

                {/* Seconds */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative px-1.5 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/30 shadow-xl text-center transition-all duration-300 group-hover:scale-105 animate-pulse-soft">
                    <div className="font-mono font-black text-sm sm:text-lg md:text-xl lg:text-2xl text-white tracking-tighter">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] sm:text-[9px] md:text-[10px] opacity-80 text-white/90 font-medium mt-0.5">
                      {currentLocale === 'fr' ? 'S' : 'S'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <nav className="w-full border-b top-0 z-[100] transition-all duration-500 relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800 border-2 border-green-400/50 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-pulse-slow nav-container">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-transparent to-green-500/20 animate-gradient-x"></div>
        
        {/* Enhanced background pattern with animations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-green-300 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-green-200 rounded-full mix-blend-overlay filter blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-400 rounded-full mix-blend-overlay filter blur-2xl animate-pulse-gentle"></div>
        </div>

        {/* Animated dots pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-2 h-2 bg-green-200 rounded-full animate-twinkle"></div>
          <div className="absolute bottom-6 left-12 w-1 h-1 bg-green-300 rounded-full animate-twinkle-delayed"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-green-100 rounded-full animate-twinkle-slow"></div>
        </div>

        <div
          className={`mx-auto relative px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center z-10 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Logo - Ultra Sophisticated Design */}
          <Link href={`/${locale}/`} className="group relative">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md border border-white/30 group-hover:border-white/50 shadow-2xl group-hover:shadow-3xl animate-pulse-gentle"></div>
            
            {/* Main logo container with advanced glassmorphism */}
            <div className="relative w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 bg-gradient-to-br from-white via-white/95 to-white/90 rounded-full flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl group-hover:shadow-2xl border border-white/40 group-hover:border-white/60 backdrop-blur-sm overflow-hidden">
              
              {/* Inner glow effect */}
              <div className="absolute inset-1 bg-gradient-to-tr from-green-400/20 via-transparent to-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Animated border ring */}
              <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-green-400/50 via-white/30 to-green-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-slow"></div>
              
              {/* Logo image with sophisticated effects */}
              <div className="relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110">
            <img
              src="/images/logo-black.png"
                  className="w-12 sm:w-14 md:w-16 h-auto filter drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-500"
                  alt="AIDAKI Logo"
                />
                
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-2 right-2 w-1 h-1 bg-green-400 rounded-full animate-twinkle"></div>
                <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle-delayed"></div>
                <div className="absolute top-1/2 left-1 w-0.5 h-0.5 bg-green-300 rounded-full animate-twinkle-slow"></div>
              </div>
            </div>
            
            {/* Outer ring animation */}
            <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-125 animate-pulse-slow"></div>
          </Link>

          {/* Mobile Right Side - Language Selector + Menu Button */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            {/* Mobile Language Selector - Always Visible */}

            {/* Mobile Menu Button - Ultra Sophisticated */}
            <button
              className={`group relative z-50 p-3 sm:p-4 rounded-xl focus:outline-none transition-all duration-500 ${
                mobileMenuOpen
                  ? "bg-white/25 backdrop-blur-md scale-110 shadow-2xl border border-white/40"
                  : "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-xl opacity-0 transition-all duration-500 ${
                mobileMenuOpen ? "opacity-100" : "group-hover:opacity-100"
              }`}></div>
              
              {/* Hamburger lines with enhanced effects */}
              <div className="relative w-6 h-6 z-10">
                <span
                  className={`absolute block w-full h-0.5 bg-white rounded-full transition-all duration-500 shadow-lg ${
                    mobileMenuOpen ? "top-3 rotate-45 scale-110" : "top-1 group-hover:scale-105"
                  }`}
                ></span>
                <span
                  className={`absolute block w-full h-0.5 bg-white rounded-full transition-all duration-500 shadow-lg ${
                    mobileMenuOpen ? "opacity-0 scale-0" : "top-3 group-hover:scale-105"
                  }`}
                ></span>
                <span
                  className={`absolute block w-full h-0.5 bg-white rounded-full transition-all duration-500 shadow-lg ${
                    mobileMenuOpen ? "top-3 -rotate-45 scale-110" : "top-5 group-hover:scale-105"
                  }`}
                ></span>
              </div>
              
              {/* Floating particles effect */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
                mobileMenuOpen ? "opacity-100" : "group-hover:opacity-100"
              }`}>
                <div className="absolute top-1 right-1 w-1 h-1 bg-green-300 rounded-full animate-twinkle"></div>
                <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white rounded-full animate-twinkle-delayed"></div>
              </div>
            </button>

            <select
              className="bg-white/20 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold outline-none hover:bg-white/30 transition-all duration-300 appearance-none pr-8 border border-white/30 min-w-[60px] text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm language-selector"
              value={currentLocale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="ar">AR</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
             <ul className="flex items-center gap-4" style={{ direction: 'ltr' }}>
              {mainRoutes.map((route, index) => (
                <li key={route.name} className="relative">
                  {route.hasDropdown ? (
                    <div className="relative dropdown-container">
                      <button
                        ref={dropdownTriggerRef}
                        id="about-dropdown-trigger"
                        className={`px-4 py-3 text-sm font-semibold text-white hover:text-green-200 transition-all duration-300 rounded-xl flex items-center gap-2 relative group bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-105 nav-link ${isRTL ? "flex-row-reverse text-right" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAboutDropdownOpen(!aboutDropdownOpen);
                        }}
                        onMouseEnter={() => setAboutDropdownOpen(true)}
                        aria-expanded={aboutDropdownOpen}
                        aria-haspopup="true"
                      >
                        {t(route.name)}
                        <svg
                          className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 ${
                            aboutDropdownOpen ? "rotate-180" : ""
                          }`}
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
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}${route.link}`}
                      className={`px-4 py-3 text-sm font-semibold text-white hover:text-green-200 transition-all duration-300 rounded-xl relative group bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-105 nav-link ${isRTL ? "text-right" : ""}`}
                      onClick={(e) => {
                        // If it's a hash link, use smooth scroll
                        if (route.link.includes('#')) {
                          e.preventDefault();
                          const hash = route.link.split('#')[1];
                          const onHome = typeof window !== 'undefined' && (window.location.pathname === `/${locale}` || window.location.pathname === `/${locale}/`);
                          const performScroll = () => smoothScrollTo(`#${hash}`, 80, 600, 0.25);
                          if (!onHome) {
                            router.push(`/${locale}/`);
                            const startedAt = Date.now();
                            const checkInterval = setInterval(() => {
                              const el = document.querySelector(`#${hash}`);
                              if (el || Date.now() - startedAt > 2000) {
                                clearInterval(checkInterval);
                                performScroll();
                              }
                            }, 100);
                          } else {
                            performScroll();
                          }
                        }
                        // For regular links, let the default behavior handle it
                      }}
                    >
                      {t(route.name)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Side */}
           <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <select
              className="bg-white/20 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold outline-none hover:bg-white/30 transition-all duration-300 appearance-none pr-8 border border-white/30 min-w-[60px] text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm language-selector"
              value={currentLocale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="ar">AR</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>

            {/* Social Icons */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl social-icon"
                  aria-label={social.label}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <svg
                    className="w-5 h-5 text-white hover:text-green-200 transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>

            {/* Login Button */}
            <a
              href="https://elearning.aidaki.ai/login"
              target="_blank"
              className="px-6 py-3 bg-gradient-to-r from-white/20 to-white/10 text-white font-semibold rounded-xl hover:from-white/30 hover:to-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/30 backdrop-blur-sm shadow-lg hover:shadow-2xl login-button"
            >
              {t(loginRoute.name)}
            </a>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu with React Portal (Secure Method) */}
      {mounted && aboutDropdownOpen && dropdownPosition && aboutRoute && typeof window !== 'undefined' 
        ? createPortal(
            <div
              className="fixed z-[2147483647] transition-all duration-300"
              style={{
                top: `${dropdownPosition.top}px`,
                width: '288px',
                ...(dropdownPosition.left !== undefined
                  ? { left: `${dropdownPosition.left}px` }
                  : {}),
                ...(dropdownPosition.right !== undefined
                  ? { right: `${dropdownPosition.right}px` }
                  : {}),
              }}
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
              role="menu"
              aria-labelledby="about-dropdown-trigger"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-4">
                <div className="flex flex-col gap-2">
                  {aboutRoute.dropdownItems?.map((item) => {
                    const href = `/${locale}${item.link}`;
                    return (
                      <button
                        key={item.name}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownLinkClick(href);
                        }}
                        className={`px-6 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all duration-300 ${isRTL ? "text-right" : "text-left"}`}
                        role="menuitem"
                      >
                        {t(item.name)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <style jsx>{`
        .time-box{background:linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08));border:1px solid rgba(255,255,255,0.25)}
      `}</style>

      {/* Professional Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Clean Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileAboutDropdownOpen(false);
          }}
        ></div>

        {/* Professional Menu Content with Green Gradient */}
        <div
          className={`absolute ${isRTL ? "right-0" : "left-0"} top-0 h-full w-80 max-w-[85vw] flex flex-col justify-start items-stretch transform transition-all duration-300 overflow-y-auto bg-gradient-to-br from-green-600 via-green-700 to-green-800 shadow-2xl ${
            mobileMenuOpen
              ? `${isRTL ? "translate-x-0" : "translate-x-0"} opacity-100`
              : `${isRTL ? "translate-x-full" : "-translate-x-full"} opacity-0`
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Clean Header */}
          <div className="w-full bg-gradient-to-r from-green-600 to-green-700 backdrop-blur-md border-b border-green-500/30 px-4 py-4">
            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Logo - Same as desktop navbar */}
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-white/40">
                  <img
                    src="/images/logo-black.png"
                    className="w-12 h-auto"
                    alt="AIDAKI Logo"
                  />
                </div>
                <span className="text-xl font-bold text-white">AIDAKI</span>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileAboutDropdownOpen(false);
                }}
                className={`w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-200 border border-white/30 ${isRTL ? "mr-auto" : "ml-auto"}`}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation with Green Gradient Background */}
          <div className="w-full flex-1 px-4 py-6 min-h-0">
            <nav className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
              {mainRoutes.map((route, index) => (
                <div key={route.name} className="mb-3">
                {route.hasDropdown ? (
                    <div>
                      <button
                        className={`w-full flex items-center px-4 py-3 text-lg font-semibold text-white hover:text-green-200 hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm ${
                          isRTL ? "flex-row-reverse justify-start gap-3" : "justify-between"
                        }`}
                        onClick={() => setMobileAboutDropdownOpen(!mobileAboutDropdownOpen)}
                      >
                        <span className={isRTL ? "text-right flex-1" : ""}>{t(route.name)}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            mobileAboutDropdownOpen ? "rotate-180" : ""
                          }`}
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
                      </button>
                      {/* Dropdown items */}
                      <div className={`${isRTL ? "mr-4" : "ml-4"} mt-2 space-y-1 transition-all duration-300 ${
                        mobileAboutDropdownOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                      }`}>
                      {route.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          href={`/${locale}${item.link}`}
                            className={`block px-4 py-2 text-base text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm ${isRTL ? "text-right" : "text-left"}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                              setMobileAboutDropdownOpen(false);
                            
                            if (item.link.includes('#')) {
                              router.push(`/${locale}/about`);
                              setTimeout(() => {
                                  const hash = item.link.split('#')[1];
                                  const element = document.getElementById(hash);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                  }
                              }, 300);
                            } else {
                              router.push(`/${locale}${item.link}`);
                            }
                          }}
                        >
                          {t(item.name)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/${locale}${route.link}`}
                      className={`block px-4 py-3 text-lg font-semibold text-white hover:text-green-200 hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm ${isRTL ? "text-right" : "text-left"}`}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (route.link.includes('#')) {
                        e.preventDefault();
                        const hash = route.link.split('#')[1];
                        const onHome = typeof window !== 'undefined' && (window.location.pathname === `/${locale}` || window.location.pathname === `/${locale}/`);
                        const performScroll = () => smoothScrollTo(`#${hash}`, 80, 600, 0.25);
                        if (!onHome) {
                          router.push(`/${locale}/`);
                          const startedAt = Date.now();
                          const checkInterval = setInterval(() => {
                            const el = document.querySelector(`#${hash}`);
                            if (el || Date.now() - startedAt > 2000) {
                              clearInterval(checkInterval);
                              performScroll();
                            }
                          }, 100);
                        } else {
                          performScroll();
                        }
                      }
                    }}
                  >
                    {t(route.name)}
                  </Link>
                )}
                </div>
              ))}
            </nav>

            {/* Login Button */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <a
                href="https://elearning.aidaki.ai/login"
                target="_blank"
                className="block w-full bg-white/20 hover:bg-white/30 text-white font-semibold text-center py-4 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              {t(loginRoute.name)}
              </a>
          </div>

            {/* Social Links */}
            <div className={`mt-6 flex ${isRTL ? "justify-start" : "justify-center"} gap-4`}>
              {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-200 border border-white/30"
                aria-label={social.label}
              >
                <svg
                    className="w-5 h-5 text-white hover:text-green-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-menu-open {
          overflow: hidden;
        }

        /* Hide scrollbar for language select */
        select::-webkit-scrollbar {
          display: none;
        }

        select {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Animations from CountDown component */
        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes twinkle-delayed {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes twinkle-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.3);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-twinkle-delayed {
          animation: twinkle-delayed 2.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-twinkle-slow {
          animation: twinkle-slow 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        /* Sophisticated hover effects */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        /* Ultra Modern Countdown Banner Animations */
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes light-ray-1 {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(-20px);
          }
          50% {
            opacity: 0.6;
            transform: translateY(20px);
          }
        }

        @keyframes light-ray-2 {
          0%, 100% {
            opacity: 0.2;
            transform: translateY(20px);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-20px);
          }
        }

        @keyframes float-particle-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(10px, -15px) scale(1.2);
            opacity: 0.7;
          }
          50% {
            transform: translate(-5px, -25px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translate(-10px, -10px) scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes float-particle-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          33% {
            transform: translate(-15px, 20px) scale(1.3);
            opacity: 0.8;
          }
          66% {
            transform: translate(10px, 10px) scale(0.8);
            opacity: 0.4;
          }
        }

        @keyframes float-particle-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          40% {
            transform: translate(20px, -20px) scale(1.4);
            opacity: 0.9;
          }
          80% {
            transform: translate(-15px, -5px) scale(0.7);
            opacity: 0.3;
          }
        }

        @keyframes float-particle-4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          30% {
            transform: translate(-20px, 15px) scale(1.2);
            opacity: 0.7;
          }
          60% {
            transform: translate(15px, -10px) scale(0.9);
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                         0 0 20px rgba(255, 255, 255, 0.3),
                         0 0 30px rgba(16, 185, 129, 0.2);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                         0 0 40px rgba(255, 255, 255, 0.5),
                         0 0 60px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.95;
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-light-ray-1 {
          animation: light-ray-1 4s ease-in-out infinite;
        }

        .animate-light-ray-2 {
          animation: light-ray-2 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-particle-1 {
          animation: float-particle-1 8s ease-in-out infinite;
        }

        .animate-float-particle-2 {
          animation: float-particle-2 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-particle-3 {
          animation: float-particle-3 12s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-particle-4 {
          animation: float-particle-4 9s ease-in-out infinite;
          animation-delay: 3s;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 1s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        /* Countdown banner specific styles */
        .countdown-banner {
          position: relative;
        }

        /* Responsive text sizing */
        @media (max-width: 640px) {
          .countdown-banner h2 {
            font-size: 1rem;
            line-height: 1.3;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .countdown-banner h2 {
            font-size: 1.25rem;
            line-height: 1.4;
          }
        }

        @media (min-width: 769px) {
          .countdown-banner h2 {
            font-size: 1.75rem;
            line-height: 1.5;
          }
        }

        @media (min-width: 1024px) {
          .countdown-banner h2 {
            font-size: 2rem;
            line-height: 1.6;
          }
        }

        .nav-link {
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          animation: glow 1.5s ease-in-out infinite;
        }

        .social-icon:hover {
          animation: bounce-subtle 0.6s ease-in-out;
        }

        .language-selector:hover {
          animation: glow 1s ease-in-out infinite;
        }

        .login-button:hover {
          animation: shimmer 1.5s ease-in-out infinite;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
          background-size: 200% 200%;
        }

        /* Z-index fixes and improvements */
        .dropdown-menu {
          z-index: 999999 !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          margin-top: 0.75rem;
          transform: translateY(0);
          will-change: transform, opacity;
          isolation: isolate;
        }

        /* Ensure dropdown doesn't affect navbar height */
        .dropdown-container {
          position: relative;
          display: inline-block;
        }

        /* Prevent layout shift when dropdown opens */
        .nav-container {
          position: relative;
          z-index: 100;
        }

        /* Enhanced glassmorphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Improved hover states */
        .nav-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .social-icon:hover {
          transform: translateY(-3px) scale(1.1);
        }

        .language-selector:hover {
          transform: translateY(-2px);
        }

        .login-button:hover {
          transform: translateY(-2px) scale(1.05);
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Advanced logo animations */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(16, 185, 129, 0.3);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        /* Logo hover effects */
        .logo-container:hover {
          animation: glow-pulse 1.5s ease-in-out infinite;
        }

        /* Enhanced glassmorphism for logo */
        .logo-glass {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Force dropdown above all elements */
        .dropdown-menu {
          position: absolute !important;
          z-index: 999999 !important;
          isolation: isolate !important;
          transform: translate3d(0, 0, 0) !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
        }

        /* Ensure no stacking context issues */
        .dropdown-menu * {
          z-index: inherit !important;
        }
      `}</style>
    </>
  );
}
