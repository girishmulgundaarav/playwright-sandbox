"use client";

import React, { useEffect, useState } from "react";

export default function DialogLoadPage() {
  const [response, setResponse] = useState<string>("WAITING");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Trigger a native confirmation dialog immediately on load.
      // E2E test scripts must listen for and intercept this before the page is fully ready.
      try {
        const result = window.confirm("Do you want to enable experimental features?");
        if (result) {
          setResponse("CONFIRMED");
        } else {
          setResponse("DISMISSED");
        }
      } catch (err) {
        setResponse("ERROR");
      }
    }
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-600 mb-6">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">On-Load Dialog Intercept</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          This page triggered a native <code>window.confirm</code> dialog immediately when it loaded. 
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-5 bg-slate-50">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Dialog Resolution State
            </span>
            <div className="flex justify-center">
              <span
                data-testid="dialog-load-status"
                className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-bold border ${
                  response === "CONFIRMED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : response === "DISMISSED"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-250 animate-pulse"
                }`}
              >
                {response}
              </span>
            </div>
          </div>

          <p
            data-testid="dialog-response-msg"
            className="text-xs font-semibold text-slate-655"
          >
            {response === "CONFIRMED" && "User accepted the dialog."}
            {response === "DISMISSED" && "User cancelled the dialog."}
            {response === "WAITING" && "Waiting for dialog resolution..."}
          </p>
        </div>
      </div>
    </div>
  );
}
