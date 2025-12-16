import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { type MapboxSuggestion, type GeolocationData } from "../types";

const MAPBOX_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

// --- Helper Icons ---
const PinIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const StoreIcon = () => (
  <svg
    className="w-5 h-5 text-cyan-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 100-4 2 2 0 000 4zm-6 0a2 2 0 100-4 2 2 0 000 4h6"
    />
  </svg>
);

interface DestinationFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (destination: MapboxSuggestion) => void;
  coords: GeolocationData["coords"];
}

export const DestinationForm: React.FC<DestinationFormProps> = ({
  isLoading,
  error,
  onSubmit,
  coords,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // We need a session token for the Search Box API to group keystrokes
  const sessionToken = useRef(crypto.randomUUID());

  const staticMapUrl = coords
    ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${coords.longitude},${coords.latitude},14,0,0/1280x1280?access_token=${MAPBOX_TOKEN}`
    : "";

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsFetching(true);

      const proximity = coords
        ? `&proximity=${coords.longitude},${coords.latitude}`
        : "";

      // NEW API ENDPOINT: Search Box API (Suggest)
      // This is much better at finding "Walmart" vs "Walmart Drive"
      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
        debouncedSearchTerm
      )}&access_token=${MAPBOX_TOKEN}&session_token=${
        sessionToken.current
      }&types=brand,poi,address&limit=10${proximity}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Map the new API response format to our existing MapboxSuggestion type
        const mappedSuggestions: MapboxSuggestion[] = (
          data.suggestions || []
        ).map((s: any) => ({
          id: s.mapbox_id, // Important: We store the mapbox_id here
          text: s.name,
          place_name: s.full_address || s.place_formatted,
          // NOTE: The Suggest API does NOT return coordinates.
          // We set a dummy [0,0] here and fetch the real ones in handleSelect
          center: [0, 0],
          place_type: [s.feature_type || "poi"],
        }));

        setSuggestions(mappedSuggestions);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm, coords]);

  const handleSelect = async (suggestion: MapboxSuggestion) => {
    setSearchTerm(suggestion.text);
    setSuggestions([]);
    setIsFetching(true); // Show loading while we retrieve coords

    try {
      // STEP 2: RETRIEVE
      // We have the ID, now we need the actual coordinates to navigate.
      const retrieveUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.id}?access_token=${MAPBOX_TOKEN}&session_token=${sessionToken.current}`;

      const res = await fetch(retrieveUrl);
      const data = await res.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        // Create the final object with REAL coordinates
        const finalDestination: MapboxSuggestion = {
          ...suggestion,
          center: feature.geometry.coordinates, // [lon, lat]
          place_name: feature.properties.full_address || suggestion.place_name,
        };

        // Reset session token for next search
        sessionToken.current = crypto.randomUUID();

        onSubmit(finalDestination);
      }
    } catch (err) {
      console.error("Failed to retrieve details:", err);
      // Fallback: Just try sending it anyway (though it might fail without coords)
      onSubmit(suggestion);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        color: "white",
        overflow: "hidden",
      }}
    >
      <style>{`
        .hud-input:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.25);
          border-color: var(--hud-color) !important;
        }
        .hud-button:hover:not(:disabled) {
          background-color: #22d3ee !important; 
          transform: translateY(-1px);
        }
        .hud-suggestion-btn:hover {
          background-color: rgba(6, 182, 212, 0.15); 
        }
        .hud-list::-webkit-scrollbar { width: 8px; }
        .hud-list::-webkit-scrollbar-track { background: #111827; }
        .hud-list::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
      `}</style>

      {/* BACKGROUND MAP LAYER */}
      {staticMapUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        >
          <img
            src={staticMapUrl}
            alt="Map Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, black, transparent, black)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, black, transparent, black)",
            }}
          />
        </div>
      )}

      {/* CONTENT LAYER */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "32rem",
          padding: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "var(--hud-color)",
            marginBottom: "2rem",
            letterSpacing: "0.05em",
            filter: "drop-shadow(0 0 15px var(--hud-color))",
            textShadow: "0 0 10px black",
            textAlign: "center",
          }}
        >
          HUD Navigation
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search (e.g. Walmart)..."
            className="hud-input"
            disabled={isLoading || isFetching}
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              fontSize: "1.25rem",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "2px solid var(--hud-color)",
              borderRadius: "0.75rem",
              color: "white",
              transition: "all 0.2s ease",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.8)",
            }}
          />

          {suggestions.length > 0 && (
            <ul
              className="hud-list"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 50,
                width: "100%",
                marginTop: "0.5rem",
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                textAlign: "left",
                maxHeight: "20rem",
                overflowY: "auto",
                backdropFilter: "blur(24px)",
                padding: 0,
                listStyle: "none",
              }}
            >
              {suggestions.map((s) => {
                // Check if it is a brand or poi for the icon
                const isPoi = s.place_type?.some(
                  (t) => t === "brand" || t === "poi"
                );

                return (
                  <li key={s.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <button
                      type="button"
                      onClick={() => handleSelect(s)}
                      className="hud-suggestion-btn"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        color: "#e5e7eb",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "colors 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {/* Icon */}
                      <div style={{ flexShrink: 0 }}>
                        {isPoi ? <StoreIcon /> : <PinIcon />}
                      </div>

                      {/* Text */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            color: isPoi ? "var(--hud-color)" : "white",
                          }}
                        >
                          {s.text}
                        </span>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            opacity: 0.75,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {s.place_name}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="submit"
            disabled={isLoading || isFetching || !searchTerm.trim()}
            className="hud-button"
            style={{
              width: "100%",
              padding: "1rem 1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              backgroundColor: "var(--hud-color)",
              color: "black",
              borderRadius: "0.75rem",
              border: "none",
              cursor:
                isLoading || isFetching || !searchTerm.trim()
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
              opacity: isLoading || isFetching || !searchTerm.trim() ? 0.5 : 1,
            }}
          >
            {isFetching
              ? "Getting Location..."
              : isLoading
              ? "Calculating..."
              : "Start Drive"}
          </button>

          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(127, 29, 29, 0.8)",
                border: "1px solid rgb(239, 68, 68)",
                borderRadius: "0.5rem",
                color: "white",
                fontWeight: 600,
                textAlign: "center",
                backdropFilter: "blur(4px)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
