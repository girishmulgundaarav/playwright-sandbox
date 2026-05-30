"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

interface Employee {
  id: number;
  name: string;
  role: string;
  status: string;
}

const initialEmployees: Employee[] = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", status: "Active" },
  { id: 2, name: "Bob Smith", role: "Product Manager", status: "Active" },
  { id: 3, name: "Charlie Brown", role: "QA Lead", status: "Active" },
  { id: 4, name: "Diana Prince", role: "UX Designer", status: "Inactive" },
  { id: 5, name: "Ethan Hunt", role: "DevOps Engineer", status: "Active" },
  { id: 6, name: "Fiona Gallagher", role: "HR Specialist", status: "On Leave" },
  { id: 7, name: "George Clark", role: "Database Admin", status: "Active" },
  { id: 8, name: "Hannah Abbott", role: "Security Analyst", status: "Active" },
  { id: 9, name: "Ian Malcolm", role: "Data Scientist", status: "Inactive" },
  { id: 10, name: "Julia Roberts", role: "Marketing Director", status: "Active" },
  { id: 11, name: "Kevin Bacon", role: "Support Lead", status: "On Leave" },
  { id: 12, name: "Laura Croft", role: "Penetration Tester", status: "Active" },
  { id: 13, name: "Michael Scott", role: "Branch Manager", status: "Inactive" },
  { id: 14, name: "Nancy Drew", role: "Investigator", status: "Active" },
  { id: 15, name: "Oscar Martinez", role: "Accountant", status: "Active" },
];

export default function TablesPage() {
  // Table States
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<"name" | "role" | "status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  // Sync indeterminate state for master checkbox
  useEffect(() => {
    if (masterCheckboxRef.current) {
      const totalCount = initialEmployees.length;
      const selectedCount = selectedIds.length;
      masterCheckboxRef.current.indeterminate = selectedCount > 0 && selectedCount < totalCount;
    }
  }, [selectedIds]);

  // Handle Sort Toggle
  const handleSort = (column: "name" | "role" | "status") => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    // Return to first page when sort filter changes
    setCurrentPage(1);
  };

  // Sort Entire Dataset
  const sortedEmployees = [...initialEmployees].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn].toLowerCase();
    const valB = b[sortColumn].toLowerCase();
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const rowsPerPage = 5;
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + rowsPerPage);

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(initialEmployees.map((emp) => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle Individual Selection
  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const isAllSelected = selectedIds.length === initialEmployees.length;

  return (
    <div
      data-testid="tables-page"
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
        <div className="border-b border-slate-250 pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Tables & Data Grids
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Practice paginating data, sorting columns alphabetically, and handling bulk row selections.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600">
            Selected: <span className="text-indigo-600 font-mono font-bold">{selectedIds.length}</span> / {initialEmployees.length}
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="p-5 w-12 text-center">
                    <input
                      type="checkbox"
                      ref={masterCheckboxRef}
                      data-testid="master-checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                  </th>
                  <th className="p-5">
                    <button
                      onClick={() => handleSort("name")}
                      data-testid="header-name"
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer group uppercase font-semibold text-xs tracking-wider"
                    >
                      Name
                      <span className="text-indigo-600 font-mono">
                        {sortColumn === "name" ? (sortDirection === "asc" ? " ▲" : " ▼") : " ↕"}
                      </span>
                    </button>
                  </th>
                  <th className="p-5">
                    <button
                      onClick={() => handleSort("role")}
                      data-testid="header-role"
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer group uppercase font-semibold text-xs tracking-wider"
                    >
                      Role
                      <span className="text-indigo-600 font-mono">
                        {sortColumn === "role" ? (sortDirection === "asc" ? " ▲" : " ▼") : " ↕"}
                      </span>
                    </button>
                  </th>
                  <th className="p-5">
                    <button
                      onClick={() => handleSort("status")}
                      data-testid="header-status"
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer group uppercase font-semibold text-xs tracking-wider"
                    >
                      Status
                      <span className="text-indigo-600 font-mono">
                        {sortColumn === "status" ? (sortDirection === "asc" ? " ▲" : " ▼") : " ↕"}
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {paginatedEmployees.map((emp) => {
                  const isChecked = selectedIds.includes(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-slate-50/50 transition-colors ${isChecked ? "bg-indigo-50/20" : ""}`}
                    >
                      <td className="p-5 text-center">
                        <input
                          type="checkbox"
                          data-testid={`row-checkbox-${emp.id}`}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(emp.id, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-5 font-semibold text-slate-900 whitespace-nowrap">{emp.name}</td>
                      <td className="p-5 text-slate-500">{emp.role}</td>
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            emp.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10"
                              : emp.status === "Inactive"
                              ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10"
                              : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              emp.status === "Active"
                                ? "bg-emerald-500"
                                : emp.status === "Inactive"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <span
              data-testid="page-indicator"
              className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                data-testid="prev-page-btn"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-350 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                data-testid="next-page-btn"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-350 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
