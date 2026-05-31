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

  // ZONE 3: Variable Delay Element State
  const [randomDelayState, setRandomDelayState] = useState<"idle" | "loading" | "loaded">("idle");
  const [currentRandomDelay, setCurrentRandomDelay] = useState(0);

  // ZONE 4: Step-by-Step Status Polling State
  const [pollingJobState, setPollingJobState] = useState<"idle" | "queued" | "processing" | "validating" | "completed">("idle");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ZONE 5: Search Auto-suggest Race Conditions State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isRaceConditionBuggy, setIsRaceConditionBuggy] = useState(false);
  const searchReqIdRef = useRef(0);

  // ZONE 6: Transient Toast Notification State
  const [showToast, setShowToast] = useState(false);

  // ZONE 7: Retry-on-Failure Flow State
  const [retryCount, setRetryCount] = useState(0);
  const [retryStatus, setRetryStatus] = useState<"idle" | "error" | "success">("idle");
  const [isRetryLoading, setIsRetryLoading] = useState(false);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // ZONE 1 Handler
  const handleFetchData = () => {
    setApiState("loading");
    setTimeout(() => {
      setApiState("loaded");
    }, 3500); // exactly 3.5 seconds
  };

  const handleResetApi = () => {
    setApiState("idle");
  };

  // ZONE 2 Handler
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
    }, 50); // 5 seconds total
  };

  const handleResetProgress = () => {
    setProgress(0);
    setProgressActive(false);
    setDownloadComplete(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // ZONE 3 Handler
  const handleTriggerRandomDelay = () => {
    setRandomDelayState("loading");
    const delay = Math.floor(Math.random() * 3500) + 1500; // between 1.5s and 5.0s
    setCurrentRandomDelay(delay);
    setTimeout(() => {
      setRandomDelayState("loaded");
    }, delay);
  };

  const handleResetRandomDelay = () => {
    setRandomDelayState("idle");
    setCurrentRandomDelay(0);
  };

  // ZONE 4 Handler
  const handleStartPolling = () => {
    setPollingJobState("queued");
    let step = 0;
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      step++;
      if (step === 1) {
        setPollingJobState("processing");
      } else if (step === 2) {
        setPollingJobState("validating");
      } else if (step === 3) {
        setPollingJobState("completed");
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
    }, 1200);
  };

  const handleResetPolling = () => {
    setPollingJobState("idle");
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
  };

  // ZONE 5 Handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearchLoading(true);
    const reqId = ++searchReqIdRef.current;

    // Simulate delay. Short searches are slow (2.5s), long searches are fast (0.5s).
    // This naturally triggers race conditions if the user types quickly!
    const delay = val.length <= 3 ? 2000 : 400;

    setTimeout(() => {
      // Check if we want the buggy version or the clean race-condition-prevented version
      if (isRaceConditionBuggy || reqId === searchReqIdRef.current) {
        const database = [
          "playwright testing framework",
          "playwright selector locator",
          "playwright auto-wait delay",
          "playwright async assertions",
          "javascript debounce throttle",
          "react abort controller signal",
          "test automation practices",
          "network intercept mock response",
        ];
        const filtered = database.filter(item => item.toLowerCase().includes(val.toLowerCase()));
        setSuggestions(filtered);
        setIsSearchLoading(false);
      }
    }, delay);
  };

  // ZONE 6 Handler
  const handleTriggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000); // dismiss after 2s
  };

  // ZONE 7 Handler
  const handleExecuteRetryRequest = () => {
    setIsRetryLoading(true);
    setRetryStatus("idle");
    setTimeout(() => {
      setIsRetryLoading(false);
      setRetryCount((prev) => {
        const nextCount = prev + 1;
        if (nextCount < 3) {
          setRetryStatus("error");
        } else {
          setRetryStatus("success");
        }
        return nextCount;
      });
    }, 900);
  };

  const handleResetRetry = () => {
    setRetryCount(0);
    setRetryStatus("idle");
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
            Practice handling time delays, race conditions, loading states, background process status polling, retries, and transient self-dismissing elements.
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

                {downloadComplete && (
                  <div
                    data-testid="download-complete-badge"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-250 px-3 py-2 text-xs font-semibold text-emerald-800 animate-bounce"
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

          {/* ZONE 3: Variable Delay Element */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-250 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Variable Delay Card</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Clicking triggers a success card after a random duration (between 1.5s and 5.0s). Test locators must dynamic-wait without sleeping.
              </p>

              <div className="min-h-[160px] flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
                {randomDelayState === "idle" && (
                  <p className="text-sm text-slate-400 font-medium">Ready to trigger.</p>
                )}

                {randomDelayState === "loading" && (
                  <div className="flex flex-col items-center gap-3">
                    <svg data-testid="random-spinner" className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
                      Pending random resolving...
                    </p>
                  </div>
                )}

                {randomDelayState === "loaded" && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div
                      data-testid="random-success-card"
                      className="w-full text-center rounded-lg border border-emerald-250 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800 font-medium"
                    >
                      🟢 Action Resolved after {(currentRandomDelay / 1000).toFixed(2)}s!
                    </div>
                    <button
                      onClick={handleResetRandomDelay}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Reset State
                    </button>
                  </div>
                )}
              </div>
            </div>

            {randomDelayState === "idle" && (
              <button
                onClick={handleTriggerRandomDelay}
                data-testid="random-delay-btn"
                className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 transition-all duration-200"
              >
                Trigger Random Delay
              </button>
            )}
          </section>

          {/* ZONE 4: Step-by-Step Status Polling */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 border border-cyan-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Status Polling Simulator</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Launches a job that loops through status updates: Queued $\rightarrow$ Processing $\rightarrow$ Validating $\rightarrow$ Completed. Polling cycles occur every 1.2s.
              </p>

              <div className="min-h-[160px] flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
                {pollingJobState === "idle" ? (
                  <p className="text-sm text-slate-400 font-medium">No job currently running.</p>
                ) : (
                  <div className="w-full flex flex-col items-center gap-4">
                    {/* Status Badge */}
                    <div
                      data-testid="polling-status-badge"
                      className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider ${
                        pollingJobState === "completed"
                          ? "bg-emerald-50 border-emerald-250 text-emerald-800 animate-pulse"
                          : pollingJobState === "validating"
                          ? "bg-amber-50 border-amber-250 text-amber-800"
                          : "bg-indigo-50 border-indigo-200 text-indigo-700"
                      }`}
                    >
                      Current Status: {pollingJobState}
                    </div>

                    {pollingJobState !== "completed" && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-450 animate-pulse font-semibold uppercase tracking-wider">
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Polling worker update...
                      </div>
                    )}

                    {pollingJobState === "completed" && (
                      <button
                        onClick={handleResetPolling}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        Reset State
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {pollingJobState === "idle" && (
              <button
                onClick={handleStartPolling}
                data-testid="start-polling-btn"
                className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 transition-all duration-200"
              >
                Launch Background Job
              </button>
            )}
          </section>

          {/* ZONE 5: Search Auto-suggest Race Conditions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-605 border border-teal-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Race Condition Autocomplete</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Type queries. Short entries trigger slow responses (2.0s); long entries are fast (0.4s). Shaking connections resolve responses out-of-order.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      data-testid="race-search-input"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="e.g. playwright"
                      className="w-full pl-4 pr-10 py-2.5 text-sm rounded-lg border border-slate-300 bg-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    {isSearchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggestions dropdown preview */}
                {suggestions.length > 0 && (
                  <ul
                    data-testid="suggestions-list"
                    className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-100 overflow-hidden text-xs max-h-40 overflow-y-auto"
                  >
                    {suggestions.map((sug, idx) => (
                      <li
                        key={idx}
                        data-testid={`suggestion-item-${idx}`}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer font-semibold text-slate-700"
                        onClick={() => {
                          setSearchQuery(sug);
                          setSuggestions([]);
                        }}
                      >
                        {sug}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label htmlFor="race-toggle" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide cursor-pointer">
                    Enable Race Condition Bug
                  </label>
                  <button
                    type="button"
                    id="race-toggle"
                    data-testid="race-bug-switch"
                    onClick={() => setIsRaceConditionBuggy(!isRaceConditionBuggy)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isRaceConditionBuggy ? "bg-red-500" : "bg-slate-250"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isRaceConditionBuggy ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 6: Transient Toast Notification */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-655 border border-pink-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Transient Alert Banner</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Triggers an overlay alert banner inside the section that stays visible for exactly 2.0 seconds and then unmounts from the DOM.
              </p>

              <div className="min-h-[130px] relative border border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 flex items-center justify-center mb-6">
                {showToast ? (
                  <div
                    data-testid="toast-banner"
                    className="absolute bg-indigo-650 text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg text-xs font-semibold animate-pulse border border-indigo-700"
                  >
                    <svg className="h-4 w-4 text-indigo-200" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    Alert will dismiss in 2.0s!
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No notification visible.</span>
                )}
              </div>
            </div>

            <button
              onClick={handleTriggerToast}
              disabled={showToast}
              data-testid="show-toast-btn"
              className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              Show Alert Banner
            </button>
          </section>

          {/* ZONE 7: Retry-on-Failure Flow */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-250 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Retry-on-Failure Request Flow</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice building test retry loops. The server simulates network failure. Attempts 1 and 2 yield a red &ldquo;503 Server Error&rdquo;. Click the submit action a 3rd time to retrieve the successful payload.
              </p>

              <div className="grid gap-6 sm:grid-cols-2 items-center">
                <div className="min-h-[140px] flex flex-col justify-center rounded-xl bg-slate-50 border border-slate-200 p-6">
                  {/* Status Indicator */}
                  {retryStatus === "idle" && (
                    <p className="text-xs text-slate-450 italic text-center">Awaiting request dispatch...</p>
                  )}

                  {isRetryLoading && (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-indigo-650" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Connecting to token server...</span>
                    </div>
                  )}

                  {!isRetryLoading && retryStatus === "error" && (
                    <div
                      data-testid="retry-error-alert"
                      className="rounded-lg border border-red-250 bg-red-50 p-4 text-red-800 text-xs"
                    >
                      <p className="font-bold">❌ Connection Failed (Attempt {retryCount})</p>
                      <p className="text-[10px] text-red-700 mt-1 font-medium">503 Service Temporarily Unavailable. Please retry execution.</p>
                    </div>
                  )}

                  {!isRetryLoading && retryStatus === "success" && (
                    <div
                      data-testid="retry-success-alert"
                      className="rounded-lg border border-emerald-250 bg-emerald-50 p-4 text-emerald-800 text-xs animate-bounce"
                    >
                      <p className="font-bold">✨ Access Granted (Attempt {retryCount})</p>
                      <p className="text-[10px] text-emerald-700 mt-1 font-mono font-bold">Mock Token: authtoken_d3f4a9b2c8e102</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <span>Attempts:</span>
                    <span className="bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-650 font-mono font-bold">
                      {retryCount}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      data-testid="retry-request-btn"
                      disabled={isRetryLoading || retryStatus === "success"}
                      onClick={handleExecuteRetryRequest}
                      className="flex-1 rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {retryStatus === "error" ? "Retry Request" : "Execute Request"}
                    </button>
                    {retryCount > 0 && !isRetryLoading && (
                      <button
                        type="button"
                        onClick={handleResetRetry}
                        className="rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-sm font-semibold text-slate-655 hover:text-slate-900 transition-all duration-200"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
