"use client";

import { useEffect, useState } from "react";
// Import the VisualsTopbar for non-authenticated users
import { useRouter } from "../../../navigation";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";
import { useTranslations, useLocale } from "next-intl";
import Footer from "../../components/Footer";
import ComplaintForm from "../../components/ComplaintForm";
import ReportForm from "../../components/ReportForm";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportAndAssistancePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'complaint', 'report', ou null
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [thankYouType, setThankYouType] = useState('');

  useEffect(() => {
    // Check if user has a token (equivalent to authStore.isLoggedIn from original)
    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="));
    if (token) {
      setIsAuthenticated(true);
      // Don't redirect to dashboard - let users access support page even when logged in
    }

    // Écouter les événements de fermeture des modals
    const handleCloseModal = () => setActiveModal(null);
    const handleShowThankYouModal = (event) => {
      setThankYouType(event.detail.type);
      setShowThankYouModal(true);

      // Fermer automatiquement après 20 secondes
      setTimeout(() => {
        setShowThankYouModal(false);
      }, 20000);
    };

    window.addEventListener('closeModal', handleCloseModal);
    window.addEventListener('showThankYouModal', handleShowThankYouModal);

    return () => {
      window.removeEventListener('closeModal', handleCloseModal);
      window.removeEventListener('showThankYouModal', handleShowThankYouModal);
    };
  }, [router]);

  return (
    <div className="relative overflow-hidden">
      {/* Always show VisualsTopbar like other pages */}
      <div>
        <VisualsTopbar />
      </div>

      {/* Main content section */}
      <section className="relative py-16 md:py-24 bg-green-50">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply opacity-20"></div>
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl text-center md:text-5xl font-bold mb-6 text-gray-800 tracking-tight">
              {t("support.title")}
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("support.subtitle")}
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-green-100 mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
            </div>
            <p className="text-xl text-gray-700 text-center leading-relaxed">
              {t("support.paragraph3")}
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Réclamation Link */}
            <button
              onClick={() => setActiveModal('complaint')}
              className="group bg-gradient-to-br from-red-500 to-orange-500 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl text-center font-bold text-white mb-3">
                {t("support.complaint_title")}
              </h3>
              <p className="text-white text-opacity-90">
                {t("support.complaint_description")}
              </p>
            </button>

            {/* Signalement Link */}
            <button
              onClick={() => setActiveModal('report')}
              className="group bg-gradient-to-br from-orange-500 to-yellow-500 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl text-center font-bold text-white mb-3">
                {t("support.report_title")}
              </h3>
              <p className="text-white text-opacity-90">
                {t("support.report_description")}
              </p>
            </button>
          </div>
        </div>
      </section>


      {/* Dynamic Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeModal === 'complaint' ? t("complaintForm.title") : t("reportForm.title")}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {activeModal === 'complaint' ? <ComplaintForm /> : <ReportForm />}
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showThankYouModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowThankYouModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Thank You Icon */}
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              {/* Thank You Message */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {thankYouType === 'complaint' ? t("thankYou.complaintTitle") : t("thankYou.reportTitle")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {thankYouType === 'complaint' ? t("thankYou.complaintMessage") : t("thankYou.reportMessage")}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 20, ease: "linear" }}
                />
              </div>

              <p className="text-sm text-gray-500">
                {t("thankYou.autoCloseMessage")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom wavy separator */}
      <div className="wavy-separator-bottom">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-20 text-green-50"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <Footer />
    </div>
  );
}
