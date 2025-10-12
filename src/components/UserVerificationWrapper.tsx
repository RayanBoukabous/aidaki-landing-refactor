"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "../navigation";
import { isAuthenticated, sendVerificationEmail } from "../app/services/auth";
import { useUsersService } from "../app/services/users";

interface User {
  id: string | number;
  email: string;
  isVerified: boolean;
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

/**
 * Loading spinner component
 */
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Verifying your account...</p>
      </div>
    </div>
  );
};

/**
 * Verification check component
 */
const VerificationCheck = ({
  user,
  onResend,
  isResending,
  resendSuccess,
  resendError,
}: {
  user: User | null;
  onResend: (email: string) => void;
  isResending: boolean;
  resendSuccess: boolean;
  resendError: string | null;
}) => {
  const t = useTranslations();
  const [email, setEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      setEmailError(t("verification.errors.emailRequired") || "Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(t("verification.errors.invalidEmail") || "Please enter a valid email address");
      return;
    }
    setEmailError(null);
    onResend(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {t("verification.notVerified") || "You are not verified"}
          </h2>
          <p className="text-slate-600">
            {t("verification.pleaseVerify") || "Please verify your email address"}
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            {t("verification.emailLabel") || "Email address"}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            className={`w-full px-4 py-3 rounded-lg border ${emailError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
            placeholder={t("verification.emailPlaceholder") || "Enter your email address"}
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">
              {t("verification.resendSuccess") || "New verification email sent! Check your inbox."}
            </p>
          </div>
        )}

        {resendError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{resendError}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
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
              <span>{t("verification.resending") || "Sending..."}</span>
            </div>
          ) : (
            t("verification.sendVerification") || "Send verification link"
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Main verification wrapper component
 */
export const UserVerificationWrapper: React.FC<
  { children: React.ReactNode; requireOnboarding?: boolean }
> = ({ children, requireOnboarding = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const t = useTranslations();
  const router = useRouter();
  const { getCurrentUserInfo } = useUsersService();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      const userInfo = await getCurrentUserInfo();
      setUser(userInfo);
      setLoading(false);
    } catch (err) {
      console.error("Error checking user status:", err);
      setError("Unable to verify user status. Please try again.");
      setLoading(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await sendVerificationEmail(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error("Resend verification error:", err);
      const error = err as VerificationError;
      let errorMessage = "Unable to resend verification email. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setResendError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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

  return <>{children}</>;
};

/**
 * Wrapper for pages that require email verification
 */
export function VerifiedUserWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserVerificationWrapper requireOnboarding={false}>
      {children}
    </UserVerificationWrapper>
  );
}

export default UserVerificationWrapper;
