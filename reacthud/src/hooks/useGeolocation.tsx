import { useState, useEffect, useCallback } from "react";
import { GeolocationStatus, type GeolocationData } from "../types";

export const useGeolocation = () => {
  const [status, setStatus] = useState<any>(GeolocationStatus.PENDING);
  const [data, setData] = useState<any>({
    speed: null,
    heading: null,
    coords: null,
  });
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setStatus(GeolocationStatus.GRANTED);
    setData({
      speed: position.coords.speed,
      heading: position.coords.heading,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    setError(null);
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setStatus(GeolocationStatus.DENIED);
    setError(error);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus(GeolocationStatus.DENIED);
      // Create a compatible error object
      const customError: GeolocationPositionError = {
        code: 0, // Using a custom code
        message: "Geolocation is not supported by your browser.",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      };
      setError(customError);
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [handleSuccess, handleError]);

  return { status, data, error };
};
