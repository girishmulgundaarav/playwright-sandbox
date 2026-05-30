"use client";

import React, { useState } from "react";

export default function IframeContentPage() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSubmitted(true);
      setError(false);
    } else {
      setError(true);
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Inside iFrame Boundary
        </h3>
        
        {submitted ? (
          <div
            data-testid="iframe-success-msg"
            className="rounded-lg bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-xs text-center"
          >
            <p className="font-semibold mb-1">Message Submitted!</p>
            <p className="text-slate-600 font-mono bg-slate-50 rounded px-2 py-1 truncate mt-1">
              &ldquo;{inputValue}&rdquo;
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setInputValue("");
              }}
              className="mt-3 text-xs underline font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Secret Message
              </label>
              <input
                type="text"
                data-testid="iframe-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type here..."
                className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-colors ${
                  error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
              />
              {error && (
                <span className="block mt-1 text-xs font-medium text-red-500">
                  Please type a message before submitting.
                </span>
              )}
            </div>

            <button
              type="submit"
              data-testid="iframe-submit-btn"
              className="w-full rounded-lg bg-indigo-650 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 transition-all duration-200"
            >
              Submit to Parent
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
