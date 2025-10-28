"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../navigation";
import { useParams } from "next/navigation";
import { getDirection } from "../../i18n";

// Import the VisualsTopbar for non-authenticated users
import VisualsTopbar from "../components/visuals/VisualsTopbar";
import CountDown from "../components/visuals/CountDown";
// Import all the converted home page components
import FeaturesHomePageHeader from "../components/features/home-page/Header";
import FeaturesHomePageFeatures from "../components/features/home-page/Features";
import FeaturesHomePageCourses from "../components/features/home-page/Courses";
import FeaturesHomePagePricingHeader from "../components/features/home-page/PricingHeader";
import FeaturesHomePagePricing from "../components/features/home-page/Pricing";
import VisualsPointsOfSale from "../components/visuals/PointsOfSale";

// Import the new ProfAvatars component
import ProfAvatars from "../components/ProfAvatars";
import VideoDemos from "../components/VideoDemos";

// Import the new AppDownloadSection component
import AppDownloadSection from "../components/AppDownloadSection";

// Import Footer component
import Footer from "../components/Footer";

// Import BackToTop component
import BackToTop from "../components/BackToTop";

// Import Chatbot component
import Chatbot from "../components/Chatbot";

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations();
  const params = useParams();
  const currentLocale = params.locale as string;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const direction = getDirection(currentLocale);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const languages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const switchLanguage = (locale: string) => {
    router.push("/", { locale });
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Show VisualsTopbar and CountDown */}
      <div>
        <CountDown />
        <VisualsTopbar />
      </div>

      {/* Language Switcher Header */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          {isDropdownOpen && (
            <div
              className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px] ${
                direction === "rtl" ? "left-0" : "right-0"
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`w-full px-4 py-2 text-start hover:bg-gray-50 flex items-center space-x-3 ${
                    direction === "rtl" ? "space-x-reverse" : ""
                  } ${
                    lang.code === currentLocale
                      ? "bg-green-50 text-green-600"
                      : "text-gray-700"
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Home Page Components - Optimized Logical Order */}
      <FeaturesHomePageHeader />

      {/* PHASE 2: EDUCATION - Present platform value */}
      <FeaturesHomePageFeatures />
      
      {/* PHASE 3: DEMONSTRATION - Show content quality */}
      <VideoDemos />
      
      {/* PHASE 4: COURSES - Show available courses */}
      <FeaturesHomePageCourses />
      
      {/* PHASE 5: CREDIBILITY - Establish trust with professors */}
      <ProfAvatars />
      
      {/* PHASE 6: CONVERSION - Pricing and action */}
      <FeaturesHomePagePricingHeader />
      <FeaturesHomePagePricing />
      
      {/* PHASE 7: ACTION - Download app */}
      <AppDownloadSection />
      
      {/* PHASE 8: CONTACT - Physical store */}
      <VisualsPointsOfSale />

      {/* Add Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Chatbot */}
      <Chatbot />

      {/* Dropdown backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
