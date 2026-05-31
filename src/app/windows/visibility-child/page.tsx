"use client";

import React, { useEffect, useState, useRef } from "react";

export default function VisibilityChildPage() {
  const [visibleState, setVisibleState] = useState("VISIBLE");
  const [blurCount, setBlurCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const originalTitleRef = useRef("Visibility Challenge");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track original document title
    originalTitleRef.current = document.title || "Visibility Challenge";

    // 1. Visibility Change Listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setVisibleState("HIDDEN");
        document.title = "⚠️ Don't Leave Me!";
        setBlurCount((prev) => prev + 1);
      } else {
        setVisibleState("VISIBLE");
        document.title = originalTitleRef.current;
      }
    };

    // 2. Blur / Focus Listeners
    const handleWindowBlur = () => {
      // Sometimes blur happens without visibilitychange (e.g., clicking browser address bar or devtools)
      setBlurCount((prev) => prev + 1);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    // 3. Ticking Timer (only increments if page is visible)
    const interval = setInterval(() => {
      if (!document.hidden && document.visibilityState === "visible") {
        setTimerSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      clearInterval(interval);
      // Restore title
      if (typeof document !== "undefined") {
        document.title = originalTitleRef.current;
      }
    };
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-600 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Page Visibility Challenge</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Test how automation scripts switch away and back to simulate user multitasking.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 mb-6">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 text-center">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Visibility
            </span>
            <span
              data-testid="visibility-status"
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${
                visibleState === "VISIBLE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {visibleState}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 text-center">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Timer (Visible Only)
            </span>
            <span
              data-testid="active-timer"
              className="text-lg font-mono font-bold text-slate-800"
            >
              {timerSeconds}s
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-5 bg-slate-50 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Focus Loss / Tab Hide Count
          </span>
          <span
            data-testid="blur-counter"
            className="text-4xl font-extrabold text-indigo-650"
          >
            {blurCount}
          </span>
          <p className="text-[11px] text-slate-400 mt-3 leading-normal">
            Increments when the tab becomes hidden, you switch tabs, or window loses focus.
          </p>
        </div>
      </div>
    </div>
  );
}
