"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

interface Employee {
  id: number;
  name: string;
  role: string;
  status: string;
  email: string;
  department: string;
  hireDate: string;
  salary: string;
}

interface FeedItem {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

interface ColumnConfig {
  key: keyof Employee;
  label: string;
}

const initialEmployees: Employee[] = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", status: "Active", email: "alice.johnson@company.com", department: "Engineering", hireDate: "2022-03-15", salary: "$95,000" },
  { id: 2, name: "Bob Smith", role: "Product Manager", status: "Active", email: "bob.smith@company.com", department: "Product", hireDate: "2021-06-10", salary: "$110,000" },
  { id: 3, name: "Charlie Brown", role: "QA Lead", status: "Active", email: "charlie.brown@company.com", department: "Quality Assurance", hireDate: "2023-01-20", salary: "$90,000" },
  { id: 4, name: "Diana Prince", role: "UX Designer", status: "Inactive", email: "diana.prince@company.com", department: "Design", hireDate: "2020-11-05", salary: "$88,000" },
  { id: 5, name: "Ethan Hunt", role: "DevOps Engineer", status: "Active", email: "ethan.hunt@company.com", department: "Engineering", hireDate: "2022-09-01", salary: "$105,000" },
  { id: 6, name: "Fiona Gallagher", role: "HR Specialist", status: "On Leave", email: "fiona.gallagher@company.com", department: "Human Resources", hireDate: "2023-05-18", salary: "$70,000" },
  { id: 7, name: "George Clark", role: "Database Admin", status: "Active", email: "george.clark@company.com", department: "Engineering", hireDate: "2021-08-12", salary: "$98,000" },
  { id: 8, name: "Hannah Abbott", role: "Security Analyst", status: "Active", email: "hannah.abbott@company.com", department: "Security", hireDate: "2022-11-30", salary: "$96,000" },
  { id: 9, name: "Ian Malcolm", role: "Data Scientist", status: "Inactive", email: "ian.malcolm@company.com", department: "Analytics", hireDate: "2021-02-28", salary: "$115,000" },
  { id: 10, name: "Julia Roberts", role: "Marketing Director", status: "Active", email: "julia.roberts@company.com", department: "Marketing", hireDate: "2020-04-15", salary: "$120,000" },
  { id: 11, name: "Kevin Bacon", role: "Support Lead", status: "On Leave", email: "kevin.bacon@company.com", department: "Customer Support", hireDate: "2023-07-22", salary: "$80,000" },
  { id: 12, name: "Laura Croft", role: "Penetration Tester", status: "Active", email: "lara.croft@company.com", department: "Security", hireDate: "2022-05-14", salary: "$102,000" },
  { id: 13, name: "Michael Scott", role: "Branch Manager", status: "Inactive", email: "michael.scott@company.com", department: "Management", hireDate: "2019-10-01", salary: "$85,000" },
  { id: 14, name: "Nancy Drew", role: "Investigator", status: "Active", email: "nancy.drew@company.com", department: "Security", hireDate: "2023-09-10", salary: "$89,000" },
  { id: 15, name: "Oscar Martinez", role: "Accountant", status: "Active", email: "oscar.martinez@company.com", department: "Finance", hireDate: "2021-01-15", salary: "$92,000" },
];

const allPossibleColumns: ColumnConfig[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
  { key: "salary", label: "Salary" },
];

const generateFeedItems = (count: number, startIndex: number): FeedItem[] => {
  const levels: Array<"INFO" | "WARN" | "ERROR"> = ["INFO", "WARN", "ERROR"];
  const templates = [
    "User logged in successfully",
    "API connection timeout detected",
    "Database backup completed",
    "Failed login attempt registered",
    "File uploaded: document.pdf",
    "Cache cleared manually",
    "Billing subscription renewed",
    "Worker process restarted",
  ];

  return Array.from({ length: count }).map((_, idx) => {
    const currentIdx = startIndex + idx;
    const lvl = levels[Math.floor(Math.random() * levels.length)];
    return {
      id: `feed-${currentIdx}-${Math.random().toString().slice(2, 6)}`,
      timestamp: new Date(Date.now() - currentIdx * 30000).toISOString().replace("T", " ").substring(0, 19),
      level: lvl,
      message: templates[Math.floor(Math.random() * templates.length)] + ` (ID: ${currentIdx})`,
    };
  });
};

