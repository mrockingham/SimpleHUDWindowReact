import { useEffect, useRef } from "react";

export const useWakeLock = (shouldLock: boolean) => {
  // Use 'any' to avoid TypeScript issues if types aren't fully updated
  const wakeLock = useRef<any>(null);

  useEffect(() => {
    // If we shouldn't lock (e.g. not navigating yet), or API not supported, stop.
    if (!shouldLock || !("wakeLock" in navigator)) return;

    const requestLock = async () => {
      try {
        // Request the screen stay on
        wakeLock.current = await (navigator as any).wakeLock.request("screen");
        console.log("Screen Wake Lock active");
      } catch (err) {
        console.warn("Could not acquire wake lock:", err);
      }
    };

    // Request lock initially
    requestLock();

    // Re-acquire lock if user switches tabs and comes back
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && shouldLock) {
        requestLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup: Release lock when component unmounts or shouldLock becomes false
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLock.current) {
        wakeLock.current.release().catch(() => {});
        wakeLock.current = null;
        console.log("Screen Wake Lock released");
      }
    };
  }, [shouldLock]);
};