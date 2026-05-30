"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";

export default function AdvancedPage() {
  // ZONE 1: Drag and Drop State
  const [isDropped, setIsDropped] = useState(false);

  // ZONE 3: Infinite Scroll State
  const [items, setItems] = useState<string[]>(
    Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`)
  );
  const [loading, setLoading] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ZONE 4: Accessibility Sandbox State
  const [a11ySubmitCount, setA11ySubmitCount] = useState(0);

  // ZONE 5: Canvas Signature Pad State
  const [isCanvasBlank, setIsCanvasBlank] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "dragged-box-a");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data === "dragged-box-a") {
      setIsDropped(true);
    }
  };

  const handleResetDrag = () => {
    setIsDropped(false);
  };

  // Infinite Scroll Handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Check if user scrolled to the bottom (within 5px threshold)
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

    if (isAtBottom && !loading && items.length < 50) {
      setLoading(true);
      
      // Clear any pending timeout
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      // Simulate a small loading latency (500ms) for testing wait-states
      scrollTimeoutRef.current = setTimeout(() => {
        setItems((prev) => {
          const currentLength = prev.length;
          const newBatch = Array.from({ length: 10 }, (_, i) => `Item ${currentLength + i + 1}`);
          return [...prev, ...newBatch];
        });
        setLoading(false);
      }, 500);
    }
  };

  const handleResetScroll = () => {
    setItems(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`));
    setLoading(false);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
  };

  // Canvas Drawing Handlers
  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
    isDrawing.current = true;
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setIsCanvasBlank(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    if (e.cancelable) e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsCanvasBlank(true);
  };

  return (
    <div
      data-testid="advanced-page"
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
            Advanced Interactions
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice automating advanced pointer actions: HTML5 drag-and-drop swaps, mouse-hover menus, and dynamic infinite scroll trigger zones.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* ZONE 1: Drag & Drop */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Drag and Drop Playground</h2>
              </div>
              <p className="text-sm text-slate-600 mb-8 max-w-2xl">
                Automate pointer dragging. Drag Box A from its starting container on the left, and drop it directly inside the target Box B.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                {/* Drag Source Area */}
                <div className="w-full max-w-[240px] h-[160px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
                  {!isDropped ? (
                    <div
                      draggable
                      onDragStart={handleDragStart}
                      data-testid="draggable-box"
                      className="w-32 h-20 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-indigo-500/20 cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Box A
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Empty Spot</span>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="text-slate-350 transform rotate-90 sm:rotate-0">
                  <svg className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>

                {/* Drop Zone Box B */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-testid="dropzone-box"
                  className={`w-full max-w-[240px] h-[160px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                    isDropped
                      ? "border-emerald-500/50 bg-emerald-50/50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-450"
                  }`}
                >
                  {isDropped ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400/30 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-emerald-500/20">
                        Box A
                      </div>
                      <span className="text-xs font-bold text-emerald-600 mt-2 uppercase tracking-wide">Dropped Successfully!</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Box B</p>
                      <p className="text-[10px] text-slate-550 mt-1">Drop Box A Here</p>
                    </div>
                  )}
                </div>
              </div>

              {isDropped && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleResetDrag}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline transition-colors"
                  >
                    Reset Playground
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ZONE 2: Hover Menu */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Hover Reveal Dropdown</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice mouse hovering. Hover over the button below to expand the dropdown overlay and click on the links inside.
              </p>

              <div className="min-h-[140px] flex items-start justify-center pt-6 rounded-xl bg-slate-50 border border-slate-200 p-6">
                {/* CSS group-hover Dropdown Container */}
                <div className="relative group inline-block">
                  <button
                    data-testid="hover-trigger"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-650 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-600 transition-all duration-200"
                  >
                    Hover Me
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Dropdown Menu Overlay */}
                  <div
                    data-testid="hover-dropdown"
                    className="hidden group-hover:block absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-fade-in"
                  >
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      data-testid="hover-link-1"
                      className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Automation Link 1
                    </a>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      data-testid="hover-link-2"
                      className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Automation Link 2
                    </a>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      data-testid="hover-link-3"
                      className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Automation Link 3
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 3: Infinite Scroll */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Infinite Scroll List</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Scroll to the bottom of the container below to trigger an async event that dynamically appends 10 new items (up to 50).
              </p>

              {/* Scrollable Container */}
              <div
                onScroll={handleScroll}
                data-testid="infinite-scroll-container"
                className="h-44 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 scrollbar-thin"
              >
                {items.map((item, idx) => (
                  <div
                    key={item}
                    data-testid={`scroll-item-${idx + 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 font-semibold tracking-wide flex items-center justify-between shadow-xxs"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Index: {idx}</span>
                  </div>
                ))}

                {/* Loader Indicator */}
                {loading && (
                  <div
                    data-testid="scroll-loader"
                    className="flex justify-center items-center py-2"
                  >
                    <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-xs text-slate-500 font-semibold">
                Total Rows: <span className="text-slate-800 font-bold font-mono">{items.length}</span> / 50
              </span>
              {items.length > 10 && (
                <button
                  onClick={handleResetScroll}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline transition-colors"
                >
                  Reset List
                </button>
              )}
            </div>
          </section>

          {/* ZONE 4: Accessibility Sandbox */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Accessibility Auditing Sandbox</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice auditing accessibility compliance issues. These elements deliberately contain accessibility anti-patterns (no labels, custom interactive div buttons without ARIA tags, low contrast text).
              </p>

              <div className="space-y-6 rounded-xl bg-slate-50 border border-slate-200 p-6">
                {/* 1. Missing input label */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-450 uppercase tracking-wider">
                    Missing Input Label Test
                  </span>
                  <input
                    type="text"
                    placeholder="Enter sandbox password..."
                    data-testid="a11y-no-label-input"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 2. Custom button without role/tabindex */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-450 uppercase tracking-wider">
                    Non-semantic Div Button
                  </span>
                  <div
                    onClick={() => setA11ySubmitCount((c) => c + 1)}
                    data-testid="a11y-custom-div-button"
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center cursor-pointer select-none transition-all"
                  >
                    Submit Request
                  </div>
                  {a11ySubmitCount > 0 && (
                    <p data-testid="a11y-submit-msg" className="text-[10px] font-bold text-emerald-600">
                      Requests Submitted: {a11ySubmitCount}
                    </p>
                  )}
                </div>

                {/* 3. Low contrast warning text */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-450 uppercase tracking-wider">
                    Low Contrast Text Ratio Test
                  </span>
                  <div className="bg-white p-3 rounded-lg border border-slate-150">
                    <p
                      data-testid="a11y-low-contrast-text"
                      className="text-slate-300 text-[11px]"
                    >
                      Warning: Highly sensitive credential transmission mode is currently active.
                    </p>
                  </div>
                </div>

                {/* 4. Missing image alt tag */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-bold text-slate-450 uppercase tracking-wider">
                    Image Without Alt Text
                  </span>
                  <div className="flex justify-center bg-white p-3 rounded-lg border border-slate-150">
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                    <img
                      src="/api/placeholder/100/50"
                      data-testid="a11y-no-alt-image"
                      className="h-12 w-auto object-contain rounded opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 5: Canvas signature pad */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-650 border border-indigo-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Canvas Signature Pad</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Practice testing absolute coordinate mouse/touch drag draw triggers. Hold down and drag across the canvas pad below to sign.
              </p>

              <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-50 border border-slate-200 p-6">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  data-testid="signature-pad"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={stopDrawing}
                  className="bg-white border border-slate-300 rounded-lg shadow-inner cursor-crosshair max-w-full"
                />

                <div className="w-full flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500 font-semibold">
                    Status:{" "}
                    <span
                      data-testid="signature-status"
                      className={`font-bold uppercase tracking-wide ${
                        isCanvasBlank ? "text-slate-400" : "text-emerald-600 animate-pulse"
                      }`}
                    >
                      {isCanvasBlank ? "Empty" : "Signed"}
                    </span>
                  </span>

                  <button
                    type="button"
                    data-testid="clear-signature-btn"
                    onClick={handleClearCanvas}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-350 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 active:scale-97 transition-all cursor-pointer"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Clear Canvas
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
