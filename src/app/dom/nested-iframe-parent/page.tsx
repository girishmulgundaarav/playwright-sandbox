"use client";

import React from "react";

export default function NestedIframeParentPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3 text-center">
          Parent iFrame (Level 1)
        </h3>
        
        {/* Child iFrame Wrapper */}
        <div className="rounded-lg border border-slate-250 overflow-hidden bg-slate-50">
          <iframe
            src="/dom/nested-iframe-child"
            data-testid="nested-child-iframe"
            className="w-full h-[180px] border-none"
          />
        </div>
      </div>
    </div>
  );
}
