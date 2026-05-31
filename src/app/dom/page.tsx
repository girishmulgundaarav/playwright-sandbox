"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function DomPage() {
  // ZONE 1: Dialog Triggers State
  const [alertStatus, setAlertStatus] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState<string | null>(null);

  // ZONE 3: Shadow DOM Ref
  const shadowHostRef = useRef<HTMLDivElement>(null);

  // ZONE 4: Sibling Locating State
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // ZONE 5: Stale Element State
  const [staleKey, setStaleKey] = useState(0);
  const [staleHits, setStaleHits] = useState(0);
  const [isStalePending, setIsStalePending] = useState(false);

  // ZONE 6: Dynamic ID State
  const [dynamicId, setDynamicId] = useState("");
  const [dynamicClicks, setDynamicClicks] = useState(0);

  useEffect(() => {
    setDynamicId(`btn-${Math.random().toString(36).substring(2, 7)}`);
  }, [dynamicClicks]);

  useEffect(() => {
    if (shadowHostRef.current && !shadowHostRef.current.shadowRoot) {
      const shadowRoot = shadowHostRef.current.attachShadow({ mode: "open" });

      const style = document.createElement("style");
      style.textContent = `
        .shadow-wrapper {
          padding: 1.5rem;
          border-radius: 0.75rem;
          background: #ffffff;
          border: 1px dashed rgba(236, 72, 153, 0.6);
          color: rgb(15, 23, 42);
          font-family: ui-sans-serif, system-ui, sans-serif;
          text-align: center;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }
        .secret-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.75rem;
          padding: 0.125rem 0.625rem;
          border-radius: 9999px;
          background-color: rgba(244, 63, 94, 0.05);
          border: 1px solid rgba(244, 63, 94, 0.15);
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(225, 29, 72);
        }
        .secret-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: rgb(15, 23, 42);
          letter-spacing: -0.025em;
          margin: 0;
        }
        .desc-text {
          font-size: 0.75rem;
          color: rgb(71, 85, 105);
          margin-top: 0.5rem;
        }
      `;

      const wrapper = document.createElement("div");
      wrapper.className = "shadow-wrapper";

      const badge = document.createElement("div");
      badge.className = "secret-badge";
      badge.innerHTML = `<span style="height: 6px; width: 6px; background-color: rgb(244, 63, 94); border-radius: 50%;"></span> Shadow DOM Encapsulated`;

      const secret = document.createElement("p");
      secret.setAttribute("data-testid", "shadow-secret");
      secret.className = "secret-text";
      secret.textContent = "Playwright Pierced The Shadow DOM!";

      const desc = document.createElement("div");
      desc.className = "desc-text";
      desc.textContent = "Standard CSS selectors outside cannot access this node natively, but Playwright's engine pierces it automatically.";

      wrapper.appendChild(badge);
      wrapper.appendChild(secret);
      wrapper.appendChild(desc);

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(wrapper);
    }
  }, []);

  // Dialog Handlers
  const handleAlert = () => {
    setAlertStatus("Alert opened");
    window.alert("This is a native browser alert modal dialog!");
    setAlertStatus("Alert closed");
  };

  const handleConfirm = () => {
    setConfirmResult(null);
    const userChoice = window.confirm("Do you agree to continue the testing process?");
    if (userChoice) {
      setConfirmResult("OK");
    } else {
      setConfirmResult("Cancel");
    }
  };

  const handlePrompt = () => {
    setPromptResult(null);
    const userVal = window.prompt("Please enter your secret QA key:");
    if (userVal === null) {
      setPromptResult("Cancelled");
    } else {
      setPromptResult(userVal || "Empty Value");
    }
  };

  const handleTriggerStale = () => {
    setIsStalePending(true);
    setTimeout(() => {
      setStaleKey((prev) => prev + 1);
      setStaleHits((prev) => prev + 1);
      setIsStalePending(false);
    }, 300);
  };

  return (
    <div
      data-testid="dom-page"
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
            DOM & Locating Practice
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice handling native dialog alerts, locating elements in nested frames, relative sibling searches, piercing open Shadow DOM trees, and bypassing staleness or dynamic ID structures.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* ZONE 1: Dialog Triggers */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-655 border border-purple-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Browser Modals & Dialogs</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Interact with native window dialogs. Set up Playwright&apos;s <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-650 font-mono text-xs">page.on(&apos;dialog&apos;)</code> event handler before triggering the buttons below.
              </p>

              <div className="space-y-6">
                {/* Alert Trigger */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alert Modal</span>
                    {alertStatus && (
                      <span className="text-xs text-indigo-600 font-semibold font-mono">{alertStatus}</span>
                    )}
                  </div>
                  <button
                    onClick={handleAlert}
                    data-testid="alert-btn"
                    className="w-full rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200/80 transition-all duration-200"
                  >
                    Trigger Alert
                  </button>
                </div>

                {/* Confirm Trigger */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm Modal</span>
                    {confirmResult && (
                      <span
                        data-testid="confirm-result"
                        className="text-xs text-emerald-800 font-bold font-mono bg-emerald-50 px-2 py-0.5 border border-emerald-250 rounded"
                      >
                        Result: {confirmResult}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleConfirm}
                    data-testid="confirm-btn"
                    className="w-full rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200/80 transition-all duration-200"
                  >
                    Trigger Confirm
                  </button>
                </div>

                {/* Prompt Trigger */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prompt Modal</span>
                    {promptResult !== null && (
                      <span
                        data-testid="prompt-result"
                        className="text-xs text-amber-800 font-bold font-mono bg-amber-50 px-2 py-0.5 border border-amber-200 rounded max-w-[180px] truncate"
                      >
                        Val: {promptResult}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handlePrompt}
                    data-testid="prompt-btn"
                    className="w-full rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200/80 transition-all duration-200"
                  >
                    Trigger Prompt
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 2: Shadow DOM */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-655 border border-pink-200 font-bold text-sm">
                    2
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Shadow DOM Boundary</h2>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  The text block below is encapsulated in an open Shadow DOM root. Practice using piercing selector paths or standard queries.
                </p>
              </div>

              {/* Shadow Host Container */}
              <div
                ref={shadowHostRef}
                data-testid="shadow-host"
                className="my-auto py-4"
              >
                {/* Mounted shadow root content goes here */}
              </div>
            </div>
          </section>

          {/* ZONE 3: Sibling Plan Selector (Relative Locating) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Relative Sibling Locators</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Locate specific cards based on title (e.g. &ldquo;Professional Plan&rdquo;) and click the relative &ldquo;Select Plan&rdquo; button inside.
              </p>

              <div className="space-y-4">
                {/* Subscription plans list */}
                {["Starter Plan", "Professional Plan", "Enterprise Plan"].map((plan) => (
                  <div
                    key={plan}
                    data-testid={`plan-card-${plan.toLowerCase().replace(" ", "-")}`}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedPlan === plan
                        ? "bg-emerald-50/50 border-emerald-250 shadow-emerald-500/5"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{plan}</h4>
                      <p className="text-[10px] text-slate-450 mt-1">
                        {plan === "Starter Plan" ? "$10/mo" : plan === "Professional Plan" ? "$29/mo" : "$99/mo"} — Active
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                        selectedPlan === plan
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-indigo-50 border border-indigo-150 text-indigo-600 hover:bg-indigo-100"
                      }`}
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ZONE 4: Stale Element Simulator */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-600 border border-orange-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Stale Element Simulator</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Clicking completely unmounts the button node and appends an identical-looking node after 300ms. Caching elements causes stale failures.
              </p>

              <div className="min-h-[140px] flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6 mb-6">
                <div className="w-full text-center mb-4">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Valid Hits recorded</span>
                  <p data-testid="stale-click-counter" className="text-2xl font-extrabold text-slate-850 mt-1">{staleHits}</p>
                </div>

                <div className="w-full">
                  {isStalePending ? (
                    <div className="flex justify-center items-center gap-2 text-xs text-slate-450 animate-pulse py-2.5 font-semibold">
                      <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Re-creating element reference...
                    </div>
                  ) : (
                    <button
                      key={staleKey}
                      onClick={handleTriggerStale}
                      data-testid="stale-trigger-btn"
                      className="w-full rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs font-semibold text-indigo-650 hover:bg-indigo-100 transition-all"
                    >
                      Trigger Node Re-creation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 5: Dynamic ID & Class Attributes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 border border-cyan-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dynamic ID & Attributes</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                The button&apos;s ID randomizes (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-650 font-mono text-xs">{dynamicId || "btn-xxxx"}</code>) on every click. Locate using stable text patterns.
              </p>

              <div className="min-h-[145px] flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="w-full mb-4 text-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Validation status</span>
                  {dynamicClicks > 0 ? (
                    <p data-testid="identity-validation-badge" className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-250 rounded-lg px-3 py-1 mt-1.5 inline-block">
                      ✓ Validation Success ({dynamicClicks} clicks)
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1.5">Unverified</p>
                  )}
                </div>

                <button
                  id={dynamicId}
                  onClick={() => setDynamicClicks((prev) => prev + 1)}
                  data-testid="dynamic-id-btn"
                  className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 active:bg-indigo-750 transition-all"
                >
                  Validate Identity
                </button>
              </div>
            </div>
          </section>

          {/* ZONE 6: Deeply Nested iframes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-605 border border-teal-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Deeply Nested iFrames</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice chaining frames. The input resides in a Level 2 iframe inside a Level 1 iframe. Switch contexts recursively to click.
              </p>

              <div className="w-full rounded-xl border border-slate-200 overflow-hidden bg-white">
                <iframe
                  src="/dom/nested-iframe-parent"
                  data-testid="nested-parent-iframe"
                  className="w-full h-[230px] border-none"
                />
              </div>
            </div>
          </section>

          {/* ZONE 7: Embedded iframe (Single Frame) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Embedded iFrame (Single Frame)</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice standard single-frame navigation. Locate and type inside the iframe form below.
              </p>

              <div className="w-full rounded-xl border border-slate-200 overflow-hidden bg-white">
                <iframe
                  src="/dom/iframe-content"
                  data-testid="embedded-iframe"
                  className="w-full h-[260px] border-none"
                />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
