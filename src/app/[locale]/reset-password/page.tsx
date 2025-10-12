"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../navigation";
import { useSearchParams } from "next/navigation";
import { isAuthenticated, resetPassword } from "../../services/auth";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";

function ResetPasswordContent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
      return;
    }

    // Get token from URL parameters
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");
    
    if (!urlToken) {
      setError(t("auth.resetPassword.invalidToken") || "Invalid or missing reset token.");
      return;
    }
    
    setToken(urlToken);
    if (urlEmail) {
      setFormData(prev => ({ ...prev, email: urlEmail }));
    }
  }, [router, searchParams, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Only check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.resetPassword.passwordsNotMatch") || "Passwords do not match.");
      return;
    }

    if (!token) {
      setError(t("auth.resetPassword.invalidToken") || "Invalid reset token.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(formData.email, formData.password, formData.confirmPassword, token);
      setSuccess(
        t("auth.resetPassword.success") ||
        "Your password has been reset successfully. You can now log in with your new password."
      );
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err) {
      console.error("Reset password error:", err);
      
      let errorMessage = t("auth.resetPassword.error") || 
        "Unable to reset password. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = t("auth.resetPassword.invalidRequest") || 
          "Invalid request. Please check your information.";
      } else if (err.response?.status === 404) {
        errorMessage = t("auth.resetPassword.tokenExpired") || 
          "Reset token is invalid or expired. Please request a new password reset.";
      } else if (err.message) {
        errorMessage = t(err.message) || err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <VisualsTopbar />
      <div className="min-h-screen py-4 sm:py-8 lg:py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <img
              src="/images/logo.png"
              alt={`${t("app.name")} Logo`}
              className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              <span className="text-green-600">AI</span>DAKI
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              {t("auth.resetPassword.subtitle") || "Create your new password"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                {success 
                  ? t("auth.resetPassword.successTitle") || "Password Reset Complete"
                  : t("auth.resetPassword.title") || "Reset Your Password"
                }
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {success
                  ? t("auth.resetPassword.successDescription") || "You will be redirected to login shortly."
                  : t("auth.resetPassword.description") || "Enter your email and choose a new secure password."
                }
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

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.resetPassword.email") || "Email address"}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
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

                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.resetPassword.newPassword") || "New Password"}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-10 sm:pr-12 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 sm:right-3 top-2.5 sm:top-4 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.resetPassword.confirmPassword") || "Confirm New Password"}
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-10 sm:pr-12 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 sm:right-3 top-2.5 sm:top-4 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-1 text-xs">
                      {formData.password === formData.confirmPassword ? (
                        <div className="flex items-center text-green-600">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{t("auth.resetPassword.passwordsMatch") || "Passwords match"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>{t("auth.resetPassword.passwordsNotMatch") || "Passwords do not match"}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || formData.password !== formData.confirmPassword}
                  className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-200 mt-6"
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
                    t("auth.resetPassword.submit") || "Reset Password"
                  )}
                </button>
              </form>
            )}

            {/* Success state - show login redirect */}
            {success && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-xs sm:text-sm text-slate-600">
                    {t("auth.resetPassword.redirectingToLogin") || "Redirecting to login page..."}
                  </p>
                </div>
                
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
                >
                  {t("auth.resetPassword.goToLogin") || "Go to Login"}
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center space-y-2">
              <div className="text-xs sm:text-sm text-slate-600">
                {t("auth.resetPassword.rememberPassword")}{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  {t("auth.resetPassword.backToLogin") || "Back to login"}
                </Link>
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                {t("auth.resetPassword.needHelp")}{" "}
                <Link
                  href="/support-and-assistance"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  {t("auth.resetPassword.contactSupport") || "Contact support"}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
