"use client";

import React from "react";

export default function ChainAPage() {
  const handleOpenChainB = () => {
    if (typeof window !== "undefined") {
      window.open(
        "/windows/chain-b",
        "_blank",
        "width=500,height=600,resizable=yes"
      );
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600 mb-6">
          <span className="font-extrabold text-lg">A</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Chain Window: Step A</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          You are currently in Tab A. To complete the flow, you must open the next link in the chain.
        </p>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Current Chain Status
            </span>
            <span
              data-testid="chain-a-status"
              className="text-sm font-bold text-orange-655"
            >
              CHAIN_STEP_1
            </span>
          </div>

          <button
            type="button"
            data-testid="open-chain-b-btn"
            onClick={handleOpenChainB}
            className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 text-sm transition-all focus:outline-none"
          >
            Open Tab B (Next)
          </button>
        </div>
      </div>
    </div>
  );
}