export default function TablesPage() {
  // --- CHALLENGE A STATES ---
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<"name" | "role" | "status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    details: true,
    name: true,
    role: true,
    status: true,
    actions: true,
  });

  // Lag Simulation States
  const [isLagEnabled, setIsLagEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // CRUD Inline Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Employee>>({});

  // Add Employee Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState("Active");
  const [newEmail, setNewEmail] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newSalary, setNewSalary] = useState("$90,000");

  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  // --- CHALLENGE B STATES ---
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // --- CHALLENGE C STATES ---
  const [dynamicCols, setDynamicCols] = useState<ColumnConfig[]>([]);

  // Shuffles/Randomizes columns selection & order
  const randomizeColumns = () => {
    const shuffled = [...allPossibleColumns].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 4) + 4; // Select random size between 4 and 7
    setDynamicCols(shuffled.slice(0, count));
  };

  // Initialize page features
  useEffect(() => {
    setFeedItems(generateFeedItems(12, 1));
    randomizeColumns();
  }, []);

  // Sync indeterminate state for master checkbox
  useEffect(() => {
    if (masterCheckboxRef.current) {
      const totalCount = employees.length;
      const selectedCount = selectedIds.length;
      masterCheckboxRef.current.indeterminate = selectedCount > 0 && selectedCount < totalCount;
    }
  }, [selectedIds, employees]);

  // Lag Simulation Wrapper
  const runWithDelay = (action: () => void) => {
    if (isLagEnabled) {
      setIsLoading(true);
      setTimeout(() => {
        action();
        setIsLoading(false);
      }, 750);
    } else {
      action();
    }
  };

  // Handle Sort Toggle
  const handleSort = (column: "name" | "role" | "status") => {
    runWithDelay(() => {
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    });
  };

  // Filter Entire Dataset
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      emp.role.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  });

  // Sort Filtered Dataset
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn].toLowerCase();
    const valB = b[sortColumn].toLowerCase();
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const rowsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + rowsPerPage);

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(employees.map((emp) => emp.id));
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

  const isAllSelected = employees.length > 0 && selectedIds.length === employees.length;

  // Highlights searched query inside text
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-100 text-slate-900 rounded-sm px-0.5" data-testid="highlighted-text">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Inline CRUD Handlers
  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditForm(emp);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: number) => {
    runWithDelay(() => {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, ...editForm } as Employee : emp))
      );
      setEditingId(null);
      setEditForm({});
    });
  };

  const deleteRow = (id: number) => {
    runWithDelay(() => {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      setExpandedIds((prev) => prev.filter((x) => x !== id));
    });
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim() || !newEmail.trim()) return;

    runWithDelay(() => {
      const newId = Math.max(...employees.map((emp) => emp.id), 0) + 1;
      const newEmp: Employee = {
        id: newId,
        name: newName,
        role: newRole,
        status: newStatus,
        email: newEmail,
        department: newDept,
        hireDate: new Date().toISOString().split("T")[0],
        salary: newSalary,
      };

      setEmployees([newEmp, ...employees]);
      setShowAddForm(false);
      setNewName("");
      setNewRole("");
      setNewEmail("");
    });
  };

  const toggleRowExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // CSV Export Trigger
  const exportToCsv = () => {
    const headers = "ID,Name,Role,Status,Email,Department,Hire Date,Salary\n";
    const rows = filteredEmployees
      .map(
        (emp) =>
          `${emp.id},"${emp.name}","${emp.role}","${emp.status}","${emp.email}","${emp.department}","${emp.hireDate}","${emp.salary}"`
      )
      .join("\n");

    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employees.csv");
    link.setAttribute("data-testid", "csv-download-link");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Infinite Scroll Handler
  const handleFeedScroll = () => {
    const el = feedContainerRef.current;
    if (!el || isFeedLoading) return;

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 12) {
      setIsFeedLoading(true);
      setTimeout(() => {
        setFeedItems((prev) => [...prev, ...generateFeedItems(10, prev.length + 1)]);
        setIsFeedLoading(false);
      }, 750);
    }
  };

  const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

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
              Practice advanced automation: dynamic search highlighting, column hiding, inline edits (CRUD), expandable row details, simulated database lags, CSV file downloads, infinite scroll, and randomized dynamic columns.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 shadow-xs">
            Selected Rows: <span className="text-indigo-600 font-mono font-bold" data-testid="selected-count-badge">{selectedIds.length}</span> / {employees.length}
          </div>
        </div>

        {/* CONTROL PANEL SECTION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
                </svg>
              </span>
              <input
                type="text"
                data-testid="table-search-input"
                placeholder="Search name, role, email, or department..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
              />
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Lag Toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-655 hover:bg-slate-100/50 transition-colors">
                <input
                  type="checkbox"
                  data-testid="toggle-network-lag"
                  checked={isLagEnabled}
                  onChange={(e) => setIsLagEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
                />
                Simulate Network Lag
              </label>

              {/* Export Button */}
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={exportToCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export CSV
              </button>

              {/* Add Button */}
              <button
                type="button"
                data-testid="add-employee-btn"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-650 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-all shadow-xs"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Employee
              </button>
            </div>
          </div>

          {/* Add Employee Form Box */}
          {showAddForm && (
            <form onSubmit={handleAddEmployee} data-testid="add-employee-form" className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Employee</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    data-testid="add-emp-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    data-testid="add-emp-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Engineer"
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    data-testid="add-emp-email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. john@comp.com"
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Department</label>
                  <select
                    data-testid="add-emp-dept"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Quality Assurance">QA</option>
                    <option value="Security">Security</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-4">
                  <div>
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-655 cursor-pointer">
                      <input
                        type="radio"
                        name="add-emp-status"
                        checked={newStatus === "Active"}
                        onChange={() => setNewStatus("Active")}
                        className="text-indigo-650 focus:ring-indigo-500"
                      />
                      Active
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-655 cursor-pointer">
                      <input
                        type="radio"
                        name="add-emp-status"
                        checked={newStatus === "Inactive"}
                        onChange={() => setNewStatus("Inactive")}
                        className="text-indigo-650 focus:ring-indigo-500"
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3.5 py-1.5 text-xs border border-slate-200 hover:border-slate-300 rounded font-semibold text-slate-600 bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-testid="add-emp-submit"
                    className="px-3.5 py-1.5 text-xs bg-indigo-650 hover:bg-indigo-600 text-white rounded font-semibold"
                  >
                    Save Record
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Columns Visibility Selector */}
          <div className="border-t border-slate-150 pt-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-3">Visible Columns</h4>
            <div className="flex flex-wrap gap-4">
              {Object.keys(visibleColumns).map((col) => (
                <label key={col} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    data-testid={`column-toggle-${col}`}
                    checked={visibleColumns[col as keyof typeof visibleColumns]}
                    onChange={(e) =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [col]: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="capitalize">{col === "checkbox" ? "Selector" : col}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* CHALLENGE A: MASTER GRID TABLE */}
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden mb-16">
          
          {/* Server loader lag overlay */}
          {isLoading && (
            <div data-testid="table-loading-overlay" className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-indigo-655" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 animate-pulse">Querying DB...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-650 uppercase tracking-wider select-none">
                  {visibleColumns.checkbox && (
                    <th className="p-5 w-12 text-center">
                      <input
                        type="checkbox"
                        ref={masterCheckboxRef}
                        data-testid="master-checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-655 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      />
                    </th>
                  )}
                  {visibleColumns.details && <th className="p-5 w-10"></th>}
                  
                  {visibleColumns.name && (
                    <th className="p-5">
                      <button
                        onClick={() => handleSort("name")}
                        data-testid="header-name"
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer uppercase font-bold tracking-wider"
                      >
                        Name
                        <span className="text-indigo-600 font-mono text-[9px]">
                          {sortColumn === "name" ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    </th>
                  )}

                  {visibleColumns.role && (
                    <th className="p-5">
                      <button
                        onClick={() => handleSort("role")}
                        data-testid="header-role"
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer uppercase font-bold tracking-wider"
                      >
                        Role
                        <span className="text-indigo-600 font-mono text-[9px]">
                          {sortColumn === "role" ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    </th>
                  )}

                  {visibleColumns.status && (
                    <th className="p-5">
                      <button
                        onClick={() => handleSort("status")}
                        data-testid="header-status"
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer uppercase font-bold tracking-wider"
                      >
                        Status
                        <span className="text-indigo-600 font-mono text-[9px]">
                          {sortColumn === "status" ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    </th>
                  )}

                  {visibleColumns.actions && <th className="p-5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm text-slate-700">
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={visibleCount} className="p-10 text-center text-xs text-slate-450 italic">
                      No records matched the filter terms.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => {
                    const isChecked = selectedIds.includes(emp.id);
                    const isEditing = editingId === emp.id;
                    const isExpanded = expandedIds.includes(emp.id);

                    return (
                      <React.Fragment key={emp.id}>
                        <tr
                          data-testid={`employee-row-${emp.id}`}
                          className={`hover:bg-slate-50/50 transition-colors ${isChecked ? "bg-indigo-50/15" : ""}`}
                        >
                          {/* Selection Checkbox Cell */}
                          {visibleColumns.checkbox && (
                            <td className="p-5 text-center">
                              <input
                                type="checkbox"
                                data-testid={`row-checkbox-${emp.id}`}
                                checked={isChecked}
                                onChange={(e) => handleSelectRow(emp.id, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                              />
                            </td>
                          )}

                          {/* Row Expander Cell */}
                          {visibleColumns.details && (
                            <td className="p-5 text-center">
                              <button
                                type="button"
                                data-testid={`row-expand-btn-${emp.id}`}
                                onClick={() => toggleRowExpand(emp.id)}
                                className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-transform duration-200"
                                style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                                aria-label="Expand row details"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                              </button>
                            </td>
                          )}

                          {/* Name Cell */}
                          {visibleColumns.name && (
                            <td className="p-5 font-semibold text-slate-900 whitespace-nowrap">
                              {isEditing ? (
                                <input
                                  type="text"
                                  data-testid={`edit-name-input-${emp.id}`}
                                  value={editForm.name || ""}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                                />
                              ) : (
                                highlightText(emp.name, searchTerm)
                              )}
                            </td>
                          )}

                          {/* Role Cell */}
                          {visibleColumns.role && (
                            <td className="p-5 text-slate-500 whitespace-nowrap">
                              {isEditing ? (
                                <input
                                  type="text"
                                  data-testid={`edit-role-input-${emp.id}`}
                                  value={editForm.role || ""}
                                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                  className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                                />
                              ) : (
                                highlightText(emp.role, searchTerm)
                              )}
                            </td>
                          )}

                          {/* Status Cell */}
                          {visibleColumns.status && (
                            <td className="p-5">
                              {isEditing ? (
                                <select
                                  data-testid={`edit-status-select-${emp.id}`}
                                  value={editForm.status || "Active"}
                                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-white outline-none focus:border-indigo-500"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                  <option value="On Leave">On Leave</option>
                                </select>
                              ) : (
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
                              )}
                            </td>
                          )}

                          {/* Actions buttons cell */}
                          {visibleColumns.actions && (
                            <td className="p-5 text-right whitespace-nowrap">
                              {isEditing ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    data-testid={`edit-save-${emp.id}`}
                                    onClick={() => saveEdit(emp.id)}
                                    className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100 font-semibold"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    data-testid={`edit-cancel-${emp.id}`}
                                    onClick={cancelEdit}
                                    className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 font-semibold"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    data-testid={`edit-btn-${emp.id}`}
                                    onClick={() => startEdit(emp)}
                                    className="px-2.5 py-1 text-xs rounded border border-slate-200 text-slate-650 hover:text-indigo-650 hover:bg-slate-50 hover:border-slate-350 transition-colors font-semibold"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    data-testid={`delete-btn-${emp.id}`}
                                    onClick={() => deleteRow(emp.id)}
                                    className="px-2.5 py-1 text-xs rounded border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors font-semibold"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>

                        {/* Expandable subdetails row */}
                        {isExpanded && (
                          <tr data-testid={`expanded-row-${emp.id}`} className="bg-slate-50/50">
                            <td colSpan={visibleCount} className="p-5">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs p-2">
                                <div>
                                  <span className="block font-bold text-slate-400 uppercase tracking-wide text-[9px] mb-1">Email Address</span>
                                  <span className="font-semibold text-slate-800" data-testid={`detail-email-${emp.id}`}>{emp.email}</span>
                                </div>
                                <div>
                                  <span className="block font-bold text-slate-400 uppercase tracking-wide text-[9px] mb-1">Department</span>
                                  <span className="font-semibold text-slate-800" data-testid={`detail-dept-${emp.id}`}>{highlightText(emp.department, searchTerm)}</span>
                                </div>
                                <div>
                                  <span className="block font-bold text-slate-400 uppercase tracking-wide text-[9px] mb-1">Hire Date</span>
                                  <span className="font-semibold text-slate-800" data-testid={`detail-date-${emp.id}`}>{emp.hireDate}</span>
                                </div>
                                <div>
                                  <span className="block font-bold text-slate-400 uppercase tracking-wide text-[9px] mb-1">Salary</span>
                                  <span className="font-semibold text-slate-800" data-testid={`detail-salary-${emp.id}`}>{emp.salary}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between select-none">
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

        {/* CHALLENGE B: INFINITE SCROLL FEED CONTAINER */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs p-8 relative overflow-hidden mb-16">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Infinite Scrolling Logs Feed</h2>
              <p className="text-xs text-slate-500 mt-1">Scroll inside the container below. Reaching the bottom lazy-loads new log entries dynamically.</p>
            </div>
            <span className="bg-indigo-50 border border-indigo-150 rounded px-2 py-0.5 text-xs text-indigo-650 font-semibold font-mono">
              Total Log Entries: <span data-testid="log-count">{feedItems.length}</span>
            </span>
          </div>

          <div
            ref={feedContainerRef}
            onScroll={handleFeedScroll}
            data-testid="infinite-scroll-container"
            className="border border-slate-200 rounded-xl h-72 overflow-y-auto bg-slate-950 p-4 font-mono text-xs space-y-2.5 custom-scrollbar"
          >
            {feedItems.map((item) => (
              <div
                key={item.id}
                data-testid={`log-item-${item.id}`}
                className="flex items-start gap-3 border-b border-slate-900 pb-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <span className="text-slate-500 shrink-0 select-none">[{item.timestamp}]</span>
                <span
                  className={`font-bold shrink-0 ${
                    item.level === "ERROR"
                      ? "text-red-500"
                      : item.level === "WARN"
                      ? "text-amber-500"
                      : "text-indigo-400"
                  }`}
                >
                  {item.level}
                </span>
                <span className="break-all">{item.message}</span>
              </div>
            ))}

            {isFeedLoading && (
              <div data-testid="feed-loading-indicator" className="py-4 flex items-center justify-center gap-2 text-indigo-400 animate-pulse bg-slate-900/50 rounded-lg">
                <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Fetching dynamic feeds from stream...</span>
              </div>
            )}
          </div>
        </div>

        {/* CHALLENGE C: DYNAMIC COLUMNS TABLE */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Challenge C: Dynamic Columns Table</h2>
              <p className="text-xs text-slate-500 mt-1">Columns shuffle in order and selection on page load. Locators must target data by mapping header names to column cell indices.</p>
            </div>
            <button
              type="button"
              data-testid="randomize-columns-btn"
              onClick={randomizeColumns}
              className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-indigo-650 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-all shadow-xs"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Randomize Columns
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse" data-testid="dynamic-columns-table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-650 uppercase tracking-wider select-none">
                  {dynamicCols.map((col) => (
                    <th
                      key={col.key}
                      data-testid={`dyn-header-${col.key}`}
                      className="p-5"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm text-slate-700">
                {employees.slice(0, 5).map((emp) => (
                  <tr
                    key={emp.id}
                    data-testid={`dyn-row-${emp.id}`}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {dynamicCols.map((col) => (
                      <td
                        key={col.key}
                        data-testid={`dyn-cell-${emp.id}-${col.key}`}
                        className="p-5 font-semibold text-slate-900 whitespace-nowrap"
                      >
                        {String(emp[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
