"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function BasicControlsPage() {
  // Zone 1: Radio Button Group State
  const [membership, setMembership] = useState("Bronze");

  // Zone 2: Checkbox Grid State
  const initialHobbies = {
    reading: false,
    coding: false,
    gaming: false,
    sports: false,
    music: false,
    traveling: false,
  };
  const [hobbies, setHobbies] = useState(initialHobbies);

  const handleCheckboxChange = (hobby: keyof typeof initialHobbies) => {
    setHobbies((prev) => ({
      ...prev,
      [hobby]: !prev[hobby],
    }));
  };

  const handleClearHobbies = () => {
    setHobbies(initialHobbies);
  };

  // Zone 3: Dynamic Text State
  const [isToggleOn, setIsToggleOn] = useState(true);

  return (
    <div
      data-testid="basic-controls-page"
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
            Basic UI Controls
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice E2E interactions with fundamental web elements. Handle radio option states, checkbox checklist matrices, selection resets, and dynamic visibility assertions.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1: Radio Button Group */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Radio Button Group</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Select a membership tier. Note that Gold is fully disabled and Bronze is pre-selected.
              </p>

              <div data-testid="radio-group" className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Membership Level
                </label>
                
                <div className="space-y-3">
                  <label data-testid="label-bronze" className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="membership"
                      value="Bronze"
                      data-testid="radio-bronze"
                      checked={membership === "Bronze"}
                      onChange={(e) => setMembership(e.target.value)}
                      className="h-4 w-4 border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Bronze (Default)
                    </span>
                  </label>

                  <label data-testid="label-silver" className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="membership"
                      value="Silver"
                      data-testid="radio-silver"
                      checked={membership === "Silver"}
                      onChange={(e) => setMembership(e.target.value)}
                      className="h-4 w-4 border-slate-300 bg-white text-indigo-655 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Silver
                    </span>
                  </label>

                  <label data-testid="label-gold" className="flex items-center gap-3 cursor-not-allowed opacity-50">
                    <input
                      type="radio"
                      name="membership"
                      value="Gold"
                      data-testid="radio-gold"
                      disabled
                      checked={membership === "Gold"}
                      onChange={(e) => setMembership(e.target.value)}
                      className="h-4 w-4 border-slate-200 bg-slate-100 text-slate-400 focus:ring-0 focus:ring-offset-0 cursor-not-allowed"
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Gold (Disabled)
                    </span>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                  Active selection: <span data-testid="selected-membership-display" className="font-mono font-bold text-indigo-600">{membership}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 2: Checkbox Grid */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Checkbox Grid</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Select your hobbies from the grid. Use the reset trigger to clear all selections.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Hobbies Checklist
                  </label>
                  <button
                    type="button"
                    data-testid="clear-hobbies-btn"
                    onClick={handleClearHobbies}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider focus:outline-none"
                  >
                    Clear All
                  </button>
                </div>

                <div data-testid="checkbox-grid" className="grid grid-cols-2 gap-3">
                  {(Object.keys(hobbies) as Array<keyof typeof hobbies>).map((hobby) => (
                    <label
                      key={hobby}
                      data-testid={`label-${hobby}`}
                      className="flex items-center gap-3 cursor-pointer group bg-white border border-slate-200 rounded-lg p-2.5 hover:border-indigo-150 hover:bg-indigo-50/10 transition-all select-none"
                    >
                      <input
                        type="checkbox"
                        data-testid={`checkbox-${hobby}`}
                        checked={hobbies[hobby]}
                        onChange={() => handleCheckboxChange(hobby)}
                        className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-700 capitalize group-hover:text-slate-900">
                        {hobby}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 3: Dynamic Text States */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dynamic Text States</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Flip the toggle switch to alter the header&apos;s text string, text color, and visibility attribute (`hidden` vs `visible`).
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-6 flex flex-col items-center justify-center min-h-[160px]">
                {/* Custom Toggle Switch */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Toggle Header State:
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      data-testid="state-toggle"
                      checked={isToggleOn}
                      onChange={() => setIsToggleOn(!isToggleOn)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Dynamic Header */}
                <div className="h-10 flex items-center justify-center">
                  <h3
                    data-testid="dynamic-header"
                    hidden={!isToggleOn}
                    className={`text-xl font-extrabold transition-all duration-300 ${
                      isToggleOn ? "text-emerald-600 scale-100" : "text-rose-600 scale-95"
                    }`}
                  >
                    {isToggleOn ? "Active State - ON" : "Inactive State - OFF"}
                  </h3>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
