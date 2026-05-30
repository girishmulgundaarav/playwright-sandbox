"use client";

import Link from "next/link";
import React from "react";

export default function WindowsPage() {
  const [popupBlocked, setPopupBlocked] = React.useState(false);

  const handleOpenPopup = () => {
    if (typeof window !== "undefined") {
      setPopupBlocked(false);
      const newWin = window.open(
        "/windows/popup",
        "_blank",
        "width=500,height=650,resizable=yes,scrollbars=yes"
      );
      if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
        setPopupBlocked(true);
      }
    }
  };

  return (
    <div
      data-testid="windows-page"
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
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Multi-Tab & Window Triggers
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice context switching, targeting new tabs, and automating popups. Test how E2E frameworks wait for and locate newly spawned pages.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1: Target Blank New Tab Link */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Target Blank Link</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                A simple text link styled to open in a separate browser tab using the <code>target=&quot;_blank&quot;</code> attribute.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <a
                  href="/windows/new-tab"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="open-tab-link"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>Open New Tab</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* ZONE 2: window.open() Popup Window Trigger */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Popup Window Button</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Trigger a programmatic popup window using Javascript&apos;s <code>window.open()</code> API, launching a sub-form in a separate window shell.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <button
                  type="button"
                  data-testid="open-window-btn"
                  onClick={handleOpenPopup}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 text-sm shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>Open Popup Window</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {popupBlocked && (
                  <div
                    data-testid="popup-blocked-warning"
                    className="mt-4 text-xs font-semibold text-rose-605 text-center"
                  >
                    Popup blocked! Please allow popups in your browser or use this link:{" "}
                    <a
                      href="/windows/popup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Open Fallback Link
                    </a>
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
