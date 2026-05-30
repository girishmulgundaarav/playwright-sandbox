"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function ApiSandboxPage() {
  // GET states
  const [responseJson, setResponseJson] = useState("");
  const [getLoading, setGetLoading] = useState(false);

  // POST states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [includeAuth, setIncludeAuth] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFetchBooks = async () => {
    setGetLoading(true);
    setResponseJson("");
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
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
        // Automatically fetch updated list
        handleFetchBooks();
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to submit request";
      setErrorMsg(errMsg);
    } finally {
      setPostLoading(false);
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
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Integrated API Sandbox
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice hybrid E2E testing by combining browser UI commands and custom HTTP fetch API calls. Manage request headers, query mock databases, and handle authorization status overrides.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1: GET Request Client */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                    1
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">GET Request Sandbox</h2>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Trigger an internal HTTP GET request to pull the list of stored books as a JSON array payload.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col space-y-4">
                <button
                  type="button"
                  data-testid="api-get-btn"
                  onClick={handleFetchBooks}
                  disabled={getLoading}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getLoading ? "Fetching..." : "Fetch Books"}
                </button>

                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Response Payload
                  </label>
                  <pre className="w-full max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3.5 text-xs font-mono text-slate-800 scrollbar-thin">
                    <code data-testid="api-response-block">
                      {responseJson || "[]"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 2: POST Request Client */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">POST Creation Sandbox</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Submit a new book record. Leave the token header unchecked to test the backend authentication validator.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                {successMsg && (
                  <div
                    data-testid="api-success-msg"
                    className="rounded-lg bg-emerald-50 border border-emerald-250 p-3 text-xs font-semibold text-emerald-800"
                  >
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div
                    data-testid="api-error-msg"
                    className="rounded-lg bg-rose-50 border border-rose-250 p-3 text-xs font-semibold text-rose-700"
                  >
                    {errorMsg}
                  </div>
                )}

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

                  <label
                    data-testid="auth-label"
                    className="flex items-center gap-3 cursor-pointer group bg-white border border-slate-200 rounded-lg p-2.5 hover:border-indigo-150 hover:bg-indigo-50/10 transition-all select-none"
                  >
                    <input
                      type="checkbox"
                      data-testid="auth-header-toggle"
                      checked={includeAuth}
                      onChange={(e) => setIncludeAuth(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-650 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-650 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
                      Include Bearer Auth Token Header
                    </span>
                  </label>

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

        </div>
      </div>
    </div>
  );
}
