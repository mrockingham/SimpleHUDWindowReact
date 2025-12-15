import React, { useState, useMemo, useEffect } from "react";
import {
  AppState,
  GeolocationStatus,
  type Instruction,
  type MapboxSuggestion,
} from "./types";
import { useGeolocation } from "./hooks/useGeolocation";
import { HUDDisplay } from "./components/HUDDisplay";
import { Controls } from "./components/Controls";
import { StatusScreen } from "./components/StatusScreen";
import { DestinationForm } from "./components/DestinationForm";
import { SettingsModal } from "./components/SettingsModal";

import {
  getDistance,
  getIconForManeuver,
  formatDistance,
  M_S_TO_KMH,
  M_S_TO_MPH,
  MANEUVER_THRESHOLD_METERS,
} from "./utils";

const MAPBOX_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

const App: React.FC = () => {
  const {
    status: geoStatus,
    data: geoData,
    error: geoError,
  } = useGeolocation();

  const [appState, setAppState] = useState<AppState>(
    AppState.DESTINATION_SELECT
  );
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // UI State
  const [isHudMode, setIsHudMode] = useState(false);
  const [isMph, setIsMph] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hudColor, setHudColor] = useState("#06b6d4");
  const [hudSize, setHudSize] = useState(1);

  // Load and apply settings
  useEffect(() => {
    const savedColor = localStorage.getItem("hudColor");
    const savedSize = localStorage.getItem("hudSize");
    if (savedColor) setHudColor(savedColor);
    if (savedSize) setHudSize(parseFloat(savedSize));
  }, []);

  useEffect(() => {
    localStorage.setItem("hudColor", hudColor);
    localStorage.setItem("hudSize", hudSize.toString());
    document.documentElement.style.setProperty("--hud-color", hudColor);
    document.documentElement.style.setProperty(
      "--hud-size-multiplier",
      hudSize.toString()
    );
  }, [hudColor, hudSize]);

  const handleGetDirections = async (destination: MapboxSuggestion) => {
    setAppState(AppState.LOADING);
    setApiError(null);

    if (!MAPBOX_TOKEN) {
      return (
        setApiError("Mapbox access token is not configured."),
        setAppState(AppState.ERROR)
      );
    }
    if (!geoData.coords) {
      return (
        setApiError("Could not get current location."),
        setAppState(AppState.ERROR)
      );
    }

    try {
      const { longitude, latitude } = geoData.coords;
      const [destLon, destLat] = destination.center;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destLon},${destLat}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch directions from Mapbox API.");

      const data = await response.json();
      if (data.code !== "Ok" || !data.routes?.length)
        throw new Error(data.message || "No routes found.");

      const parsed: Instruction[] = data.routes[0].legs.flatMap((leg: any) =>
        leg.steps.map(
          (step: any): Instruction => ({
            icon: getIconForManeuver(step.maneuver),
            distance: step.distance,
            action: step.maneuver.instruction,
            location: step.maneuver.location,
          })
        )
      );

      setInstructions(parsed);
      setInstructionIndex(0);
      setAppState(AppState.NAVIGATING);
    } catch (err: any) {
      setApiError(err.message || "An unknown error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleExitNav = () => {
    setInstructions([]);
    setInstructionIndex(0);
    setAppState(AppState.DESTINATION_SELECT);
  };

  useEffect(() => {
    if (
      appState !== AppState.NAVIGATING ||
      !geoData.coords ||
      instructionIndex >= instructions.length - 1
    )
      return;

    const nextManeuver = instructions[instructionIndex];
    const distanceToNext = getDistance(
      { lat: geoData.coords.latitude, lon: geoData.coords.longitude },
      { lat: nextManeuver.location[1], lon: nextManeuver.location[0] }
    );
    if (distanceToNext < MANEUVER_THRESHOLD_METERS) {
      setInstructionIndex((prev) => prev + 1);
    }
  }, [geoData.coords, instructions, instructionIndex, appState]);

  const speedDisplay = useMemo(() => {
    if (geoData.speed === null) return "--";
    const speed = isMph
      ? geoData.speed * M_S_TO_MPH
      : geoData.speed * M_S_TO_KMH;
    return Math.round(speed).toString().padStart(2, "0");
  }, [geoData.speed, isMph]);

  const currentInstruction = instructions[instructionIndex];

  const distanceToTurn = useMemo(() => {
    if (!currentInstruction || !geoData.coords) return "--";
    const distance = getDistance(
      { lat: geoData.coords.latitude, lon: geoData.coords.longitude },
      {
        lat: currentInstruction.location[1],
        lon: currentInstruction.location[0],
      }
    );
    return formatDistance(distance, isMph);
  }, [geoData.coords, currentInstruction, isMph]);

  const renderContent = () => {
    if (geoStatus === GeolocationStatus.PENDING) {
      return (
        <StatusScreen
          title="Waiting for Location"
          message="Please grant location permission to start."
        />
      );
    }
    if (geoStatus === GeolocationStatus.DENIED) {
      return (
        <StatusScreen
          title="Location Access Denied"
          message={geoError?.message || "Please enable location services."}
        />
      );
    }

    switch (appState) {
      case AppState.DESTINATION_SELECT:
        return (
          <DestinationForm
            isLoading={false}
            error={apiError}
            onSubmit={handleGetDirections}
            coords={geoData.coords}
          />
        );
      case AppState.LOADING:
        return (
          <StatusScreen
            title="Calculating Route..."
            message="Fetching the best route for your destination."
          />
        );
      case AppState.ERROR:
        return (
          <StatusScreen
            title="Error"
            message={apiError || "Something went wrong."}
          >
            <button
              onClick={() => setAppState(AppState.DESTINATION_SELECT)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                backgroundColor: "rgb(8, 145, 178)",
                color: "black",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </StatusScreen>
        );
      case AppState.NAVIGATING:
        if (!currentInstruction) {
          return (
            <StatusScreen
              title="Route Complete"
              message="You have arrived at your destination."
            >
              <button
                onClick={handleExitNav}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "rgb(8, 145, 178)",
                  color: "black",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                New Route
              </button>
            </StatusScreen>
          );
        }
        return (
          <div
            style={{
              position: "relative",
              height: "100vh",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            <Controls
              isHudMode={isHudMode}
              isMph={isMph}
              onToggleHud={() => setIsHudMode((p) => !p)}
              onToggleUnits={() => setIsMph((p) => !p)}
              onExitNav={handleExitNav}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              color={hudColor}
              onColorChange={setHudColor}
              size={hudSize}
              onSizeChange={setHudSize}
              isHudMode={isHudMode}
            />
            <div
              style={{
                width: "100%",
                height: "90%",
                transition: "transform 0.3s ease",
                transform: isHudMode ? "scaleX(-1)" : "none",
              }}
            >
              <HUDDisplay
                speedDisplay={speedDisplay}
                unit={isMph ? "mph" : "km/h"}
                currentInstruction={currentInstruction}
                distanceToTurn={distanceToTurn}
              />
            </div>
          </div>
        );
      default:
        return (
          <StatusScreen
            title="Initializing..."
            message="Setting up HUD Navigation system."
          />
        );
    }
  };

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        fontFamily: "sans-serif",
        color: "white",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {renderContent()}
    </main>
  );
};

export default App;
