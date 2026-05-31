"use client";

import React, { useState } from "react";

export default function NestedIframeChildPage() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 text-center">
          Child iFrame (Level 2)
        </h3>
        
        {submitted ? (
          <div
            data-testid="nested-child-success"
            className="rounded-lg bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-xs text-center"
          >
            <p className="font-semibold mb-1">Frame Success!</p>
            <p className="text-slate-655 font-mono text-[10px] bg-slate-50 rounded px-2 py-1 truncate">
              &ldquo;{inputValue}&rdquo;
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setInputValue("");
              }}
              className="mt-3 text-xs underline font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Reset Input
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="child-input" className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Input Text
              </label>
              <input
                id="child-input"
                type="text"
                data-testid="nested-child-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Deep nested input..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              data-testid="nested-child-btn"
              className="w-full rounded-lg bg-red-500 hover:bg-red-650 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
            >
              Submit in Child
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
