"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getDirection } from "../../i18n.ts";
import { Languages, Menu, X } from "lucide-react";
import Link from "next/link";
import { logout } from "../services/auth";
import { StudySessionWidget } from "./progress/StudySessionComponents.jsx";
import { getNavigationItems, Logo } from "../../lib/navigationData";

interface NavbarProps {
  params?: {
    locale: string;
  };
}

// Mobile Navigation Item Component
const MobileNavItem = ({ item, isActive, onItemClick }) => {
  return (
    <Link
      href={item.path}
      onClick={onItemClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
        isActive
          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
          : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
      }`}
    >
      <div className="relative">
        <span
          className={`${
            isActive
              ? "text-white"
              : "text-gray-500 group-hover:text-green-600"
          } transition-colors`}
        >
          {item.icon}
        </span>
        {item.hasNotification && !isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </div>
      <span className="font-medium text-sm">{item.name}</span>
      {isActive && (
        <div className="absolute right-3">
          <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
        </div>
      )}
    </Link>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose, locale, t }) => {
  const pathname = usePathname();
  const menuRef = useRef(null);

  // Get navigation items
  const navItems = getNavigationItems(locale, t);

  // Check if a navigation item is active
  const isActive = (path, activePaths = null) => {
    if (!path) return false;

    if (activePaths && Array.isArray(activePaths)) {
      return activePaths.some((activePath) => {
        const normalizedPathname = pathname.replace(/\/$/, "");
        const normalizedPath = activePath.replace(/\/$/, "");
        return normalizedPathname === normalizedPath || normalizedPathname.startsWith(normalizedPath + "/");
      });
    }

    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedPath = path.replace(/\/$/, "");

    if (normalizedPathname === normalizedPath) return true;
    if (normalizedPath === `/${locale}/dashboard`) {
      return normalizedPathname === normalizedPath;
    }
    return normalizedPathname.startsWith(normalizedPath + "/");
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 right-0 bg-gradient-to-b from-green-50 via-blue-50 to-purple-50 shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Header with Logo and Close Button */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-white border-opacity-50">
          <Logo className="flex-1" />
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 shadow-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.key}
              item={item}
              isActive={isActive(item.path, item.activePaths)}
              onItemClick={onClose}
            />
          ))}
        </nav>
      </div>
    </>
  );
};

export default function Navbar({ params }: NavbarProps) {
  const { locale } = useParams();
  const t = useTranslations();
  const direction = getDirection(locale as string);
  const isRTL = direction === "rtl";
  const router = useRouter();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for dropdowns
  const profileRef = useRef(null);
  const languageRef = useRef(null);

  // Language options
  const languages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  // Enhanced language switching function with full page reload
  const switchLanguage = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    
    // Force a full page reload to ensure proper RTL/LTR switching
    window.location.href = newPath;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close all dropdowns when clicking outside or pressing escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsLanguageDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Student-focused notifications with i18n
  const notifications = [
    {
      id: 1,
      text: t("navbar.notifications.newAssignment"),
      time: t("navbar.notifications.time15min"),
      type: "assignment",
    },
    {
      id: 2,
      text: t("navbar.notifications.quizReminder"),
      time: t("navbar.notifications.time2hours"),
      type: "quiz",
    },
    {
      id: 3,
      text: t("navbar.notifications.moduleCompleted"),
      time: t("navbar.notifications.timeYesterday"),
      type: "achievement",
    },
    {
      id: 4,
      text: t("navbar.notifications.classReminder"),
      time: t("navbar.notifications.timeYesterday"),
      type: "reminder",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Logout failed:", error);
      alert(t("navbar.logoutError"));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "quiz":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "achievement":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <>
      <nav
        className={`bg-white shadow-sm border-b border-slate-200 px-6 py-3 ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="flex justify-between items-center">
          <div
            className={`flex items-center space-x-4 ${
              isRTL ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Mobile Menu Button - Visible only on small screens */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>

            {/* Mobile Logo - Visible only on small screens */}
            <div className="lg:hidden">
              <Logo className="!w-8 !h-8" />
            </div>

            {/* Title - Hidden on small screens when mobile menu exists */}
            <h1 className="text-xl font-semibold text-slate-800 hidden lg:block">
              {t("navbar.title")}
            </h1>
          </div>

          <div className={`flex items-center space-x-6`}>
            {/* Study Session Widget */}
            <StudySessionWidget className="hidden sm:flex" />

            {/* Language Switcher */}
            <div ref={languageRef} className="relative">
              <button
                onClick={() => {
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                  if (isNotificationsOpen) setIsNotificationsOpen(false);
                  if (isProfileOpen) setIsProfileOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center space-x-2"
                aria-expanded={isLanguageDropdownOpen}
                aria-label="Language switcher"
              >
                <Languages className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline text-sm text-slate-600">
                  {currentLanguage.name}
                </span>
              </button>

              {isLanguageDropdownOpen && (
                <div
                  className={`absolute top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[150px] ${
                    isRTL ? "left-0" : "right-0"
                  }`}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-start hover:bg-slate-50 flex items-center space-x-3 ${
                        direction === "rtl" ? "space-x-reverse" : ""
                      } ${
                        lang.code === locale
                          ? "bg-green-50 text-green-600"
                          : "text-slate-700"
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  if (isNotificationsOpen) setIsNotificationsOpen(false);
                  if (isLanguageDropdownOpen) setIsLanguageDropdownOpen(false);
                }}
                className={`flex items-center gap-4 space-x-3 focus:outline-none p-1 rounded-lg hover:bg-slate-100 transition-colors ${
                  isRTL ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                  {t("navbar.userInitial")}
                </div>
                <div
                  className={`hidden md:block ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <div className="text-sm font-medium text-slate-700">
                    {t("navbar.student")}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t("navbar.myAccount")}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div
                  className={`absolute mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 ${
                    isRTL ? "left-0" : "right-0"
                  }`}
                >
                  <div
                    className={`px-4 py-2 border-b border-slate-100 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-800">
                      {t("navbar.myAccount")}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t("navbar.manageInfo")}
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/dashboard/profile`}
                    className={`flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors`}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-slate-400 ${
                        isRTL ? "ml-3" : "mr-3"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {t("navbar.myProfile")}
                  </Link>
                  
                  {/* New Subscription Dashboard Link */}
                  <Link
                    href={`/${locale}/dashboard/subscription`}
                    className={`flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors`}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-slate-400 ${
                        isRTL ? "ml-3" : "mr-3"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    {t("navbar.subscription", { default: "My Subscription" })}
                  </Link>

                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleLogout()}
                      className={`flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 text-red-500 ${
                          isRTL ? "ml-3" : "mr-3"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {t("navbar.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        locale={locale}
        t={t}
      />
    </>
  );
}
