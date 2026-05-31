"use client";

import React, { useEffect, useState, useRef } from "react";

export default function SyncChildPage() {
  const [receivedMsg, setReceivedMsg] = useState("");
  const [typedMsg, setTypedMsg] = useState("");
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Set up BroadcastChannel
    const channel = new BroadcastChannel("tab_sync_channel");
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data && typeof event.data === "object") {
        if (event.data.type === "PARENT_MSG") {
          setReceivedMsg(event.data.text);
        }
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedMsg(val);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: "CHILD_MSG", text: val });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
      <div className="mx-auto max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-600 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L17.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sync Child Tab</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Type below to send message to parent, or see what parent typed.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Received From Parent
            </label>
            <div
              data-testid="child-sync-msg"
              className="min-h-[44px] rounded-lg border border-dashed border-slate-350 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 break-all"
            >
              {receivedMsg || <span className="text-slate-400 italic">Waiting for parent typing...</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Send to Parent
            </label>
            <input
              type="text"
              data-testid="child-sync-input"
              value={typedMsg}
              onChange={handleInputChange}
              placeholder="Type message here..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
