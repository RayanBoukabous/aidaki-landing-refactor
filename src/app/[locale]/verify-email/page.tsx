"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../navigation";
import { useSearchParams } from "next/navigation";
import { useUsersService } from "../../services/users";
import { verifyEmail } from "../../services/auth";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";

interface VerificationError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

function VerifyEmailContent() {
  const [email, setEmail] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [verificationState, setVerificationState] = useState<"pending" | "verifying" | "success" | "error">("pending");
  const [verificationError, setVerificationError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { sendVerificationEmail } = useUsersService();

  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlToken = searchParams.get("token");

    if (urlEmail) {
      setEmail(urlEmail);
      setCustomEmail(urlEmail);
    }

    // If there's a token, verify it automatically
    if (urlToken) {
      setVerificationState("verifying");
      verifyEmailToken(urlToken);
    }
  }, [searchParams]);

  const verifyEmailToken = async (token: string) => {
    try {
      await verifyEmail(token);
      setVerificationState("success");
      
      // Redirect to login after successful verification
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      console.error("Email verification error:", err);
      setVerificationState("error");

      const error = err as VerificationError;
      let errorMessage = t("auth.verifyEmail.error") || "Unable to verify email. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = t("auth.verifyEmail.invalidRequest") || "Invalid verification request.";
      } else if (error.response?.status === 404) {
        errorMessage = t("auth.verifyEmail.tokenExpired") || "Verification token is invalid or expired.";
      } else if (error.response?.status === 409) {
        errorMessage = t("auth.verifyEmail.alreadyVerified") || "This email is already verified.";
      } else if (error.message) {
        errorMessage = t(error.message) || error.message;
      }

      setVerificationError(errorMessage);
    }
  };

  const handleResendVerification = async () => {
    const emailToUse = customEmail || email;
    
    if (!emailToUse || !emailToUse.trim()) {
      setResendError(t("auth.verifyEmail.emailRequired") || "Please enter your email address");
      return;
    }

    setIsResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      await sendVerificationEmail(emailToUse);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error("Resend verification error:", err);
      const error = err as VerificationError;
      let errorMessage = t("auth.verifyEmail.resendError") || "Unable to resend verification email. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setResendError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomEmail(e.target.value);
    if (resendError) setResendError("");
  };

  const renderContent = () => {
    switch (verificationState) {
      case "verifying":
        return (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="animate-spin w-8 h-8 text-blue-600"
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
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {t("auth.verifyEmail.verifyingTitle") || "Verifying Your Email"}
            </h2>
            <p className="text-sm text-slate-600">
              {t("auth.verifyEmail.verifyingDescription") || "Please wait while we verify your email address..."}
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
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
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                {t("auth.verifyEmail.successTitle") || "Email Verified Successfully!"}
              </h2>
              <p className="text-sm text-green-700 mb-4">
                {t("auth.verifyEmail.successDescription") || "Your email address has been verified. You can now sign in to your account."}
              </p>
              <p className="text-xs text-green-600">
                {t("auth.verifyEmail.redirectingToLogin") || "Redirecting to sign in..."}
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-green-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
            >
              {t("auth.verifyEmail.goToLogin") || "Sign In to Your Account"}
            </Link>
          </div>
        );

      case "error":
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
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
                </div>
              </div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                {t("auth.verifyEmail.errorTitle") || "Verification Failed"}
              </h2>
              <p className="text-sm text-red-700">
                {verificationError}
              </p>
            </div>

          </div>
        );

      default: // pending state
        return (
          <div className="space-y-6">
            {/* Main verification message */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">
                {t("auth.verifyEmail.checkInboxTitle") || "Verify Your Email Address"}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-2">
                {t("auth.verifyEmail.checkInboxDescription") || "We've sent a verification email to:"}
              </p>
              {email && (
                <p className="text-sm sm:text-base font-medium text-slate-800 mb-4">
                  {email}
                </p>
              )}
              <p className="text-sm text-slate-600">
                {t("auth.verifyEmail.clickLinkDescription") || "Please check your inbox and click the verification link to complete your registration."}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                {t("auth.verifyEmail.instructionsTitle") || "What to do next:"}
              </h3>
              <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>{t("auth.verifyEmail.instruction1") || "Check your email inbox (including spam/junk folder)"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>{t("auth.verifyEmail.instruction2") || "Look for an email from AIDAKI"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>{t("auth.verifyEmail.instruction3") || "Click the verification link in the email"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>{t("auth.verifyEmail.instruction4") || "You'll be redirected back to sign in"}</span>
                </li>
              </ul>
            </div>

            {/* Resend section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">
                {t("auth.verifyEmail.didntReceiveTitle") || "Didn't receive the email?"}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {t("auth.verifyEmail.didntReceiveDescription") || "If you don't see the email in your inbox, you can request a new one."}
              </p>

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 flex-shrink-0"
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
                  <span className="text-sm">
                    {t("auth.verifyEmail.resendSuccess") || "New verification email sent! Check your inbox."}
                  </span>
                </div>
              )}

              {resendError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 flex-shrink-0"
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
                  <span className="text-sm">{resendError}</span>
                </div>
              )}


              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isResending ? (
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
                    <span>{t("auth.verifyEmail.resending") || "Sending..."}</span>
                  </div>
                ) : (
                  t("auth.verifyEmail.resendButton") || "Didn't receive email? Click to send again"
                )}
              </button>
            </div>

            {/* Additional help links */}
            <div className="text-center space-y-2">
              <Link
                href="/login"
                className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {t("auth.verifyEmail.backToLogin") || "Back to sign in"}
              </Link>
              <div className="text-xs text-slate-500">
                {t("auth.verifyEmail.needHelp") || "Need help?"} {" "}
                <Link href="/support-and-assistance" className="text-blue-600 hover:text-blue-700">
                  {t("auth.verifyEmail.contactSupport") || "Contact support"}
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
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
              {t("auth.verifyEmail.subtitle") || "Verify your email address"}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10">
            {renderContent()}
          </div>

          {/* Bottom Footer */}
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

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
