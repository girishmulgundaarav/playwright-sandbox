"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

interface Product {
  name: string;
  price: number;
}

export default function DropdownsPage() {
  // ----------------------------------------------------
  // SECTION 1: STANDARD ELEMENTS (dropdown-1.md)
  // ----------------------------------------------------

  // 1. Standard HTML Select (#country)
  const [selectedCountry, setSelectedCountry] = useState("");

  // 2. Multi-Select Dropdown (#colors)
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const handleColorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedColors(values);
  };
  const clearColors = () => {
    setSelectedColors([]);
  };

  // 3. Alphabetical Sorting Auditor (#animals)
  const [selectedAnimal, setSelectedAnimal] = useState("");

  // 4. Storefront Product Sorting
  const initialProducts: Product[] = [
    { name: "iPhone SE", price: 399 },
    { name: "iPhone 12", price: 699 },
    { name: "iPhone 13 Pro", price: 999 },
    { name: "iPhone 14 Pro Max", price: 1199 },
  ];
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    let sorted = [...initialProducts];
    if (sortBy === "lowesttopriced") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highesttopriced") {
      sorted.sort((a, b) => b.price - a.price);
    }
    setProducts(sorted);
  }, [sortBy]);


  // ----------------------------------------------------
  // SECTION 2: CUSTOM & DYNAMIC COMPONENTS (dropdown-2.md)
  // ----------------------------------------------------

  // 5. Custom Accessible Select (role="combobox")
  const [customSelected, setCustomSelected] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const customRef = useRef<HTMLDivElement>(null);

  // 6. Keyboard-Driven Auto-suggest (Employee Name)
  const allEmployees = ["John Doe", "John Smith", "Johnny Cash", "Johnson Baby", "Jane Doe", "Bob Vance"];
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [employeeSelected, setEmployeeSelected] = useState("");
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const employeeRef = useRef<HTMLDivElement>(null);

  const filteredEmployees = allEmployees.filter((emp) =>
    emp.toLowerCase().includes(employeeQuery.toLowerCase())
  );

  const handleSelectEmployee = (emp: string) => {
    setEmployeeSelected(emp);
    setEmployeeQuery(emp);
    setEmployeeOpen(false);
    setFocusedIndex(-1);
  };

  const handleEmployeeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!employeeOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setEmployeeOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredEmployees.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredEmployees.length) % filteredEmployees.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredEmployees.length) {
        handleSelectEmployee(filteredEmployees[focusedIndex]);
      }
    } else if (e.key === "Escape") {
      setEmployeeOpen(false);
      setFocusedIndex(-1);
    }
  };

  // 7. Bootstrap Checkbox Dropdown (Lab A)
  const bootstrapOptions = ["HTML", "CSS", "Java", "Angular", "React"];
  const [bootstrapSelected, setBootstrapSelected] = useState<string[]>([]);
  const [bootstrapOpen, setBootstrapOpen] = useState(false);
  const bootstrapRef = useRef<HTMLDivElement>(null);

  const handleToggleBootstrap = (opt: string) => {
    setBootstrapSelected((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  // 8. Flight/Bus Autocomplete Suggestions (Lab B - RedBus style)
  const allDestinations = ["Delhi", "Delhi Airport", "Delhi Cantt", "Mumbai", "Bangalore"];
  const [travelQuery, setTravelQuery] = useState("");
  const [travelSelected, setTravelSelected] = useState("");
  const [travelOpen, setTravelOpen] = useState(false);
  const travelRef = useRef<HTMLDivElement>(null);

  const filteredDestinations = allDestinations.filter((dest) =>
    dest.toLowerCase().includes(travelQuery.toLowerCase())
  );

  const handleSelectTravel = (dest: string) => {
    setTravelSelected(dest);
    setTravelQuery(dest);
    setTravelOpen(false);
  };

  // 9. Hidden Dynamic Dropdown (Lab C - OrangeHRM style)
  const empStatuses = ["Full-Time Permanent", "Full-Time Temporary", "Part-Time Internship", "Freelance"];
  const [empStatusSelected, setEmpStatusSelected] = useState("");
  const [empStatusOpen, setEmpStatusOpen] = useState(false);
  const empStatusRef = useRef<HTMLDivElement>(null);

  // Close custom overlays on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (customRef.current && !customRef.current.contains(target)) {
        setCustomOpen(false);
      }
      if (employeeRef.current && !employeeRef.current.contains(target)) {
        setEmployeeOpen(false);
      }
      if (bootstrapRef.current && !bootstrapRef.current.contains(target)) {
        setBootstrapOpen(false);
      }
      if (travelRef.current && !travelRef.current.contains(target)) {
        setTravelOpen(false);
      }
      if (empStatusRef.current && !empStatusRef.current.contains(target)) {
        setEmpStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      data-testid="dropdowns-page"
      className="flex-1 bg-slate-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
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
            Interactive Dropdowns Sandbox
          </h1>
          <p className="mt-4 text-base text-slate-600">
            A comprehensive, high-fidelity playground to practice standard select elements, custom accessible comboboxes, auto-suggestions, keyboard navigation, and hidden dropdowns.
          </p>
        </div>

        {/* ====================================================================================== */}
        {/* SECTION 1: STANDARD ELEMENTS */}
        {/* ====================================================================================== */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
              I
            </span>
            Dropdowns - Part 1: Standard Elements
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Standard HTML Select */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">1. Standard HTML Select</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Native <code>&lt;select&gt;</code> element. Targetable by value, visible text, or index.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div>
                    <label htmlFor="country" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Country Select
                    </label>
                    <select
                      id="country"
                      data-testid="standard-select"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    >
                      <option value="">-- Choose Country --</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="au">Australia</option>
                      <option value="jp">Japan</option>
                    </select>
                  </div>

                  {selectedCountry && (
                    <div className="text-xs text-slate-500">
                      Selected Value: <span className="font-mono font-bold text-indigo-650">{selectedCountry}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 2. Multi-Select Dropdown */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">2. Multi-Select Dropdown</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Multiple select box. Use <code>selectOption([...])</code> to select or pass <code>[]</code> to clear.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div>
                    <label htmlFor="colors" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Favorite Colors
                    </label>
                    <select
                      id="colors"
                      multiple
                      value={selectedColors}
                      onChange={handleColorsChange}
                      className="w-full h-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    >
                      <option value="red_val">Red</option>
                      <option value="green_val">Green</option>
                      <option value="blue_val">Blue</option>
                      <option value="yellow_val">Yellow</option>
                      <option value="orange_val">Orange</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-550">
                      Selected count: <span className="font-bold text-indigo-650">{selectedColors.length}</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearColors}
                      className="text-xs font-semibold text-red-600 hover:text-red-750 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {selectedColors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedColors.map((col) => (
                        <span
                          key={col}
                          className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Alphabetical Sorting Auditor */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">3. Alphabetical Auditor</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Standard dropdown containing a pre-sorted list of animals. Used for sorting validation.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div>
                    <label htmlFor="animals" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Animals List
                    </label>
                    <select
                      id="animals"
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    >
                      <option value="">-- Choose Animal --</option>
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                      <option value="elephant">Elephant</option>
                      <option value="giraffe">Giraffe</option>
                      <option value="zebra">Zebra</option>
                    </select>
                  </div>

                  {selectedAnimal && (
                    <div className="text-xs text-slate-500">
                      Selected Animal: <span className="font-semibold text-slate-800 capitalize">{selectedAnimal}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* 4. Mini Storefront (Sorting Assignment) */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">4. Storefront Product Sorting (Hands-on Lab)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select sorting direction and verify items are displayed in correct price order.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 min-w-[200px]">
                <label htmlFor="sort-select" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Order by
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                >
                  <option value="">-- Sort Products --</option>
                  <option value="lowesttopriced">Lowest to highest</option>
                  <option value="highesttopriced">Highest to lowest</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {products.map((prod) => (
                <div
                  key={prod.name}
                  className="rounded-xl border border-slate-150 bg-slate-50/50 p-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-850 block mb-2">{prod.name}</span>
                  <span className="text-base font-bold text-slate-900">${prod.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================================== */}
        {/* SECTION 2: CUSTOM & DYNAMIC COMPONENTS */}
        {/* ====================================================================================== */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold text-sm">
              II
            </span>
            Dropdowns - Part 2: Custom & Dynamic Components
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* 5. Custom Accessible Select */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">5. Custom ARIA Combobox</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Uses accessible ARIA roles (<code>combobox</code>, <code>listbox</code>, <code>option</code>) instead of native selects.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div ref={customRef} className="relative">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Select Language
                    </label>

                    <button
                      id="select-btn"
                      type="button"
                      role="combobox"
                      aria-expanded={customOpen}
                      aria-haspopup="listbox"
                      onClick={() => setCustomOpen(!customOpen)}
                      className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none hover:border-slate-400 transition-colors"
                    >
                      <span>{customSelected || "Select Language"}</span>
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {customOpen && (
                      <ul
                        role="listbox"
                        className="select-options-list absolute left-0 right-0 mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30 space-y-0.5"
                      >
                        {["TypeScript", "Python", "Rust", "Go"].map((lang) => (
                          <li
                            key={lang}
                            role="option"
                            aria-selected={customSelected === lang}
                            onClick={() => {
                              setCustomSelected(lang);
                              setCustomOpen(false);
                            }}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer select-none ${
                              customSelected === lang
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            {lang}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {customSelected && (
                    <div className="text-xs text-slate-505">
                      Confirmed choice: <span className="font-bold text-indigo-650">{customSelected}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 6. Keyboard-Driven Auto-suggest */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">6. Keyboard-Nav Combobox</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Searchable input supporting Arrow keys to navigate suggestions and Enter to select.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div ref={employeeRef} className="relative">
                    <label htmlFor="emp-search" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Employee Name
                    </label>

                    <input
                      id="emp-search"
                      type="text"
                      role="textbox"
                      aria-label="Employee Name"
                      value={employeeQuery}
                      onChange={(e) => {
                        setEmployeeQuery(e.target.value);
                        setEmployeeOpen(true);
                        setFocusedIndex(-1);
                      }}
                      onFocus={() => setEmployeeOpen(true)}
                      onKeyDown={handleEmployeeKeyDown}
                      placeholder="Type John..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />

                    {employeeOpen && filteredEmployees.length > 0 && (
                      <div className="oxd-autocomplete-dropdown absolute left-0 right-0 mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30 space-y-0.5">
                        {filteredEmployees.map((emp, index) => (
                          <div
                            key={emp}
                            onClick={() => handleSelectEmployee(emp)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer select-none ${
                              index === focusedIndex
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            {emp}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {employeeSelected && (
                    <div className="text-xs text-slate-505">
                      Selected Employee: <span className="font-bold text-indigo-650">{employeeSelected}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 7. Bootstrap Checkbox Dropdown */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">7. Bootstrap Checkbox Select</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Checkbox list dropdown structure. Emulates <code>button.multiselect</code> custom layout.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div ref={bootstrapRef} className="relative">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Choose Frameworks
                    </label>

                    <button
                      type="button"
                      onClick={() => setBootstrapOpen(!bootstrapOpen)}
                      className="multiselect w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none hover:border-slate-400 transition-colors"
                    >
                      <span className="truncate">
                        {bootstrapSelected.length > 0
                          ? bootstrapSelected.join(", ")
                          : "None selected"}
                      </span>
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {bootstrapOpen && (
                      <ul className="multiselect-container absolute left-0 right-0 mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30 space-y-0.5">
                        {bootstrapOptions.map((opt) => {
                          const isChecked = bootstrapSelected.includes(opt);
                          return (
                            <li key={opt} className="rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none">
                              <label className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-650 cursor-pointer w-full">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleBootstrap(opt)}
                                  className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                {opt}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Travel Autocomplete Suggestions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">8. Travel Autocomplete</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Asynchronous-style search for transit targets. Matches autocomplete suggestions via <code>.placeHolderText</code>.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div ref={travelRef} className="relative">
                    <label htmlFor="src" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Departure City
                    </label>

                    <input
                      id="src"
                      type="text"
                      value={travelQuery}
                      onChange={(e) => {
                        setTravelQuery(e.target.value);
                        setTravelOpen(true);
                      }}
                      onFocus={() => setTravelOpen(true)}
                      placeholder="Search departure..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />

                    {travelOpen && filteredDestinations.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30 space-y-0.5">
                        {filteredDestinations.map((dest) => (
                          <div
                            key={dest}
                            onClick={() => handleSelectTravel(dest)}
                            className="placeHolderText rounded-lg px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer select-none"
                          >
                            {dest}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {travelSelected && (
                    <div className="text-xs text-slate-505">
                      Selected Departure: <span className="font-bold text-indigo-650">{travelSelected}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 9. Hidden Dynamic Dropdown */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between md:col-span-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">9. Hidden Dynamic Select (OrangeHRM Style)</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Simulates a dropdown structure where option divs are dynamic and the trigger resides in a sibling container.
                </p>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                  <div ref={empStatusRef} className="space-y-2">
                    <div className="flex items-center">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Employment Status
                      </label>
                    </div>
                    <div>
                      {/* Sibling div container holding custom select target */}
                      <div
                        onClick={() => setEmpStatusOpen(!empStatusOpen)}
                        className="oxd-select-wrapper w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none hover:border-slate-400 transition-colors cursor-pointer"
                      >
                        <span className="select-none">{empStatusSelected || "-- Select --"}</span>
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {empStatusOpen && (
                      <div className="oxd-select-dropdown border border-slate-200 bg-white rounded-xl shadow-lg mt-1 p-1.5 space-y-0.5">
                        {empStatuses.map((status) => (
                          <div
                            key={status}
                            onClick={() => {
                              setEmpStatusSelected(status);
                              setEmpStatusOpen(false);
                            }}
                            className="oxd-select-option rounded-lg px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer select-none"
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
