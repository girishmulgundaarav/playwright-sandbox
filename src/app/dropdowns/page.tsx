"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function DropdownsPage() {
  // VARIANT 1: Standard Select State
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // VARIANT 2: Searchable Combobox State
  const languages = [
    "JavaScript", "TypeScript", "Python", "Java", "C++",
    "C#", "Go", "Rust", "Ruby", "Swift", "PHP"
  ];
  const [comboSearch, setComboSearch] = useState("");
  const [comboSelected, setComboSelected] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);

  // VARIANT 3: Multiple Selection State
  const technologies = [
    "React", "Vue", "Angular", "Next.js", "Svelte",
    "Nuxt.js", "Tailwind CSS", "Playwright", "Cypress", "Jest"
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [multiOpen, setMultiOpen] = useState(false);
  const multiRef = useRef<HTMLDivElement>(null);

  // VARIANT 4: Dependent Dropdown State
  const stateCities: Record<string, string[]> = {
    USA: ["New York", "California", "Texas"],
    Canada: ["Toronto", "Vancouver", "Montreal"],
  };
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Close custom overlays on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setComboOpen(false);
      }
      if (multiRef.current && !multiRef.current.contains(e.target as Node)) {
        setMultiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Search filter for combobox
  const filteredLanguages = languages.filter((lang) =>
    lang.toLowerCase().includes(comboSearch.toLowerCase())
  );

  const handleSelectLanguage = (lang: string) => {
    setComboSelected(lang);
    setComboSearch(lang);
    setComboOpen(false);
  };

  // Toggle tag selection
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleRemoveTag = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity(""); // Reset city choice on state switch
  };

  return (
    <div
      data-testid="dropdowns-page"
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
            Multi-Type Dropdowns
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice interacting with different dropdown strategies: standard select tags, searchable input comboboxes, checkbox multi-selectors, and parent-dependent pickers.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* VARIANT 1: Standard Select Dropdown */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Standard HTML Select</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                A native select dropdown containing a list of countries. Direct targeting by index, value, or label.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label htmlFor="country" className="block text-xs font-semibold text-slate-605 uppercase tracking-wider mb-2">Select Country</label>
                  <select
                    id="country"
                    data-testid="standard-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                  >
                    <option value="" disabled>-- Select a Country --</option>
                    <option value="usa" data-testid="standard-option-usa">United States</option>
                    <option value="canada" data-testid="standard-option-canada">Canada</option>
                    <option value="uk" data-testid="standard-option-uk">United Kingdom</option>
                    <option value="japan" data-testid="standard-option-japan">Japan</option>
                    <option value="australia" data-testid="standard-option-australia">Australia</option>
                  </select>
                </div>

                {selectedCountry && (
                  <div className="text-xs text-slate-500">
                    Selected code: <span data-testid="selected-country-display" className="font-mono font-bold text-indigo-650">{selectedCountry}</span>
                  </div>
                )}

                {/* Standard HTML Multi-Select */}
                <div className="pt-4 border-t border-slate-200">
                  <label htmlFor="colors" className="block text-xs font-semibold text-slate-605 uppercase tracking-wider mb-2">Select Colors (Multi-Select)</label>
                  <select
                    multiple
                    id="colors"
                    data-testid="standard-multi-select"
                    value={selectedColors}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions).map(o => o.value);
                      setSelectedColors(options);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer min-h-[100px]"
                  >
                    <option value="red" data-testid="color-option-red">Red</option>
                    <option value="blue" data-testid="color-option-blue">Blue</option>
                    <option value="yellow" data-testid="color-option-yellow">Yellow</option>
                    <option value="green" data-testid="color-option-green">Green</option>
                  </select>
                  {selectedColors.length > 0 && (
                    <div className="mt-2 text-xs text-slate-550">
                      Selected: <span data-testid="selected-colors-display" className="font-mono font-bold text-indigo-650">{selectedColors.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* VARIANT 2: Searchable Combobox */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Searchable Combobox</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                A custom input combobox. Type a query to dynamically filter the option div elements rendered inside the scroll list.
              </p>

              <div ref={comboRef} className="relative rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-605 uppercase tracking-wider mb-2">Favorite Language</label>
                  <div className="relative">
                    <input
                      type="text"
                      data-testid="combobox-input"
                      value={comboSearch}
                      onChange={(e) => {
                        setComboSearch(e.target.value);
                        setComboOpen(true);
                      }}
                      onFocus={() => setComboOpen(true)}
                      placeholder="Type to search..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setComboOpen(!comboOpen)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Combobox scroll list */}
                {comboOpen && (
                  <div
                    data-testid="combobox-list"
                    className="absolute left-6 right-6 top-[76px] z-30 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg space-y-0.5 scrollbar-thin"
                  >
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((lang) => (
                        <div
                          key={lang}
                          data-testid={`combobox-option-${lang.toLowerCase()}`}
                          onClick={() => handleSelectLanguage(lang)}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {lang}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-xs text-slate-400 py-3 font-semibold">No matches found</div>
                    )}
                  </div>
                )}

                {comboSelected && (
                  <div className="text-xs text-slate-500">
                    Selected value: <span className="font-mono font-bold text-indigo-650">{comboSelected}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* VARIANT 3: Multiple Selection Dropdown */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-50 text-pink-650 border border-pink-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Multiple Selection</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Select multiple tags from a dropdown checklist. Selected items appear as tag pills that can also be deselected.
              </p>

              <div ref={multiRef} className="relative rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-605 uppercase tracking-wider mb-2">Technologies Used</label>
                  <div
                    data-testid="multi-select-trigger"
                    onClick={() => setMultiOpen(!multiOpen)}
                    className="w-full min-h-[42px] flex flex-wrap gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 cursor-pointer hover:border-slate-400 transition-colors"
                  >
                    {selectedTags.length > 0 ? (
                      selectedTags.map((tag) => (
                        <span
                          key={tag}
                          data-testid={`multi-select-pill-${tag.toLowerCase()}`}
                          className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-150 px-2 py-0.5 text-xs font-semibold text-indigo-700"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveTag(e, tag)}
                            className="hover:text-red-600 text-indigo-500 font-bold transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 select-none">Choose technologies...</span>
                    )}
                  </div>
                </div>

                {/* Checklist Dropdown Overlay */}
                {multiOpen && (
                  <div
                    data-testid="multi-select-list"
                    className="absolute left-6 right-6 top-[76px] z-30 max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg space-y-0.5 scrollbar-thin"
                  >
                    {technologies.map((tech) => {
                      const isSelected = selectedTags.includes(tech);
                      return (
                        <div
                          key={tech}
                          data-testid={`multi-select-option-${tech.toLowerCase()}`}
                          onClick={() => handleToggleTag(tech)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-3.5 w-3.5 rounded border-slate-300 bg-white text-indigo-600 focus:ring-0 focus:ring-offset-0 pointer-events-none"
                          />
                          {tech}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* VARIANT 4: Dependent Dropdown */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-650 border border-emerald-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Dependent Dropdown</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Selecting a country (State/Region) enables the City dropdown and populates it with matching local cities.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-605 uppercase tracking-wider mb-2">State / Country</label>
                    <select
                      data-testid="dependent-state-select"
                      value={selectedState}
                      onChange={handleStateChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
                    >
                      <option value="">-- Choose Country --</option>
                      <option value="USA" data-testid="state-option-USA">United States</option>
                      <option value="Canada" data-testid="state-option-Canada">Canada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-605 uppercase tracking-wider mb-2">City</label>
                    <select
                      data-testid="dependent-city-select"
                      value={selectedCity}
                      disabled={!selectedState}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                    >
                      <option value="">-- Choose City --</option>
                      {selectedState &&
                        stateCities[selectedState].map((city) => (
                          <option key={city} value={city} data-testid={`city-option-${city.replace(/\s+/g, "")}`}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {selectedState && selectedCity && (
                  <div className="text-xs text-slate-500">
                    Location selected: <span className="font-semibold text-indigo-650">{selectedCity}, {selectedState}</span>
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
