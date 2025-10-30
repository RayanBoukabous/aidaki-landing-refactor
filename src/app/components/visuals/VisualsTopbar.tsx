"use client";

import { useState, useEffect } from "react";
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
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{days:number;hours:number;minutes:number;seconds:number}>({days:0,hours:0,minutes:0,seconds:0});

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown banner persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem('aidaki-countdown-dismissed') === '1';
    setBannerDismissed(dismissed);
  }, []);

  // Countdown to 10 Nov 2025 00:00:00
  useEffect(() => {
    const target = new Date(2025, 10, 10, 0, 0, 0).getTime();
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

  const dismissBanner = () => {
    setBannerDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aidaki-countdown-dismissed', '1');
    }
  };

  // ULTRA ROBUST FALLBACK - Create dropdown directly in DOM
  useEffect(() => {
    if (aboutDropdownOpen && mounted) {
      // Calculate position immediately to avoid flash
      const button = document.querySelector('[data-dropdown-trigger]') as HTMLElement;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      const calculatedTop = rect.bottom + scrollTop + 8;
      const calculatedLeft = rect.left + scrollLeft;

      // Remove any existing dropdown
      const existingDropdown = document.getElementById('ultra-robust-dropdown');
      if (existingDropdown) {
        existingDropdown.remove();
      }

      // Create dropdown element
      const dropdown = document.createElement('div');
      dropdown.id = 'ultra-robust-dropdown';
      dropdown.className = 'ultra-robust-dropdown';
      dropdown.style.cssText = `
        position: fixed !important;
        z-index: 2147483647 !important;
        top: ${calculatedTop}px !important;
        left: ${calculatedLeft}px !important;
        width: 288px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(16px) !important;
        border-radius: 16px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        padding: 16px !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: scale(1) !important;
        transition: all 0.3s ease !important;
      `;

      // Add dropdown content (localized)
      dropdown.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a href="/${locale}/about" style="display: block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #374151; border-radius: 12px; margin: 0 8px; transition: all 0.3s; text-decoration: none;" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'; this.style.color='#059669';" onmouseout="this.style.background='transparent'; this.style.color='#374151';">${t('aboutUs.title')}</a>
          <a href="/${locale}/about#vision" style="display: block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #374151; border-radius: 12px; margin: 0 8px; transition: all 0.3s; text-decoration: none;" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'; this.style.color='#059669';" onmouseout="this.style.background='transparent'; this.style.color='#374151';">${t('aboutUs.nav.ourVision')}</a>
          <a href="/${locale}/about#new-approach" style="display: block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #374151; border-radius: 12px; margin: 0 8px; transition: all 0.3s; text-decoration: none;" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'; this.style.color='#059669';" onmouseout="this.style.background='transparent'; this.style.color='#374151';">${t('aboutUs.nav.newEducationalApproach')}</a>
          <a href="/${locale}/about#avatar-technology" style="display: block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #374151; border-radius: 12px; margin: 0 8px; transition: all 0.3s; text-decoration: none;" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'; this.style.color='#059669';" onmouseout="this.style.background='transparent'; this.style.color='#374151';">${t('aboutUs.nav.effectOfAvatars')}</a>
        </div>
      `;

      // Add event listeners
      dropdown.addEventListener('mouseenter', () => setAboutDropdownOpen(true));
      dropdown.addEventListener('mouseleave', () => setAboutDropdownOpen(false));

      // Add click handlers for links
      dropdown.addEventListener('click', (e) => {
        const target = e.target as HTMLAnchorElement;
        if (target.tagName === 'A') {
          e.preventDefault();
          setAboutDropdownOpen(false);
          const href = target.getAttribute('href');
          if (href) {
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
          }
        }
      });

      // Append to body
      document.body.appendChild(dropdown);

      return () => {
        const existingDropdown = document.getElementById('ultra-robust-dropdown');
        if (existingDropdown) {
          existingDropdown.remove();
        }
      };
    }
  }, [aboutDropdownOpen, mounted, locale, router]);

  // Navigation routes with the new structure
  const mainRoutes = [
    {
      name: "navHome",
      link: "/",
    },
    {
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
    },
    {
      name: "pointsOfSale.title",
      link: "/#points-of-sale",
    },
    {
      name: "educationResources.title",
      link: "/news",
    },
    {
      name: "navPrices",
      link: "/#prices",
    },
    {
      name: "support.title",
      link: "/support-and-assistance",
    },
  ];

  const loginRoute = {
    name: "login",
    link: "/login",
  };

  // Social media links
  const socialLinks = [
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
      href: "https://tiktok.com/@aidaki.dz",
      label: "TikTok",
      icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    },
  ];

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

  return (
    <>
      {/* Countdown Banner */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white border-2 border-green-400/50 shadow-2xl" style={{fontFamily:"Poppins, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.45),transparent_35%),radial-gradient(circle_at_85%_120%,rgba(255,255,255,0.35),transparent_45%)]"></div>
          <div className={`container relative z-10 mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-3 text-base md:text-lg font-semibold tracking-tight">
              <span className="text-xl md:text-2xl">🎓</span>
              <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                <span className="whitespace-pre px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                  {isRTL
                    ? 'جاهز للنجاح في البكالوريا؟ '
                    : currentLocale === 'fr'
                      ? 'Prêt à réussir au baccalauréat ? '
                      : 'Ready to succeed in the baccalaureate? '}
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  {isRTL
                    ? 'نصل قريبًا'
                    : currentLocale === 'fr'
                      ? "On arrive bientôt"
                      : "We're coming soon"}
                </span>
                <span className="hidden sm:inline px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  {isRTL
                    ? '10 نوفمبر 2025'
                    : currentLocale === 'fr'
                      ? '10 novembre 2025'
                      : 'Nov 10, 2025'}
                </span>
                <span className="text-xl md:text-2xl">🚀</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 font-mono">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 shadow-xl text-center"><span className="font-extrabold tracking-wider">{String(timeLeft.days).padStart(2, '0')}</span> <span className="opacity-80 text-[11px]">{isRTL ? 'يوم' : currentLocale === 'fr' ? 'J' : 'D'}</span></span>
              <span className="opacity-70">:</span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 shadow-xl text-center"><span className="font-extrabold tracking-wider">{String(timeLeft.hours).padStart(2, '0')}</span> <span className="opacity-80 text-[11px]">{isRTL ? 'سا' : currentLocale === 'fr' ? 'H' : 'H'}</span></span>
              <span className="opacity-70">:</span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 shadow-xl text-center"><span className="font-extrabold tracking-wider">{String(timeLeft.minutes).padStart(2, '0')}</span> <span className="opacity-80 text-[11px]">{isRTL ? 'د' : currentLocale === 'fr' ? 'M' : 'M'}</span></span>
              <span className="opacity-70">:</span>
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 shadow-xl text-center"><span className="font-extrabold tracking-wider">{String(timeLeft.seconds).padStart(2, '0')}</span> <span className="opacity-80 text-[11px]">{isRTL ? 'ث' : currentLocale === 'fr' ? 'S' : 'S'}</span></span>
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
             <ul className="flex items-center gap-4">
              {mainRoutes.map((route, index) => (
                <li key={route.name} className="relative">
                  {route.hasDropdown ? (
                    <div className="relative dropdown-container">
                      <button
                        data-dropdown-trigger
                        className="px-4 py-3 text-sm font-semibold text-white hover:text-green-200 transition-all duration-300 rounded-xl flex items-center gap-2 relative group bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-105 nav-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAboutDropdownOpen(!aboutDropdownOpen);
                        }}
                        onMouseEnter={() => setAboutDropdownOpen(true)}
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

                      {/* Dropdown Menu - ULTRA ROBUST METHOD (DOM Manipulation) */}
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}${route.link}`}
                      className="px-4 py-3 text-sm font-semibold text-white hover:text-green-200 transition-all duration-300 rounded-xl relative group bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-105 nav-link"
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

      <style jsx>{`
        .time-box{background:linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08));border:1px solid rgba(255,255,255,0.25)}
      `}</style>

      {/* Professional Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-300 ${
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
          className={`relative h-full flex flex-col justify-start items-stretch transform transition-all duration-300 overflow-y-auto ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          {/* Clean Header */}
          <div className="w-full bg-gradient-to-r from-green-600 to-green-700 backdrop-blur-md border-b border-green-500/30 px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <img
                    src="/images/logo-black.png"
                    className="w-6 h-6 filter brightness-0 invert"
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
                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-200 border border-white/30"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation with Green Gradient Background */}
          <div className="w-full bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex-1 px-4 py-6 min-h-0">
            <nav className="space-y-2">
              {mainRoutes.map((route, index) => (
                <div key={route.name} className="mb-3">
                {route.hasDropdown ? (
                    <div>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-white hover:text-green-200 hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                        onClick={() => setMobileAboutDropdownOpen(!mobileAboutDropdownOpen)}
                      >
                        <span>{t(route.name)}</span>
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
                      <div className={`ml-4 mt-2 space-y-1 transition-all duration-300 ${
                        mobileAboutDropdownOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                      }`}>
                      {route.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          href={`/${locale}${item.link}`}
                            className="block px-4 py-2 text-base text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm"
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
                      className="block px-4 py-3 text-lg font-semibold text-white hover:text-green-200 hover:bg-white/10 rounded-lg transition-colors duration-200 backdrop-blur-sm"
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
            <div className="mt-6 flex justify-center gap-4">
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

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
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
