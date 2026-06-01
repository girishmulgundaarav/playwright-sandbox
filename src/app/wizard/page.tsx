"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

type WizardStep = "account" | "company" | "address" | "payment" | "review" | "success";

interface FormState {
  email: string;
  accountType: "personal" | "business";
  companyName: string;
  taxId: string;
  address: string;
  city: string;
  payment: string;
  promoCode: string;
}

interface StepInfo {
  id: WizardStep;
  label: string;
}

export default function FormWizardPage() {
  const [step, setStep] = useState<WizardStep>("account");
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Form input states
  const [form, setForm] = useState<FormState>({
    email: "",
    accountType: "personal",
    companyName: "",
    taxId: "",
    address: "",
    city: "",
    payment: "",
    promoCode: "",
  });

  // Validation error states
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Touch states (to validate on blur)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  // Promo code states
  const [promoStatus, setPromoStatus] = useState<"idle" | "validating" | "success" | "invalid">("idle");
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Steps visited to control click navigation in header
  const [visitedSteps, setVisitedSteps] = useState<string[]>(["account"]);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wizard_progress_state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.form) setForm(parsed.form);
          if (parsed.step && parsed.step !== "success") setStep(parsed.step);
          if (parsed.visitedSteps) setVisitedSteps(parsed.visitedSteps);
          if (parsed.promoStatus) setPromoStatus(parsed.promoStatus);
          if (parsed.promoDiscount) setPromoDiscount(parsed.promoDiscount);
        } catch (err) {
          console.error("Failed to parse wizard progress state", err);
        }
      }
      setStorageLoaded(true);
    }
  }, []);

  // Save state to localStorage on state changes
  useEffect(() => {
    if (storageLoaded && step !== "success") {
      localStorage.setItem(
        "wizard_progress_state",
        JSON.stringify({
          form,
          step,
          visitedSteps,
          promoStatus,
          promoDiscount,
        })
      );
    }
  }, [form, step, visitedSteps, promoStatus, promoDiscount, storageLoaded]);

  // Determine active steps list based on selected account path
  const getActiveSteps = (): StepInfo[] => {
    const list: StepInfo[] = [{ id: "account", label: "Account Info" }];
    if (form.accountType === "business") {
      list.push({ id: "company", label: "Company Details" });
    }
    list.push({ id: "address", label: "Shipping" });
    list.push({ id: "payment", label: "Payment" });
    list.push({ id: "review", label: "Review & Confirm" });
    return list;
  };

  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex((s) => s.id === step);

  const markStepVisited = (stepId: WizardStep) => {
    setVisitedSteps((prev) => {
      if (prev.includes(stepId)) return prev;
      return [...prev, stepId];
    });
  };

  const navigateToStep = (stepId: WizardStep) => {
    // Only allow clicking if step has been visited or we are going backward
    const targetIdx = activeSteps.findIndex((s) => s.id === stepId);
    if (visitedSteps.includes(stepId) || targetIdx < currentStepIndex) {
      setStep(stepId);
    }
  };

  // Validation helper routines
  const validateField = (name: keyof FormState, value: string): string => {
    if (name === "email") {
      if (!value.trim()) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address.";
    }
    if (name === "companyName" && form.accountType === "business") {
      if (!value.trim()) return "Company name is required.";
    }
    if (name === "taxId" && form.accountType === "business") {
      if (!value.trim()) return "Tax ID is required.";
      const taxRegex = /^[0-9A-Za-z-]+$/;
      if (!taxRegex.test(value)) return "Tax ID must be alphanumeric.";
    }
    if (name === "address") {
      if (!value.trim()) return "Street address is required.";
    }
    if (name === "city") {
      if (!value.trim()) return "City is required.";
    }
    if (name === "payment") {
      if (!value || value === "") return "Please select a payment method.";
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    setForm((prev) => ({ ...prev, [key]: value }));

    // Reset errors & touched state if accountType changes to rebuild steps correctly
    if (key === "accountType") {
      setErrors({});
      setTouched({});
      // If switching type, we reset visited steps to account page
      setVisitedSteps(["account"]);
    }

    if (touched[key]) {
      const error = validateField(key, value);
      setErrors((prev) => ({ ...prev, [key]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    setTouched((prev) => ({ ...prev, [key]: true }));
    const error = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  // Step 1 navigation validation
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateField("email", form.email);
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: error }));

    if (!error) {
      const nextStep = form.accountType === "business" ? "company" : "address";
      markStepVisited(nextStep);
      setStep(nextStep);
    }
  };

  // Step 2 Business navigation validation
  const handleCompanyNext = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateField("companyName", form.companyName);
    const taxErr = validateField("taxId", form.taxId);

    setTouched((prev) => ({ ...prev, companyName: true, taxId: true }));
    setErrors((prev) => ({
      ...prev,
      companyName: nameErr,
      taxId: taxErr,
    }));

    if (!nameErr && !taxErr) {
      markStepVisited("address");
      setStep("address");
    }
  };

  // Address step navigation validation
  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    const addressError = validateField("address", form.address);
    const cityError = validateField("city", form.city);

    setTouched((prev) => ({ ...prev, address: true, city: true }));
    setErrors((prev) => ({
      ...prev,
      address: addressError,
      city: cityError,
    }));

    if (!addressError && !cityError) {
      markStepVisited("payment");
      setStep("payment");
    }
  };

  // Payment step navigation validation
  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentError = validateField("payment", form.payment);
    setTouched((prev) => ({ ...prev, payment: true }));
    setErrors((prev) => ({ ...prev, payment: paymentError }));

    if (!paymentError && promoStatus !== "validating") {
      markStepVisited("review");
      setStep("review");
    }
  };

  // Async Promo Verification Action
  const handleVerifyPromo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.promoCode.trim()) return;

    setPromoStatus("validating");
    setTimeout(() => {
      if (form.promoCode.trim().toUpperCase() === "DISCOUNT50") {
        setPromoStatus("success");
        setPromoDiscount(50);
      } else {
        setPromoStatus("invalid");
        setPromoDiscount(0);
      }
    }, 1500);
  };

  // Final confirmation
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear storage on successful order completion
    localStorage.removeItem("wizard_progress_state");
    setStep("success");
  };

  // Reset the wizard back to empty default
  const handleReset = () => {
    localStorage.removeItem("wizard_progress_state");
    setForm({
      email: "",
      accountType: "personal",
      companyName: "",
      taxId: "",
      address: "",
      city: "",
      payment: "",
      promoCode: "",
    });
    setErrors({});
    setTouched({});
    setPromoStatus("idle");
    setPromoDiscount(0);
    setVisitedSteps(["account"]);
    setStep("account");
  };

  return (
    <div
      data-testid="wizard-page"
      className="flex-1 bg-slate-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950 mb-8 transition-colors"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Auto-Save Status Banner */}
        {step !== "success" && (
          <div
            data-testid="autosave-banner"
            className="mb-6 flex items-center justify-between rounded-xl bg-slate-100 border border-slate-200 px-5 py-3 text-xs text-slate-600"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Progress auto-saved in local storage
            </span>
            <button
              type="button"
              data-testid="autosave-clear-btn"
              onClick={handleReset}
              className="text-indigo-650 hover:text-indigo-805 font-bold uppercase tracking-wider focus:outline-none transition-colors"
            >
              Reset Progress
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Multi-Step Form Wizard
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice validation gating, dynamic step skipping, async loaders, and auto-saving. Review steps allow jumping backward and forward through roving headers.
          </p>
        </div>

        {/* Step Indicator / Progress Bar */}
        {step !== "success" && (
          <div className="mb-12" data-testid="wizard-progress">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-between w-full">
                {activeSteps.map((s, idx) => {
                  const isPassed = currentStepIndex > idx;
                  const isCurrent = s.id === step;
                  const isClickable = visitedSteps.includes(s.id);

                  return (
                    <li key={s.id} className="relative flex flex-col items-center flex-1">
                      <div className="flex items-center w-full">
                        <div className={`w-full h-1 ${idx === 0 ? "bg-transparent" : isPassed ? "bg-emerald-500" : "bg-slate-200"}`} />
                        <button
                          type="button"
                          disabled={!isClickable}
                          onClick={() => navigateToStep(s.id)}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 z-10 focus:outline-none ${
                            isCurrent
                              ? "border-indigo-650 bg-white text-indigo-650 shadow-sm ring-2 ring-indigo-500/20"
                              : isPassed
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-200 bg-white text-slate-400"
                          } ${isClickable ? "cursor-pointer hover:border-indigo-500" : "cursor-not-allowed"}`}
                        >
                          {isPassed ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            idx + 1
                          )}
                        </button>
                        <div className={`w-full h-1 ${idx === activeSteps.length - 1 ? "bg-transparent" : isPassed ? "bg-emerald-500" : "bg-slate-200"}`} />
                      </div>
                      <span
                        className={`mt-2 text-[10px] font-bold uppercase tracking-wider text-center ${
                          isCurrent ? "text-indigo-650" : isPassed ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        )}

        {/* Wizard Main Container Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm min-h-[380px] flex flex-col justify-between">
          
          {/* STEP 1: Account Info */}
          {step === "account" && (
            <form
              data-testid="wizard-step-1"
              onSubmit={handleStep1Next}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 1: Account Information</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Select your registration path type and input your email.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Account Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-6 items-center">
                      <label className="inline-flex items-center text-sm text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="accountType"
                          data-testid="wizard-type-personal"
                          value="personal"
                          checked={form.accountType === "personal"}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-indigo-650 border-slate-300 focus:ring-indigo-500"
                        />
                        Personal Account
                      </label>
                      <label className="inline-flex items-center text-sm text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="accountType"
                          data-testid="wizard-type-business"
                          value="business"
                          checked={form.accountType === "business"}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-indigo-650 border-slate-300 focus:ring-indigo-500"
                        />
                        Business Account
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      data-testid="wizard-email-input"
                      value={form.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="name@example.com"
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-rose-450 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500"
                          : touched.email
                          ? "border-emerald-500 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        data-testid="wizard-email-error"
                        className="text-xs font-semibold text-rose-600 flex items-center gap-1"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  data-testid="wizard-next-btn"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Company Details (Business only) */}
          {step === "company" && (
            <form
              data-testid="wizard-step-2-business"
              onSubmit={handleCompanyNext}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 2: Company Details</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Provide the enterprise registration records details.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700">
                      Company Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      data-testid="wizard-company-input"
                      value={form.companyName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Acme Corp"
                      aria-required="true"
                      aria-invalid={errors.companyName ? "true" : "false"}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.companyName
                          ? "border-rose-450 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500"
                          : touched.companyName
                          ? "border-emerald-500 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    {errors.companyName && (
                      <p
                        id="company-error"
                        data-testid="wizard-company-error"
                        className="text-xs font-semibold text-rose-600 flex items-center gap-1"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="taxId" className="block text-sm font-semibold text-slate-700">
                      Registration Tax ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      data-testid="wizard-taxid-input"
                      value={form.taxId}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="US-1234567"
                      aria-required="true"
                      aria-invalid={errors.taxId ? "true" : "false"}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.taxId
                          ? "border-rose-450 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500"
                          : touched.taxId
                          ? "border-emerald-500 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    {errors.taxId && (
                      <p
                        id="taxid-error"
                        data-testid="wizard-taxid-error"
                        className="text-xs font-semibold text-rose-600 flex items-center gap-1"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {errors.taxId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  data-testid="wizard-back-btn"
                  onClick={() => setStep("account")}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  data-testid="wizard-next-btn"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Shipping Address */}
          {step === "address" && (
            <form
              data-testid="wizard-step-2"
              onSubmit={handleAddressNext}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 3: Shipping Address</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Provide the destination address for physical delivery.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-slate-700">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      data-testid="wizard-address-input"
                      value={form.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="123 Main Street"
                      aria-required="true"
                      aria-invalid={errors.address ? "true" : "false"}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.address
                          ? "border-rose-450 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500"
                          : touched.address
                          ? "border-emerald-500 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    {errors.address && (
                      <p
                        id="address-error"
                        data-testid="wizard-address-error"
                        className="text-xs font-semibold text-rose-600 flex items-center gap-1"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-semibold text-slate-700">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      data-testid="wizard-city-input"
                      value={form.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="San Francisco"
                      aria-required="true"
                      aria-invalid={errors.city ? "true" : "false"}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.city
                          ? "border-rose-450 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500"
                          : touched.city
                          ? "border-emerald-500 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    {errors.city && (
                      <p
                        id="city-error"
                        data-testid="wizard-city-error"
                        className="text-xs font-semibold text-rose-600 flex items-center gap-1"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  data-testid="wizard-back-btn"
                  onClick={() => setStep(form.accountType === "business" ? "company" : "account")}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  data-testid="wizard-next-btn"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Payment Details & Promo Verification */}
          {step === "payment" && (
            <form
              data-testid="wizard-step-3"
              onSubmit={handlePaymentNext}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 4: Select Payment & Promos</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Choose payment method and apply voucher promotion code.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="payment" className="block text-sm font-semibold text-slate-700">
                      Payment Option <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="payment"
                      name="payment"
                      data-testid="wizard-payment-select"
                      value={form.payment}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      aria-required="true"
                      aria-invalid={errors.payment ? "true" : "false"}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer ${
                        errors.payment
                          ? "border-rose-450 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500"
                          : touched.payment
                          ? "border-emerald-500 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    >
                      <option value="">-- Choose Payment Method --</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                    {errors.payment && (
                      <p
                        id="payment-error"
                        data-testid="wizard-payment-error"
                        className="text-xs font-semibold text-rose-600 flex items-center gap-1"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {errors.payment}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="promoCode" className="block text-sm font-semibold text-slate-700">
                      Voucher Promo Code <span className="text-slate-400 font-normal">(Optional, try: DISCOUNT50)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="promoCode"
                        name="promoCode"
                        data-testid="wizard-promo-input"
                        value={form.promoCode}
                        onChange={handleInputChange}
                        placeholder="VOUCHER10"
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        data-testid="wizard-promo-verify-btn"
                        onClick={handleVerifyPromo}
                        disabled={promoStatus === "validating" || !form.promoCode.trim()}
                        className="px-5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 focus:outline-none transition-colors"
                      >
                        {promoStatus === "validating" ? "Checking..." : "Verify Code"}
                      </button>
                    </div>

                    <div className="h-5">
                      {promoStatus === "validating" && (
                        <p data-testid="wizard-promo-status" className="text-xs text-slate-500 animate-pulse font-semibold flex items-center gap-1">
                          <svg className="animate-spin h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying voucher coupon database...
                        </p>
                      )}
                      {promoStatus === "success" && (
                        <p data-testid="wizard-promo-status" className="text-xs text-emerald-600 font-bold">
                          ✓ Coupon applied successfully! 50% discount validated.
                        </p>
                      )}
                      {promoStatus === "invalid" && (
                        <p data-testid="wizard-promo-status" className="text-xs text-rose-600 font-bold">
                          ⚠️ Invalid discount coupon code. Please try again.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  data-testid="wizard-back-btn"
                  onClick={() => setStep("address")}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  data-testid="wizard-next-btn"
                  disabled={promoStatus === "validating"}
                  className={`px-6 py-2.5 rounded-lg text-white font-semibold text-sm hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer ${
                    promoStatus === "validating" ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Review & Direct Edit Gating */}
          {step === "review" && (
            <form
              data-testid="wizard-step-review"
              onSubmit={handleConfirmOrder}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 5: Review & Confirm Order</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Carefully review details. Click Edit on any block to modify values immediately.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-5 text-sm">
                  {/* Account Block */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Account Details</span>
                      <p className="mt-1 text-slate-800 font-semibold">{form.email}</p>
                      <p className="text-xs text-slate-500 capitalize">{form.accountType} profile path</p>
                    </div>
                    <button
                      type="button"
                      data-testid="edit-step-account"
                      onClick={() => setStep("account")}
                      className="text-xs font-bold text-indigo-650 hover:underline hover:text-indigo-805"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Business Block (Conditional) */}
                  {form.accountType === "business" && (
                    <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Enterprise Info</span>
                        <p className="mt-1 text-slate-800 font-semibold">{form.companyName}</p>
                        <p className="text-xs text-slate-500">Tax ID: {form.taxId}</p>
                      </div>
                      <button
                        type="button"
                        data-testid="edit-step-business"
                        onClick={() => setStep("company")}
                        className="text-xs font-bold text-indigo-650 hover:underline hover:text-indigo-805"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  {/* Shipping Block */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Shipping Location</span>
                      <p className="mt-1 text-slate-800 font-semibold">{form.address}</p>
                      <p className="text-xs text-slate-500">{form.city}</p>
                    </div>
                    <button
                      type="button"
                      data-testid="edit-step-address"
                      onClick={() => setStep("address")}
                      className="text-xs font-bold text-indigo-650 hover:underline hover:text-indigo-805"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Payment Block */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Payment Method</span>
                      <p className="mt-1 text-indigo-650 font-bold">{form.payment}</p>
                      {promoDiscount > 0 && (
                        <p className="text-xs text-emerald-600 font-bold">Promo Coupon: {form.promoCode} (-{promoDiscount}%)</p>
                      )}
                    </div>
                    <button
                      type="button"
                      data-testid="edit-step-payment"
                      onClick={() => setStep("payment")}
                      className="text-xs font-bold text-indigo-650 hover:underline hover:text-indigo-805"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  data-testid="wizard-back-btn"
                  onClick={() => setStep("payment")}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  data-testid="wizard-confirm-btn"
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Confirm Order
                </button>
              </div>
            </form>
          )}

          {/* SUCCESS STATE: Summary */}
          {step === "success" && (
            <div data-testid="wizard-summary" className="space-y-8 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2
                    data-testid="wizard-success-msg"
                    className="text-2xl font-extrabold text-slate-900"
                  >
                    Order Confirmed Successfully
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Your sandbox transaction processed successfully. See execution summary below:
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Execution Data Payloads
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="p-3 bg-white rounded-lg border border-slate-150">
                      <span className="block text-xs font-semibold text-slate-450 uppercase tracking-wide">
                        Account Email
                      </span>
                      <span data-testid="summary-email" className="font-mono text-slate-800 break-all font-semibold">
                        {form.email}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-150">
                      <span className="block text-xs font-semibold text-slate-450 uppercase tracking-wide">
                        Shipping Location
                      </span>
                      <span data-testid="summary-address" className="font-semibold text-slate-800">
                        {form.address}, {form.city}
                      </span>
                    </div>

                    {form.accountType === "business" && (
                      <div className="p-3 bg-white rounded-lg border border-slate-150 sm:col-span-2">
                        <span className="block text-xs font-semibold text-slate-450 uppercase tracking-wide">
                          Enterprise Identity
                        </span>
                        <span className="font-semibold text-slate-800">
                          {form.companyName} (Tax ID: {form.taxId})
                        </span>
                      </div>
                    )}

                    <div className="p-3 bg-white rounded-lg border border-slate-150 sm:col-span-2">
                      <span className="block text-xs font-semibold text-slate-450 uppercase tracking-wide">
                        Payment Selection
                      </span>
                      <span data-testid="summary-payment" className="font-mono text-indigo-650 font-bold">
                        {form.payment} {promoDiscount > 0 ? `(with 50% discount voucher)` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-center">
                <button
                  type="button"
                  data-testid="wizard-reset-btn"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Start Over
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
