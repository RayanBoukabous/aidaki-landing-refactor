"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "../../../navigation";
import { register, isAuthenticated } from "../../services/auth";
import { getAllStates, getAllCommunes } from "../../services/users";
import { useUsersService } from "../../services/users";
import { useYearOfStudy } from "../../hooks/useYearOfStudy";
import { useSpecializations } from "../../hooks/useSpecializations";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";
import Footer from "../../components/Footer";
import { getDirection } from "@/i18n";
import CountDown from "../../components/visuals/CountDown";

interface State {
  id: string | number;
  name: {
    [key: string]: string;
    en?: string;
    fr?: string;
    ar?: string;
  };
  wilaya_code?: string;
  code?: string;
}

interface Commune {
  id: string | number;
  commune_name_ar?: string;
  commune_name_fr?: string;
  name_ar?: string;
  name_fr?: string;
  name?: string;
  wilaya_code: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  email: string;
  age: string;
  phoneNumber: string;
  stateId: string;
  commune: string;
  yearOfStudyId: string;
  specializationId: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    firstNameAr: "",
    lastNameAr: "",
    email: "",
    age: "",
    phoneNumber: "",
    stateId: "",
    commune: "",
    yearOfStudyId: "",
    specializationId: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [allCommunes, setAllCommunes] = useState<Commune[]>([]);
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<State | null>(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [statesError, setStatesError] = useState("");
  const [communesError, setCommunesError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstNameArError, setFirstNameArError] = useState("");
  const [lastNameArError, setLastNameArError] = useState("");

  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { sendVerificationEmail } = useUsersService();
  const direction = getDirection(locale);
  const isRTL = direction === "rtl";
  const getSelectClasses = (disabled = false) =>
    `
  w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg 
  focus:ring-green-500 focus:border-green-500 appearance-none bg-white 
  text-sm sm:text-base transition-colors duration-200
  ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
  ${isRTL ? "text-right" : "text-left"}
`
      .replace(/\s+/g, " ")
      .trim();

  // Use hooks for years and specializations
  const {
    yearsOfStudy,
    loading: yearsLoading,
    error: yearsError,
    fetchYearsOfStudy,
  } = useYearOfStudy();

  const {
    specializations,
    loading: specializationsLoading,
    error: specializationsError,
    fetchSpecializations,
  } = useSpecializations();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingStates(true);
      setStatesError("");
      try {
        const [statesData, communesData] = await Promise.all([
          getAllStates(),
          getAllCommunes(),
        ]);
        setStates(statesData || []);
        setAllCommunes(communesData || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setStatesError(
          t("auth.register.errorLoadingStates") || "Error loading states"
        );
      } finally {
        setLoadingStates(false);
      }
    };

    fetchInitialData();
    fetchYearsOfStudy();
    fetchSpecializations();
  }, [t, fetchYearsOfStudy, fetchSpecializations]);

  // Get specializations for selected year
  const getSpecializationsForYear = (yearId: string) => {
    if (!yearId || !specializations) return [];
    return (
      specializations.filter(
        (spec) => spec.yearOfStudyId === parseInt(yearId)
      ) || []
    );
  };

  // Validate Latin characters (English/French letters)
  const validateLatinCharacters = (text: string): boolean => {
    const latinRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    return latinRegex.test(text);
  };

  // Validate Arabic characters
  const validateArabicCharacters = (text: string): boolean => {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicRegex.test(text);
  };

  // Algerian phone number validation - only local format 0555123456
  const validatePhoneNumber = (phone: string): boolean => {
    const algerianPhoneRegex = /^0(5|6|7)[0-9]{8}$/;
    return algerianPhoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert email to lowercase
    const processedValue = name === "email" ? value.toLowerCase() : value;

    setFormData({ ...formData, [name]: processedValue });
    
    // Validate first name (Latin only)
    if (name === "firstName") {
      if (value && !validateLatinCharacters(value)) {
        setFirstNameError(
          t("auth.register.invalidLatinName") || 
          "First name must contain only Latin letters (A-Z, a-z)"
        );
      } else {
        setFirstNameError("");
      }
    }

    // Validate last name (Latin only)
    if (name === "lastName") {
      if (value && !validateLatinCharacters(value)) {
        setLastNameError(
          t("auth.register.invalidLatinName") || 
          "Last name must contain only Latin letters (A-Z, a-z)"
        );
      } else {
        setLastNameError("");
      }
    }

    // Validate Arabic first name
    if (name === "firstNameAr") {
      if (value && !validateArabicCharacters(value)) {
        setFirstNameArError(
          t("auth.register.invalidArabicName") || 
          "Arabic first name must contain only Arabic letters"
        );
      } else {
        setFirstNameArError("");
      }
    }

    // Validate Arabic last name
    if (name === "lastNameAr") {
      if (value && !validateArabicCharacters(value)) {
        setLastNameArError(
          t("auth.register.invalidArabicName") || 
          "Arabic last name must contain only Arabic letters"
        );
      } else {
        setLastNameArError("");
      }
    }
    
    // Validate phone number on change
    if (name === "phoneNumber") {
      if (value && !validatePhoneNumber(value)) {
        setPhoneError(
          t("auth.register.invalidPhone") || 
          "Invalid Algerian phone number. Format: 0555123456"
        );
      } else {
        setPhoneError("");
      }
    }
    
    if (error) setError("");
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "yearOfStudyId") {
      setFormData({
        ...formData,
        [name]: value,
        specializationId: "", // Reset specialization when year changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (error) setError("");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setFormData({ ...formData, stateId: stateId, commune: "" });

    if (stateId) {
      const selectedState = states.find(
        (state) => state.id.toString() === stateId
      );
      if (selectedState) {
        setSelectedWilaya(selectedState);
        const wilayaCode =
          selectedState.wilaya_code ||
          selectedState.code ||
          selectedState.id?.toString().padStart(2, "0");
        const filtered = allCommunes.filter(
          (commune) => commune.wilaya_code === wilayaCode
        );
        setFilteredCommunes(filtered);
      }
    } else {
      setSelectedWilaya(null);
      setFilteredCommunes([]);
    }
    if (error) setError("");
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, commune: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate Latin names
    if (!validateLatinCharacters(formData.firstName)) {
      setError(
        t("auth.register.invalidLatinName") || 
        "First name must contain only Latin letters (A-Z, a-z)"
      );
      setLoading(false);
      return;
    }

    if (!validateLatinCharacters(formData.lastName)) {
      setError(
        t("auth.register.invalidLatinName") || 
        "Last name must contain only Latin letters (A-Z, a-z)"
      );
      setLoading(false);
      return;
    }

    // Validate Arabic names
    if (!validateArabicCharacters(formData.firstNameAr)) {
      setError(
        t("auth.register.invalidArabicName") || 
        "Arabic first name must contain only Arabic letters"
      );
      setLoading(false);
      return;
    }

    if (!validateArabicCharacters(formData.lastNameAr)) {
      setError(
        t("auth.register.invalidArabicName") || 
        "Arabic last name must contain only Arabic letters"
      );
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(
        t("auth.register.passwordTooShort") ||
          "Password must be at least 8 characters long"
      );
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.register.passwordMismatch") || "Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate phone number format
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      setError(
        t("auth.register.invalidPhone") || 
        "Invalid Algerian phone number. Please use format: 0555123456"
      );
      setLoading(false);
      return;
    }

    if (!formData.yearOfStudyId.trim()) {
      setError(
        t("onboarding.errors.selectYear") || "Please select your year of study"
      );
      setLoading(false);
      return;
    }

    if (!formData.specializationId.trim()) {
      setError(
        t("onboarding.errors.selectSpecialization") ||
          "Please select your specialization"
      );
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        firstNameAr: formData.firstNameAr,
        lastNameAr: formData.lastNameAr,
        email: formData.email.toLowerCase(),
        age: formData.age ? parseInt(formData.age, 10) : null,
        phoneNumber: formData.phoneNumber,
        stateId: formData.stateId,
        communeId: formData.commune,
        yearOfStudyId: formData.yearOfStudyId,
        specializationId: formData.specializationId,
        password: formData.password,
      };

      // Register the user
      await register(submitData);

      // Send verification email
      try {
        await sendVerificationEmail(formData.email.toLowerCase());
        console.log("Verification email sent successfully");
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
      }

      // Redirect to verify-email page with email parameter
      try {
        const verifyEmailUrl = `/verify-email?email=${encodeURIComponent(
          formData.email.toLowerCase()
        )}`;
        console.log("Redirecting to:", verifyEmailUrl);
        router.replace(verifyEmailUrl);
      } catch (redirectError) {
        console.error("Error redirecting:", redirectError);
        if (typeof window !== "undefined") {
          window.location.href = `/${locale}/verify-email?email=${encodeURIComponent(
            formData.email.toLowerCase()
          )}`;
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMessage =
        t("auth.register.error") || "Registration failed. Please try again.";

      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.message && Array.isArray(errorData.message)) {
          errorMessage = errorData.message[0];
        } else if (errorData.message && typeof errorData.message === "string") {
          errorMessage = errorData.message;
        } else if (errorData.error && typeof errorData.error === "string") {
          errorMessage = errorData.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStateName = (state: State) => {
    if (!state || !state.name) return "";
    return (
      state.name[locale] ||
      state.name.en ||
      state.name.fr ||
      state.name.ar ||
      ""
    );
  };

  const getStateDisplayValue = (state: State) => {
    const wilayaCode =
      state.wilaya_code || state.code || state.id?.toString().padStart(2, "0");
    const stateName = getStateName(state);
    return `${wilayaCode} - ${stateName}`;
  };

  const getCommuneName = (commune: Commune) => {
    if (!commune) return "";
    return locale === "ar"
      ? commune.commune_name_ar || commune.name_ar || commune.name || ""
      : commune.commune_name_fr || commune.name_fr || commune.name || "";
  };

  const validatePassword = (password: string) => {
    const requirements: string[] = [];
    if (password.length < 8)
      requirements.push(
        t("auth.register.passwordLength") || "At least 8 characters"
      );
    if (!/[A-Z]/.test(password))
      requirements.push(
        t("auth.register.passwordUppercase") || "One uppercase letter"
      );
    if (!/[a-z]/.test(password))
      requirements.push(
        t("auth.register.passwordLowercase") || "One lowercase letter"
      );
    if (!/[0-9]/.test(password))
      requirements.push(t("auth.register.passwordNumber") || "One number");
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const hasPasswordMismatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;
  const hasPasswordErrors =
    passwordRequirements.length > 0 || hasPasswordMismatch;
  const hasNameErrors = 
    firstNameError !== "" || 
    lastNameError !== "" || 
    firstNameArError !== "" || 
    lastNameArError !== "";
  const isSubmitDisabled = 
    loading || 
    hasPasswordErrors || 
    phoneError !== "" || 
    hasNameErrors;

  const availableSpecializations = formData.yearOfStudyId
    ? getSpecializationsForYear(formData.yearOfStudyId)
    : [];

  return (
    <div>
      <CountDown />
      <VisualsTopbar />
      <div className="min-h-screen py-4 sm:py-8 lg:py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <img
              src="/images/logo-black.png"
              alt={`${t("app.name")} Logo`}
              className="h-12 sm:h-28 w-auto hidden md:block mx-auto mb-3 sm:mb-4"
            />
           
            <p className="text-green-600 hidden md:block md:text-slate-600 text-3xl md:text-lg text-center">
              {t("auth.register.subtitle") || "Create your learning account"}
            </p>
            <p className="block md:hidden mb-6 text-green-600 md:text-slate-600 font-medium text-2xl md:text-sm text-center">
              {t("auth.register.mobileTitle") || "Create your learning space"}
              <br />
              {t("auth.register.mobileSubtitle") || "Join thousands of students"}
            </p>
          </div>

          {/* Login/Register Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 p-1 rounded-full flex">
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 text-center px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                {t("auth.login.title") || "Login"}
              </Link>
              <div className="bg-green-600 text-center text-white px-6 py-2 rounded-full text-sm font-medium">
                {t("auth.register.title") || "Register"}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                {t("auth.register.title")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {t("auth.register.description") ||
                  "Join thousands of students learning with AIDAKI"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Information - Latin Names */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.firstName")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200 ${
                      firstNameError ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder={
                      t("auth.register.firstNamePlaceholder") ||
                      "Your first name"
                    }
                    required
                  />
                  {firstNameError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {firstNameError}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.lastName")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200 ${
                      lastNameError ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder={
                      t("auth.register.lastNamePlaceholder") || "Your last name"
                    }
                    required
                  />
                  {lastNameError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {lastNameError}
                    </p>
                  )}
                </div>
              </div>

              {/* Arabic Names */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="firstNameAr"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.firstNameAr") || "First Name (Arabic)"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstNameAr"
                    name="firstNameAr"
                    type="text"
                    value={formData.firstNameAr}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200 text-right ${
                      firstNameArError ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder={
                      t("auth.register.firstNameArPlaceholder") || "الاسم الأول"
                    }
                    required
                    dir="rtl"
                  />
                  {firstNameArError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {firstNameArError}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastNameAr"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.lastNameAr") || "Last Name (Arabic)"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastNameAr"
                    name="lastNameAr"
                    type="text"
                    value={formData.lastNameAr}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200 text-right ${
                      lastNameArError ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder={
                      t("auth.register.lastNameArPlaceholder") || "اللقب"
                    }
                    required
                    dir="rtl"
                  />
                  {lastNameArError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {lastNameArError}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                >
                  {t("auth.register.email")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
                  placeholder="your.email@school.com"
                  required
                />
              </div>

              {/* Age and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.age")}   <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="6"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
                    placeholder={
                      t("auth.register.agePlaceholder") || "Your age"
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.phoneNumber")}{" "}
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200 ${
                      phoneError ? "border-red-500" : "border-slate-300"
                    } ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder="0555123456"
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              {/* Wilaya and Commune - Side by side with proper RTL/LTR order */}
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ${
                  isRTL ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Commune - First in both LTR and RTL */}
                <div className={isRTL ? "lg:col-start-2" : "lg:col-start-1"}>
                  <label
                    htmlFor="commune"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.commune") || "Commune"}    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="commune"
                    name="commune"
                    value={formData.commune}
                    onChange={handleCommuneChange}
                    className={getSelectClasses(!selectedWilaya)}
                    disabled={!selectedWilaya}
                    required
                  >
                    <option value="">
                      {!selectedWilaya
                        ? t("auth.register.selectStateFirst") ||
                          "Select a state first"
                        : t("auth.register.communePlaceholder") ||
                          "Select your commune"}
                    </option>
                    {filteredCommunes.map((commune) => (
                      <option key={commune.id} value={commune.id}>
                        {getCommuneName(commune)}
                      </option>
                    ))}
                  </select>
                  {communesError && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {communesError}
                    </p>
                  )}
                </div>

                {/* Wilaya (State) - Second in both LTR and RTL */}
                <div className={isRTL ? "lg:col-start-1" : "lg:col-start-2"}>
                  <label
                    htmlFor="stateId"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.state")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="stateId"
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleStateChange}
                    className={`${getSelectClasses(loadingStates)}`}
                    disabled={loadingStates}
                    required
                  >
                    <option value="">
                      {loadingStates
                        ? t("auth.register.loadingStates") ||
                          "Loading states..."
                        : t("auth.register.statePlaceholder") ||
                          "Select your state"}
                    </option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {getStateDisplayValue(state)}
                      </option>
                    ))}
                  </select>
                  {statesError && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {statesError}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Information - Year and Specialization side by side with proper RTL/LTR order */}
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ${
                  isRTL ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Specialization - First in both LTR and RTL */}
                <div className={isRTL ? "lg:col-start-2" : "lg:col-start-1"}>
                  <label
                    htmlFor="specializationId"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("onboarding.step2.title") || "Specialization"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="specializationId"
                    name="specializationId"
                    value={formData.specializationId}
                    onChange={handleSelectChange}
                    className={getSelectClasses(
                      !formData.yearOfStudyId || specializationsLoading
                    )}
                    disabled={!formData.yearOfStudyId || specializationsLoading}
                    required
                  >
                    <option value="">
                      {!formData.yearOfStudyId
                        ? t("learning.selectSpecializtion") || "Select year first"
                        : specializationsLoading
                        ? t("common.loading") || "Loading..."
                        : t("specializations.chooseSpecialization") ||
                          "Select your specialization"}
                    </option>
                    {availableSpecializations.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.title.charAt(0).toUpperCase() +
                          spec.title.slice(1)}
                      </option>
                    ))}
                  </select>
                  {specializationsError && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {specializationsError}
                    </p>
                  )}
                </div>

                {/* Year of Study - Second in both LTR and RTL */}
                <div className={isRTL ? "lg:col-start-1" : "lg:col-start-2"}>
                  <label
                    htmlFor="yearOfStudyId"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("onboarding.step1.title") || "Year Of Study"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearOfStudyId"
                    name="yearOfStudyId"
                    value={formData.yearOfStudyId}
                    onChange={handleSelectChange}
                    className={`${getSelectClasses(yearsLoading)}`}
                    disabled={yearsLoading}
                    required
                  >
                    <option value="">
                      {yearsLoading
                        ? t("common.loading") || "Loading..."
                        : t("learning.selectYear") ||
                          "Select your year of study"}
                    </option>
                    {yearsOfStudy?.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.title}
                      </option>
                    ))}
                  </select>
                  {yearsError && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {yearsError}
                    </p>
                  )}
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.password")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-9 sm:pr-11 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
                      placeholder={
                        t("auth.register.passwordPlaceholder") ||
                        "Create a strong password"
                      }
                      required
                    />
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
                  {formData.password && passwordRequirements.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-600 mb-1">
                        {t("auth.register.passwordRequirements") ||
                          "Password requirements:"}
                      </p>
                      <ul className="text-xs space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <li
                            key={index}
                            className="text-red-600 flex items-center"
                          >
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2"
                  >
                    {t("auth.register.confirmPassword")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition-colors duration-200"
                    placeholder={
                      t("auth.register.confirmPasswordPlaceholder") ||
                      "Confirm your password"
                    }
                    required
                  />
                  {hasPasswordMismatch && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("auth.register.passwordMismatch") ||
                        "Passwords do not match"}
                    </p>
                  )}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg flex items-start sm:items-center">
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

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 mt-6 ${
                  isSubmitDisabled
                    ? "bg-slate-400 text-slate-600 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
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
                  t("auth.register.submit")
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <div className="text-xs sm:text-sm text-slate-600">
                {t("auth.register.alreadyAccount")}{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  {t("auth.register.login")}
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
      
      {/* Add Footer */}
      <Footer />
    </div>
  );
}