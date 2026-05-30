"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function AsyncPage() {
  // ZONE 1: Delayed API Simulation State
  const [apiState, setApiState] = useState<"idle" | "loading" | "loaded">("idle");

  // ZONE 2: Real-time Progress Bar State
  const [progress, setProgress] = useState(0);
  const [progressActive, setProgressActive] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Handlers
  const handleFetchData = () => {
    setApiState("loading");
    setTimeout(() => {
      setApiState("loaded");
    }, 3500); // exactly 3.5 seconds
  };

  const handleStartProgress = () => {
    setProgress(0);
    setProgressActive(true);
    setDownloadComplete(false);
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          setProgressActive(false);
          setDownloadComplete(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 50ms * 100 steps = 5000ms (5 seconds)
  };

  const handleResetApi = () => {
    setApiState("idle");
  };

  const handleResetProgress = () => {
    setProgress(0);
    setProgressActive(false);
    setDownloadComplete(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  return (
    <div
      data-testid="async-page"
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
            Async Challenges
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice handling time delays, race conditions, loading states, and dynamic elements that change based on background processes.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* ZONE 1: Delayed API Simulation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Delayed API Simulation</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Click the button below to fetch mock data. It will display a loading spinner for exactly 3.5 seconds before rendering the results.
              </p>

              <div className="min-h-[160px] flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
                {apiState === "idle" && (
                  <p className="text-sm text-slate-400 font-medium">No data requested yet.</p>
                )}

                {apiState === "loading" && (
                  <div className="flex flex-col items-center gap-3">
                    {/* SVG Spinner */}
                    <svg
                      data-testid="loading-spinner"
                      className="animate-spin h-8 w-8 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
                      Calling API (3.5s delay)...
                    </p>
                  </div>
                )}

                {apiState === "loaded" && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <input
                      type="text"
                      readOnly
                      data-testid="loaded-text-box"
                      value="Data Loaded Successfully"
                      className="w-full text-center rounded-lg border border-emerald-250 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 outline-none"
                    />
                    <button
                      onClick={handleResetApi}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Reset State
                    </button>
                  </div>
                )}
              </div>
            </div>

            {apiState === "idle" && (
              <button
                onClick={handleFetchData}
                data-testid="fetch-data-btn"
                className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 transition-all duration-200"
              >
                Fetch Data
              </button>
            )}
          </section>

          {/* ZONE 2: Real-time Progress Bar */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Real-time Progress Bar</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Trigger a download bar that counts from 0% to 100% over exactly 5.0 seconds. A hidden success badge appears only when finished.
              </p>

              <div className="min-h-[160px] flex flex-col justify-center rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
                {/* Progress Tracks */}
                <div className="w-full mb-4">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-slate-500">Progress Status</span>
                    <span data-testid="progress-text" className="font-mono font-bold text-slate-700">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                    <div
                      data-testid="progress-bar"
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-75"
                    />
                  </div>
                </div>

                {/* Success Badge */}
                {downloadComplete && (
                  <div
                    data-testid="download-complete-badge"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-250 px-3 py-2 text-xs font-semibold text-emerald-800"
                  >
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Download Complete
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartProgress}
                disabled={progressActive}
                data-testid="start-progress-btn"
                className="flex-1 rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {progressActive ? "Downloading..." : "Start Download"}
              </button>
              {(progress > 0 || downloadComplete) && !progressActive && (
                <button
                  onClick={handleResetProgress}
                  className="rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-450 transition-all duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
