"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function PermissionsPage() {
  // Zone 1: Geolocation States
  const [geoResult, setGeoResult] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  const handleRequestGeolocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoResult("Error: Geolocation API is not supported by your browser");
      return;
    }

    setGeoLoading(true);
    setGeoResult("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setGeoResult(`Latitude: ${lat}, Longitude: ${long}`);
        setGeoLoading(false);
      },
      (error) => {
        setGeoResult(`Error: ${error.message}`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Zone 2: Camera Permission States
  const [cameraStatus, setCameraStatus] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);

  const handleCheckCameraStatus = async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.permissions ||
      !navigator.permissions.query
    ) {
      setCameraStatus("Error: Permissions API is not supported by your browser");
      return;
    }

    setCameraLoading(true);
    setCameraStatus("");

    try {
      // Query camera permissions
      const status = await navigator.permissions.query({ name: "camera" as PermissionName });
      
      const mapState = (state: PermissionState) => {
        if (state === "granted") return "Granted";
        if (state === "denied") return "Denied";
        if (state === "prompt") return "Prompt";
        return state;
      };

      setCameraStatus(mapState(status.state));
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Could not query camera permission";
      setCameraStatus(`Error: ${errMsg}`);
    } finally {
      setCameraLoading(false);
    }
  };

  return (
    <div
      data-testid="permissions-page"
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
            Geolocation & Permissions
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Practice handling browser permission prompts and mocking hardware responses. Test E2E permission configurations and mock device coordinates.
          </p>
        </div>

        {/* Grid of Test Zones */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ZONE 1: Geolocation Request */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-650 border border-blue-200 font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-slate-900">Request Geolocation</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Ask the browser for the current device coordinate parameters. Mocks injected by automation scripts will instantly return their assigned values.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <button
                  type="button"
                  data-testid="request-geolocation-btn"
                  onClick={handleRequestGeolocation}
                  disabled={geoLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {geoLoading ? "Requesting..." : "Request Geolocation"}
                </button>

                {geoResult && (
                  <div className="text-center pt-2">
                    <span
                      data-testid="geolocation-result"
                      className={`text-sm font-semibold ${
                        geoResult.startsWith("Error") ? "text-rose-600" : "text-slate-800"
                      }`}
                    >
                      {geoResult}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 2: Camera Status Checker */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-650 border border-purple-200 font-bold text-sm">
                  2
                </span>
                <h2 className="text-xl font-bold text-slate-900">Check Camera Status</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Query the Permissions API for camera access. Mocks in E2E settings will override browser defaults to return Granted or Denied.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <button
                  type="button"
                  data-testid="check-camera-btn"
                  onClick={handleCheckCameraStatus}
                  disabled={cameraLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 text-sm shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cameraLoading ? "Checking..." : "Check Camera Status"}
                </button>

                {cameraStatus && (
                  <div className="text-center pt-2">
                    <span
                      data-testid="camera-status"
                      className={`text-sm font-bold uppercase tracking-wider ${
                        cameraStatus === "Granted"
                          ? "text-emerald-600"
                          : cameraStatus === "Denied"
                          ? "text-rose-600"
                          : "text-slate-600"
                      }`}
                    >
                      {cameraStatus}
                    </span>
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
