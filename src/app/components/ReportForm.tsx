"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface ReportFormData {
  name: string;
  email: string;
  phone: string;
  errorType: string;
  subject: string;
  description: string;
}

const ReportForm = () => {
  const t = useTranslations("reportForm");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [formData, setFormData] = useState<ReportFormData>({
    name: "",
    email: "",
    phone: "",
    errorType: "",
    subject: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<ReportFormData>>({});

  const errorTypes = [
    t("errorTypes.dateError"),
    t("errorTypes.pedagogicalContent"),
    t("errorTypes.chatbotResponse"),
    t("errorTypes.aiAnalysis"),
    t("errorTypes.avatarVideo"),
    t("errorTypes.other"),
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ReportFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.errorType) {
      newErrors.errorType = t("validation.errorTypeRequired");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("validation.subjectRequired");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("validation.descriptionRequired");
    } else if (formData.description.trim().length < 10) {
      newErrors.description = t("validation.descriptionTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Préparer les données pour l'API
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.errorType,
        details: formData.subject,
        description: formData.description,
      };

      // Envoyer les données à l'API
      const response = await fetch("https://aidaki.ai/api/mail/complaint-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        errorType: "",
        subject: "",
        description: "",
      });
      
      // Fermer immédiatement le modal de formulaire et afficher le modal de remerciement
      const closeEvent = new CustomEvent('closeReportModal');
      window.dispatchEvent(closeEvent);
      
      // Afficher le modal de remerciement
      setTimeout(() => {
        const thankYouEvent = new CustomEvent('showThankYouModal', { 
          detail: { type: 'report' } 
        });
        window.dispatchEvent(thankYouEvent);
      }, 300);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {t("title")}
          </h2>
          <p className="text-white text-opacity-90 text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("fields.name")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder={t("placeholders.name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("fields.email")} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder={t("placeholders.email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("fields.phone")}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              placeholder={t("placeholders.phone")}
            />
          </div>

          {/* Error Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t("fields.errorType")} *
            </label>
            <div className="space-y-2">
              {errorTypes.map((errorType, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleInputChange("errorType", errorType)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    formData.errorType === errorType
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-300 hover:border-orange-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.errorType === errorType
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-400"
                    }`}>
                      {formData.errorType === errorType && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="font-medium">{errorType}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            {errors.errorType && (
              <p className="text-red-500 text-sm mt-1">{errors.errorType}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("fields.subject")} *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                errors.subject ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder={t("placeholders.subject")}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("fields.description")} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none ${
                errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder={t("placeholders.description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {t("descriptionHint")}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl"
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t("submitting")}
                </div>
              ) : (
                t("submit")
              )}
            </motion.button>
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700 font-medium">{t("successMessage")}</p>
                </div>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-700 font-medium">{t("errorMessage")}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportForm;
