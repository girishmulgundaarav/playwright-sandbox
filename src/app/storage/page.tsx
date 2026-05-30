"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function StoragePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Constants for verification
  const LOCAL_TOKEN_KEY = "auth_token";
  const LOCAL_TOKEN_VAL = "mock-auth-token-123";
  const SESSION_ID_KEY = "session_id";
  const SESSION_ID_VAL = "mock-session-id-456";
  const COOKIE_STR = "logged_in=true";

  // Check state helper
  const checkStorageState = () => {
    if (typeof window === "undefined") return false;
    const hasLocal = localStorage.getItem(LOCAL_TOKEN_KEY) === LOCAL_TOKEN_VAL;
    const hasSession = sessionStorage.getItem(SESSION_ID_KEY) === SESSION_ID_VAL;
    const hasCookie = document.cookie.includes(COOKIE_STR);
    return hasLocal && hasSession && hasCookie;
  };

  // Mount effect: Check initial state and run polling interval
  useEffect(() => {
    // Initial restoration check
    if (checkStorageState()) {
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 0);
    }
    setTimeout(() => {
      setIsInitialized(true);
    }, 0);

    // Dynamic checking interval (every 500ms)
    const interval = setInterval(() => {
      const isValid = checkStorageState();
      
      setIsLoggedIn((prev) => {
        // If state says logged in but storage state is cleared/invalid -> boot back
        if (prev && !isValid) {
          return false;
        }
        // If state says logged out but storage state is complete/valid -> auto login
        if (!prev && isValid) {
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

    if (username === "admin" && password === "admin") {
      // Set localStorage
      localStorage.setItem(LOCAL_TOKEN_KEY, LOCAL_TOKEN_VAL);
      // Set sessionStorage
      sessionStorage.setItem(SESSION_ID_KEY, SESSION_ID_VAL);
      // Set Cookie
      document.cookie = `${COOKIE_STR}; path=/; max-age=3600`;
      
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid username or password. Please use admin / admin.");
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    // Clear sessionStorage
    sessionStorage.removeItem(SESSION_ID_KEY);
    // Clear Cookie (expires in past)
    document.cookie = `${LOCAL_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    setIsLoggedIn(false);
  };

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
            Practice authentication state preservation and state reuse. Log in to write values to LocalStorage, SessionStorage, and Document Cookies, and test how E2E frameworks cache and inject them.
          </p>
        </div>

        {/* Main Panel */}
        <div className="mx-auto max-w-md">
          {/* Prevent flashing before restoration check runs */}
          {!isInitialized ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex items-center justify-center min-h-[300px]">
              <span className="text-sm font-semibold text-slate-500 animate-pulse">Initializing state...</span>
            </div>
          ) : !isLoggedIn ? (
            /* LOGIN CARD */
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
              <div className="text-center mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Secure Client Login</h2>
                <p className="text-xs text-slate-500 mt-1.5">
                  Use credentials <span className="font-mono font-semibold bg-slate-100 text-slate-700 px-1 py-0.5 rounded">admin</span> / <span className="font-mono font-semibold bg-slate-100 text-slate-700 px-1 py-0.5 rounded">admin</span>
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
                    placeholder="Enter admin"
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
                    placeholder="Enter admin"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  data-testid="login-submit"
                  className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:ring-offset-2"
                >
                  Log In
                </button>
              </form>
            </div>
          ) : (
            /* SECURE SUB-ROUTE PANEL VIEW */
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md text-center space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 shadow-sm animate-bounce">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>

              <div>
                <h2 data-testid="welcome-message" className="text-2xl font-extrabold text-slate-900">
                  Welcome, Admin!
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  You are successfully authenticated. Playwright can cache this state using <code>browserContext.storageState()</code> to bypass subsequent logins.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-[11px] text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span className="font-bold">LocalStorage Token:</span>
                  <span className="text-indigo-650 truncate max-w-[140px]">mock-auth-token-123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">SessionStorage ID:</span>
                  <span className="text-indigo-655 truncate max-w-[140px]">mock-session-id-456</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Cookie Value:</span>
                  <span className="text-indigo-655 font-bold">logged_in=true</span>
                </div>
              </div>

              <button
                type="button"
                data-testid="logout-btn"
                onClick={handleLogout}
                className="w-full inline-flex justify-center items-center rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
