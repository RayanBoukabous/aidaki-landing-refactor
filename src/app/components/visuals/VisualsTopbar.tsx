"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
  const [currentLocale, setCurrentLocale] = useState(locale as string);


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
      <nav className="w-full border-b top-0 z-50 transition-all duration-500 bg-white">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-green-300 via-green-300 to-green-300"></div>

        <div
          className={`mx-auto relative px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Logo */}
          <Link href={`/${locale}/`} className="group relative">
            <div className="absolute inset-0 bg-green-200/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src="/images/logo-black.png"
              className="w-10 sm:w-12 md:w-16 h-auto relative z-10 transition-transform duration-300 group-hover:scale-110"
              alt="Logo"
            />
          </Link>

          {/* Mobile Right Side - Language Selector + Menu Button */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            {/* Mobile Language Selector - Always Visible */}

            {/* Mobile Menu Button */}
            <button
              className={`bg-green-700 z-50 p-2 sm:p-3 rounded-xl focus:outline-none transition-all duration-300 ${
                mobileMenuOpen
                  ? "bg-white/20 backdrop-blur-sm scale-110"
                  : "hover:bg-green-400/30"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "top-3 rotate-45" : "top-1"
                  }`}
                ></span>
                <span
                  className={`absolute block w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "top-3"
                  }`}
                ></span>
                <span
                  className={`absolute block w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "top-3 -rotate-45" : "top-5"
                  }`}
                ></span>
              </div>
            </button>

            <select
              className="bg-green-50 cursor-pointer rounded-lg px-2 py-3 text-xs font-medium outline-none hover:bg-green-100 transition-all duration-300 appearance-none pr-6 border border-green-200 min-w-[50px]"
              value={currentLocale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="ar">AR</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-1">
              {mainRoutes.map((route, index) => (
                <li key={route.name} className="relative">
                  {route.hasDropdown ? (
                    <div className="relative">
                      <button
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-300 rounded-lg flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAboutDropdownOpen(!aboutDropdownOpen);
                        }}
                        onMouseEnter={() => setAboutDropdownOpen(true)}
                      >
                        {t(route.name)}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
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

                      {/* Dropdown Menu */}
                      {aboutDropdownOpen && (
                        <div
                          className={`absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 ${
                            isRTL ? "right-0" : "left-0"
                          }`}
                          onMouseEnter={() => setAboutDropdownOpen(true)}
                          onMouseLeave={() => setAboutDropdownOpen(false)}
                        >
                          {route.dropdownItems?.map((item) => (
                            <Link
                              key={item.name}
                              href={`/${locale}${item.link}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                              onClick={(e) => {
                                e.preventDefault();
                                setAboutDropdownOpen(false);
                                
                                // If it's a hash link, navigate to about page first then scroll
                                if (item.link.includes('#')) {
                                  const hash = item.link.split('#')[1];
                                  // Navigate to about page first
                                  router.push(`/${locale}/about`);
                                  // Wait for page to load, then scroll to the section
                                  setTimeout(() => {
                                    // Try multiple times to ensure the element exists
                                    const scrollToSection = () => {
                                      const element = document.getElementById(hash);
                                      if (element) {
                                        smoothScrollTo(`#${hash}`);
                                      } else {
                                        // If element not found, try again after 200ms
                                        setTimeout(scrollToSection, 200);
                                      }
                                    };
                                    scrollToSection();
                                  }, 300);
                                } else {
                                  // Regular navigation
                                  router.push(`/${locale}${item.link}`);
                                }
                              }}
                            >
                              {t(item.name)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}${route.link}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-300 rounded-lg"
                      onClick={(e) => {
                        // If it's a hash link, use smooth scroll
                        if (route.link.includes('#')) {
                          e.preventDefault();
                          const hash = route.link.split('#')[1];
                          smoothScrollTo(`#${hash}`);
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

            <select
              className="bg-green-50 cursor-pointer rounded-lg px-2 py-3 text-xs font-medium outline-none hover:bg-green-100 transition-all duration-300 appearance-none pr-6 border border-green-200 min-w-[50px]"
              value={currentLocale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="ar">AR</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-green-600 transition-colors duration-300"
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
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t(loginRoute.name)}
            </a>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-black/90 via-green-800/60 to-green-800/60 backdrop-blur-lg transition-opacity duration-500 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Menu Content */}
        <div
          className={`relative h-full flex flex-col justify-center items-center transform transition-all duration-500 ${
            mobileMenuOpen
              ? "translate-y-0 scale-100"
              : "-translate-y-10 scale-95"
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-green-300 to-green-300 rounded-full opacity-20 animate-pulse"></div>
          <div
            className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-green-300 to-teal-300 rounded-full opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Navigation Links */}
          <ul className="flex flex-col items-center gap-4 sm:gap-6 text-lg sm:text-xl mb-6 sm:mb-8 px-4">
            {mainRoutes.map((route, index) => (
              <li
                key={route.name}
                className={`transform transition-all duration-500 ${
                  mobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                {route.hasDropdown ? (
                  <div className="text-center">
                    <Link
                      className="font-semibold text-white hover:text-green-200 transition-colors duration-300 px-6 py-3 block"
                      href={`/${locale}${route.link}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(route.name)}
                    </Link>
                    {/* Mobile dropdown items */}
                    <div className="mt-2 space-y-2">
                      {route.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          className="text-green-200 hover:text-white transition-colors duration-300 px-4 py-2 text-base block"
                          href={`/${locale}${item.link}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            
                            // If it's a hash link, navigate to about page first then scroll
                            if (item.link.includes('#')) {
                              const hash = item.link.split('#')[1];
                              // Navigate to about page first
                              router.push(`/${locale}/about`);
                              // Wait for page to load, then scroll to the section
                              setTimeout(() => {
                                // Try multiple times to ensure the element exists
                                const scrollToSection = () => {
                                  const element = document.getElementById(hash);
                                  if (element) {
                                    smoothScrollTo(`#${hash}`);
                                  } else {
                                    // If element not found, try again after 200ms
                                    setTimeout(scrollToSection, 200);
                                  }
                                };
                                scrollToSection();
                              }, 300);
                            } else {
                              // Regular navigation
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
                    className="font-semibold text-white hover:text-green-200 transition-colors duration-300 px-6 py-3"
                    href={`/${locale}${route.link}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(route.name)}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Login CTA for Mobile */}
          <div
            className={`mb-8 transform transition-all duration-500 ${
              mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <Link
              className="font-bold text-green-900 bg-gradient-to-r from-green-300 to-green-400 hover:from-green-200 hover:to-green-300 transition-all duration-300 px-8 py-4 rounded-2xl hover:scale-110"
              href={`/${locale}${loginRoute.link}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(loginRoute.name)}
            </Link>
          </div>

          {/* Social Icons for Mobile */}
          <div
            className={`flex items-center gap-8 mb-8 transform transition-all duration-500 ${
              mobileMenuOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-green-400/20 backdrop-blur-sm rounded-2xl hover:bg-green-300/35 transition-all duration-300 hover:scale-110 hover:rotate-6"
                aria-label={social.label}
              >
                <svg
                  className="w-6 h-6 text-white group-hover:text-green-200 transition-colors duration-300"
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
      `}</style>
    </>
  );
}
