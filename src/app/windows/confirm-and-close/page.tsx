"use client";

import React, { useState } from "react";

export default function ConfirmAndClosePage() {
  const [status, setStatus] = useState("idle");

  const handleConfirmAndClose = () => {
    if (typeof window !== "undefined") {
      setStatus("processing");
      // Check if opener exists
      if (window.opener) {
        window.opener.postMessage("confirmed", "*");
        setStatus("sent");
      } else {
        setStatus("no_opener");
      }
      // Delay closing slightly so user/test can observe transition
      setTimeout(() => {
        window.close();
      }, 500);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600 mb-6">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Confirmation Required</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Please confirm your action. Clicking the button below will notify the parent page and close this tab automatically.
        </p>

        <div className="space-y-4">
          <button
            type="button"
            data-testid="confirm-close-btn"
            onClick={handleConfirmAndClose}
            className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {status === "processing" && "Processing..."}
            {status === "sent" && "Confirmed! Closing..."}
            {status === "no_opener" && "No opener window found!"}
            {status === "idle" && "Confirm & Close Window"}
          </button>
        </div>
      </div>
    </div>
  );
}
