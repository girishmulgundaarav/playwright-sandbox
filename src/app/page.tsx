import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  testId: string;
  gradient: string;
  icon: React.ReactNode;
}

export default function Home() {
  const challenges: Challenge[] = [
    {
      id: "forms",
      title: "Forms & Controls",
      description: "Interact with dynamic consent checkboxes, password strength meters, debounced async username checkers, format mask inputs, character counters, and multi-file drops.",
      href: "/forms",
      tags: ["Validation", "Async Status", "Masking", "Multi-File Upload"],
      testId: "card-forms",
      gradient: "from-blue-500 to-cyan-500",
      icon: (
        <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      id: "async",
      title: "Async Challenges",
      description: "Handle delayed element rendering, dynamic loading indicators, AJAX calls, and progressive page updates.",
      href: "/async",
      tags: ["Waiting", "Loaders", "Network", "Race Conditions"],
      testId: "card-async",
      gradient: "from-purple-500 to-indigo-500",
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "dom",
      title: "DOM & Locating",
      description: "Practice advanced locating techniques: dialog modals, nested iframes, and piercing Shadow DOM boundaries.",
      href: "/dom",
      tags: ["iFrames", "Shadow DOM", "Nested Trees", "Piercing Selector"],
      testId: "card-shadow",
      gradient: "from-pink-500 to-rose-500",
      icon: (
        <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m11.142 0L21.75 12l-4.179-2.25M12 5.75L6.429 9.75 12 13.75l5.571-4L12 5.75zm0 8l-5.571 4L12 21.75l5.571-4-5.571-4z" />
        </svg>
      ),
    },
    {
      id: "tables",
      title: "Tables & Grids",
      description: "Extract data from tabular views, perform search sorting, verify pagination, and validate dynamically changing rows.",
      href: "/tables",
      tags: ["Sorting", "Pagination", "Data Extraction", "Dynamic Rows"],
      testId: "card-tables",
      gradient: "from-amber-500 to-orange-500",
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM3.75 9h16.5M3.75 14.25h16.5M9 3.75v16.5m6-16.5v16.5" />
        </svg>
      ),
    },
    {
      id: "advanced",
      title: "Advanced Interactions",
      description: "Automate complex actions: drag-and-drop, sliders, hovering, double clicking, mouse coordinates, and key presses.",
      href: "/advanced",
      tags: ["Drag & Drop", "Hover Menus", "Sliders", "Double Clicks"],
      testId: "card-advanced",
      gradient: "from-emerald-500 to-teal-500",
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-8.117-.312c.528-.456 1.094-.897 1.676-1.345M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zM12 13.5c-1.658 0-3 1.567-3 3.5s1.342 3.5 3 3.5 3-1.567 3-3.5-1.342-3.5-3-3.5z" />
        </svg>
      ),
    },
    {
      id: "calendars",
      title: "Calendars & Pickers",
      description: "Interact with diverse date controllers: standard date inputs, custom popup date grids, and interconnected side-by-side range pickers.",
      href: "/calendars",
      tags: ["Inputs", "Date Pickers", "Date Ranges", "Month Toggles"],
      testId: "card-calendars",
      gradient: "from-rose-500 to-amber-500",
      icon: (
        <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      ),
    },
    {
      id: "dropdowns",
      title: "Multi-Type Dropdowns",
      description: "Practice locating diverse select elements: standard HTML select lists, dynamic searchable comboboxes, tag selections, and dependent selectors.",
      href: "/dropdowns",
      tags: ["Selects", "Comboboxes", "Multi-Select", "Dependent Options"],
      testId: "card-dropdowns",
      gradient: "from-blue-500 to-indigo-500",
      icon: (
        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5m3 6l-3 3-3-3" />
        </svg>
      ),
    },
    {
      id: "basic-controls",
      title: "Basic UI Controls",
      description: "Interact with radio button groups, toggle checkboxes in grids, clear selections, and validate dynamic text color, labels, and visibility states.",
      href: "/basic-controls",
      tags: ["Radio Buttons", "Checkbox Grid", "Toggles", "Dynamic States"],
      testId: "card-basic-controls",
      gradient: "from-teal-500 to-emerald-500",
      icon: (
        <svg className="h-6 w-6 text-teal-655" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "storage",
      title: "Storage & Authentication",
      description: "Practice authentication E2E state reuse. Test login forms, cookie caching, local storage tokens, session storage IDs, and auto-logout scenarios.",
      href: "/storage",
      tags: ["Cookies", "LocalStorage", "SessionStorage", "State Reuse"],
      testId: "card-storage",
      gradient: "from-blue-500 to-indigo-500",
      icon: (
        <svg className="h-6 w-6 text-indigo-650" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      id: "windows",
      title: "Multi-Tab & Windows",
      description: "Practice handling multiple pages, switching browser tab context, target='_blank' links, and managing programmatically opened popup windows.",
      href: "/windows",
      tags: ["Tabs", "Popups", "Window Handles", "Target Blank"],
      testId: "card-windows",
      gradient: "from-pink-500 to-rose-500",
      icon: (
        <svg className="h-6 w-6 text-pink-605" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0016.5 18v-2.25m-15 0h15m-15-5.25h15M20.25 7.5l3 3m0 0l-3 3m3-3h-10.5" />
        </svg>
      ),
    },
    {
      id: "permissions",
      title: "Geolocation & Permissions",
      description: "Practice interacting with browser permission requests. Request geolocation details, mock device coordinates, and check camera API permission status.",
      href: "/permissions",
      tags: ["Geolocation", "Permissions", "Browser API", "Mocking"],
      testId: "card-permissions",
      gradient: "from-teal-500 to-cyan-500",
      icon: (
        <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      id: "api-sandbox",
      title: "API Sandbox",
      description: "Test hybrid UI/API test automation. Query simulated endpoints via GET requests, submit form data via POST, and inspect authorization header results.",
      href: "/api-sandbox",
      tags: ["REST API", "Headers", "Bearer Token", "Hybrid Testing"],
      testId: "card-api-sandbox",
      gradient: "from-purple-500 to-indigo-500",
      icon: (
        <svg className="h-6 w-6 text-purple-650" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
    {
      id: "wizard",
      title: "Form Wizard",
      description: "Automate checkout and registration multi-step guided wizards. Handle validation blocks, go back and forth between screens, and verify final order summaries.",
      href: "/wizard",
      tags: ["Form Wizard", "Multi-step Flow", "State Management", "Data Validation"],
      testId: "card-wizard",
      gradient: "from-indigo-500 to-pink-500",
      icon: (
        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 12.4H3.018a2.25 2.25 0 01-2.247-2.118L.5 5.122a2.25 2.25 0 012.247-2.378H6.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 bg-clip-text text-transparent">
            Playwright Automation Practice Sandbox
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Sharpen your end-to-end testing skills. Interact with dynamic elements, handle complex UI patterns, and run robust assertions against our modern React-based application.
          </p>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              data-testid={challenge.testId}
              className="relative group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Glow Effect */}
              <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${challenge.gradient} opacity-10 blur-3xl group-hover:opacity-15 transition-opacity duration-300 pointer-events-none`} />

              {/* Number Indicator */}
              <span className="absolute top-6 right-6 text-xs font-mono font-bold text-slate-450/70 group-hover:text-indigo-550 transition-colors duration-300">
                #{String(index + 1).padStart(2, "0")}
              </span>

              <div>
                {/* Icon wrapper */}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-6 group-hover:border-indigo-50 transition-colors">
                  {challenge.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {index + 1}. {challenge.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {challenge.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {challenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <Link
                  href={challenge.href}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-500 transition-colors duration-200"
                >
                  Enter Challenge
                  <svg className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
