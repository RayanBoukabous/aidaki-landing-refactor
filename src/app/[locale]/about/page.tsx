"use client";

import { useTranslations } from "next-intl";
import {
  Brain,
  Cpu,
  Target,
  Code,
  Award,
  CheckCircle,
  Users,
  Star,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";
import Footer from "../../components/Footer";

export default function AboutUsPage() {
  const t = useTranslations("aboutUs");

  return (
    <div className="relative overflow-hidden">
      {/* Add VisualsTopbar for non-authenticated users */}
      <VisualsTopbar />

      {/* Hero Section - Updated with introduction text and image layout */}
      <section className="relative py-16 md:py-24 bg-green-50">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply opacity-20"></div>
        <div className="absolute text-center top-1/4 right-10 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("subtitle")}
            </p>
          </div>

          {/* Introduction Content with Image - Similar to other sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="order-1 lg:order-1">
              <div className="bg-white p-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <img
                  src="/images/about/aboutUs.png"
                  alt="AIDAKI - Innovation algérienne en éducation"
                  className="w-full aspect-square object-cover rounded-xl mb-4"
                />
              </div>
            </div>

            <div className="order-2 lg:order-2">
         
          
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">{t("platform.intro")}</p>
                <p>{t("platform.systemAdvanced")}</p>
                <p>{t("platform.features")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Image Left, Text Right */}
      <section id="vision" className="relative py-16 md:py-24 bg-green-50">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply opacity-20"></div>
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-2">
              <div className="bg-white p-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <img
                  src="/images/about/vision.png"
                  alt="Vision of future education"
                  className="w-full aspect-square object-cover rounded-xl mb-4"
                />
              </div>
            </div>

            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Target className="h-4 w-4" />
                {t("vision.title")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-normal">
                {t("vision.subtitle")}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-green-900">
                  {t("vision.intro")}
                </p>
                <p>{t("vision.personalizedLearning")}</p>
                <p>{t("vision.predictiveAnalysis")}</p>
                <p className="font-semibold text-green-900">
                  {t("vision.personalizedReality")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="new-approach"
        className="relative py-16 md:py-24 bg-green-50"
      >
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-300 rounded-full mix-blend-multiply opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-1">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <img
                  src="/images/about/python.jpg"
                  alt="Python development and mathematics"
                  className="w-full aspect-square object-cover rounded-xl mb-4"
                />
              </div>
            </div>

            <div className="order-2 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Code className="h-4 w-4" />
                {t("coursesDevelopment.title")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-normal">
                {t("coursesDevelopment.title")}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">{t("coursesDevelopment.intro")}</p>
                <p>{t("coursesDevelopment.qualityContent")}</p>
                <p>{t("coursesDevelopment.pythonAdvantage")}</p>
                <p className="font-semibold text-green-900">
                  {t("coursesDevelopment.uniqueOffering")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Technology Section - Text Left, Image Right */}
      <section
        id="avatar-technology"
        className="relative py-16 md:py-24 bg-green-100"
      >
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-300 rounded-full mix-blend-multiply opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-200 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Brain className="h-4 w-4" />
                {t("avatarTechnology.title")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-normal">
                {t("avatarTechnology.title")}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-green-900">
                  {t("avatarTechnology.intro")}
                </p>
                <p>{t("avatarTechnology.neuralNetworks")}</p>

                <div className="bg-white rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-4 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-gray-900">
                      70% Engagement Increase
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("avatarTechnology.engagement")}
                  </p>
                </div>

                <p>{t("avatarTechnology.stressReduction")}</p>
                <p>{t("avatarTechnology.rewardSystem")}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-white p-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <img
                  src="/images/about/avatars.png"
                  alt="Avatar technology and neural networks"
                  className="w-full aspect-square object-cover rounded-xl mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Text Left, Image Right */}
      <section className="relative py-16 md:py-24 bg-green-100">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-green-200 text-green-800 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Award className="h-4 w-4" />
                {t("leadership.title")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-normal">
                {t("leadership.title")}
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">{t("leadership.commitment")}</p>
                <p>{t("leadership.redesigning")}</p>
                <p>{t("leadership.research")}</p>

                <div className="bg-white rounded-xl p-6 border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">
                    Our Impact
                  </p>
                  <p className="text-gray-700">{t("leadership.measurement")}</p>
                </div>

                <p className="font-semibold text-green-900">
                  {t("leadership.thoughtLeadership")}
                </p>
              </div>
            </div>

            <div className="order-2 lg:order-1">
              <div className="bg-white p-2 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <img
                  src="/images/about/leader.png"
                  alt="Leadership and educational innovation"
                  className="w-full aspect-square object-cover rounded-xl mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Footer */}
      <Footer />
    </div>
  );
}
