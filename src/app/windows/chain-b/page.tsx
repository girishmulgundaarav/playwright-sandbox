"use client";

import React from "react";

export default function ChainBPage() {
  const handleCompleteChain = () => {
    if (typeof window !== "undefined") {
      // Send message via BroadcastChannel to parent page
      const channel = new BroadcastChannel("chain_sync_channel");
      channel.postMessage({ type: "CHAIN_COMPLETE" });
      channel.close();

      // Close this window
      window.close();
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-6">
          <span className="font-extrabold text-lg">B</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Chain Window: Step B</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          This is the final tab in the chain. Click the button below to resolve the entire sequence and notify the parent dashboard.
        </p>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Current Chain Status
            </span>
            <span
              data-testid="chain-b-status"
              className="text-sm font-bold text-emerald-655"
            >
              CHAIN_STEP_2
            </span>
          </div>

          <button
            type="button"
            data-testid="complete-chain-btn"
            onClick={handleCompleteChain}
            className="w-full inline-flex justify-center items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 text-sm transition-all focus:outline-none"
          >
            Complete Chain
          </button>
        </div>
      </div>
    </div>
  );
}
