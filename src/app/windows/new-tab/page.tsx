"use client";

import React, { useEffect, useState } from "react";

export default function NewTabPage() {
  const [tabId, setTabId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        setTabId(id);
      }
    }
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-600 mb-6">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </div>
        <h1
          data-testid="new-tab-header"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          New Tab Content{tabId ? ` - ID: ${tabId}` : ""}
        </h1>
        {tabId && (
          <div className="mt-3">
            <span
              data-testid="new-tab-id"
              className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200"
            >
              Tab {tabId}
            </span>
          </div>
        )}
        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
          This content was successfully loaded inside a completely separate browser tab. E2E automation tests can switch context to this page handler to inspect this element.
        </p>
      </div>
    </div>
  );
}
