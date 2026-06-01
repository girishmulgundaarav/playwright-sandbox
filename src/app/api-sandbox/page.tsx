"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function ApiSandboxPage() {
  // Shared Auth State
  const [includeAuth, setIncludeAuth] = useState(false);

  // ZONE 1 & 3 & 4: GET Books & Inline Actions States
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [responseJson, setResponseJson] = useState("");
  const [getLoading, setGetLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ZONE 2: POST states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  // ZONE 3: Inline Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // ZONE 5: Query Filter States
  const [querySearch, setQuerySearch] = useState("");
  const [queryLimit, setQueryLimit] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [queryCode, setQueryCode] = useState<number | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // ZONE 6: HTTP Status Code Tester States
  const [statusCode, setStatusCode] = useState("200");
  const [statusResponseCode, setStatusResponseCode] = useState<number | null>(null);
  const [statusResponsePayload, setStatusResponsePayload] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  // ZONE 7: Mirror Inspector States
  const [mirrorMethod, setMirrorMethod] = useState("POST");
  const [mirrorHeaderKey, setMirrorHeaderKey] = useState("X-Custom-Header");
  const [mirrorHeaderVal, setMirrorHeaderVal] = useState("Playwright-Practice");
  const [mirrorBody, setMirrorBody] = useState('{\n  "test": true,\n  "role": "automation"\n}');
  const [mirrorDump, setMirrorDump] = useState("");
  const [mirrorLoading, setMirrorLoading] = useState(false);

  // ZONE 8: CSV Export States
  const [exportStatus, setExportStatus] = useState("Idle");

  // Load books list initially
  useEffect(() => {
    handleFetchBooks();
  }, []);

  const handleFetchBooks = async () => {
    setGetLoading(true);
    setResponseJson("");
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooksList(Array.isArray(data) ? data : []);
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to fetch books";
      setResponseJson(JSON.stringify({ error: errMsg }, null, 2));
    } finally {
      setGetLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      headers["Authorization"] = "Bearer mock-token";
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers,
        body: JSON.stringify({ title, author }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || `Error ${res.status}: ${res.statusText}`);
      } else {
        setSuccessMsg(`Book successfully created! ID: ${data.id}`);
        setTitle("");
        setAuthor("");
        // Refresh updated list
        handleFetchBooks();
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to submit request";
      setErrorMsg(errMsg);
    } finally {
      setPostLoading(false);
    }
  };

  // ZONE 3: PUT Update
  const startEditing = (book: Book) => {
    setEditingId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };

  const handleUpdateBook = async (id: number) => {
    setSuccessMsg("");
    setErrorMsg("");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      headers["Authorization"] = "Bearer mock-token";
    }

    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers,
        body: JSON.stringify({ id, title: editTitle, author: editAuthor }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || `Update error: ${res.status}`);
      } else {
        setSuccessMsg(`Book ID ${id} updated successfully.`);
        setEditingId(null);
        handleFetchBooks();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Update request failed");
    }
  };

  // ZONE 4: DELETE operator
  const handleDeleteBook = async (id: number) => {
    setSuccessMsg("");
    setErrorMsg("");

    const headers: Record<string, string> = {};
    if (includeAuth) {
      headers["Authorization"] = "Bearer mock-token";
    }

    try {
      const res = await fetch(`/api/books?id=${id}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || `Delete error: ${res.status}`);
      } else {
        setSuccessMsg(`Book ID ${id} deleted successfully.`);
        handleFetchBooks();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Delete request failed");
    }
  };

  // ZONE 5: Query Filter parameters
  const handleQueryFilterFetch = async () => {
    setQueryLoading(true);
    setQueryResult("");
    setQueryCode(null);
    try {
      const params = new URLSearchParams();
      if (querySearch) params.append("search", querySearch);
      if (queryLimit) params.append("limit", queryLimit);

      const url = `/api/books?${params.toString()}`;
      const res = await fetch(url);
      setQueryCode(res.status);
      const data = await res.json();
      setQueryResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setQueryResult(JSON.stringify({ error: err instanceof Error ? err.message : "Query failed" }, null, 2));
    } finally {
      setQueryLoading(false);
    }
  };

  // ZONE 6: HTTP Status tester
  const handleTriggerStatus = async () => {
    setStatusLoading(true);
    setStatusResponsePayload("");
    setStatusResponseCode(null);
    try {
      const res = await fetch(`/api/status-tester?code=${statusCode}`);
      setStatusResponseCode(res.status);
      const data = await res.json();
      setStatusResponsePayload(JSON.stringify(data, null, 2));
    } catch (err) {
      setStatusResponsePayload(JSON.stringify({ error: err instanceof Error ? err.message : "Failed to load" }, null, 2));
    } finally {
      setStatusLoading(false);
    }
  };

  // ZONE 7: Mirror inspector
  const handleSendMirror = async () => {
    setMirrorLoading(true);
    setMirrorDump("");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (mirrorHeaderKey && mirrorHeaderVal) {
        headers[mirrorHeaderKey] = mirrorHeaderVal;
      }

      const fetchOptions: RequestInit = {
        method: mirrorMethod,
        headers,
      };

      if (mirrorMethod !== "GET" && mirrorMethod !== "HEAD") {
        fetchOptions.body = mirrorBody;
      }

      const res = await fetch("/api/mirror", fetchOptions);
      const data = await res.json();
      setMirrorDump(JSON.stringify(data, null, 2));
    } catch (err) {
      setMirrorDump(JSON.stringify({ error: err instanceof Error ? err.message : "Mirror failed" }, null, 2));
    } finally {
      setMirrorLoading(false);
    }
  };

  // ZONE 8: CSV download
  const handleCsvExport = () => {
    setExportStatus("Exporting...");
    try {
      window.location.href = "/api/books/export";
      setExportStatus("Export Dispatched");
    } catch (err) {
      setExportStatus("Export Failed");
    }
  };

  return (
    <div
      data-testid="api-sandbox-page"
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
        <div className="border-b border-slate-200 pb-8 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Integrated API Sandbox
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Practice hybrid E2E testing by combining browser UI commands and custom HTTP fetch API calls. Manage request headers, query mock databases, and handle authorization status overrides.
            </p>
          </div>
          <div className="shrink-0 flex items-center">
            <label
              data-testid="auth-label"
              className="flex items-center gap-3 cursor-pointer group bg-white border border-slate-200 shadow-xs rounded-xl p-4 hover:border-indigo-150 hover:bg-indigo-50/10 transition-all select-none"
            >
              <input
                type="checkbox"
                data-testid="auth-header-toggle"
                checked={includeAuth}
                onChange={(e) => setIncludeAuth(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-650 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
                Include Bearer Auth Token
              </span>
            </label>
          </div>
        </div>

        {/* Global Notifications */}
        {(successMsg || errorMsg) && (
          <div className="mb-8 space-y-2">
            {successMsg && (
              <div
                data-testid="api-success-msg"
                className="rounded-xl bg-emerald-50 border border-emerald-250 p-4 text-sm font-semibold text-emerald-800"
              >
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div
                data-testid="api-error-msg"
                className="rounded-xl bg-rose-50 border border-rose-250 p-4 text-sm font-semibold text-rose-700"
              >
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1, 3, 4: Books Manager */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                    1
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">GET, PUT, & DELETE Books Sandbox</h2>
                </div>
                <button
                  type="button"
                  data-testid="api-get-btn"
                  onClick={handleFetchBooks}
                  disabled={getLoading}
                  className="inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs shadow-sm transition-all focus:outline-none disabled:opacity-50"
                >
                  {getLoading ? "Fetching..." : "Fetch Books"}
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Query, edit, and delete books in the database. Editing or deleting requires checking the authentication token checkbox above.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Visual Books List */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interactive Books Directory</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50 max-h-72 overflow-y-auto">
                    {booksList.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-400 italic">No books loaded or directory empty. Click "Fetch Books" above.</div>
                    ) : (
                      booksList.map((book) => (
                        <div key={book.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                          {editingId === book.id ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                data-testid={`edit-title-${book.id}`}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full rounded border border-slate-300 px-2 py-1 text-xs outline-none"
                              />
                              <input
                                type="text"
                                data-testid={`edit-author-${book.id}`}
                                value={editAuthor}
                                onChange={(e) => setEditAuthor(e.target.value)}
                                className="w-full rounded border border-slate-300 px-2 py-1 text-xs outline-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  data-testid={`edit-save-btn-${book.id}`}
                                  onClick={() => handleUpdateBook(book.id)}
                                  className="inline-flex items-center bg-indigo-650 text-white font-bold px-2 py-1 rounded text-[10px]"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  data-testid={`edit-cancel-btn-${book.id}`}
                                  onClick={() => setEditingId(null)}
                                  className="inline-flex items-center bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{book.title}</h4>
                                <p className="text-xs text-slate-500">by {book.author}</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  type="button"
                                  data-testid={`inline-edit-btn-${book.id}`}
                                  onClick={() => startEditing(book)}
                                  className="inline-flex items-center border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 font-semibold px-2 py-1 rounded text-[10px] shadow-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  data-testid={`inline-delete-btn-${book.id}`}
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="inline-flex items-center border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-650 font-semibold px-2 py-1 rounded text-[10px]"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Raw JSON Block */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Raw GET Response Dump</span>
                  <pre className="w-full h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs font-mono text-emerald-400 scrollbar-thin">
                    <code data-testid="api-response-block">
                      {responseJson || "[]"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 2: POST Creation Sandbox */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">POST Creation Sandbox</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Submit a new book record to the in-memory array database.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Book Title</label>
                    <input
                      type="text"
                      data-testid="book-title-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Brave New World"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Book Author</label>
                    <input
                      type="text"
                      data-testid="book-author-input"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Aldous Huxley"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    data-testid="api-post-btn"
                    disabled={postLoading}
                    className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-all focus:outline-none"
                  >
                    {postLoading ? "Submitting..." : "Add Book"}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* ZONE 5: Query Parameter Filters */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Query Parameter Filters</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Test passing query-string variables (`?search=xxx` and `?limit=y`) to filter records on the backend.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Text</label>
                    <input
                      type="text"
                      data-testid="query-search-input"
                      value={querySearch}
                      onChange={(e) => setQuerySearch(e.target.value)}
                      placeholder="e.g. Orwell"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Limit Count</label>
                    <select
                      data-testid="query-limit-select"
                      value={queryLimit}
                      onChange={(e) => setQueryLimit(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none h-[34px]"
                    >
                      <option value="">No Limit</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="query-fetch-btn"
                  onClick={handleQueryFilterFetch}
                  disabled={queryLoading}
                  className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-650 hover:bg-indigo-750 text-white font-bold py-2.5 text-xs transition-all focus:outline-none"
                >
                  {queryLoading ? "Filtering..." : "Fetch Filtered"}
                </button>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">HTTP STATUS CODE:</span>
                    <span data-testid="query-result-code" className="text-slate-900">{queryCode !== null ? queryCode : "---"}</span>
                  </div>
                  <pre className="w-full max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-950 p-3 text-[11px] font-mono text-emerald-450">
                    {queryResult || "[]"}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 6: HTTP Status Code Tester */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">HTTP Status Code Tester</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Trigger mock API errors to check frontend error-boundary displays and status classifications.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Status Code</label>
                  <select
                    data-testid="status-code-select"
                    value={statusCode}
                    onChange={(e) => setStatusCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                  >
                    <option value="200">200 OK</option>
                    <option value="400">400 Bad Request</option>
                    <option value="401">401 Unauthorized</option>
                    <option value="403">403 Forbidden</option>
                    <option value="404">404 Not Found</option>
                    <option value="429">429 Too Many Requests</option>
                    <option value="500">500 Internal Server Error</option>
                    <option value="503">503 Service Unavailable</option>
                  </select>
                </div>

                <button
                  type="button"
                  data-testid="trigger-status-btn"
                  onClick={handleTriggerStatus}
                  disabled={statusLoading}
                  className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-all focus:outline-none"
                >
                  {statusLoading ? "Triggering..." : "Trigger Request"}
                </button>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">RESPONSE STATUS CODE:</span>
                    <span data-testid="status-response-code" className={`font-bold ${statusResponseCode && statusResponseCode >= 400 ? "text-rose-600" : "text-emerald-600"}`}>{statusResponseCode !== null ? statusResponseCode : "---"}</span>
                  </div>
                  <pre className="w-full max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-slate-950 p-3 text-[11px] font-mono text-emerald-450">
                    {statusResponsePayload || "(No payload yet)"}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 7: Request Mirror Inspector */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-750 border border-cyan-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Request Mirror Inspector</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Send a custom HTTP request with customizable headers and payloads to `/api/mirror`, which echoes them back for client analysis.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">HTTP Method</label>
                      <select
                        data-testid="mirror-method-select"
                        value={mirrorMethod}
                        onChange={(e) => setMirrorMethod(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none h-[34px]"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Custom Header Key</label>
                      <input
                        type="text"
                        data-testid="mirror-custom-header-key"
                        value={mirrorHeaderKey}
                        onChange={(e) => setMirrorHeaderKey(e.target.value)}
                        placeholder="Key"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Custom Header Value</label>
                    <input
                      type="text"
                      data-testid="mirror-custom-header-val"
                      value={mirrorHeaderVal}
                      onChange={(e) => setMirrorHeaderVal(e.target.value)}
                      placeholder="Value"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  {mirrorMethod !== "GET" && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">JSON Payload Body</label>
                      <textarea
                        rows={3}
                        value={mirrorBody}
                        onChange={(e) => setMirrorBody(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    data-testid="mirror-send-btn"
                    onClick={handleSendMirror}
                    disabled={mirrorLoading}
                    className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-all focus:outline-none"
                  >
                    {mirrorLoading ? "Mirroring..." : "Send Request"}
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reflected Request Payload Dump</span>
                  <pre className="w-full h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs font-mono text-emerald-400 scrollbar-thin">
                    <code data-testid="mirror-request-dump">
                      {mirrorDump || "(Reflected data will appear here)"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 8: CSV Export Downloader */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Simulated CSV File Export</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Download a compiled, raw CSV file representation of current books list directly from the streaming API endpoint.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <button
                  type="button"
                  data-testid="api-export-btn"
                  onClick={handleCsvExport}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  Export CSV Data
                </button>

                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Export Channel Status: </span>
                  <span data-testid="api-export-status" className="text-xs font-semibold text-slate-700">{exportStatus}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
