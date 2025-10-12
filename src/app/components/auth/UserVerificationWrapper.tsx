"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "../../../navigation";
import { isAuthenticated, sendVerificationEmail } from "../../services/auth";
import { useUsersService } from "../../services/users";
import { useSubscriptions } from "../../hooks/useSubscriptions";

interface User {
  id: string | number;
  email: string;
  isVerified: boolean;
  yearOfStudy?: number | null;
  specialization?: number | null;
  [key: string]: any;
}

interface VerificationError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface UserVerificationWrapperProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireSubscription?: boolean;
}

/**
 * Loading spinner component with i18n support
 */
const LoadingSpinner = () => {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-slate-600">
          {t("verification.checking") || "Verifying your account..."}
        </p>
      </div>
    </div>
  );
};

/**
 * Error message component with retry functionality
 */
const ErrorMessage = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          {t("common.error") || "Verification Error"}
        </h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {t("common.retry") || "Try Again"}
        </button>
      </div>
    </div>
  );
};

/**
 * Verification check component with resend functionality
 */
const VerificationCheck = ({
  user,
  onResend,
  isResending,
  resendSuccess,
  resendError,
}: {
  user: User | null;
  onResend: () => void;
  isResending: boolean;
  resendSuccess: boolean;
  resendError: string | null;
}) => {
  const t = useTranslations();

  return (
    <div className="min-h-screen py-4 sm:py-8 lg:py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/images/logo-black.png"
            alt={`${t("app.name")} Logo`}
            className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4"
          />
         
         
          <p className="text-sm sm:text-base text-center text-slate-600">
            {t("verification.subtitle") || "Verify your email address"}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10">
          <div className="space-y-6">
            {/* Email verification required message */}
            <div className="text-center space-y-4">
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
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                {t("verification.title") || "Verify Your Email Address"}
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                {t("verification.description") ||
                  "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."}
              </p>

              {user?.email && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">
                      {t("verification.sentTo") || "Email sent to:"}
                    </span>
                    <br />
                    <span className="font-mono">{user.email}</span>
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-500">
                {t("verification.checkSpam") ||
                  "If you don't see the email, check your spam folder."}
              </p>
            </div>

            {/* Success/Error messages */}
            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
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
                  {t("verification.resendSuccess") ||
                    "New verification email sent! Check your inbox."}
                </span>
              </div>
            )}

            {resendError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
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

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg text-base font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
              >
                {t("verification.checkAgain") || "I've verified my email"}
              </button>

              <button
                onClick={onResend}
                disabled={isResending || !user?.email}
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
                    <span>{t("verification.resending") || "Sending..."}</span>
                  </div>
                ) : (
                  t("verification.sendVerification") || "Resend verification email"
                )}
              </button>
            </div>

            {/* Resend verification section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">
                {t("auth.verifyEmail.needNewLink") ||
                  "Need a new verification link?"}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {t("auth.verifyEmail.resendDescription") ||
                  "If your verification link has expired or is invalid, you can request a new one."}
              </p>

              <button
                onClick={onResend}
                disabled={isResending || !user?.email}
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
                    <span>
                      {t("auth.verifyEmail.resending") || "Sending..."}
                    </span>
                  </div>
                ) : (
                  t("auth.verifyEmail.resendButton") ||
                  "Send New Verification Email"
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-800 mb-2">
                {t("verification.instructionsTitle") || "Next steps:"}
              </h3>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>{t("verification.step1") || "Check your email inbox"}</li>
                <li>
                  {t("verification.step2") ||
                    "Click the verification link in the email"}
                </li>
                <li>
                  {t("verification.step3") ||
                    'Return here and click "I\'ve verified my email"'}
                </li>
                <li>
                  {t("verification.step4") || "Complete your profile setup"}
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs text-slate-500 px-4">
          <p>{t("auth.securityNotice") || "Secure educational platform"}</p>
          <p className="mt-1">
            © 2025 AIDAKI -{" "}
            {t("auth.allRightsReserved") || "All rights reserved"}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main verification wrapper component
 */
export const UserVerificationWrapper: React.FC<
  UserVerificationWrapperProps
> = ({ children, requireOnboarding = false, requireSubscription = true }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { getCurrentUserInfo } = useUsersService();
  const { fetchCurrentSubscription, isSubscriptionExpired } = useSubscriptions();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated()) {
        setCheckingVerification(true);
        router.push("/login");
        return;
      }

      // Get current user info
      const userInfo = await getCurrentUserInfo();
      setUser(userInfo);

      
      // Check email verification
      if (!userInfo.isVerified) {
        setLoading(false);
        return;
      }

      // Check subscription status if required
      if (requireSubscription) {
        try {
          const subscriptionData = await fetchCurrentSubscription();
          if (!subscriptionData || isSubscriptionExpired()) {
            setCheckingVerification(true);
            router.push("/plans");
            return;
          }
        } catch (subscriptionError) {
          console.warn("Could not fetch subscription data:", subscriptionError);
          // If subscription check fails, redirect to plans page to be safe
          setCheckingVerification(true);
          router.push("/plans");
          return;
        }
      }

      // Check onboarding completion if required
      if (requireOnboarding) {
        const hasCompletedOnboarding =
          userInfo.yearOfStudy !== undefined &&
          userInfo.yearOfStudy !== null &&
          userInfo.specialization !== undefined &&
          userInfo.specialization !== null;

        if (!hasCompletedOnboarding) {
          setCheckingVerification(true);
          router.push("/dashboard");
          return;
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error checking user status:", err);
      setError(
        t("verification.error") ||
          "Unable to verify user status. Please try again."
      );
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setCheckingVerification(false);
    checkUserStatus();
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await sendVerificationEmail(user.email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error("Resend verification error:", err);
      const error = err as VerificationError;
      let errorMessage =
        t("verification.errors.resendFailed") ||
        "Unable to resend verification email. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage =
          t("auth.verifyEmail.invalidRequest") ||
          "Invalid verification request.";
      } else if (error.response?.status === 404) {
        errorMessage =
          t("auth.verifyEmail.tokenExpired") ||
          "Verification token is invalid or expired.";
      } else if (error.response?.status === 409) {
        errorMessage =
          t("auth.verifyEmail.alreadyVerified") ||
          "This email is already verified.";
      } else if (error.message) {
        errorMessage = t(error.message) || error.message;
      }

      setResendError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Show loading spinner while fetching user data
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error message if there was an error fetching user data
  if (error) {
    return <ErrorMessage error={error} onRetry={handleRetry} />;
  }

  // Show verification check component if user is not verified
  if (user && !user.isVerified) {
    return (
      <VerificationCheck
        user={user}
        onResend={handleResendVerification}
        isResending={isResending}
        resendSuccess={resendSuccess}
        resendError={resendError}
      />
    );
  }

  // Show verification checking message while redirecting for onboarding
  if (checkingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            {t("verification.checking") || "Checking Verification"}
          </h2>
          <p className="text-blue-600">
            {t("verification.checkingMessage") ||
              "Please wait while we verify your account status..."}
          </p>
        </div>
      </div>
    );
  }

  // User is verified and all checks passed, render the children
  return <>{children}</>;
};

/**
 * Wrapper specifically for dashboard/learning pages that require full onboarding and subscription
 */
export function LearningPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserVerificationWrapper requireOnboarding={true} requireSubscription={true}>
      {children}
    </UserVerificationWrapper>
  );
}

/**
 * Wrapper for pages that only require email verification (like onboarding)
 */
export function VerifiedUserWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserVerificationWrapper requireOnboarding={false} requireSubscription={false}>
      {children}
    </UserVerificationWrapper>
  );
}

/**
 * Wrapper for plans page that only requires email verification (no subscription check)
 */
export function PlansPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserVerificationWrapper requireOnboarding={false} requireSubscription={false}>
      {children}
    </UserVerificationWrapper>
  );
}

export default UserVerificationWrapper;
