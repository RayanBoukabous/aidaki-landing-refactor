"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../navigation";
import { isAuthenticated, forgotPassword, validateEmail } from "../../services/auth";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email format
    if (!validateEmail(email)) {
      setError(t("auth.validation.invalidEmail") || "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(
        t("auth.forgotPassword.success") ||
          "Password reset instructions have been sent to your email address."
      );
      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // Handle specific error messages
      let errorMessage = t("auth.forgotPassword.error") || 
        "Unable to send reset email. Please try again or contact support.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = t("auth.forgotPassword.emailNotFound") || 
          "No account found with this email address.";
      } else if (err.response?.status === 429) {
        errorMessage = t("auth.forgotPassword.tooManyRequests") || 
          "Too many requests. Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setSuccess("");
    setError("");
  };

  return (
    <div>
      <VisualsTopbar />
      <div className="min-h-screen py-4 sm:py-8 lg:py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <img
              src="/images/logo-black.png"
              alt={`${t("app.name")} Logo`}
              className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4"
            />
            
            <p className="text-sm text-center sm:text-base text-slate-600">
              {t("auth.forgotPassword.subtitle") || "Reset your password"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                {isSubmitted
                  ? t("auth.forgotPassword.checkEmailTitle") ||
                    "Check your email"
                  : t("auth.forgotPassword.title") || "Forgot your password?"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {isSubmitted
                  ? t("auth.forgotPassword.checkEmailDescription") ||
                    "We've sent password reset instructions to your email address."
                  : t("auth.forgotPassword.description") ||
                    "Enter your email address and we'll send you instructions to reset your password."}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg mb-4 sm:mb-6 flex items-start sm:items-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-3 rounded-lg mb-4 sm:mb-6 flex items-start sm:items-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">{success}</span>
              </div>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.forgotPassword.email") || "Email address"}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@school.com"
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
                    />
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 absolute left-2.5 sm:left-3 top-2.5 sm:top-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-green-400 transition-all duration-200 mt-6"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span className="text-sm sm:text-base">
                        {t("common.loading")}
                      </span>
                    </div>
                  ) : (
                    t("auth.forgotPassword.submit") || "Send reset instructions"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Email confirmation display */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-xs sm:text-sm text-slate-600 mb-4">
                    {t("auth.forgotPassword.emailSentTo") || "Email sent to:"}
                  </p>
                  <p className="text-center text-sm sm:text-base font-medium text-slate-800 mb-4">
                    {email}
                  </p>
                  <p className="text-center text-xs sm:text-sm text-slate-600">
                    {t("auth.forgotPassword.checkSpam") ||
                      "If you don't see the email, check your spam folder."}
                  </p>
                </div>

                {/* Resend button */}
                <button
                  type="button"
                  onClick={handleResend}
                  className="w-full bg-slate-100 text-slate-700 py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-slate-200 focus:ring-4 focus:ring-slate-300 focus:ring-opacity-50 transition-all duration-200"
                >
                  {t("auth.forgotPassword.resend") || "Resend email"}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center space-y-2">
              <div className="text-xs sm:text-sm text-slate-600">
                {t("auth.forgotPassword.rememberPassword")}{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  {t("auth.forgotPassword.backToLogin") || "Back to login"}
                </Link>
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                {t("auth.forgotPassword.noAccount")}{" "}
                <Link
                  href="/register"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  {t("auth.forgotPassword.createAccount") ||
                    "Create an account"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs text-slate-500 px-4">
            <p>{t("auth.securityNotice") || "Secure educational platform"}</p>
            <p className="mt-1">
              © 2025 AIDAKI -{" "}
              {t("auth.allRightsReserved") || "All rights reserved"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
