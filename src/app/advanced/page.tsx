"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

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

  // ZONE 6: Custom Context Menu & Double Click States
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuAction, setContextMenuAction] = useState("");

  // ZONE 7: Lasso Multi-Select States
  const [selectedLassoCells, setSelectedLassoCells] = useState<number[]>([]);
  const [lassoMarquee, setLassoMarquee] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const lassoContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLassoDragging, setIsLassoDragging] = useState(false);
  const lassoStartPos = useRef({ x: 0, y: 0 });

  // ZONE 8: Resizable Splitter States
  const [leftWidth, setLeftWidth] = useState(30); // 30%
  const [isResizing, setIsResizing] = useState(false);
  const resizableContainerRef = useRef<HTMLDivElement | null>(null);

  // ZONE 9: Keyboard Hotkeys States
  const [heldKeys, setHeldKeys] = useState<string[]>([]);
  const [hotkeyStatus, setHotkeyStatus] = useState("");


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

  // Context Menu Closer
  useEffect(() => {
    const closeMenu = () => setContextMenuVisible(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // Splitter Resizer MouseMove/MouseUp Effect
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = resizableContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(10, Math.min(90, (offsetX / rect.width) * 100));
        setLeftWidth(Math.round(percentage));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleDoubleClick = () => {
    setIsDoubleClicked((prev) => !prev);
  };

  // Context Menu Handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
    setContextMenuAction("");
  };

  const handleContextMenuAction = (actionName: string) => {
    setContextMenuAction(actionName);
    setContextMenuVisible(false);
  };

  // Lasso Multi-Select Drag Handlers
  const handleLassoMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    if (target.closest("[data-testid^='lasso-cell-']")) {
      return; 
    }

    const container = lassoContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    setIsLassoDragging(true);
    lassoStartPos.current = { x: clientX, y: clientY };
    setSelectedLassoCells([]);
    setLassoMarquee({
      left: clientX - rect.left,
      top: clientY - rect.top,
      width: 0,
      height: 0
    });
  };

  useEffect(() => {
    if (!isLassoDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const container = lassoContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const currentX = e.clientX;
      const currentY = e.clientY;

      const startX = lassoStartPos.current.x;
      const startY = lassoStartPos.current.y;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(startX - currentX);
      const height = Math.abs(startY - currentY);

      const relLeft = left - rect.left;
      const relTop = top - rect.top;

      setLassoMarquee({
        left: relLeft,
        top: relTop,
        width,
        height
      });

      const newSelected: number[] = [];
      for (let i = 1; i <= 6; i++) {
        const cell = container.querySelector(`[data-testid="lasso-cell-${i}"]`) as HTMLElement;
        if (cell) {
          const cellRect = cell.getBoundingClientRect();
          const cellLeft = cellRect.left - rect.left;
          const cellTop = cellRect.top - rect.top;
          const cellRight = cellLeft + cellRect.width;
          const cellBottom = cellTop + cellRect.height;

          const intersects = !(
            relLeft + width < cellLeft ||
            relLeft > cellRight ||
            relTop + height < cellTop ||
            relTop > cellBottom
          );

          if (intersects) {
            newSelected.push(i);
          }
        }
      }
      setSelectedLassoCells(newSelected);
    };

    const handleWindowMouseUp = () => {
      setIsLassoDragging(false);
      setLassoMarquee(null);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isLassoDragging]);


  // Keyboard Hotkeys Handlers
  const handleHotkeyKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const active: string[] = [];
    if (e.ctrlKey) active.push("Control");
    if (e.shiftKey) active.push("Shift");
    if (e.altKey) active.push("Alt");
    if (e.metaKey) active.push("Meta");
    if (e.key && !["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
      active.push(e.key);
    }
    setHeldKeys(active);

    let handled = false;
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
      setHotkeyStatus("Progress Saved Successfully!");
      handled = true;
    }
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "k") {
      setHotkeyStatus("");
      handled = true;
    }
    if (e.key === "Escape") {
      setHotkeyStatus("Reset listener card state");
      handled = true;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleHotkeyKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const active: string[] = [];
    if (e.ctrlKey) active.push("Control");
    if (e.shiftKey) active.push("Shift");
    if (e.altKey) active.push("Alt");
    if (e.metaKey) active.push("Meta");
    setHeldKeys(active);
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

          {/* ZONE 6: Double-Click & Right-Click Custom Menu */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Custom Context Menu & Double-Click</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Double-click the box below to toggle its visual state, or right-click to reveal a custom context menu. Select options from the custom popup menu.
              </p>

              <div className="relative min-h-[140px] flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div
                  data-testid="context-menu-target"
                  onDoubleClick={handleDoubleClick}
                  onContextMenu={handleContextMenu}
                  className={`w-48 h-28 rounded-xl border flex flex-col items-center justify-center text-center p-4 transition-all select-none cursor-pointer ${
                    isDoubleClicked
                      ? "bg-indigo-650 border-indigo-700 text-white shadow-md shadow-indigo-500/20"
                      : "bg-white border-slate-250 text-slate-700 hover:bg-slate-100/50"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wide">Target Box</span>
                  <span className="text-[9px] opacity-75 mt-1">Dbl-Click or Right-Click</span>
                </div>

                {contextMenuAction && (
                  <p data-testid="context-action-msg" className="text-xs font-bold text-center text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mt-4 w-full">
                    🎉 Action Triggered: {contextMenuAction}
                  </p>
                )}

                {/* Custom Context Menu Popup */}
                {contextMenuVisible && (
                  <div
                    data-testid="context-menu-popup"
                    style={{ top: `${contextMenuPos.y}px`, left: `${contextMenuPos.x}px` }}
                    className="fixed z-50 w-36 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg flex flex-col gap-0.5"
                  >
                    <button
                      type="button"
                      data-testid="context-menu-item-edit"
                      onClick={() => handleContextMenuAction("Edit")}
                      className="w-full text-left rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-650 transition-colors cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      data-testid="context-menu-item-copy"
                      onClick={() => handleContextMenuAction("Copy")}
                      className="w-full text-left rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-650 transition-colors cursor-pointer"
                    >
                      📋 Copy
                    </button>
                    <button
                      type="button"
                      data-testid="context-menu-item-delete"
                      onClick={() => handleContextMenuAction("Delete")}
                      className="w-full text-left rounded px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 7: Mouse-Drag Lasso Multi-Select */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Mouse-Drag Lasso Multi-Select</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Click and drag in the empty space of the grid below to draw a marquee selector. Any cells that intersect the marquee will be selected simultaneously.
              </p>

              <div
                ref={lassoContainerRef}
                onMouseDown={handleLassoMouseDown}
                data-testid="lasso-container"
                className="relative w-full rounded-xl bg-slate-50 border border-slate-200 p-6 select-none min-h-[220px]"
              >
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const isSelected = selectedLassoCells.includes(num);
                    return (
                      <div
                        key={num}
                        data-testid={`lasso-cell-${num}`}
                        className={`h-20 rounded-lg border flex flex-col items-center justify-center font-bold text-sm transition-all ${
                          isSelected
                            ? "bg-indigo-650 border-indigo-700 text-white shadow-md shadow-indigo-500/20"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        Cell {num}
                      </div>
                    );
                  })}
                </div>

                {lassoMarquee && (
                  <div
                    data-testid="lasso-marquee"
                    style={{
                      position: "absolute",
                      left: `${lassoMarquee.left}px`,
                      top: `${lassoMarquee.top}px`,
                      width: `${lassoMarquee.width}px`,
                      height: `${lassoMarquee.height}px`,
                      border: "1.5px dashed #4f46e5",
                      backgroundColor: "rgba(79, 70, 229, 0.12)",
                      pointerEvents: "none",
                      zIndex: 10
                    }}
                  />
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-slate-500 font-semibold">
                  Selected Cells Count: <span data-testid="lasso-selected-count" className="text-slate-800 font-bold font-mono">{selectedLassoCells.length}</span>
                </span>
                {selectedLassoCells.length > 0 && (
                  <button
                    type="button"
                    data-testid="lasso-reset-btn"
                    onClick={() => setSelectedLassoCells([])}
                    className="text-xs font-semibold text-indigo-650 hover:text-indigo-550 underline cursor-pointer"
                  >
                    Reset Grid
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 8: Resizable Panel Splitter */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Resizable Drag Splitter</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Drag the vertical splitter bar left or right to change the split ratio between the sidebar pane and content pane.
              </p>

              <div 
                ref={resizableContainerRef}
                data-testid="resizable-container"
                className="relative flex border border-slate-200 rounded-xl h-36 overflow-hidden bg-slate-50 select-none"
              >
                {/* Left pane */}
                <div 
                  data-testid="resizable-left-pane"
                  style={{ width: `${leftWidth}%` }}
                  className="bg-slate-100 border-r border-slate-200 flex flex-col items-center justify-center p-2 truncate"
                >
                  <span className="text-xs font-bold text-slate-700">Sidebar</span>
                  <span data-testid="resizable-left-width-display" className="text-[10px] font-mono text-indigo-655 font-bold mt-1">
                    Width: {leftWidth}%
                  </span>
                </div>

                {/* Splitter bar handle */}
                <div 
                  data-testid="resizable-splitter"
                  onMouseDown={() => setIsResizing(true)}
                  className={`w-2.5 cursor-col-resize hover:bg-indigo-500 active:bg-indigo-600 transition-colors flex items-center justify-center relative z-10 ${
                    isResizing ? "bg-indigo-500" : "bg-slate-300"
                  }`}
                >
                  <div className="w-0.5 h-6 bg-white opacity-60 rounded" />
                </div>

                {/* Right pane */}
                <div 
                  data-testid="resizable-right-pane"
                  className="flex-1 bg-white flex flex-col items-center justify-center p-4 truncate"
                >
                  <span className="text-xs font-bold text-slate-800">Content Workspace</span>
                  <span className="text-[10px] text-slate-450 mt-1">Width: {100 - leftWidth}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 9: Keyboard Hotkeys Listener */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-250 font-bold text-sm">
                  9
                </span>
                <h2 className="text-xl font-bold text-slate-900">Keyboard Shortcuts (Multi-Key Hotkeys)</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Click inside the card below to focus it, then test key combinations:
                <br />
                - <kbd className="px-1 bg-slate-100 border rounded font-mono text-xs">Ctrl + Shift + S</kbd> to save.
                <br />
                - <kbd className="px-1 bg-slate-100 border rounded font-mono text-xs">Ctrl + Alt + K</kbd> to clear history.
                <br />
                - <kbd className="px-1 bg-slate-100 border rounded font-mono text-xs">Escape</kbd> to reset.
              </p>

              <div 
                tabIndex={0}
                data-testid="hotkey-listener-card"
                onKeyDown={handleHotkeyKeyDown}
                onKeyUp={handleHotkeyKeyUp}
                className="max-w-md mx-auto rounded-xl bg-slate-50 hover:bg-slate-100/50 border border-slate-200 p-6 space-y-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
              >
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Click here to capture keystrokes
                  </span>
                </div>

                {/* Pressed keys */}
                <div className="flex justify-center items-center gap-1.5 min-h-[32px]">
                  {heldKeys.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">No active keys pressed</span>
                  ) : (
                    heldKeys.map((k) => (
                      <kbd 
                        key={k} 
                        data-testid="hotkey-active-keys"
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold font-mono text-amber-400 shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))
                  )}
                </div>

                {hotkeyStatus && (
                  <div 
                    data-testid="hotkey-status-msg"
                    className="text-xs text-center text-emerald-800 bg-emerald-50 border border-emerald-250 rounded-lg p-2 font-semibold"
                  >
                    {hotkeyStatus}
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
