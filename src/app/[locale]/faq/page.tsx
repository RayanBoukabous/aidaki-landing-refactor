"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  BookOpen,
  Users,
  Brain,
  FileText,
  CreditCard,
  Smartphone,
  Headphones,
} from "lucide-react";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";
import Footer from "../../components/Footer";

export default function FAQPage() {
  const t = useTranslations("faqPage");
  const params = useParams();
  const currentLocale = params.locale as string;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQ items with translation keys
  const faqItems = [
    {
      key: "whatIsAidaki",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: "whoCanUse",
      icon: <Users className="w-5 h-5" />,
    },
    {
      key: "howAiHelps",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      key: "whatContains",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      key: "nationalProgram",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: "freeTrial",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      key: "installSoftware",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      key: "pricing",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      key: "mobileUse",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      key: "coursesAvailable",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: "progressTracking",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      key: "support",
      icon: <Headphones className="w-5 h-5" />,
    },
  ];

  const filteredFaqs = faqItems.filter((item) => {
    const question = t(`items.${item.key}.question`).toLowerCase();
    const answer = t(`items.${item.key}.answer`).toLowerCase();
    return (
      question.includes("") ||
      answer.includes("")
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <VisualsTopbar></VisualsTopbar>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            {t("title")}
          </h1>
          <p className="text-xl text-green-100 text-center max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("noResults")}</p>
            </div>
          ) : (
            filteredFaqs.map((item, index) => (
              <div
                key={item.key}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mt-1">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {t(`items.${item.key}.question`)}
                      </h3>
                      {openIndex === index && (
                        <div className="mt-3 text-gray-600 leading-relaxed space-y-3">
                          {t(`items.${item.key}.answer`)
                            .split("\n")
                            .map((paragraph, i) => {
                              // Check if paragraph contains a bullet point
                              if (paragraph.trim().startsWith("•")) {
                                return (
                                  <li key={i} className="ml-6">
                                    {paragraph.trim().substring(1).trim()}
                                  </li>
                                );
                              }
                              return paragraph.trim() ? (
                                <p key={i}>{paragraph.trim()}</p>
                              ) : null;
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 mt-1 transition-transform duration-300 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
