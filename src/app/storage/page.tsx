"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function StoragePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Advanced authentication states
  const [role, setRole] = useState("admin");
  const [rememberMe, setRememberMe] = useState(false);
  const [expiryDuration, setExpiryDuration] = useState(0); // in seconds
  const [countdown, setCountdown] = useState(0);
  const [rbacMessage, setRbacMessage] = useState("");

  // IndexedDB States
  const [bookmarks, setBookmarks] = useState<{ id?: number; title: string; url: string }[]>([]);
  const [idxTitle, setIdxTitle] = useState("");
  const [idxUrl, setIdxUrl] = useState("");

  // API Interception States
  const [apiResult, setApiResult] = useState("");
  const [apiHeaders, setApiHeaders] = useState("");

  // Quota states
  const [quotaMessage, setQuotaMessage] = useState("");
  const [quotaError, setQuotaError] = useState("");

  // Constants
  const LOCAL_TOKEN_KEY = "auth_token";
  const SESSION_ID_KEY = "session_id";
  const SESSION_ID_VAL = "mock-session-id-456";

  // Renders a mock JWT
  const generateMockJWT = (userRole: string) => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: `user-${userRole}-123`,
      name: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} User`,
      roles: [userRole],
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    
    try {
      const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      return `${headerB64}.${payloadB64}.signature_hash_123456789`;
    } catch (e) {
      return "mock-auth-token-" + userRole;
    }
  };

  const checkStorageState = () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem(LOCAL_TOKEN_KEY);
    const hasLocal = token !== null && token !== "";
    const hasSession = sessionStorage.getItem(SESSION_ID_KEY) === SESSION_ID_VAL;
    const hasCookie = document.cookie.includes("logged_in=true");
    return hasLocal && hasSession && hasCookie;
  };

  // Mount effect
  useEffect(() => {
    if (checkStorageState()) {
      setIsLoggedIn(true);
      const savedRole = localStorage.getItem("auth_role") || "admin";
      setRole(savedRole);
    }
    setIsInitialized(true);
    loadBookmarks();

    // Check interval every 500ms
    const interval = setInterval(() => {
      const isValid = checkStorageState();

      if (typeof window !== "undefined") {
        const expiryTimeStr = sessionStorage.getItem("auth_expiry_time");
        if (expiryTimeStr) {
          const expiryTime = Number(expiryTimeStr);
          if (Date.now() > expiryTime) {
            handleLogout();
            return;
          } else {
            setCountdown(Math.ceil((expiryTime - Date.now()) / 1000));
          }
        } else {
          setCountdown(0);
        }
      }

      setIsLoggedIn((prev) => {
        if (prev && !isValid) {
          return false;
        }
        if (!prev && isValid) {
          const savedRole = localStorage.getItem("auth_role") || "admin";
          setRole(savedRole);
          return true;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validCreds: { [key: string]: string } = {
      admin: "admin",
      editor: "editor",
      viewer: "viewer"
    };

    if (validCreds[username] && password === validCreds[username]) {
      const selectedRole = username;
      const token = generateMockJWT(selectedRole);

      localStorage.setItem(LOCAL_TOKEN_KEY, token);
      localStorage.setItem("auth_role", selectedRole);
      sessionStorage.setItem(SESSION_ID_KEY, SESSION_ID_VAL);

      // Set cookie remember-me parameters
      const cookieAge = rememberMe ? "; max-age=31536000" : ""; // 1 year
      document.cookie = `logged_in=true; path=/${cookieAge}`;

      if (expiryDuration > 0) {
        sessionStorage.setItem("auth_expiry_time", String(Date.now() + expiryDuration * 1000));
      }

      setRole(selectedRole);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid credentials. Use admin/admin, editor/editor, or viewer/viewer.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    localStorage.removeItem("auth_role");
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem("auth_expiry_time");
    document.cookie = "logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsLoggedIn(false);
    setCountdown(0);
    setApiResult("");
    setApiHeaders("");
    setRbacMessage("");
  };

  // IndexedDB operations
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("BookmarksDB", 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "id", autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const loadBookmarks = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("bookmarks", "readonly");
      const store = tx.objectStore("bookmarks");
      const req = store.getAll();
      req.onsuccess = () => {
        setBookmarks(req.result);
      };
    } catch (e) {
      console.warn("IndexedDB load error:", e);
    }
  };

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idxTitle || !idxUrl) return;
    try {
      const db = await openDB();
      const tx = db.transaction("bookmarks", "readwrite");
      const store = tx.objectStore("bookmarks");
      store.add({ title: idxTitle, url: idxUrl });
      tx.oncomplete = () => {
        loadBookmarks();
        setIdxTitle("");
        setIdxUrl("");
      };
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBookmark = async (id: number) => {
    try {
      const db = await openDB();
      const tx = db.transaction("bookmarks", "readwrite");
      const store = tx.objectStore("bookmarks");
      store.delete(id);
      tx.oncomplete = () => {
        loadBookmarks();
      };
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearBookmarks = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("bookmarks", "readwrite");
      const store = tx.objectStore("bookmarks");
      store.clear();
      tx.oncomplete = () => {
        loadBookmarks();
      };
    } catch (e) {
      console.error(e);
    }
  };

  // Bearer fetch verification
  const handleBearerFetch = async () => {
    setApiResult("");
    setApiHeaders("");
    const token = localStorage.getItem(LOCAL_TOKEN_KEY) || "";

    try {
      const res = await fetch("/api/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      setApiResult(JSON.stringify(data, null, 2));
      setApiHeaders(`Authorization: Bearer ${token.substring(0, 15)}...`);
    } catch (e: any) {
      setApiResult(JSON.stringify({ error: e.message }, null, 2));
    }
  };

  // Quota filler
  const handleFillQuota = () => {
    setQuotaMessage("");
    setQuotaError("");
    try {
      const bigString = "A".repeat(5 * 1024 * 1024); // 5MB
      localStorage.setItem("quota_test_key", bigString);
      setQuotaMessage("Successfully filled 5MB in LocalStorage!");
    } catch (e: any) {
      setQuotaError(`QuotaExceededError: ${e.message || "LocalStorage limit reached!"}`);
    }
  };

  const handleClearQuota = () => {
    localStorage.removeItem("quota_test_key");
    setQuotaMessage("Cleared quota simulation key.");
    setQuotaError("");
  };

  // Clear specific scopes
  const handleClearSpecific = (medium: "local" | "session" | "cookies") => {
    if (medium === "local") {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      localStorage.removeItem("auth_role");
    } else if (medium === "session") {
      sessionStorage.removeItem(SESSION_ID_KEY);
    } else if (medium === "cookies") {
      document.cookie = "logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  // Trigger RBAC action verification
  const handleRbacAction = (action: "view" | "edit" | "delete") => {
    setRbacMessage("");
    if (action === "view") {
      setRbacMessage("Access Granted: Retreived read-only document feed.");
    } else if (action === "edit") {
      if (role === "viewer") {
        setRbacMessage("Access Denied: Edit permission is blocked for role Viewer.");
      } else {
        setRbacMessage("Access Granted: Workspace modifications saved successfully.");
      }
    } else if (action === "delete") {
      if (role === "admin") {
        setRbacMessage("Access Granted: Secure transaction logs purged.");
      } else {
        setRbacMessage(`Access Denied: Delete permission is blocked for role ${role.charAt(0).toUpperCase() + role.slice(1)}.`);
      }
    }
  };

  // Decode JWT payload token helper
  const decodeJWT = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(LOCAL_TOKEN_KEY) || "";
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      return JSON.parse(atob(parts[1]));
    } catch (e) {
      return null;
    }
  };

  const decodedToken = decodeJWT();

  return (
    <div
      data-testid="storage-page"
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
            Storage & Authentication
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice authentication state preservation and state reuse. Log in as different roles to write permissions to LocalStorage, SessionStorage, and Document Cookies. Inspect IndexedDB databases, test authorization headers, and simulate storage quotas.
          </p>
        </div>

        {/* Main Workspace */}
        {!isInitialized ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex items-center justify-center min-h-[300px]">
            <span className="text-sm font-semibold text-slate-500 animate-pulse">Initializing state...</span>
          </div>
        ) : !isLoggedIn ? (
          /* LOGIN PANEL */
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
              <div className="text-center mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Secure Client Login</h2>
                <p className="text-xs text-slate-500 mt-2">
                  Use credentials: <span className="font-semibold text-indigo-650">admin</span> / <span className="font-semibold text-indigo-650">admin</span>, <span className="font-semibold text-indigo-650">editor</span> / <span className="font-semibold text-indigo-650">editor</span>, or <span className="font-semibold text-indigo-650">viewer</span> / <span className="font-semibold text-indigo-650">viewer</span>
                </p>
              </div>

              {error && (
                <div
                  data-testid="login-error"
                  className="rounded-lg bg-rose-50 border border-rose-200 p-3.5 mb-6 text-xs font-semibold text-rose-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                  <input
                    type="text"
                    data-testid="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter credentials"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    data-testid="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter credentials"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Expiry select + Remember Me */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      data-testid="login-remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="text-xs font-semibold text-slate-600 cursor-pointer">
                      Remember Me
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Session Expiry</label>
                    <select
                      data-testid="login-expiry-select"
                      value={expiryDuration}
                      onChange={(e) => setExpiryDuration(Number(e.target.value))}
                      className="w-full text-xs font-semibold text-slate-700 bg-slate-50 rounded border border-slate-200 p-1.5 outline-none focus:border-indigo-500"
                    >
                      <option value={0}>No Expiry</option>
                      <option value={10}>10 Seconds</option>
                      <option value={60}>1 Minute</option>
                      <option value={3600}>1 Hour</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  data-testid="login-submit"
                  className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:ring-offset-2 cursor-pointer shadow-2xs"
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* LOGGED IN WORKSPACE */
          <div className="grid gap-10 md:grid-cols-3">
            
            {/* COLUMN 1: Session Status & RBAC */}
            <div className="md:col-span-1 space-y-8">
              
              {/* Account Status Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md text-center space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <div>
                  <h2 data-testid="welcome-message" className="text-xl font-extrabold text-slate-900">
                    Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!
                  </h2>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                    Role: {role.toUpperCase()}
                  </span>
                </div>

                {countdown > 0 && (
                  <div 
                    data-testid="expiry-countdown" 
                    className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-250 py-1.5 rounded-lg text-center"
                  >
                    ⏳ Session Timeout in: {countdown}s
                  </div>
                )}

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-[10px] text-slate-600 font-mono">
                  <div className="flex justify-between">
                    <span className="font-bold">LS Token:</span>
                    <span className="text-indigo-650 truncate max-w-[100px]">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">SS Session ID:</span>
                    <span className="text-indigo-655 truncate max-w-[100px]">{SESSION_ID_VAL}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Cookie Status:</span>
                    <span className="text-indigo-655 font-bold">logged_in=true</span>
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="logout-btn"
                  onClick={handleLogout}
                  className="w-full py-2 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-3xs"
                >
                  Log Out Session
                </button>
              </div>

              {/* RBAC Action Perms Tester */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Role-Based Actions</h3>
                <p className="text-xs text-slate-500">
                  Verify that specific actions are restricted or disabled in the UI based on your authentication role.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    data-testid="rbac-action-view"
                    onClick={() => handleRbacAction("view")}
                    className="w-full flex justify-between items-center px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-750 transition-colors cursor-pointer"
                  >
                    <span>🔍 View Audit Logs</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">All Roles</span>
                  </button>

                  <button
                    type="button"
                    data-testid="rbac-action-edit"
                    disabled={role === "viewer"}
                    onClick={() => handleRbacAction("edit")}
                    className={`w-full flex justify-between items-center px-4 py-2 border rounded-lg text-xs font-semibold transition-colors ${
                      role === "viewer"
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                        : "bg-indigo-50/50 border-indigo-150 hover:bg-indigo-50 text-indigo-700 cursor-pointer"
                    }`}
                  >
                    <span>✏️ Edit Config settings</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Admin/Editor</span>
                  </button>

                  <button
                    type="button"
                    data-testid="rbac-action-delete"
                    disabled={role !== "admin"}
                    onClick={() => handleRbacAction("delete")}
                    className={`w-full flex justify-between items-center px-4 py-2 border rounded-lg text-xs font-semibold transition-colors ${
                      role !== "admin"
                        ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                        : "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
                    }`}
                  >
                    <span>🗑️ Delete Logs</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Admin Only</span>
                  </button>
                </div>

                {rbacMessage && (
                  <div
                    data-testid="rbac-status-msg"
                    className={`rounded-lg p-3 text-xs font-semibold border ${
                      rbacMessage.includes("Denied")
                        ? "bg-rose-50 border-rose-200 text-rose-800"
                        : "bg-emerald-50 border-emerald-250 text-emerald-800"
                    }`}
                  >
                    {rbacMessage}
                  </div>
                )}
              </div>

            </div>

            {/* COLUMN 2 & 3: Advanced Storage APIs */}
            <div className="md:col-span-2 space-y-8">
              
              {/* ZONE 2: IndexedDB Structured Store */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">ZONE 2: IndexedDB Structured Database</h3>
                  <button
                    type="button"
                    data-testid="idx-clear-btn"
                    onClick={handleClearBookmarks}
                    className="text-xs text-rose-600 hover:text-rose-500 font-bold transition-colors cursor-pointer"
                  >
                    Clear DB Store
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Manage database objects in the browser's IndexedDB. Adding or deleting entries directly mutates the browser database store, testing data persistence on page reloads.
                </p>

                {/* Form */}
                <form onSubmit={handleAddBookmark} className="grid gap-4 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Bookmark Title"
                    data-testid="idx-title-input"
                    value={idxTitle}
                    onChange={(e) => setIdxTitle(e.target.value)}
                    className="sm:col-span-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    required
                  />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    data-testid="idx-url-input"
                    value={idxUrl}
                    onChange={(e) => setIdxUrl(e.target.value)}
                    className="sm:col-span-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    required
                  />
                  <button
                    type="submit"
                    data-testid="idx-add-btn"
                    className="sm:col-span-1 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add Bookmark
                  </button>
                </form>

                {/* List */}
                <div data-testid="idx-bookmark-list" className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {bookmarks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">No database entries. Add a bookmark above.</p>
                  ) : (
                    bookmarks.map((bm) => (
                      <div 
                        key={bm.id} 
                        data-testid={`idx-bookmark-item-${bm.id}`}
                        className="flex justify-between items-center bg-slate-50 p-2 border border-slate-150 rounded-lg"
                      >
                        <div className="truncate pr-4">
                          <p className="text-xs font-bold text-slate-800">{bm.title}</p>
                          <a href={bm.url} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-550 hover:underline">{bm.url}</a>
                        </div>
                        <button
                          type="button"
                          data-testid={`idx-delete-btn-${bm.id}`}
                          onClick={() => bm.id !== undefined && handleDeleteBookmark(bm.id)}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-700 hover:underline p-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* ZONE 3: Authorization Interception & Bearer Fetcher */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">ZONE 3: Bearer Header Request & JWT Visualizer</h3>
                <p className="text-xs text-slate-500">
                  Verify request headers and tokens. Fetch calls transmit authentication parameters inside headers, allowing tests to intercept queries and mock responses.
                </p>

                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    data-testid="bearer-fetch-btn"
                    onClick={handleBearerFetch}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-3xs"
                  >
                    Fetch Private Profile
                  </button>
                  {apiHeaders && (
                    <span 
                      data-testid="bearer-req-headers"
                      className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded"
                    >
                      {apiHeaders}
                    </span>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* API Response JSON */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Network JSON Payload</span>
                    <pre 
                      data-testid="bearer-response-payload"
                      className="p-3 bg-slate-900 text-slate-350 text-[10px] font-mono rounded-lg overflow-x-auto max-h-40 min-h-[100px]"
                    >
                      {apiResult || "// Click Fetch to trigger API query"}
                    </pre>
                  </div>

                  {/* Decoded JWT claims */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Decoded JWT claims</span>
                    <div 
                      className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-mono text-slate-650 max-h-40 overflow-y-auto min-h-[100px] space-y-1.5"
                    >
                      {decodedToken ? (
                        <>
                          <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="font-bold">Issuer (iss):</span>
                            <span>{decodedToken.iss}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="font-bold">Subject (sub):</span>
                            <span>{decodedToken.sub}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="font-bold">Roles (roles):</span>
                            <span data-testid="jwt-decoded-roles" className="text-indigo-650 font-bold">
                              {JSON.stringify(decodedToken.roles)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold">Expires (exp):</span>
                            <span>{decodedToken.exp}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-slate-400 italic">// Decoded local token metadata displays here</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* ZONE 4: Expiration, Clearers, & Quotas */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-5">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">ZONE 4: Storage Cleaner & Limit Simulator</h3>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  
                  {/* Scope cleaner */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Independent Cleaners</h4>
                    <p className="text-[11px] text-slate-500">
                      Tear down specific authentication domains to verify how the application recovers from partial state clearance.
                    </p>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        data-testid="clear-local-btn"
                        onClick={() => handleClearSpecific("local")}
                        className="py-1.5 px-3 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-left flex justify-between"
                      >
                        <span>Clear LocalStorage token</span>
                        <span className="text-[10px] font-mono text-slate-400">auth_token</span>
                      </button>

                      <button
                        type="button"
                        data-testid="clear-session-btn"
                        onClick={() => handleClearSpecific("session")}
                        className="py-1.5 px-3 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-left flex justify-between"
                      >
                        <span>Clear SessionStorage ID</span>
                        <span className="text-[10px] font-mono text-slate-400">session_id</span>
                      </button>

                      <button
                        type="button"
                        data-testid="clear-cookies-btn"
                        onClick={() => handleClearSpecific("cookies")}
                        className="py-1.5 px-3 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-left flex justify-between"
                      >
                        <span>Clear Document Cookies</span>
                        <span className="text-[10px] font-mono text-slate-400">logged_in=true</span>
                      </button>
                    </div>
                  </div>

                  {/* Quota Exhaustion */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quota Exhaustion</h4>
                    <p className="text-[11px] text-slate-500">
                      Fill LocalStorage with a large 5MB string data payload to trigger storage boundary warnings.
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-testid="fill-quota-btn"
                        onClick={handleFillQuota}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Exhaust Quota (5MB)
                      </button>
                      <button
                        type="button"
                        onClick={handleClearQuota}
                        className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Clear Quota
                      </button>
                    </div>

                    {quotaMessage && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 text-[11px] font-semibold">
                        {quotaMessage}
                      </div>
                    )}
                    {quotaError && (
                      <div 
                        data-testid="quota-error-alert"
                        className="rounded-lg bg-rose-50 border border-rose-250 text-rose-800 p-2.5 text-[11px] font-bold"
                      >
                        ⚠️ {quotaError}
                      </div>
                    )}
                  </div>

                </div>
              </section>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
