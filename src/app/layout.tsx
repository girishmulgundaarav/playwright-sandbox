import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Playwright Automation Practice Sandbox",
  description: "A premium playground for practicing Playwright test automation with modern, dynamic, and challenging web components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.self !== window.top) {
                document.body.classList.add('is-iframe');
              }
            `,
          }}
        />
        {/* Sticky persistent navigation bar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md shadow-xs">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo/Dashboard Home Link */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 group font-semibold text-lg tracking-tight text-slate-950"
                data-testid="nav-dashboard"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-all duration-300">
                  P
                </span>
                <span className="text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                  Playwright Sandbox
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6" data-testid="navbar">
              <Link
                href="/"
                className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors duration-200"
                data-testid="nav-home"
              >
                Dashboard
              </Link>
              
              {/* Challenges Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  data-testid="nav-challenges-trigger"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors duration-200 cursor-pointer py-2"
                >
                  Challenges
                  <svg className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {/* Dropdown panel */}
                <div
                  data-testid="nav-challenges-dropdown"
                  className="absolute right-0 top-full z-50 w-56 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200"
                >
                  <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 flex flex-col gap-0.5">
                    <Link
                      href="/basic-controls"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-basic-controls"
                    >
                      Basic Controls
                    </Link>
                    <Link
                      href="/forms"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-forms"
                    >
                      Forms & Controls
                    </Link>
                    <Link
                      href="/dropdowns"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-dropdowns"
                    >
                      Dropdowns
                    </Link>
                    <Link
                      href="/tables"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-tables"
                    >
                      Tables & Grids
                    </Link>
                    <Link
                      href="/async"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-async"
                    >
                      Async Challenges
                    </Link>
                    <Link
                      href="/dom"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-shadow"
                    >
                      DOM & Locating
                    </Link>
                    <Link
                      href="/calendars"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-calendars"
                    >
                      Calendars & Pickers
                    </Link>
                    <Link
                      href="/storage"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-storage"
                    >
                      Storage & Auth
                    </Link>
                    <Link
                      href="/advanced"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-advanced"
                    >
                      Advanced Actions
                    </Link>
                    <Link
                      href="/windows"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-windows"
                    >
                      Multi-Tab & Windows
                    </Link>
                    <Link
                      href="/permissions"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-permissions"
                    >
                      Geolocation & Permissions
                    </Link>
                    <Link
                      href="/api-sandbox"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-api-sandbox"
                    >
                      API Sandbox
                    </Link>
                    <Link
                      href="/wizard"
                      className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-650 hover:bg-slate-50 transition-all"
                      data-testid="nav-wizard"
                    >
                      Form Wizard
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right side CTA or status badge */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Ready for Testing
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>© 2026 Playwright Practice Sandbox. Built for QA Automation & Testing Practice.</p>
        </footer>
      </body>
    </html>
  );
}
