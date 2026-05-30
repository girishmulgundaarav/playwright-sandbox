"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";

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

  // ZONE 3: File Upload Zone State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file input dialog
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      data-testid="forms-page"
      className="flex-1 bg-slate-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
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
        <div className="border-b border-slate-250 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Forms & Controls Practice
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice automating form actions: checkbox consents, error handling for empty states, and dynamic drag-and-drop file uploads.
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

          {/* ZONE 2: Registration Validation Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-600 border border-purple-200 font-bold text-sm">
                  2
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

          {/* ZONE 3: File Upload Zone */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">File Upload Zone</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6 max-w-2xl">
                Practice file drop handling and file input dialog selectors. Drag and drop any file here, or click to choose from your disk, and see the file name immediately.
              </p>

              <div
                data-testid="file-dropzone"
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? "border-indigo-500 bg-indigo-50/50 shadow-indigo-500/5 shadow-inner scale-[1.01]"
                    : "border-slate-250 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50"
                }`}
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  data-testid="file-input"
                  className="hidden"
                />

                {uploadedFileName ? (
                  <div className="flex flex-col items-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 mb-4 animate-bounce">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">File Uploaded Successfully</p>
                    <p
                      data-testid="file-name-display"
                      className="text-xs text-indigo-650 font-mono bg-indigo-50 border border-indigo-150 rounded-md px-3 py-1.5 max-w-sm truncate"
                    >
                      {uploadedFileName}
                    </p>
                    <button
                      onClick={clearFile}
                      data-testid="file-clear-btn"
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 mb-4 group-hover:border-slate-300 transition-colors">
                      <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      Drag & drop a file here, or <span className="text-indigo-650 hover:text-indigo-500">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Accepts any file for automation testing</p>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
