"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

export default function WindowsPage() {
  // Existing states
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Zone 3: Delayed Tab States
  const [delayedCountdown, setDelayedCountdown] = useState<number | null>(null);
  const [delayedLoading, setDelayedLoading] = useState(false);

  // Zone 4: Batch Tab States
  const [batchStatus, setBatchStatus] = useState("idle");
  const [batchBlocked, setBatchBlocked] = useState(false);

  // Zone 5: Cross-Tab Sync States
  const [parentSyncInput, setParentSyncInput] = useState("");
  const [parentSyncMsg, setParentSyncMsg] = useState("");
  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  // Zone 6: Auto-Close states
  const [closingConfirmed, setClosingConfirmed] = useState(false);

  // Zone 7: Opener relationship states
  const [openerType, setOpenerType] = useState<"opener" | "noopener">("opener");
  const [parentManipulated, setParentManipulated] = useState(false);

  // Zone 9: Chain Spawner states
  const [chainCompleted, setChainCompleted] = useState(false);

  // Event handlers & Listeners
  useEffect(() => {
    // 1. Listen for postMessages (Zone 6 & Zone 7)
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "confirmed") {
        setClosingConfirmed(true);
      }
      if (event.data && event.data.type === "MANIPULATE_PARENT") {
        setParentManipulated(true);
      }
    };
    window.addEventListener("message", handleMessage);

    // 2. Set up BroadcastChannel for Cross-Tab Sync (Zone 5)
    const syncChannel = new BroadcastChannel("tab_sync_channel");
    syncChannelRef.current = syncChannel;
    syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === "CHILD_MSG") {
        setParentSyncMsg(event.data.text);
      }
    };

    // 3. Set up BroadcastChannel for Chain Spawner (Zone 9)
    const chainChannel = new BroadcastChannel("chain_sync_channel");
    chainChannel.onmessage = (event) => {
      if (event.data && event.data.type === "CHAIN_COMPLETE") {
        setChainCompleted(true);
      }
    };

    return () => {
      window.removeEventListener("message", handleMessage);
      syncChannel.close();
      chainChannel.close();
    };
  }, []);

  // Zone 1 & 2 Handlers
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

  // Zone 3 Handler (Delayed Tab)
  const handleDelayedTab = () => {
    if (typeof window === "undefined" || delayedLoading) return;
    setDelayedCountdown(3);
    setDelayedLoading(true);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        setDelayedCountdown(null);
        setDelayedLoading(false);
        window.open("/windows/new-tab", "_blank");
      } else {
        setDelayedCountdown(count);
      }
    }, 1000);
  };

  // Zone 4 Handler (Batch Spawner)
  const handleBatchSpawning = () => {
    if (typeof window === "undefined") return;
    setBatchBlocked(false);
    setBatchStatus("spawning");
    
    // Spawn 3 tabs concurrently with different parameters
    const w1 = window.open("/windows/new-tab?id=A", "_blank");
    const w2 = window.open("/windows/new-tab?id=B", "_blank");
    const w3 = window.open("/windows/new-tab?id=C", "_blank");
    
    const isBlocked = (w: Window | null) => !w || w.closed || typeof w.closed === "undefined";
    if (isBlocked(w1) || isBlocked(w2) || isBlocked(w3)) {
      setBatchBlocked(true);
    }
    
    setTimeout(() => {
      setBatchStatus("spawned");
    }, 800);
  };

  // Zone 5 Handler (Cross-Tab Message Broadcast)
  const handleSyncInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setParentSyncInput(val);
    if (syncChannelRef.current) {
      syncChannelRef.current.postMessage({ type: "PARENT_MSG", text: val });
    }
  };

  const handleOpenSyncTab = () => {
    if (typeof window !== "undefined") {
      window.open("/windows/sync-child", "_blank");
    }
  };

  // Zone 6 Handler (Auto-Close)
  const handleOpenClosingTab = () => {
    if (typeof window !== "undefined") {
      setClosingConfirmed(false);
      window.open(
        "/windows/confirm-and-close",
        "_blank",
        "width=500,height=600"
      );
    }
  };

  // Zone 7 Handler (Opener Reference)
  const handleOpenOpenerTest = () => {
    if (typeof window !== "undefined") {
      setParentManipulated(false);
      if (openerType === "opener") {
        // Open with opener reference enabled (rel=opener equivalent using window.open)
        // By default window.open preserves opener link unless rel="noopener" is set or window.open is customized
        window.open("/windows/opener-child", "_blank");
      } else {
        // Open with noopener
        window.open("/windows/opener-child", "_blank", "noopener,noreferrer");
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

          {/* ZONE 3: Delayed Tab Spawner */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-650 border border-amber-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Delayed Tab Trigger</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Initiates a 3-second delay, rendering countdown loading states before triggering <code>window.open()</code>.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <button
                  type="button"
                  data-testid="delayed-tab-btn"
                  onClick={handleDelayedTab}
                  disabled={delayedLoading}
                  className={`inline-flex items-center gap-2 rounded-lg font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none ${
                    delayedLoading
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {delayedLoading ? (
                    <span className="flex items-center gap-2" data-testid="delayed-tab-loader">
                      <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Spawning in {delayedCountdown}s
                    </span>
                  ) : (
                    <span>Launch Delayed Tab</span>
                  )}
                </button>

                {delayedLoading && (
                  <span
                    data-testid="delayed-tab-countdown"
                    className="mt-3 text-xs font-bold text-slate-500"
                  >
                    Countdown: {delayedCountdown}s remaining
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 4: Multi-Tab Batch Spawner */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-650 border border-teal-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Batch Tab Spawner</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Programmatically spawns 3 separate new tabs simultaneously, forcing tests to handle multiple tab contexts.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <button
                  type="button"
                  data-testid="batch-tabs-btn"
                  onClick={handleBatchSpawning}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  <span>Spawn Batch (3 Tabs)</span>
                </button>

                <span
                  data-testid="batch-status-display"
                  className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Status: {batchStatus}
                </span>

                {batchBlocked && (
                  <div
                    data-testid="batch-blocked-warning"
                    className="mt-4 text-xs font-semibold text-rose-605 text-center px-4"
                  >
                    Popups blocked! Please allow popups or open them manually:
                    <div className="mt-2 flex gap-3 justify-center">
                      <a href="/windows/new-tab?id=A" target="_blank" rel="noopener noreferrer" className="underline text-indigo-650 hover:text-indigo-805">Tab A</a>
                      <a href="/windows/new-tab?id=B" target="_blank" rel="noopener noreferrer" className="underline text-indigo-650 hover:text-indigo-805">Tab B</a>
                      <a href="/windows/new-tab?id=C" target="_blank" rel="noopener noreferrer" className="underline text-indigo-650 hover:text-indigo-805">Tab C</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 5: Cross-Tab Message Synchronizer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-650 border border-rose-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Cross-Tab Synchronizer</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Bi-directional messaging across distinct tabs using BroadcastChannel. Real-time updates mirroring keyboard input.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    data-testid="parent-sync-input"
                    value={parentSyncInput}
                    onChange={handleSyncInputChange}
                    placeholder="Type to sync with child tab..."
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    data-testid="open-sync-tab-btn"
                    onClick={handleOpenSyncTab}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs transition-colors"
                  >
                    Open Sync Tab
                  </button>
                </div>

                <div className="text-center rounded-lg bg-white border border-slate-200 p-2.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Received From Child
                  </span>
                  <span
                    data-testid="parent-sync-msg"
                    className="text-xs font-semibold text-slate-700 break-all"
                  >
                    {parentSyncMsg || <span className="text-slate-400 italic">No input from child yet</span>}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 6: Auto-Closing Confirmation Flow */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-650 border border-emerald-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Auto-Closing Confirmation</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Opens a popup sub-route, receives postMessage event callbacks, and verifies when the child window self-closes.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <button
                  type="button"
                  data-testid="open-closing-btn"
                  onClick={handleOpenClosingTab}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  <span>Open Auto-Close Tab</span>
                </button>

                <div className="mt-4">
                  {closingConfirmed ? (
                    <span
                      data-testid="closing-success-msg"
                      className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200"
                    >
                      Confirmed Successfully!
                    </span>
                  ) : (
                    <span
                      data-testid="closing-success-msg"
                      className="text-xs text-slate-500 font-semibold italic"
                    >
                      Awaiting Confirmation...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 7: Window Opener Reference & Toggle */}
          <section className={`rounded-2xl border p-8 shadow-xs flex flex-col justify-between transition-all duration-300 ${
            parentManipulated ? "border-emerald-400 bg-emerald-50/20 shadow-emerald-50" : "border-slate-200 bg-white"
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-violet-650 border border-violet-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Opener Context Access</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Configure `rel=&quot;opener&quot;` vs `rel=&quot;noopener&quot;` and test if the child window is capable of interacting back with the parent page.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <label className="inline-flex items-center text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="openerType"
                      value="opener"
                      checked={openerType === "opener"}
                      onChange={() => setOpenerType("opener")}
                      className="mr-2 h-4 w-4 text-indigo-650 focus:ring-indigo-500 border-slate-300"
                    />
                    rel=&quot;opener&quot;
                  </label>
                  <label className="inline-flex items-center text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="openerType"
                      value="noopener"
                      checked={openerType === "noopener"}
                      onChange={() => setOpenerType("noopener")}
                      className="mr-2 h-4 w-4 text-indigo-650 focus:ring-indigo-500 border-slate-300"
                    />
                    rel=&quot;noopener&quot;
                  </label>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    data-testid="open-opener-test-btn"
                    onClick={handleOpenOpenerTest}
                    className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 text-xs transition-colors"
                  >
                    Open Opener Test Tab
                  </button>

                  <span
                    data-testid="parent-manipulate-status"
                    className={`text-xs font-bold ${parentManipulated ? "text-emerald-700 animate-bounce" : "text-slate-500"}`}
                  >
                    Parent Status: {parentManipulated ? "Manipulated!" : "Normal"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 8: Page Visibility / Focus & Blur Challenge */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-650 border border-teal-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Visibility & Focus Challenge</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Verify focus states, blur updates, and Page Visibility API triggers as context focus rotates.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <a
                  href="/windows/visibility-child"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="open-visibility-test-btn"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  <span>Open Visibility Test</span>
                </a>
              </div>
            </div>
          </section>

          {/* ZONE 9: Chain-Reaction Multi-Window Spawner */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-655 border border-orange-200 font-bold text-sm">
                  9
                </span>
                <h2 className="text-xl font-bold text-slate-900">Nested Window Chains</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Open Tab A, which spawns Tab B. Tests switching context through deep nested tree structures.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <button
                  type="button"
                  data-testid="open-chain-btn"
                  onClick={() => {
                    setChainCompleted(false);
                    window.open("/windows/chain-a", "_blank", "width=500,height=600");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  <span>Open Chain A</span>
                </button>

                <div className="mt-4 text-center">
                  {chainCompleted ? (
                    <span
                      data-testid="chain-success-msg"
                      className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200"
                    >
                      Chain Completed Successfully!
                    </span>
                  ) : (
                    <span
                      data-testid="chain-success-msg"
                      className="text-xs text-slate-500 font-semibold italic"
                    >
                      Chain Not Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 10: Alert/Dialog Interceptor on Load */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-650 border border-rose-200 font-bold text-sm">
                  10
                </span>
                <h2 className="text-xl font-bold text-slate-900">Load-Time Dialog</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Opens a window that executes <code>window.confirm()</code> during load, testing prompt-intercept mechanics.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[140px]">
                <a
                  href="/windows/dialog-load"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="open-dialog-test-btn"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  <span>Open Dialog Tab</span>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
