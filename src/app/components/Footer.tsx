"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDirection } from "../../i18n";

export default function Footer() {
  const t = useTranslations();
  const params = useParams();
  const currentLocale = params.locale as string;
  const direction = getDirection(currentLocale);
  const isRTL = direction === "rtl";

  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    {
      title: "footer.navigation.platform",
      links: [
        { name: "footer.links.home", href: "/" },
        { name: "footer.links.courses", href: "/#courses" },
        { name: "footer.links.pricing", href: "/#prices" },
        { name: "footer.links.news", href: "/news" },
      ],
    },
    {
      title: "footer.navigation.support",
      links: [
        { name: "footer.links.support", href: "/support-and-assistance" },
        { name: "footer.links.contact", href: "/support-and-assistance#contact" },
        { name: "footer.links.faq", href: "/faq" },
      ],
    },
    {
      title: "footer.navigation.account",
      links: [
      /*   { name: "footer.links.login", href: "/login" },
        { name: "footer.links.register", href: "/register" }, */
        { name: "footer.links.dashboard", href: "/dashboard" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/aidaki.ai",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61580462821351",
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@aidaki.ai",
      icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    },
  ];

  const legalLinks = [
    { name: "footer.legal.privacy", href: "/privacy-policy" },
    { name: "footer.legal.terms", href: "/terms-of-service" },
    { name: "footer.legal.cookies", href: "/cookie-policy" },
  ];

  return (
    <footer className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white border-t border-green-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className={`lg:col-span-1 `}>
            <div className="mb-6">
              <Link href={`/${currentLocale}/`} className="group inline-block">
               <img src="/images/logo.png" className="w-20"></img>
              </Link>
            </div>
          

         
          </div>

          {/* Navigation Links */}
          {navigationLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} >
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
                {t(section.title)}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={`/${currentLocale}${link.href}`}
                      className="text-white hover:text-gray-50 transition-colors duration-300 group flex items-center gap-2"
                    >
                      <span className="relative">
                        {t(link.name)}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                      </span>
                      <svg
                        className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                          isRTL ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Section */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row ${isRTL ? "md:flex-row-reverse" : ""} justify-between items-center gap-4`}>
            {/* Copyright */}
            <div className="text-white/90 text-sm">
              <p>
                © {currentYear} AIDAKI. {t("footer.copyright")}
              </p>
            </div>

            {/* Legal Links */}
            <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} gap-6`}>
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={`/${currentLocale}${link.href}`}
                  className="text-white/80 hover:text-white text-sm transition-colors duration-300 relative group"
                >
                  {t(link.name)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
              aria-label={t("footer.backToTop")}
            >
              <svg
                className="w-5 h-5 text-white group-hover:text-gray-50 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
