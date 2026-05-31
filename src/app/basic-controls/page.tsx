"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function BasicControlsPage() {
  // ZONE 1: Text Input Box State
  const [name, setName] = useState("");

  // ZONE 2: Radio Button Group State
  const [membership, setMembership] = useState("Bronze");
  const [gender, setGender] = useState(""); // Default unselected

  // ZONE 3: Checkbox Grid State
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

  // Days of the Week Checkboxes State
  const daysArray = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ] as const;

  const initialDays = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };
  const [days, setDays] = useState<Record<string, boolean>>(initialDays);

  const handleDayChange = (day: string) => {
    setDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleClearDays = () => {
    setDays(initialDays);
  };

  // ZONE 4: Dynamic Text State
  const [isToggleOn, setIsToggleOn] = useState(true);

  // ZONE 5: Range Slider
  const [sliderValue, setSliderValue] = useState(50);

  // ZONE 6: Button States
  const [btnState, setBtnState] = useState<"idle" | "loading" | "success">("idle");
  const handleActionClick = () => {
    setBtnState("loading");
    setTimeout(() => {
      setBtnState("success");
      setTimeout(() => setBtnState("idle"), 2000);
    }, 1500);
  };

  // ZONE 7: Textarea
  const MAX_CHARS = 200;
  const [bio, setBio] = useState("");

  // ZONE 8: Alerts / Toasts
  const [toastSuccess, setToastSuccess] = useState(false);
  const [toastWarning, setToastWarning] = useState(false);
  const [toastError, setToastError] = useState(false);

  // ZONE 9: Counter with Limits
  const COUNTER_MIN = 0;
  const COUNTER_MAX = 10;
  const [count, setCount] = useState(0);

  return (
    <div
      data-testid="basic-controls-page"
      className="flex-1 bg-slate-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-955 mb-8 transition-colors"
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
            Practice E2E interactions with fundamental web elements. Handle text inputs, radio options, checkboxes, selection resets, and dynamic visibility assertions.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1: Text Input Box */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Text Input Box</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice text box interaction. Check if the element is editable, fill it instantly, or simulate typing delay.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    data-testid="text-input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs text-slate-500">
                  <div>
                    Value: <span data-testid="entered-name-display" className="font-mono font-bold text-indigo-600">{name || "(empty)"}</span>
                  </div>
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName("")}
                      className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 2: Radio Button Group & Gender */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Radio Button Groups</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Select membership level (Bronze is pre-selected) and gender (unselected by default).
              </p>

              <div className="space-y-4">
                {/* Membership */}
                <div data-testid="radio-group" className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Membership Level
                  </label>
                  
                  <div className="space-y-2">
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
                </div>

                {/* Gender */}
                <div data-testid="gender-radio-group" className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Gender Selection
                  </label>

                  <div className="flex gap-6">
                    <label data-testid="label-male" className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        data-testid="radio-male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-4 w-4 border-slate-300 bg-white text-indigo-655 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        Male
                      </span>
                    </label>

                    <label data-testid="label-female" className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        data-testid="radio-female"
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-4 w-4 border-slate-300 bg-white text-indigo-655 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        Female
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                    Selected Gender: <span data-testid="selected-gender-display" className="font-mono font-bold text-indigo-600">{gender || "None"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 3: Checkbox Grids & Lists */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Checkbox Grids & Lists</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice checkbox multi-selection. Handle hobbies checklist matrices and days of the week loops.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Hobbies Checklist */}
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

                {/* Days of the Week */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Days of the Week
                    </label>
                    <button
                      type="button"
                      data-testid="clear-days-btn"
                      onClick={handleClearDays}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider focus:outline-none"
                    >
                      Clear All
                    </button>
                  </div>

                  <div data-testid="days-checklist" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {daysArray.map((day) => (
                      <label
                        key={day}
                        htmlFor={day.toLowerCase()}
                        data-testid={`label-${day.toLowerCase()}`}
                        className="flex items-center gap-2 cursor-pointer group bg-white border border-slate-200 rounded-lg p-2 hover:border-indigo-150 hover:bg-indigo-50/10 transition-all select-none"
                      >
                        <input
                          type="checkbox"
                          id={day.toLowerCase()}
                          data-testid={`checkbox-${day.toLowerCase()}`}
                          checked={days[day]}
                          onChange={() => handleDayChange(day)}
                          className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                          {day}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 4: Dynamic Text States */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  4
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

          {/* ZONE 5: Range Slider */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-600 border border-orange-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Range Slider</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Drag the slider to a value. Practice using{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">fill()</code> or{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">evaluate()</code> to set slider positions.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="range-slider" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Volume Level
                  </label>
                  <span data-testid="slider-value-display" className="font-mono font-bold text-indigo-600 text-sm">
                    {sliderValue}
                  </span>
                </div>
                <input
                  type="range"
                  id="range-slider"
                  data-testid="range-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 6: Button States */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600 border border-teal-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Button States</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Test idle, loading, success, and permanently disabled states. Assert text changes and{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toBeDisabled()</code>.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Action Button</label>

                <button
                  type="button"
                  data-testid="action-btn"
                  onClick={handleActionClick}
                  disabled={btnState !== "idle"}
                  className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    btnState === "idle"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                      : btnState === "loading"
                      ? "bg-indigo-400 text-white cursor-not-allowed"
                      : "bg-emerald-500 text-white cursor-not-allowed"
                  }`}
                >
                  {btnState === "idle" && "Submit Request"}
                  {btnState === "loading" && (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  )}
                  {btnState === "success" && "✓ Submitted!"}
                </button>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                  Status:{" "}
                  <span data-testid="action-btn-status" className="font-mono font-bold text-indigo-600">
                    {btnState}
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="disabled-btn"
                  disabled
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                >
                  Permanently Disabled
                </button>
              </div>
            </div>
          </section>

          {/* ZONE 7: Textarea */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-violet-600 border border-violet-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Textarea</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Multi-line input with a live character counter. Assert content using{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toHaveValue()</code> and count with{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toHaveText()</code>.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="bio-textarea" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Bio / Description
                  </label>
                  <span
                    data-testid="char-count-display"
                    className={`text-xs font-mono font-bold ${
                      bio.length >= MAX_CHARS ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    {bio.length}/{MAX_CHARS}
                  </span>
                </div>
                <textarea
                  id="bio-textarea"
                  data-testid="bio-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Write a short bio..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-none"
                />
                {bio && (
                  <button
                    type="button"
                    data-testid="clear-bio-btn"
                    onClick={() => setBio("")}
                    className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 8: Alerts / Toasts */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Alerts &amp; Toasts</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Trigger and dismiss alerts. Assert with{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toBeVisible()</code> and{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toBeHidden()</code>.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    data-testid="toast-success-btn"
                    onClick={() => setToastSuccess(true)}
                    className="rounded-lg px-3 py-2 text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors border border-emerald-200"
                  >
                    Show Success
                  </button>
                  <button
                    type="button"
                    data-testid="toast-warning-btn"
                    onClick={() => setToastWarning(true)}
                    className="rounded-lg px-3 py-2 text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors border border-amber-200"
                  >
                    Show Warning
                  </button>
                  <button
                    type="button"
                    data-testid="toast-error-btn"
                    onClick={() => setToastError(true)}
                    className="rounded-lg px-3 py-2 text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors border border-rose-200"
                  >
                    Show Error
                  </button>
                </div>

                <div className="space-y-2">
                  {toastSuccess && (
                    <div data-testid="toast-success" className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                      <span className="text-xs font-semibold text-emerald-700">✓ Action completed successfully!</span>
                      <button
                        type="button"
                        data-testid="dismiss-success"
                        onClick={() => setToastSuccess(false)}
                        className="text-emerald-500 hover:text-emerald-700 font-bold text-sm transition-colors ml-4"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {toastWarning && (
                    <div data-testid="toast-warning" className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                      <span className="text-xs font-semibold text-amber-700">⚠ Warning: Please review your input.</span>
                      <button
                        type="button"
                        data-testid="dismiss-warning"
                        onClick={() => setToastWarning(false)}
                        className="text-amber-500 hover:text-amber-700 font-bold text-sm transition-colors ml-4"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {toastError && (
                    <div data-testid="toast-error" className="flex items-center justify-between rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
                      <span className="text-xs font-semibold text-rose-700">✕ Error: Something went wrong.</span>
                      <button
                        type="button"
                        data-testid="dismiss-error"
                        onClick={() => setToastError(false)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-sm transition-colors ml-4"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {!toastSuccess && !toastWarning && !toastError && (
                    <p className="text-xs text-slate-400 text-center py-2">No active alerts</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 9: Counter with Limits */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-200 font-bold text-sm">
                  9
                </span>
                <h2 className="text-xl font-bold text-slate-900">Counter with Limits</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Test boundary-value interactions. Buttons disable at min (0) and max (10). Assert with{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toBeDisabled()</code> and{" "}
                <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">toHaveText()</code>.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-8">
                    <button
                      type="button"
                      data-testid="decrement-btn"
                      onClick={() => setCount((c) => Math.max(COUNTER_MIN, c - 1))}
                      disabled={count === COUNTER_MIN}
                      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-2xl font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                    >
                      −
                    </button>

                    <div className="flex flex-col items-center">
                      <span
                        data-testid="counter-display"
                        className="text-5xl font-extrabold text-slate-900 tabular-nums w-20 text-center"
                      >
                        {count}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Range: {COUNTER_MIN}–{COUNTER_MAX}
                      </span>
                    </div>

                    <button
                      type="button"
                      data-testid="increment-btn"
                      onClick={() => setCount((c) => Math.min(COUNTER_MAX, c + 1))}
                      disabled={count === COUNTER_MAX}
                      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-2xl font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    data-testid="reset-counter-btn"
                    onClick={() => setCount(0)}
                    disabled={count === 0}
                    className="rounded-lg px-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Reset to 0
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
