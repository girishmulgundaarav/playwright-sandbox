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

  // VARIANT 1: Standard Input State
  const [standardDate, setStandardDate] = useState("");

  // VARIANT 2: Custom Date Picker State
  const [customYear, setCustomYear] = useState(2026);
  const [customMonth, setCustomMonth] = useState(4); // May
  const [customSelected, setCustomSelected] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const customRef = useRef<HTMLDivElement>(null);

  // VARIANT 3: Date-Range Picker State
  const [rangeYear, setRangeYear] = useState(2026);
  const [rangeMonth, setRangeMonth] = useState(4); // May (Left calendar is May, Right calendar is June)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Close custom popups when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (customRef.current && !customRef.current.contains(e.target as Node)) {
        setCustomOpen(false);
      }
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) {
        setRangeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  // Render Days Helper
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
            Practice date injection into native HTML inputs, navigating monthly arrow controls on custom popup widgets, and selecting dual date ranges.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* VARIANT 1: Standard HTML Date Input */}
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

          {/* VARIANT 2: Custom Popup Calendar Widget */}
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

          {/* VARIANT 3: Date-Range Picker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Date-Range Picker</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                A range selector featuring two side-by-side interconnected monthly views. First selection sets the Start date, and second sets the End date.
              </p>

              <div ref={rangeRef} className="relative rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="grid gap-6 sm:grid-cols-2 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">Start Date</label>
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
                    <label className="block text-xs font-semibold text-slate-650 uppercase tracking-wider mb-2">End Date</label>
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
                    {/* Header Monthly controls */}
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
                      {/* Left Calendar (current month) */}
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

                      {/* Right Calendar (next month) */}
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
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-450 hover:text-red-500 underline transition-colors"
                    >
                      Clear Selection
                    </button>
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
