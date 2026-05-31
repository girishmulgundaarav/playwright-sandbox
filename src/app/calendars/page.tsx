"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function CalendarsPage() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper date functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatLocalDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Nav month helpers
  const prevMonthAction = (year: number, month: number, setYear: React.Dispatch<React.SetStateAction<number>>, setMonth: React.Dispatch<React.SetStateAction<number>>) => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonthAction = (year: number, month: number, setYear: React.Dispatch<React.SetStateAction<number>>, setMonth: React.Dispatch<React.SetStateAction<number>>) => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // ZONE 1: Standard Input State
  const [standardDate, setStandardDate] = useState("");

  // ZONE 2: Custom Date Picker State
  const [customYear, setCustomYear] = useState(2026);
  const [customMonth, setCustomMonth] = useState(4); // May
  const [customSelected, setCustomSelected] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const customRef = useRef<HTMLDivElement>(null);

  // ZONE 3: Date-Range Picker State
  const [rangeYear, setRangeYear] = useState(2026);
  const [rangeMonth, setRangeMonth] = useState(4); // May
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  // ZONE 4: Datetime Slot Picker State
  const [schedYear, setSchedYear] = useState(2026);
  const [schedMonth, setSchedMonth] = useState(4);
  const [schedSelectedDate, setSchedSelectedDate] = useState("");
  const [schedSelectedTime, setSchedSelectedTime] = useState("");
  const [schedOpen, setSchedOpen] = useState(false);
  const [schedSubmitted, setSchedSubmitted] = useState(false);
  const schedRef = useRef<HTMLDivElement>(null);
  const availableSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"];

  // ZONE 5: Blackout Calendar State
  const [blackYear, setBlackYear] = useState(2026);
  const [blackMonth, setBlackMonth] = useState(4);
  const [blackSelected, setBlackSelected] = useState("");

  // ZONE 6: Fast Nav Dropdown Picker State
  const [navYear, setNavYear] = useState(2026);
  const [navMonth, setNavMonth] = useState(4);
  const [navSelected, setNavSelected] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const yearOptions = Array.from({ length: 16 }).map((_, i) => 2020 + i);

  // ZONE 7: Discrete Multi-Date Selector State
  const [multiYear, setMultiYear] = useState(2026);
  const [multiMonth, setMultiMonth] = useState(4);
  const [multiSelectedDates, setMultiSelectedDates] = useState<string[]>([]);
  const [multiOpen, setMultiOpen] = useState(false);
  const multiRef = useRef<HTMLDivElement>(null);

  // ZONE 8: Keyboard-Accessible Calendar State
  const [kbdYear, setKbdYear] = useState(2026);
  const [kbdMonth, setKbdMonth] = useState(4);
  const [kbdFocusedDate, setKbdFocusedDate] = useState("2026-05-15");
  const [kbdSelectedDate, setKbdSelectedDate] = useState("");

  // ZONE 9: Week-Start Grid Switcher State
  const [weekYear, setWeekYear] = useState(2026);
  const [weekMonth, setWeekMonth] = useState(4);
  const [weekSelected, setWeekSelected] = useState("");
  const [weekStartMon, setWeekStartMon] = useState(false);

  // ZONE 10: Standalone Time Picker State
  const [timeHour, setTimeHour] = useState(9);
  const [timeMinute, setTimeMinute] = useState(30);
  const [timePeriod, setTimePeriod] = useState("AM");
  const [timeSubmitted, setTimeSubmitted] = useState("");


  // Close custom popups when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (customRef.current && !customRef.current.contains(target)) {
        setCustomOpen(false);
      }
      if (rangeRef.current && !rangeRef.current.contains(target)) {
        setRangeOpen(false);
      }
      if (schedRef.current && !schedRef.current.contains(target)) {
        setSchedOpen(false);
      }
      if (navRef.current && !navRef.current.contains(target)) {
        setNavOpen(false);
      }
      if (multiRef.current && !multiRef.current.contains(target)) {
        setMultiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Preset Date-Range helper calculations
  const getRelativeDateString = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const applyPreset = (presetType: "today" | "yesterday" | "last7" | "last30" | "next14") => {
    let startStr = "";
    let endStr = "";
    switch (presetType) {
      case "today":
        startStr = getRelativeDateString(0);
        endStr = getRelativeDateString(0);
        break;
      case "yesterday":
        startStr = getRelativeDateString(-1);
        endStr = getRelativeDateString(-1);
        break;
      case "last7":
        startStr = getRelativeDateString(-6);
        endStr = getRelativeDateString(0);
        break;
      case "last30":
        startStr = getRelativeDateString(-29);
        endStr = getRelativeDateString(0);
        break;
      case "next14":
        startStr = getRelativeDateString(0);
        endStr = getRelativeDateString(13);
        break;
    }
    setStartDate(startStr);
    setEndDate(endStr);
    
    if (startStr) {
      const parts = startStr.split("-");
      setRangeYear(parseInt(parts[0], 10));
      setRangeMonth(parseInt(parts[1], 10) - 1);
    }
  };

  // Keyboard Accessible Calendar Event Handler
  const handleKbdKeyDown = (e: React.KeyboardEvent) => {
    if (!kbdFocusedDate) return;
    
    const [y, m, d] = kbdFocusedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    let handled = false;

    switch (e.key) {
      case "ArrowLeft":
        dateObj.setDate(dateObj.getDate() - 1);
        handled = true;
        break;
      case "ArrowRight":
        dateObj.setDate(dateObj.getDate() + 1);
        handled = true;
        break;
      case "ArrowUp":
        dateObj.setDate(dateObj.getDate() - 7);
        handled = true;
        break;
      case "ArrowDown":
        dateObj.setDate(dateObj.getDate() + 7);
        handled = true;
        break;
      case "Enter":
      case " ":
        setKbdSelectedDate(kbdFocusedDate);
        handled = true;
        break;
      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      const ny = dateObj.getFullYear();
      const nm = dateObj.getMonth();
      const nd = dateObj.getDate();
      const newFocusedStr = `${ny}-${String(nm + 1).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
      
      setKbdFocusedDate(newFocusedStr);
      setKbdYear(ny);
      setKbdMonth(nm);
    }
  };

  // Sync focus roving tabindex inside Keyboard-Accessible Calendar
  useEffect(() => {
    if (document.activeElement?.getAttribute("data-kbd-calendar-cell") === "true") {
      const activeEl = document.querySelector(`[data-testid="kbd-cell-${kbdFocusedDate}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.focus();
      }
    }
  }, [kbdFocusedDate]);


  // Custom Day Cell Click Handler
  const handleCustomDateSelect = (dateStr: string) => {
    setCustomSelected(dateStr);
    setCustomOpen(false);
  };

  // Date Range Click Handler
  const handleRangeDateSelect = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate("");
    } else {
      const startMs = new Date(startDate).getTime();
      const clickMs = new Date(dateStr).getTime();
      if (clickMs >= startMs) {
        setEndDate(dateStr);
        setRangeOpen(false); // Close when end date is chosen
      } else {
        setStartDate(dateStr);
      }
    }
  };

  const isDateInRange = (dateStr: string) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = new Date(dateStr).getTime();
    return current >= start && current <= end;
  };

  // Blackout dates rules (Weekends, fixed holidays, past dates before May 1, 2026)
  const isDateBlackout = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getUTCDay();
    if (day === 0 || day === 6) return true; // Weekends

    const holidayStrings = ["2026-01-01", "2026-07-04", "2026-12-25"];
    if (holidayStrings.includes(dateStr)) return true;

    const currentMs = new Date("2026-05-01").getTime();
    const cellMs = dateObj.getTime();
    if (cellMs < currentMs) return true;

    return false;
  };


  // Toggle dynamic multiselection
  const toggleMultiDate = (dateStr: string) => {
    setMultiSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  // Render Days Helper for Standard picker
  const renderCalendarDays = (
    year: number,
    month: number,
    onCellClick: (dateStr: string) => void,
    selectedDate: string,
    isRangeMode = false,
    testIdPrefix = "cell"
  ) => {
    const totalDays = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const cells: React.ReactNode[] = [];

    // Padding empty cells
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Actual day cells
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = formatLocalDate(year, month, day);
      const isSelected = selectedDate === dateStr;
      
      let bgClass = "hover:bg-slate-100 text-slate-800";
      let borderClass = "border border-transparent";

      if (isRangeMode) {
        const isStart = dateStr === startDate;
        const isEnd = dateStr === endDate;
        const inRange = isDateInRange(dateStr);

        if (isStart || isEnd) {
          bgClass = "bg-indigo-650 text-white font-bold shadow-md shadow-indigo-500/20";
        } else if (inRange) {
          bgClass = "bg-indigo-50 text-indigo-700 font-semibold";
          borderClass = "border border-indigo-150";
        }
      } else if (isSelected) {
        bgClass = "bg-indigo-650 text-white font-bold shadow-md shadow-indigo-500/20";
      }

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          data-testid={`${testIdPrefix}-${dateStr}`}
          onClick={() => onCellClick(dateStr)}
          className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all ${bgClass} ${borderClass}`}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  // Calculate Right Calendar Year/Month for Range Picker
  const rightRangeMonth = rangeMonth === 11 ? 0 : rangeMonth + 1;
  const rightRangeYear = rangeMonth === 11 ? rangeYear + 1 : rangeYear;

  return (
    <div
      data-testid="calendars-page"
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
            Calendars & Date Pickers
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice calendar UI testing: date injection, arrow navigations, dual range selectors, hour slot scheduling, blackout rules verification, fast headers jumps, and discrete multi-selections.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* ZONE 1: Standard HTML Date Input */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Standard Date Input</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                A native HTML input of type date. Allows direct text string injection (typically formatted as YYYY-MM-DD) via automation.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Select Date</label>
                  <input
                    type="date"
                    data-testid="standard-date-input"
                    value={standardDate}
                    onChange={(e) => setStandardDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>

                {standardDate && (
                  <div className="text-xs text-slate-500">
                    Selected value: <span className="font-mono font-bold text-indigo-655">{standardDate}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 2: Custom Popup Calendar Widget */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Custom Calendar Popup</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Click the input to show the custom picker. Student tests must click the next/prev month buttons to locate and select a specific target day.
              </p>

              <div ref={customRef} className="relative rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Target Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="Click to pick date"
                      data-testid="custom-date-input"
                      value={customSelected}
                      onClick={() => setCustomOpen(!customOpen)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    />
                    <svg className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                </div>

                {/* Calendar Popup Overlay */}
                {customOpen && (
                  <div className="absolute left-6 right-6 top-[76px] z-30 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                    {/* Header Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        data-testid="custom-prev-month-btn"
                        onClick={() => prevMonthAction(customYear, customMonth, setCustomYear, setCustomMonth)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <span className="text-xs font-bold text-slate-800 tracking-wide">
                        {monthNames[customMonth]} {customYear}
                      </span>
                      <button
                        type="button"
                        data-testid="custom-next-month-btn"
                        onClick={() => nextMonthAction(customYear, customMonth, setCustomYear, setCustomMonth)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>

                    {/* Week Day Titles */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                      {dayLabels.map((lbl) => (
                        <div key={lbl}>{lbl}</div>
                      ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 justify-items-center">
                      {renderCalendarDays(customYear, customMonth, handleCustomDateSelect, customSelected, false, "custom-date-cell")}
                    </div>
                  </div>
                )}

                {customSelected && (
                  <div className="text-xs text-slate-500">
                    Selected value: <span className="font-mono font-bold text-indigo-655">{customSelected}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 5: Blackout Calendar (Restricted Dates) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-orange-600 border border-orange-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Blackout Restricted Calendar</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Calendar with disabled weekends, past dates (prior to 2026-05-01), and select holidays. Assert disabled click behaviors.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                {/* Header Month Indicator */}
                <div className="text-center text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide">
                  {monthNames[blackMonth]} {blackYear}
                </div>

                {/* Week Day Titles */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                  {dayLabels.map((lbl) => (
                    <div key={`black-lbl-${lbl}`}>{lbl}</div>
                  ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {(() => {
                    const totalDays = getDaysInMonth(blackYear, blackMonth);
                    const startDay = getFirstDayOfMonth(blackYear, blackMonth);
                    const cells = [];
                    for (let i = 0; i < startDay; i++) {
                      cells.push(<div key={`empty-black-${i}`} className="h-8 w-8" />);
                    }
                    for (let day = 1; day <= totalDays; day++) {
                      const dateStr = formatLocalDate(blackYear, blackMonth, day);
                      const isBlack = isDateBlackout(dateStr);
                      const isSelected = blackSelected === dateStr;

                      let bgClass = "hover:bg-slate-100 text-slate-800";
                      let cursorClass = "cursor-pointer";

                      if (isBlack) {
                        bgClass = "bg-red-50 text-red-300 line-through cursor-not-allowed";
                      } else if (isSelected) {
                        bgClass = "bg-indigo-650 text-white font-bold shadow-md shadow-indigo-500/20";
                      }

                      cells.push(
                        <button
                          key={`day-black-${day}`}
                          type="button"
                          disabled={isBlack}
                          data-testid={`blackout-cell-${dateStr}`}
                          onClick={() => setBlackSelected(dateStr)}
                          className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all ${bgClass} ${cursorClass}`}
                        >
                          {day}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>

                {blackSelected && (
                  <div className="text-[10px] font-mono text-emerald-700 font-bold mt-3 text-center" data-testid="blackout-selection-msg">
                    Success! Selected slot: {blackSelected}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 6: Month & Year Dropdown Fast Navigation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 border border-cyan-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Fast Navigation Dropdowns</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Change calendar states instantly using header Month/Year dropdown select components, instead of paging click loops.
              </p>

              <div ref={navRef} className="relative rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 uppercase tracking-wider mb-2">Pick Jump Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="Click to pick"
                      data-testid="fast-nav-input"
                      value={navSelected}
                      onClick={() => setNavOpen(!navOpen)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Dropdown Calendar Popup */}
                {navOpen && (
                  <div className="absolute left-6 right-6 top-[76px] z-30 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                    
                    {/* Month/Year selectors header */}
                    <div className="flex gap-2 mb-4 justify-between items-center bg-slate-50 p-2 border border-slate-150 rounded-lg">
                      <select
                        data-testid="fast-nav-month-select"
                        value={navMonth}
                        onChange={(e) => setNavMonth(Number(e.target.value))}
                        className="text-xs font-bold text-slate-700 bg-white rounded border border-slate-200 p-1 outline-none"
                      >
                        {monthNames.map((n, idx) => (
                          <option key={n} value={idx}>{n}</option>
                        ))}
                      </select>

                      <select
                        data-testid="fast-nav-year-select"
                        value={navYear}
                        onChange={(e) => setNavYear(Number(e.target.value))}
                        className="text-xs font-bold text-slate-700 bg-white rounded border border-slate-200 p-1 outline-none"
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    {/* Week day titles */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                      {dayLabels.map((lbl) => (
                        <div key={`nav-lbl-${lbl}`}>{lbl}</div>
                      ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 justify-items-center">
                      {renderCalendarDays(navYear, navMonth, (dStr) => {
                        setNavSelected(dStr);
                        setNavOpen(false);
                      }, navSelected, false, "fast-nav-cell")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 4: Datetime Slot Picker (Date + Time Scheduler) */}
          <section ref={schedRef} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-250 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Datetime Appointment Scheduler</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Click input to show picker. Select a date, then click an adjacent hourly booking slot.
              </p>

              <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-655 uppercase tracking-wider mb-2">Meeting Appointment</label>
                    <input
                      type="text"
                      readOnly
                      placeholder="Select Date & Time..."
                      data-testid="sched-input"
                      value={schedSelectedDate && schedSelectedTime ? `${schedSelectedDate} at ${schedSelectedTime}` : ""}
                      onClick={() => { setSchedOpen(!schedOpen); setSchedSubmitted(false); }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 cursor-pointer"
                    />
                  </div>
                  {schedSelectedDate && schedSelectedTime && !schedSubmitted && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        data-testid="sched-submit-btn"
                        onClick={() => setSchedSubmitted(true)}
                        className="w-full rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs py-3 transition-colors shadow-xs"
                      >
                        Confirm Booking Slot
                      </button>
                    </div>
                  )}
                </div>

                {schedSubmitted && (
                  <div data-testid="sched-success-msg" className="mt-4 rounded-lg bg-emerald-50 border border-emerald-250 p-4 text-emerald-800 text-xs font-semibold">
                    🎉 Booking Complete! Scheduled for {schedSelectedDate} at {schedSelectedTime}.
                  </div>
                )}

                {/* Sched popup calendar + slots side-by-side */}
                {schedOpen && (
                  <div className="absolute left-6 right-6 top-[92px] z-30 rounded-xl border border-slate-200 bg-white p-4 shadow-xl flex flex-col md:flex-row gap-6 max-w-xl mx-auto">
                    {/* Calendar grid wrapper */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          data-testid="sched-prev-month"
                          onClick={() => prevMonthAction(schedYear, schedMonth, setSchedYear, setSchedMonth)}
                          className="p-1 rounded-md text-slate-500 hover:text-slate-800"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        <span className="text-xs font-bold text-slate-800">{monthNames[schedMonth]} {schedYear}</span>
                        <button
                          type="button"
                          data-testid="sched-next-month"
                          onClick={() => nextMonthAction(schedYear, schedMonth, setSchedYear, setSchedMonth)}
                          className="p-1 rounded-md text-slate-500 hover:text-slate-800"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                        {dayLabels.map((l) => <div key={`sched-lbl-${l}`}>{l}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1 justify-items-center">
                        {renderCalendarDays(schedYear, schedMonth, (dStr) => { setSchedSelectedDate(dStr); setSchedSelectedTime(""); }, schedSelectedDate, false, "sched-date-cell")}
                      </div>
                    </div>

                    {/* Time slots block */}
                    <div className="w-full md:w-40 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
                      <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-3">Time Slots</h4>
                      {!schedSelectedDate ? (
                        <p className="text-[10px] text-slate-400 italic">Select date first</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              data-testid={`sched-time-slot-${time.replace(" ", "-")}`}
                              onClick={() => { setSchedSelectedTime(time); setSchedOpen(false); }}
                              className={`w-full py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                                schedSelectedTime === time
                                  ? "bg-indigo-650 border-indigo-700 text-white"
                                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 7: Discrete Multi-Date Selector */}
          <section ref={multiRef} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Discrete Multi-Date Selector</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Click calendar popup. Select multiple separate dates (not a range). Removable chip elements are appended below dynamically.
              </p>

              <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 uppercase tracking-wider mb-2">Selected Travel Dates</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Click to select multiple..."
                    data-testid="multi-date-input"
                    value={multiSelectedDates.length > 0 ? `${multiSelectedDates.length} dates selected` : ""}
                    onClick={() => setMultiOpen(!multiOpen)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Selected chips list */}
                {multiSelectedDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1" data-testid="multi-selected-container">
                    {multiSelectedDates.map((date) => (
                      <span
                        key={date}
                        data-testid={`multi-selected-chip-${date}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-150"
                      >
                        {date}
                        <button
                          type="button"
                          onClick={() => toggleMultiDate(date)}
                          data-testid={`multi-remove-btn-${date}`}
                          className="text-indigo-400 hover:text-red-500 p-0.5 rounded-full"
                          aria-label={`Remove date ${date}`}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Multi-date Calendar popup */}
                {multiOpen && (
                  <div className="absolute left-6 right-6 top-[76px] z-30 rounded-xl border border-slate-200 bg-white p-4 shadow-xl max-w-sm mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        data-testid="multi-prev-month"
                        onClick={() => prevMonthAction(multiYear, multiMonth, setMultiYear, setMultiMonth)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <span className="text-xs font-bold text-slate-800">{monthNames[multiMonth]} {multiYear}</span>
                      <button
                        type="button"
                        data-testid="multi-next-month"
                        onClick={() => nextMonthAction(multiYear, multiMonth, setMultiYear, setMultiMonth)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                      {dayLabels.map((lbl) => <div key={`multi-lbl-${lbl}`}>{lbl}</div>)}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 justify-items-center">
                      {(() => {
                        const totalDays = getDaysInMonth(multiYear, multiMonth);
                        const startDay = getFirstDayOfMonth(multiYear, multiMonth);
                        const cells = [];
                        for (let i = 0; i < startDay; i++) {
                          cells.push(<div key={`empty-multi-${i}`} className="h-8 w-8" />);
                        }
                        for (let day = 1; day <= totalDays; day++) {
                          const dateStr = formatLocalDate(multiYear, multiMonth, day);
                          const isSelected = multiSelectedDates.includes(dateStr);
                          
                          let bgClass = "hover:bg-slate-100 text-slate-800";
                          if (isSelected) {
                            bgClass = "bg-indigo-650 text-white font-bold shadow-md shadow-indigo-500/20";
                          }
                          cells.push(
                            <button
                              key={`day-multi-${day}`}
                              type="button"
                              data-testid={`multi-cell-${dateStr}`}
                              onClick={() => toggleMultiDate(dateStr)}
                              className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all ${bgClass}`}
                            >
                              {day}
                            </button>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 3: Date-Range Picker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Date-Range Picker</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                A range selector featuring two side-by-side interconnected monthly views. First selection sets the Start date, and second sets the End date.
              </p>

              <div ref={rangeRef} className="relative rounded-xl bg-slate-50 border border-slate-200 p-6">
                {/* Relative Presets */}
                <div className="flex flex-wrap gap-2 mb-4 bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center mr-1">Presets:</span>
                  <button
                    type="button"
                    data-testid="preset-btn-today"
                    onClick={() => applyPreset("today")}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-indigo-50 hover:text-indigo-650 rounded border border-slate-250 font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    data-testid="preset-btn-yesterday"
                    onClick={() => applyPreset("yesterday")}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-indigo-50 hover:text-indigo-650 rounded border border-slate-250 font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    data-testid="preset-btn-last-7"
                    onClick={() => applyPreset("last7")}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-indigo-50 hover:text-indigo-650 rounded border border-slate-250 font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    data-testid="preset-btn-last-30"
                    onClick={() => applyPreset("last30")}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-indigo-50 hover:text-indigo-650 rounded border border-slate-250 font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Last 30 Days
                  </button>
                  <button
                    type="button"
                    data-testid="preset-btn-next-14"
                    onClick={() => applyPreset("next14")}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-indigo-50 hover:text-indigo-650 rounded border border-slate-250 font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Next 14 Days
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-655 uppercase tracking-wider mb-2">Start Date</label>
                    <input
                      type="text"
                      readOnly
                      placeholder="YYYY-MM-DD"
                      data-testid="range-start-input"
                      value={startDate}
                      onClick={() => setRangeOpen(true)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-655 uppercase tracking-wider mb-2">End Date</label>
                    <input
                      type="text"
                      readOnly
                      placeholder="YYYY-MM-DD"
                      data-testid="range-end-input"
                      value={endDate}
                      onClick={() => setRangeOpen(true)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    />
                  </div>
                </div>

                {/* Range Double Calendar Popup */}
                {rangeOpen && (
                  <div className="absolute left-6 right-6 top-[92px] z-30 rounded-xl border border-slate-200 bg-white p-4 shadow-xl flex flex-col gap-4 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <button
                        type="button"
                        data-testid="range-prev-month-btn"
                        onClick={() => prevMonthAction(rangeYear, rangeMonth, setRangeYear, setRangeMonth)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Select Booking Dates
                      </span>
                      <button
                        type="button"
                        data-testid="range-next-month-btn"
                        onClick={() => nextMonthAction(rangeYear, rangeMonth, setRangeYear, setRangeMonth)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2">
                      <div>
                        <div className="text-center text-xs font-bold text-slate-800 mb-3">
                          {monthNames[rangeMonth]} {rangeYear}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                          {dayLabels.map((lbl) => (
                            <div key={`left-lbl-${lbl}`}>{lbl}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 justify-items-center">
                          {renderCalendarDays(rangeYear, rangeMonth, handleRangeDateSelect, "", true, "range-left-cell")}
                        </div>
                      </div>

                      <div>
                        <div className="text-center text-xs font-bold text-slate-800 mb-3">
                          {monthNames[rightRangeMonth]} {rightRangeYear}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                          {dayLabels.map((lbl) => (
                            <div key={`right-lbl-${lbl}`}>{lbl}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 justify-items-center">
                          {renderCalendarDays(rightRangeYear, rightRangeMonth, handleRangeDateSelect, "", true, "range-right-cell")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(startDate || endDate) && (
                  <div className="text-xs text-slate-500 mt-2 flex justify-between items-center">
                    <span>
                      Range: <span className="font-mono font-bold text-indigo-650">{startDate || "..."}</span> to <span className="font-mono font-bold text-indigo-650">{endDate || "..."}</span>
                    </span>
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-455 hover:text-red-500 underline transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 8: Keyboard-Accessible Calendar */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50 text-violet-650 border border-violet-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Keyboard-Accessible Calendar (Roving Tabindex)</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Focus the calendar by clicking or tabbing into it. Navigate days using Arrow Keys (Left, Right, Up, Down), and select by pressing `Space` or `Enter`. Visual focus and ARIA states update dynamically.
              </p>

              <div 
                className="max-w-md mx-auto rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4"
                data-testid="kbd-calendar-container"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => prevMonthAction(kbdYear, kbdMonth, setKbdYear, setKbdMonth)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span className="text-xs font-bold text-slate-800 tracking-wide">
                    {monthNames[kbdMonth]} {kbdYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => nextMonthAction(kbdYear, kbdMonth, setKbdYear, setKbdMonth)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                  {dayLabels.map((lbl) => (
                    <div key={`kbd-lbl-${lbl}`}>{lbl}</div>
                  ))}
                </div>

                <div 
                  role="grid"
                  aria-label="Interactive Calendar"
                  onKeyDown={handleKbdKeyDown}
                  className="grid grid-cols-7 gap-1 justify-items-center outline-none"
                  data-testid="kbd-calendar-grid"
                >
                  {(() => {
                    const totalDays = getDaysInMonth(kbdYear, kbdMonth);
                    const startDay = getFirstDayOfMonth(kbdYear, kbdMonth);
                    const cells = [];
                    for (let i = 0; i < startDay; i++) {
                      cells.push(<div key={`empty-kbd-${i}`} className="h-8 w-8" />);
                    }
                    for (let day = 1; day <= totalDays; day++) {
                      const dateStr = formatLocalDate(kbdYear, kbdMonth, day);
                      const isFocused = kbdFocusedDate === dateStr;
                      const isSelected = kbdSelectedDate === dateStr;

                      let bgClass = "hover:bg-slate-100 text-slate-800";
                      if (isSelected) {
                        bgClass = "bg-indigo-650 text-white font-bold shadow-md shadow-indigo-500/20";
                      } else if (isFocused) {
                        bgClass = "bg-slate-200 text-slate-800 ring-2 ring-indigo-500 ring-offset-1";
                      }

                      cells.push(
                        <button
                          key={`day-kbd-${day}`}
                          type="button"
                          role="gridcell"
                          tabIndex={isFocused ? 0 : -1}
                          data-kbd-calendar-cell="true"
                          data-testid={`kbd-cell-${dateStr}`}
                          onClick={() => {
                            setKbdFocusedDate(dateStr);
                            setKbdSelectedDate(dateStr);
                          }}
                          className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all ${bgClass}`}
                        >
                          {day}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>

                {kbdSelectedDate && (
                  <div 
                    data-testid="kbd-selected-msg" 
                    className="text-xs text-center text-emerald-800 bg-emerald-50 border border-emerald-250 rounded-lg p-2.5 font-semibold"
                  >
                    🎉 Selected Date: {kbdSelectedDate}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 9: Week-Start Grid Switcher */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600 border border-teal-200 font-bold text-sm">
                    9
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Week-Start Grid Switcher</h2>
                </div>
                
                {/* Toggle Button */}
                <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 pl-1" data-testid="week-start-label">
                    Start: {weekStartMon ? "Monday" : "Sunday"}
                  </span>
                  <button
                    type="button"
                    data-testid="week-start-toggle"
                    onClick={() => setWeekStartMon(!weekStartMon)}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-650 rounded border border-slate-250 shadow-2xs transition-all cursor-pointer"
                  >
                    Toggle
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                Toggling shifts the alignment of headers and cells (Sunday vs Monday first). Tests should locate dates via data attributes to verify grid coordinates change dynamically.
              </p>

              <div className="max-w-md mx-auto rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => prevMonthAction(weekYear, weekMonth, setWeekYear, setWeekMonth)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span className="text-xs font-bold text-slate-800 tracking-wide">
                    {monthNames[weekMonth]} {weekYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => nextMonthAction(weekYear, weekMonth, setWeekYear, setWeekMonth)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                {/* Header labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                  {(() => {
                    const labels = weekStartMon
                      ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
                      : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
                    return labels.map((lbl, idx) => (
                      <div key={`week-lbl-${lbl}`} data-testid={`week-grid-header-${idx}`}>{lbl}</div>
                    ));
                  })()}
                </div>

                {/* Calendar day grid */}
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {(() => {
                    const totalDays = getDaysInMonth(weekYear, weekMonth);
                    const standardFirstDay = getFirstDayOfMonth(weekYear, weekMonth);
                    const startDay = weekStartMon
                      ? (standardFirstDay + 6) % 7
                      : standardFirstDay;
                    const cells = [];
                    
                    for (let i = 0; i < startDay; i++) {
                      cells.push(<div key={`empty-week-${i}`} className="h-8 w-8" />);
                    }

                    for (let day = 1; day <= totalDays; day++) {
                      const dateStr = formatLocalDate(weekYear, weekMonth, day);
                      const isSelected = weekSelected === dateStr;

                      let bgClass = "hover:bg-slate-100 text-slate-800";
                      if (isSelected) {
                        bgClass = "bg-indigo-650 text-white font-bold shadow-md shadow-indigo-500/20";
                      }

                      cells.push(
                        <button
                          key={`day-week-${day}`}
                          type="button"
                          data-testid={`week-cell-${dateStr}`}
                          onClick={() => setWeekSelected(dateStr)}
                          className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all ${bgClass}`}
                        >
                          {day}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>

                {weekSelected && (
                  <div className="text-xs text-center text-indigo-750 font-mono font-bold mt-2">
                    Selected: {weekSelected}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 10: Standalone Time Picker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-250 font-bold text-sm">
                  10
                </span>
                <h2 className="text-xl font-bold text-slate-900">Standalone Time Picker (Steppers & Sliders)</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Interact with time inputs: drag sliders, or click the stepper buttons to increment and decrement hours and minutes. Toggle AM/PM and confirm selection.
              </p>

              <div className="max-w-md mx-auto rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-6">
                {/* Digital Clock Display */}
                <div className="flex justify-center items-center gap-2 bg-slate-900 text-amber-400 py-4 px-6 rounded-lg font-mono text-3xl font-bold shadow-inner">
                  <span>{String(timeHour).padStart(2, "0")}</span>
                  <span className="animate-pulse">:</span>
                  <span>{String(timeMinute).padStart(2, "0")}</span>
                  <span className="text-xl ml-2 text-slate-400">{timePeriod}</span>
                </div>

                {/* Controls Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  
                  {/* Stepper controls */}
                  <div className="space-y-4 bg-white p-4 rounded-lg border border-slate-150">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Step Adjustment</h4>
                    
                    {/* Hour Stepper */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-semibold">Hours:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          data-testid="time-hour-dec"
                          onClick={() => setTimeHour((h) => (h === 1 ? 12 : h - 1))}
                          className="h-8 w-8 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-250 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">{timeHour}</span>
                        <button
                          type="button"
                          data-testid="time-hour-inc"
                          onClick={() => setTimeHour((h) => (h === 12 ? 1 : h + 1))}
                          className="h-8 w-8 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-250 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Minute Stepper */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-semibold">Minutes:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          data-testid="time-min-dec"
                          onClick={() => setTimeMinute((m) => (m === 0 ? 59 : m - 1))}
                          className="h-8 w-8 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-250 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">{timeMinute}</span>
                        <button
                          type="button"
                          data-testid="time-min-inc"
                          onClick={() => setTimeMinute((m) => (m === 59 ? 0 : m + 1))}
                          className="h-8 w-8 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-250 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* AM/PM Toggle */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-600 font-semibold">Period:</span>
                      <button
                        type="button"
                        data-testid="time-ampm-toggle"
                        onClick={() => setTimePeriod((p) => (p === "AM" ? "PM" : "AM"))}
                        className="px-4 py-1.5 text-xs font-bold uppercase bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded border border-indigo-150 transition-colors cursor-pointer"
                      >
                        {timePeriod}
                      </button>
                    </div>
                  </div>

                  {/* Slider controls */}
                  <div className="space-y-4 bg-white p-4 rounded-lg border border-slate-150 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Slider Adjustment</h4>
                      
                      {/* Hour Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Hour Slider</span>
                          <span>{timeHour}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="12"
                          data-testid="time-hour-slider"
                          value={timeHour}
                          onChange={(e) => setTimeHour(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                        />
                      </div>

                      {/* Minute Slider */}
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Minute Slider</span>
                          <span>{timeMinute}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="59"
                          data-testid="time-min-slider"
                          value={timeMinute}
                          onChange={(e) => setTimeMinute(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      data-testid="time-submit-btn"
                      onClick={() => setTimeSubmitted(`${String(timeHour).padStart(2, "0")}:${String(timeMinute).padStart(2, "0")} ${timePeriod}`)}
                      className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      Confirm Time
                    </button>
                  </div>

                </div>

                {timeSubmitted && (
                  <div 
                    data-testid="time-success-msg" 
                    className="text-xs text-center text-emerald-800 bg-emerald-50 border border-emerald-250 rounded-lg p-2.5 font-semibold"
                  >
                    🎉 Time confirmed: {timeSubmitted}
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
