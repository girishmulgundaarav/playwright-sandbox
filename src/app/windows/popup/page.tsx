"use client";

import React, { useState } from "react";

export default function PopupPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.close();
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 border border-purple-250 text-purple-650 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5-6h7.5A2.25 2.25 0 0118 6.75v10.5A2.25 2.25 0 0115.75 19.5h-7.5A2.25 2.25 0 016 17.25V6.75A2.25 2.25 0 018.25 4.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Popup Form</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Submit feedback below or close this window context.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div
              data-testid="popup-success-msg"
              className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800"
            >
              Form Submitted Successfully
            </div>
            
            <button
              type="button"
              data-testid="popup-close-btn"
              onClick={handleClose}
              className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                data-testid="popup-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
              <textarea
                data-testid="popup-message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter feedback details..."
                rows={4}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                data-testid="popup-close-btn"
                onClick={handleClose}
                className="w-full inline-flex justify-center items-center rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 text-sm transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="popup-submit-btn"
                className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-all focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
