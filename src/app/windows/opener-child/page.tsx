"use client";

import React, { useEffect, useState } from "react";

export default function OpenerChildPage() {
  const [hasOpener, setHasOpener] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if opener is available and has access
      try {
        const openerExists = !!window.opener && typeof window.opener !== "undefined";
        setHasOpener(openerExists);
      } catch (err) {
        // Cross-origin or blocked access throws error, meaning it exists but is restricted
        setHasOpener(false);
      }
    }
  }, []);

  const handleManipulateParent = () => {
    if (typeof window !== "undefined" && window.opener) {
      try {
        window.opener.postMessage({ type: "MANIPULATE_PARENT" }, "*");
      } catch (err) {
        console.error("Failed to post message to opener", err);
      }
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 border border-violet-200 text-violet-600 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Window Opener Inspector</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Verifying the window-opener link relationship.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-5 bg-slate-50 text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Opener Link Status
            </span>
            {hasOpener === null ? (
              <span className="text-sm font-semibold text-slate-500">Checking...</span>
            ) : hasOpener ? (
              <span
                data-testid="opener-status"
                className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 border border-emerald-200"
              >
                ACCESS_GRANTED
              </span>
            ) : (
              <span
                data-testid="opener-status"
                className="inline-flex items-center rounded-md bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-700 border border-rose-200"
              >
                ACCESS_BLOCKED
              </span>
            )}
          </div>

          {hasOpener && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 text-center">
                Since this tab was opened with opener access, you can trigger a state change in the parent window.
              </p>
              <button
                type="button"
                data-testid="manipulate-parent-btn"
                onClick={handleManipulateParent}
                className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 text-sm transition-all focus:outline-none"
              >
                Manipulate Parent Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
