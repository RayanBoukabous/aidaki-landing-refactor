"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

interface UpgradeBannerProps {
  locale: string;
  userName?: string;
}

export function UpgradeBanner({ locale, userName }: UpgradeBannerProps) {
  const t = useTranslations("upgradeBanner");
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-red-500  to-red-600 rounded-md p-6 mb-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
        aria-label={t("dismiss")}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
   

        {/* Text content */}
        <div className="flex-1 text-center md:text-left">
       
          <p className="text-white text-lg">
            {t("description")}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0">
          <Link
            href={`/${locale}/plans`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
           
            {t("ctaButton")}
          </Link>
        </div>
      </div>

    
    </div>
  );
}
