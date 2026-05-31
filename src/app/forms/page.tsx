"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

// Types
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "success" | "error";
  errorMsg?: string;
}

export default function FormsPage() {
  // ZONE 1: Dynamic Consent Form State
  const [consentName, setConsentName] = useState("");
  const [consentEmail, setConsentEmail] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentSubmitted, setConsentSubmitted] = useState(false);

  // ZONE 2: Registration Validation Form State
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regErrors, setRegErrors] = useState<{ username?: string; password?: string; bio?: string }>({});
  const [regSubmitted, setRegSubmitted] = useState(false);

  // ZONE 3: Advanced Multi-File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_FILES = 3;

  // ZONE 4: Password Strength State
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ZONE 5: Real-Time Username Checker State
  const [usernameToCheck, setUsernameToCheck] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [checkedUsername, setCheckedUsername] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ZONE 6: Input Masking State
  const [maskedPhone, setMaskedPhone] = useState("");
  const [maskedCard, setMaskedCard] = useState("");
  const [maskSubmitted, setMaskSubmitted] = useState(false);

  // ZONE 7: Character Counter State
  const [message, setMessage] = useState("");
  const [msgSubmitted, setMsgSubmitted] = useState(false);
  const maxMsgLength = 100;

  // ZONE 8: OTP Verification State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ZONE 9: Tag Picker State
  const [tags, setTags] = useState<string[]>(["Playwright", "React"]);
  const [tagInput, setTagInput] = useState("");

  // ZONE 10: Dual-Slider State
  const [sliderMin, setSliderMin] = useState(25);
  const [sliderMax, setSliderMax] = useState(75);

  // ZONE 11: Rich Text Editor State
  const editorRef = useRef<HTMLDivElement>(null);

  // ZONE 12: Route Guard State
  const [isPageDirty, setIsPageDirty] = useState(false);

  // Handlers
  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consentChecked) {
      setConsentSubmitted(true);
    }
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; password?: string; bio?: string } = {};
    if (!regUsername.trim()) {
      newErrors.username = "Username is required";
    }
    if (!regPassword.trim()) {
      newErrors.password = "Password is required";
    }
    if (!regBio.trim()) {
      newErrors.bio = "Bio is required";
    }

    setRegErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setRegSubmitted(true);
    } else {
      setRegSubmitted(false);
    }
  };

  // Multi-File Process
  const processFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const incomingFiles = Array.from(filesList);

    setUploadedFiles((prev) => {
      const currentSuccessCount = prev.filter(f => f.status === "success").length;
      const remainingSlots = MAX_FILES - currentSuccessCount;
      
      const newFiles = incomingFiles.slice(0, Math.max(0, remainingSlots)).map((file) => {
        const hasValidType = ALLOWED_TYPES.includes(file.type) || 
          file.name.toLowerCase().endsWith(".png") ||
          file.name.toLowerCase().endsWith(".jpg") ||
          file.name.toLowerCase().endsWith(".jpeg") ||
          file.name.toLowerCase().endsWith(".pdf");
        const hasValidSize = file.size <= MAX_FILE_SIZE;

        let status: "success" | "error" = "success";
        let errorMsg;

        if (!hasValidType) {
          status = "error";
          errorMsg = "Invalid type. Allowed: PNG, JPG, JPEG, PDF.";
        } else if (!hasValidSize) {
          status = "error";
          errorMsg = "File exceeds 2MB size limit.";
        }

        return {
          id: Math.random().toString() + "-" + file.name,
          name: file.name,
          size: file.size,
          status,
          errorMsg,
        };
      });

      if (incomingFiles.length > remainingSlots) {
        const excessFiles = incomingFiles.slice(Math.max(0, remainingSlots));
        excessFiles.forEach((file) => {
          newFiles.push({
            id: Math.random().toString() + "-" + file.name,
            name: file.name,
            size: file.size,
            status: "error",
            errorMsg: `Limit reached. Maximum of ${MAX_FILES} successful files allowed.`,
          });
        });
      }

      return [...prev, ...newFiles];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Password strength logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Very Weak", color: "bg-slate-200", textColor: "text-slate-400" };
    if (pwd.length < 6) return { score: 1, label: "Weak (Too Short)", color: "bg-red-500", textColor: "text-red-500" };

    let score = 1;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (hasLower && hasUpper) score++;
    if (hasDigit) score++;
    if (hasSpecial) score++;

    switch (score) {
      case 2:
        return { score: 2, label: "Medium", color: "bg-amber-500", textColor: "text-amber-600" };
      case 3:
        return { score: 3, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600" };
      case 4:
        return { score: 4, label: "Excellent", color: "bg-indigo-600", textColor: "text-indigo-600" };
      default:
        return { score: 1, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    }
  };
  const pwdStrength = getPasswordStrength(password);

  // Username Availability Handlers
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsernameToCheck(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setUsernameStatus("idle");
      setCheckedUsername("");
      return;
    }

    setUsernameStatus("checking");
    debounceRef.current = setTimeout(() => {
      const normalized = value.toLowerCase();
      const isTaken = normalized.includes("admin") || normalized.includes("test") || normalized.includes("taken");
      setUsernameStatus(isTaken ? "taken" : "available");
      setCheckedUsername(value);
    }, 800);
  };

  // Masking helpers
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length === 0) return "";
    const chunks = [];
    for (let i = 0; i < digits.length && i < 16; i += 4) {
      chunks.push(digits.slice(i, i + 4));
    }
    return chunks.join(" ");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskedPhone(formatPhone(e.target.value));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskedCard(formatCard(e.target.value));
  };

  const handleMaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maskedPhone.replace(/\D/g, "").length === 10 && maskedCard.replace(/\D/g, "").length === 16) {
      setMaskSubmitted(true);
    }
  };

  // Character Counter Handlers
  const handleMsgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length > 0 && message.length <= maxMsgLength) {
      setMsgSubmitted(true);
    }
  };

  const getCounterStyles = (len: number) => {
    if (len >= maxMsgLength) return "text-red-500 font-bold";
    if (len >= 80) return "text-amber-500 font-semibold";
    return "text-slate-400";
  };

  // ZONE 8: OTP Handlers
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input field
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    otpRefs.current[5]?.focus();
  };

  // ZONE 9: Tag Picker Handlers
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, "");
      if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
        setTags([...tags, cleaned]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // ZONE 10: Dual Slider Handlers
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), sliderMax - 5);
    setSliderMin(val);
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), sliderMin + 5);
    setSliderMax(val);
  };

  // ZONE 11: WYSIWYG Handlers
  const handleEditorFormat = (command: string) => {
    document.execCommand(command, false, undefined);
  };

  const handleClearFormat = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editorRef.current.innerText;
    }
  };

  // ZONE 12: Intercept Dashboard Link
  const handleDashboardLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPageDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Do you really want to leave?");
      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  // Window beforeunload handling
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPageDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPageDirty]);

  return (
    <div
      data-testid="forms-page"
      className="flex-1 bg-slate-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <Link
          href="/"
          onClick={handleDashboardLinkClick}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950 mb-8 transition-colors"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="border-b border-slate-250 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Forms & Controls Practice
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice automating form actions: checkbox consents, validation logic, file upload pipelines, masking formats, strength checks, character counters, debounced requests, OTP focus shifts, chip tag additions, dual sliders, formatting editors, and navigation guards.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1: Dynamic Consent Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dynamic Consent Form</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                The Submit button is disabled until the terms checkbox is checked. Useful for testing enabling/disabling states.
              </p>

              {consentSubmitted ? (
                <div
                  data-testid="consent-success-msg"
                  className="rounded-xl bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-sm mb-6"
                >
                  <p className="font-semibold">Consent Submitted!</p>
                  <p className="mt-1 text-xs text-emerald-700">Thank you, {consentName || "User"}. Your consent has been recorded.</p>
                  <button
                    onClick={() => {
                      setConsentSubmitted(false);
                      setConsentName("");
                      setConsentEmail("");
                      setConsentChecked(false);
                    }}
                    className="mt-3 text-xs underline font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Reset Form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      data-testid="consent-name"
                      value={consentName}
                      onChange={(e) => setConsentName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      data-testid="consent-email"
                      value={consentEmail}
                      onChange={(e) => setConsentEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      data-testid="consent-checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="h-4 w-4 mt-0.5 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="terms-checkbox" className="text-xs text-slate-600 leading-normal select-none cursor-pointer">
                      I agree to the <span className="text-indigo-600 underline">Terms and Conditions</span>.
                    </label>
                  </div>
                  <button
                    type="submit"
                    data-testid="consent-submit-btn"
                    disabled={!consentChecked}
                    className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Submit Consent
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* ZONE 4: Password Strength Meter & Visibility Toggle */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-250 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Password Strength & Visibility</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Test toggling password field visibility between hidden/visible, and assert state change of the complex strength indicators.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      data-testid="password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a secure password"
                      className="w-full rounded-lg border border-slate-300 bg-white pl-4 pr-12 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      data-testid="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-800 transition-colors px-1 py-1 rounded"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2">
                    <span className="text-slate-600">Password Strength</span>
                    <span
                      data-testid="password-strength-badge"
                      className={`font-bold transition-all duration-300 ${pwdStrength.textColor}`}
                    >
                      {pwdStrength.label}
                    </span>
                  </div>
                  {/* Strength Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      data-testid="password-strength-bar"
                      className={`h-full transition-all duration-500 ease-out ${pwdStrength.color}`}
                      style={{
                        width: `${(pwdStrength.score / 4) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 2: Registration Validation Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-600 border border-purple-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Validation Feedback Form</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Submitting this form with empty inputs will instantly reveal red error labels below the respective fields.
              </p>

              {regSubmitted ? (
                <div
                  data-testid="reg-success-msg"
                  className="rounded-xl bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-sm mb-6"
                >
                  <p className="font-semibold">Registration Complete!</p>
                  <p className="mt-1 text-xs text-emerald-700">Your mock registration for &ldquo;{regUsername}&rdquo; has been processed successfully.</p>
                  <button
                    onClick={() => {
                      setRegSubmitted(false);
                      setRegUsername("");
                      setRegPassword("");
                      setRegBio("");
                      setRegErrors({});
                    }}
                    className="mt-3 text-xs underline font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Register Another User
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text"
                      data-testid="reg-username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="automation_guru"
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                        regErrors.username ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      }`}
                    />
                    {regErrors.username && (
                      <span
                        data-testid="reg-username-error"
                        className="block mt-1 text-xs font-medium text-red-500"
                      >
                        {regErrors.username}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                    <input
                      type="password"
                      data-testid="reg-password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                        regErrors.password ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      }`}
                    />
                    {regErrors.password && (
                      <span
                        data-testid="reg-password-error"
                        className="block mt-1 text-xs font-medium text-red-500"
                      >
                        {regErrors.password}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">User Bio</label>
                    <textarea
                      data-testid="reg-bio"
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="Tell us about your automation experience..."
                      rows={3}
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                        regErrors.bio ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      }`}
                    />
                    {regErrors.bio && (
                      <span
                        data-testid="reg-bio-error"
                        className="block mt-1 text-xs font-medium text-red-500"
                      >
                        {regErrors.bio}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    data-testid="reg-submit-btn"
                    className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 transition-all duration-200"
                  >
                    Register
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* ZONE 5: Real-Time Debounced Username Checker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-250 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Real-Time Username Checker</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Simulates checking availability over a network. Words containing `admin`, `test`, or `taken` will be reported as taken after an 800ms debounce check.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Check Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      data-testid="username-checker-input"
                      value={usernameToCheck}
                      onChange={handleUsernameChange}
                      placeholder="e.g., custom_tester"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                    {usernameStatus === "checking" && (
                      <div data-testid="username-loading" className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {usernameStatus !== "idle" && usernameStatus !== "checking" && (
                  <div
                    data-testid="username-status-msg"
                    className={`rounded-lg border p-3.5 text-xs font-medium transition-all ${
                      usernameStatus === "available"
                        ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                        : "bg-red-50 border-red-250 text-red-800"
                    }`}
                  >
                    {usernameStatus === "available" ? (
                      <p>✨ Username &ldquo;{checkedUsername}&rdquo; is available!</p>
                    ) : (
                      <p>❌ Username &ldquo;{checkedUsername}&rdquo; is already taken.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 6: Input Masking (Phone & Credit Card) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-605 border border-teal-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dynamic Input Masking</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Automate entries into formatted layout text masks: Phone numbers structure to `(123) 456-7890` and Cards structure with spacing.
              </p>

              {maskSubmitted ? (
                <div
                  data-testid="mask-success-msg"
                  className="rounded-xl bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-sm mb-6"
                >
                  <p className="font-semibold">Format Verification Completed!</p>
                  <p className="mt-1 text-xs text-emerald-700">Phone: {maskedPhone}</p>
                  <p className="text-xs text-emerald-700">Card: {maskedCard}</p>
                  <button
                    onClick={() => {
                      setMaskSubmitted(false);
                      setMaskedPhone("");
                      setMaskedCard("");
                    }}
                    className="mt-3 text-xs underline font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Reset Fields
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="text"
                      data-testid="masked-phone-input"
                      value={maskedPhone}
                      onChange={handlePhoneChange}
                      maxLength={14}
                      placeholder="(555) 000-0000"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Credit Card Number</label>
                    <input
                      type="text"
                      data-testid="masked-card-input"
                      value={maskedCard}
                      onChange={handleCardChange}
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    data-testid="mask-submit-btn"
                    disabled={maskedPhone.replace(/\D/g, "").length !== 10 || maskedCard.replace(/\D/g, "").length !== 16}
                    className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Submit Verification
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* ZONE 7: Textarea with Dynamic Character Counter */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Character Counter & Limits</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Fill the textarea and assert color transformations of the character counters. Blocks submission if count limit is exceeded.
              </p>

              {msgSubmitted ? (
                <div
                  data-testid="counter-success-msg"
                  className="rounded-xl bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-sm mb-6"
                >
                  <p className="font-semibold">Message Logged Successfully!</p>
                  <p className="mt-1 text-xs text-emerald-700 italic">&ldquo;{message}&rdquo;</p>
                  <button
                    onClick={() => {
                      setMsgSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-3 text-xs underline font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Create New Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMsgSubmit} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Message</label>
                      <span
                        data-testid="char-counter-display"
                        className={`text-xs font-mono transition-colors ${getCounterStyles(message.length)}`}
                      >
                        {message.length} / {maxMsgLength} Chars
                      </span>
                    </div>
                    <textarea
                      data-testid="counter-textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here... limits apply."
                      rows={3}
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                        message.length > maxMsgLength
                          ? "border-red-500 focus:ring-red-550"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    data-testid="counter-submit-btn"
                    disabled={message.length === 0 || message.length > maxMsgLength}
                    className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Log Message
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* ZONE 8: OTP Verification Code */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-600 border border-orange-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">OTP Code Verification</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice auto-tabbing focus shifts. Enter a 6-digit numeric code. The correct mock verification key is <code className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-mono font-bold text-xs text-indigo-600">123456</code>.
              </p>

              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Secure Verification Code</label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      data-testid={`otp-input-${idx}`}
                      className="w-12 h-12 text-center text-lg font-bold border border-slate-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                  ))}
                </div>

                {otp.join("").length === 6 && (
                  <div
                    data-testid="otp-success-msg"
                    className={`rounded-lg border p-3.5 text-xs font-medium transition-all ${
                      otp.join("") === "123456"
                        ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                        : "bg-red-50 border-red-250 text-red-800"
                    }`}
                  >
                    {otp.join("") === "123456" ? (
                      <p>🎉 Verification successful! Code matches standard.</p>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span>❌ Invalid verification key entered.</span>
                        <button
                          onClick={() => setOtp(Array(6).fill(""))}
                          className="underline hover:text-red-950 font-semibold"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 9: Dynamic Tag Picker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 border border-cyan-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dynamic Tag Picker</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Type tags and press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-xs border border-slate-200">Enter</kbd> or <kbd className="bg-slate-100 px-1 py-0.5 rounded text-xs border border-slate-200">,</kbd> to add chips. (Max 5 tags). Click the &ldquo;x&rdquo; icon to delete.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Create Tags</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    disabled={tags.length >= 5}
                    placeholder={tags.length >= 5 ? "Limit reached (Max 5)" : "Add tag..."}
                    data-testid="tag-input"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-wrap gap-2" data-testid="tag-list">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      data-testid={`tag-item-${tag}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 group hover:border-slate-350 transition-colors"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        data-testid={`tag-remove-${tag}`}
                        className="text-slate-450 hover:text-red-500 hover:bg-slate-200/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 10: Dual Slider Range Picker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-250 font-bold text-sm">
                  9
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dual-Slider Range Picker</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practise dragging dual handles on an active range track. The Min handle cannot cross within 5 points of the Max handle.
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-655">
                  <span>Selected Range</span>
                  <span className="bg-indigo-50 border border-indigo-150 rounded px-2.5 py-1 text-indigo-650 font-mono font-bold">
                    Min: <span data-testid="range-val-min">{sliderMin}</span> — Max: <span data-testid="range-val-max">{sliderMax}</span>
                  </span>
                </div>

                <div className="relative pt-6 pb-4">
                  {/* Visual Slider Track */}
                  <div className="relative h-2 w-full bg-slate-100 border border-slate-200 rounded-full">
                    {/* Selected Range Bar */}
                    <div
                      className="absolute h-full bg-indigo-600 rounded-full"
                      style={{
                        left: `${sliderMin}%`,
                        right: `${100 - sliderMax}%`
                      }}
                    />
                  </div>

                  {/* Range inputs stacked absolute */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderMin}
                    onChange={handleMinSliderChange}
                    data-testid="range-slider-min"
                    className="absolute pointer-events-none appearance-none w-full h-2 bg-transparent top-6 left-0 z-20 outline-none 
                      [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer 
                      [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderMax}
                    onChange={handleMaxSliderChange}
                    data-testid="range-slider-max"
                    className="absolute pointer-events-none appearance-none w-full h-2 bg-transparent top-6 left-0 z-20 outline-none 
                      [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer 
                      [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 12: Route Guard / Dialog Warnings */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600 border border-red-200 font-bold text-sm">
                  10
                </span>
                <h2 className="text-xl font-bold text-slate-900">Route Guard Dialogs</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practise intercepting browser confirmation triggers. Turn on the lock; leaving the page or clicking below will open a native confirm dialog popup window.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <label htmlFor="nav-lock-switch" className="text-xs font-semibold text-slate-700 leading-normal select-none cursor-pointer">
                    Lock Page Navigation (Mark Forms Dirty)
                  </label>
                  <button
                    type="button"
                    id="nav-lock-switch"
                    data-testid="nav-lock-switch"
                    onClick={() => setIsPageDirty(!isPageDirty)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isPageDirty ? "bg-red-500" : "bg-slate-250"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isPageDirty ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  data-testid="simulate-nav-btn"
                  onClick={() => {
                    const confirmLeave = window.confirm("You have unsaved changes. Do you really want to leave?");
                    if (confirmLeave) {
                      window.location.href = "/";
                    }
                  }}
                  className="w-full rounded-lg border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 hover:text-red-700 px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                >
                  Simulate Navigate Away Action
                </button>
              </div>
            </div>
          </section>

          {/* ZONE 11: Rich Text WYSIWYG Editor */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 border border-indigo-250 font-bold text-sm">
                  11
                </span>
                <h2 className="text-xl font-bold text-slate-900">Rich Text WYSIWYG Editor</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Automate text updates and formatting inside a non-standard editable container tag. Highlight details and trigger CSS bold/italic assertions.
              </p>

              <div className="space-y-4">
                {/* Formatting controls toolbar */}
                <div className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex-wrap items-center">
                  <button
                    type="button"
                    data-testid="editor-bold-btn"
                    onClick={() => handleEditorFormat("bold")}
                    className="h-8 px-3 rounded text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition-colors border border-slate-200 bg-white"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    data-testid="editor-italic-btn"
                    onClick={() => handleEditorFormat("italic")}
                    className="h-8 px-3 rounded text-xs italic text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition-colors border border-slate-200 bg-white"
                  >
                    I
                  </button>
                  <div className="w-px h-5 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    data-testid="editor-clear-btn"
                    onClick={handleClearFormat}
                    className="h-8 px-3 rounded text-xs text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-200 bg-white"
                  >
                    Clear Styling
                  </button>
                </div>

                {/* Content Editable Area */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  data-testid="wysiwyg-editor"
                  className="w-full min-h-[120px] max-h-[240px] overflow-y-auto rounded-lg border border-slate-300 bg-white p-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                >
                  Type your formatted text here. Highlight any word and click <b>B</b> or <i>I</i> in the toolbar above to test state mutations.
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 3: Advanced Multi-File Upload Zone */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  12
                </span>
                <h2 className="text-xl font-bold text-slate-900">Advanced Multi-File Upload</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6 max-w-2xl">
                Practice file drop pipelines and file list state changes. Supports dropping up to 3 files (max 2MB per file; PNG, JPG, JPEG, or PDF). Excess uploads or invalid types trigger validation error tags.
              </p>

              <div className="grid gap-6 lg:grid-cols-3 items-start">
                
                {/* Drag-and-drop zone */}
                <div
                  data-testid="file-dropzone"
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`lg:col-span-2 relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? "border-indigo-500 bg-indigo-50/50 shadow-indigo-500/5 shadow-inner scale-[1.01]"
                      : "border-slate-250 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    data-testid="file-input"
                    className="hidden"
                  />

                  <div className="flex flex-col items-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 mb-4 transition-colors">
                      <svg className="h-7 w-7 text-slate-400 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      Drag & drop multiple files, or <span className="text-indigo-650 hover:text-indigo-500">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Accepts up to 3 files (PNG, JPG, PDF; Max 2MB each)</p>
                  </div>
                </div>

                {/* Uploaded File List Panel */}
                <div data-testid="file-list-container" className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[190px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Queue List</h4>
                      {uploadedFiles.length > 0 && (
                        <button
                          type="button"
                          data-testid="file-clear-all-btn"
                          onClick={clearAllFiles}
                          className="text-xs text-red-500 hover:underline font-semibold"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {uploadedFiles.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-8">No files selected</p>
                    ) : (
                      <ul className="space-y-3">
                        {uploadedFiles.map((file) => (
                          <li
                            key={file.id}
                            className={`flex items-start justify-between p-3 rounded-lg border text-xs gap-3 ${
                              file.status === "success"
                                ? "bg-white border-slate-200"
                                : "bg-red-50/50 border-red-200 text-red-900"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate text-slate-800" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-450 mt-0.5">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              {file.status === "error" && (
                                <span
                                  data-testid={`file-status-error-${file.name}`}
                                  className="block mt-1 text-[10px] font-medium text-red-600"
                                >
                                  {file.errorMsg}
                                </span>
                              )}
                              {file.status === "success" && (
                                <span
                                  data-testid={`file-status-success-${file.name}`}
                                  className="inline-flex items-center gap-0.5 mt-1 text-[10px] font-bold text-emerald-600"
                                >
                                  ✓ Ready
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              data-testid={`file-remove-btn-${file.name}`}
                              onClick={() => removeFile(file.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              aria-label={`Remove ${file.name}`}
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {uploadedFiles.filter(f => f.status === "success").length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-655 font-semibold">
                      <span>Total Ready:</span>
                      <span className="bg-indigo-50 border border-indigo-150 rounded px-2 py-0.5 text-indigo-650">
                        {uploadedFiles.filter(f => f.status === "success").length} / {MAX_FILES}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
