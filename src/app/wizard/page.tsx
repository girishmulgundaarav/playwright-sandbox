"use client";

import Link from "next/link";
import React, { useState } from "react";

type WizardStep = 1 | 2 | 3 | "success";

interface FormState {
  email: string;
  address: string;
  city: string;
  payment: string;
}

const isStepPassed = (current: WizardStep, checkStep: number): boolean => {
  if (current === "success") return true;
  return current > checkStep;
};

export default function FormWizardPage() {
  const [step, setStep] = useState<WizardStep>(1);

  // Form input states
  const [form, setForm] = useState<FormState>({
    email: "",
    address: "",
    city: "",
    payment: "",
  });

  // Validation error states
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Touch states (to validate on blur)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  // Validation helper routines
  const validateField = (name: keyof FormState, value: string): string => {
    if (name === "email") {
      if (!value.trim()) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address.";
    }
    if (name === "address") {
      if (!value.trim()) return "Street address is required.";
    }
    if (name === "city") {
      if (!value.trim()) return "City is required.";
    }
    if (name === "payment") {
      if (!value || value === "select") return "Please select a payment method.";
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    setForm((prev) => ({ ...prev, [key]: value }));

    // If already touched, validate on the fly
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
      setStep(2);
    }
  };

  // Step 2 navigation validation
  const handleStep2Next = (e: React.FormEvent) => {
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
      setStep(3);
    }
  };

  // Step 3 confirm order validation
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentError = validateField("payment", form.payment);
    setTouched((prev) => ({ ...prev, payment: true }));
    setErrors((prev) => ({ ...prev, payment: paymentError }));

    if (!paymentError) {
      setStep("success");
    }
  };

  // Reset the wizard back to empty default
  const handleReset = () => {
    setForm({
      email: "",
      address: "",
      city: "",
      payment: "",
    });
    setErrors({});
    setTouched({});
    setStep(1);
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

        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Multi-Step Form Wizard
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice E2E validation gating and sequence flows on a unified route sandbox.
            Test step validation errors, data preservation, and final payload confirmation summaries.
          </p>
        </div>

        {/* Step Indicator / Progress Bar */}
        <div className="mb-12" data-testid="wizard-progress">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between w-full">
              {/* Step 1 Indicator */}
              <li className="relative flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div className="w-full h-1 bg-slate-200" />
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 z-10 ${
                      step === 1
                        ? "border-indigo-650 bg-white text-indigo-650 shadow-sm"
                        : isStepPassed(step, 1)
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {isStepPassed(step, 1) ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      "1"
                    )}
                  </div>
                  <div
                    className={`w-full h-1 transition-all duration-300 ${
                      isStepPassed(step, 1) ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    step === 1 ? "text-indigo-650" : isStepPassed(step, 1) ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  Account Info
                </span>
              </li>

              {/* Step 2 Indicator */}
              <li className="relative flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={`w-full h-1 transition-all duration-300 ${
                      isStepPassed(step, 1) ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 z-10 ${
                      step === 2
                        ? "border-indigo-650 bg-white text-indigo-650 shadow-sm"
                        : isStepPassed(step, 2)
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {isStepPassed(step, 2) ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      "2"
                    )}
                  </div>
                  <div
                    className={`w-full h-1 transition-all duration-300 ${
                      isStepPassed(step, 2) ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    step === 2 ? "text-indigo-650" : isStepPassed(step, 2) ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  Address
                </span>
              </li>

              {/* Step 3 Indicator */}
              <li className="relative flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={`w-full h-1 transition-all duration-300 ${
                      isStepPassed(step, 2) ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 z-10 ${
                      step === 3
                        ? "border-indigo-650 bg-white text-indigo-650 shadow-sm"
                        : step === "success"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {step === "success" ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      "3"
                    )}
                  </div>
                  <div className="w-full h-1 bg-slate-200" />
                </div>
                <span
                  className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    step === 3 ? "text-indigo-650" : step === "success" ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  Payment
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Wizard Main Container Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm min-h-[350px] flex flex-col justify-between">
          
          {/* STEP 1: Account Info */}
          {step === 1 && (
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
                    Please specify the contact email address to link to this sandbox order.
                  </p>
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

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  data-testid="wizard-next-btn"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Address Info */}
          {step === 2 && (
            <form
              data-testid="wizard-step-2"
              onSubmit={handleStep2Next}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 2: Shipping Address</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Provide the shipping details for the physical delivery process.
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
                      aria-describedby={errors.address ? "address-error" : undefined}
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
                      aria-describedby={errors.city ? "city-error" : undefined}
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
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  data-testid="wizard-next-btn"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <form
              data-testid="wizard-step-3"
              onSubmit={handleConfirmOrder}
              className="space-y-6 flex-1 flex flex-col justify-between"
              noValidate
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 3: Select Payment Method</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Choose your preferred transaction system for checkout approval.
                  </p>
                </div>

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
                    aria-describedby={errors.payment ? "payment-error" : undefined}
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
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  data-testid="wizard-back-btn"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  data-testid="wizard-confirm-btn"
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-500/10 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
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

                    <div className="p-3 bg-white rounded-lg border border-slate-150 sm:col-span-2">
                      <span className="block text-xs font-semibold text-slate-450 uppercase tracking-wide">
                        Payment Selection
                      </span>
                      <span data-testid="summary-payment" className="font-mono text-indigo-650 font-bold">
                        {form.payment}
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
