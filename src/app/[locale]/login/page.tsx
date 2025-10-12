"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../navigation";
import { login, isAuthenticated } from "../../services/auth";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";
import Footer from "../../components/Footer";
import CountDown from "../../components/visuals/CountDown";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleEmailChange = (e) => {
    // Convert email to lowercase as user types
    setEmail(e.target.value.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Ensure email is lowercase when sending to API
      await login(email.toLowerCase(), password);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError(
        t("auth.login.error") || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CountDown />
      <VisualsTopbar />
      <div className="min-h-screen py-4 sm:py-8 lg:py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Header */}
          <div className=" text-center mb-6 sm:mb-8">
            <img
              src="/images/logo-black.png"
              alt={`${t("app.name")} Logo`}
              className="h-12 sm:h-28 w-auto hidden md:block mx-auto mb-3 sm:mb-4"
            />
           
            <p className="text-green-600 hidden md:block  md:text-slate-600  text-3xl md:text-lg text-center ">
              {t("auth.login.subtitle") || "Connect to your learning space"}
            </p>
            <p className="block md:hidden mb-6 text-green-600  md:text-slate-600 font-medium text-2xl md:text-sm text-center ">
              {t("auth.login.mobileTitle") || "Connect to your learning space"}
            <br />
            {t("auth.login.mobileSubtitle") || "Connect to your learning space"}
            </p>
          </div>

          {/* Login/Register Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 p-1 rounded-full flex">
              <div className="bg-green-600 text-center text-white px-6 py-2 rounded-full text-sm font-medium">
                {t("auth.login.title") || "Login"}
              </div>
              <Link 
                href="/register"
                className="text-gray-600 text-center hover:text-green-600 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                {t("auth.register.title") || "Register"}
              </Link>
            </div>
          </div>
  
        
          {/* Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                {t("auth.login.title")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {t("auth.login.description") ||
                  "Access your courses and progress tracking"}
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

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                >
                  {t("auth.login.email")}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                >
                  {t("auth.login.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      t("auth.login.passwordPlaceholder") || "Your password"
                    }
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-9 sm:pr-11 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
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
                    className="absolute right-2.5 sm:right-3 top-2.5 sm:top-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
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
                    <span className="text-sm sm:text-base">{t("common.loading")}</span>
                  </div>
                ) : (
                  t("auth.login.submit")
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-green-600 hover:text-green-700 block transition-colors duration-200"
              >
                {t("auth.login.forgotPassword")}
              </Link>
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
      
      {/* Add Footer */}
      <Footer />
    </div>
  );
}