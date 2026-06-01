"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

export default function PermissionsPage() {
  // ZONE 1: Geolocation States
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

  // ZONE 2: Camera Permission States
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

  // ZONE 3: Continuous Geo-Tracking States
  const [isWatching, setIsWatching] = useState(false);
  const [watchCoords, setWatchCoords] = useState("");
  const [watchCount, setWatchCount] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  const toggleWatchPosition = () => {
    if (isWatching) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWatching(false);
    } else {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        setWatchCoords("Error: watchPosition not supported");
        return;
      }
      setIsWatching(true);
      setWatchCoords("Initializing watch...");
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setWatchCoords(`Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`);
          setWatchCount((c) => c + 1);
        },
        (err) => {
          setWatchCoords(`Error: ${err.message}`);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // ZONE 4: Desktop Notifications States
  const [notifPermission, setNotifPermission] = useState("default");
  const [notifFeedback, setNotifFeedback] = useState("");

  const handleCheckNotificationPermission = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotifFeedback("Notification API is not supported by your browser");
      return;
    }
    setNotifPermission(Notification.permission);
    setNotifFeedback(`Current Permission is: ${Notification.permission}`);
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotifFeedback("Notification API is not supported by your browser");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    setNotifFeedback(`User responded: ${permission}`);
  };

  const handleSendTestNotification = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotifFeedback("Notification API not supported");
      return;
    }
    if (Notification.permission === "granted") {
      new Notification("Playwright E2E Sandbox", {
        body: "Notifications testing channel active!",
      });
      setNotifFeedback("Test notification dispatched.");
    } else {
      setNotifFeedback("Cannot dispatch notification: Permission not GRANTED");
    }
  };

  // ZONE 5: Clipboard Access States
  const [clipboardVal, setClipboardVal] = useState("Playwright Test Clipboard Content");
  const [clipboardStatus, setClipboardStatus] = useState("");
  const [clipboardOutput, setClipboardOutput] = useState("");

  const handleCopyClipboard = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setClipboardStatus("Clipboard write not supported");
      return;
    }
    try {
      await navigator.clipboard.writeText(clipboardVal);
      setClipboardStatus("Copied successfully!");
    } catch (err) {
      setClipboardStatus(`Error copying: ${err instanceof Error ? err.message : err}`);
    }
  };

  const handlePasteClipboard = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setClipboardStatus("Clipboard read not supported");
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setClipboardOutput(text);
      setClipboardStatus("Pasted successfully!");
    } catch (err) {
      setClipboardStatus(`Error reading clipboard: ${err instanceof Error ? err.message : err}`);
    }
  };

  // ZONE 6: Geofencing Simulator States
  const [geofenceStatus, setGeofenceStatus] = useState("");
  const [geofenceDistance, setGeofenceDistance] = useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleVerifyGeofence = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeofenceStatus("ACCESS_DENIED");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        const parisLat = 48.8566;
        const parisLon = 2.3522;
        const distance = calculateDistance(userLat, userLon, parisLat, parisLon);
        setGeofenceDistance(Number(distance.toFixed(2)));

        if (distance <= 50) {
          setGeofenceStatus("WITHIN_GEOFENCE");
        } else {
          setGeofenceStatus("OUT_OF_BOUNDS");
        }
      },
      (err) => {
        setGeofenceStatus("ACCESS_DENIED");
        setGeofenceDistance(null);
      }
    );
  };

  // ZONE 7: Microphone Request States
  const [micStatus, setMicStatus] = useState("Prompt");

  const checkMicPermission = async () => {
    if (typeof navigator === "undefined" || !navigator.permissions || !navigator.permissions.query) {
      setMicStatus("Unsupported");
      return;
    }
    try {
      const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
      const mapState = (state: PermissionState) => {
        if (state === "granted") return "Granted";
        if (state === "denied") return "Denied";
        if (state === "prompt") return "Prompt";
        return state;
      };
      setMicStatus(mapState(status.state));
    } catch (err) {
      setMicStatus(`Error checking`);
    }
  };

  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicStatus("Granted");
    } catch (err) {
      setMicStatus("Denied");
    }
  };

  // ZONE 8: Permission Listener States
  const [listenerLogs, setListenerLogs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions || !navigator.permissions.query) {
      return;
    }

    let geoStatusObj: PermissionStatus | null = null;
    let notifStatusObj: PermissionStatus | null = null;

    const handleGeoChange = () => {
      const timestamp = new Date().toLocaleTimeString();
      setListenerLogs((prev) => [
        `[${timestamp}] Geolocation status updated to: ${geoStatusObj?.state}`,
        ...prev.slice(0, 19)
      ]);
    };

    const handleNotifChange = () => {
      const timestamp = new Date().toLocaleTimeString();
      setListenerLogs((prev) => [
        `[${timestamp}] Notifications status updated to: ${notifStatusObj?.state}`,
        ...prev.slice(0, 19)
      ]);
    };

    const setupListeners = async () => {
      try {
        geoStatusObj = await navigator.permissions.query({ name: "geolocation" });
        geoStatusObj.addEventListener("change", handleGeoChange);

        notifStatusObj = await navigator.permissions.query({ name: "notifications" as PermissionName });
        notifStatusObj.addEventListener("change", handleNotifChange);
      } catch (err) {
        // Suppress errors for unsupported queries
      }
    };

    setupListeners();

    return () => {
      if (geoStatusObj) {
        geoStatusObj.removeEventListener("change", handleGeoChange);
      }
      if (notifStatusObj) {
        notifStatusObj.removeEventListener("change", handleNotifChange);
      }
    };
  }, []);

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

          {/* ZONE 3: Continuous Geo-Tracking */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold text-sm">
                  3
                </span>
                <h2 className="text-xl font-bold text-slate-900">Continuous Geo-Tracking</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Monitor coordinates in real time using `watchPosition`. Simulates listening for live updates from a physical or mocked GPS device.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <button
                  type="button"
                  data-testid="watch-geo-btn"
                  onClick={toggleWatchPosition}
                  className={`inline-flex items-center gap-2 rounded-lg font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none ${
                    isWatching
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isWatching ? "Stop Tracking" : "Start Tracking"}
                </button>

                {watchCoords && (
                  <div className="text-center space-y-1">
                    <div data-testid="watch-geo-coords" className="text-xs font-semibold text-slate-800 font-mono">
                      {watchCoords}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Position Updates: <span data-testid="watch-geo-count">{watchCount}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ZONE 4: Desktop Notifications */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-sm">
                  4
                </span>
                <h2 className="text-xl font-bold text-slate-900">Desktop Notifications</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Request permissions and send desktop notifications. Use this to verify automation behavior on notification permission popups.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    data-testid="check-notifications-btn"
                    onClick={handleCheckNotificationPermission}
                    className="inline-flex items-center rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 text-xs transition-all focus:outline-none"
                  >
                    Check Status
                  </button>
                  <button
                    type="button"
                    data-testid="request-notifications-btn"
                    onClick={handleRequestNotificationPermission}
                    className="inline-flex items-center rounded-lg bg-indigo-650 hover:bg-indigo-750 text-white font-semibold px-4 py-2 text-xs transition-all focus:outline-none"
                  >
                    Request Access
                  </button>
                  <button
                    type="button"
                    data-testid="send-test-notification-btn"
                    onClick={handleSendTestNotification}
                    className="inline-flex items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 text-xs transition-all focus:outline-none"
                  >
                    Send Notification
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Permission State: <span data-testid="notification-permission-status" className="text-slate-800 font-bold uppercase">{notifPermission}</span>
                  </div>
                  {notifFeedback && (
                    <div data-testid="notification-toast-msg" className="text-xs text-indigo-600 font-medium italic">
                      {notifFeedback}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 5: Clipboard Access */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-750 border border-emerald-200 font-bold text-sm">
                  5
                </span>
                <h2 className="text-xl font-bold text-slate-900">Clipboard Access</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Test reading and writing data parameters to the system clipboard. Practice E2E clipboard state overrides.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Text to Copy</label>
                  <input
                    type="text"
                    data-testid="clipboard-input"
                    value={clipboardVal}
                    onChange={(e) => setClipboardVal(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    data-testid="clipboard-copy-btn"
                    onClick={handleCopyClipboard}
                    className="flex-1 inline-flex justify-center items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 text-xs transition-all focus:outline-none"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    data-testid="clipboard-paste-btn"
                    onClick={handlePasteClipboard}
                    className="flex-1 inline-flex justify-center items-center rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 text-xs transition-all focus:outline-none"
                  >
                    Paste
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wide block">Clipboard Status</span>
                    <span data-testid="clipboard-status" className="font-medium text-slate-700">{clipboardStatus || "Idle"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wide block">Clipboard Output</span>
                    <span data-testid="clipboard-output" className="font-semibold text-slate-950 font-mono bg-white border border-slate-150 px-2 py-0.5 rounded inline-block">{clipboardOutput || "(Empty)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 6: Geofencing Simulator */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-bold text-sm">
                  6
                </span>
                <h2 className="text-xl font-bold text-slate-900">Geofencing Simulator</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Calculates if user coords are within 50km of Paris, France (48.8566° N, 2.3522° E). Mock your location parameters to test geofencing guards.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <button
                  type="button"
                  data-testid="geofence-trigger-btn"
                  onClick={handleVerifyGeofence}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-sm transition-all focus:outline-none"
                >
                  Verify Geofence Location
                </button>

                <div className="text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Geofence Status:{" "}
                    <span
                      data-testid="geofence-status"
                      className={`font-bold ${
                        geofenceStatus === "WITHIN_GEOFENCE"
                          ? "text-emerald-600"
                          : geofenceStatus === "OUT_OF_BOUNDS"
                          ? "text-rose-600"
                          : "text-slate-600"
                      }`}
                    >
                      {geofenceStatus || "NOT_CHECKED"}
                    </span>
                  </div>
                  {geofenceDistance !== null && (
                    <div className="text-xs font-semibold text-slate-700">
                      Distance to Paris: <span data-testid="geofence-distance">{geofenceDistance}</span> km
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 7: Microphone Request */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-750 border border-cyan-200 font-bold text-sm">
                  7
                </span>
                <h2 className="text-xl font-bold text-slate-900">Microphone Request</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Query permissions or request audio hardware stream access from the browser to capture voice data parameters.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-testid="check-mic-btn"
                    onClick={checkMicPermission}
                    className="inline-flex items-center rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 text-xs transition-all focus:outline-none"
                  >
                    Check Mic Status
                  </button>
                  <button
                    type="button"
                    data-testid="request-mic-btn"
                    onClick={requestMicAccess}
                    className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 text-xs transition-all focus:outline-none"
                  >
                    Request Mic Access
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Microphone State: </span>
                  <span
                    data-testid="mic-status"
                    className={`text-sm font-bold uppercase tracking-wider ${
                      micStatus === "Granted"
                        ? "text-emerald-600"
                        : micStatus === "Denied"
                        ? "text-rose-600"
                        : "text-slate-600"
                    }`}
                  >
                    {micStatus}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ZONE 8: Permission Listener */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-750 border border-indigo-200 font-bold text-sm">
                  8
                </span>
                <h2 className="text-xl font-bold text-slate-900">Permission Status Listener</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Listens for live permission changes on Geolocation and Notifications API queries, registering events asynchronously.
              </p>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Listener Status: </span>
                  <span data-testid="permission-listener-status" className="font-bold text-emerald-600 uppercase">ACTIVE</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Logs</label>
                  <div
                    data-testid="permission-listener-logs"
                    className="w-full h-24 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 text-xs font-mono text-slate-700 space-y-1 scrollbar-thin"
                  >
                    {listenerLogs.length === 0 ? (
                      <div className="text-slate-400 italic">Listening for permission changes...</div>
                    ) : (
                      listenerLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-100 pb-1 last:border-b-0">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
