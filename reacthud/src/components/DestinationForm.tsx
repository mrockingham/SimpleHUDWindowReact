import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { type MapboxSuggestion, type GeolocationData } from "../types";

const MAPBOX_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

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
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        debouncedSearchTerm
      )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true${proximity}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm, coords]);

  const handleSelect = (suggestion: MapboxSuggestion) => {
    setSearchTerm(suggestion.place_name);
    setSuggestions([]);
    onSubmit(suggestion);
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
      {/* CSS Styles for Form Elements */}
      <style>{`
        .hud-input:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.25);
          border-color: var(--hud-color) !important;
        }
        .hud-button:hover:not(:disabled) {
          background-color: #22d3ee !important; /* Cyan-400 */
          transform: translateY(-1px);
        }
        .hud-suggestion-btn:hover {
          background-color: var(--hud-color);
          color: black;
        }
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
            placeholder="Where to?"
            className="hud-input"
            disabled={isLoading}
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
                maxHeight: "15rem",
                overflowY: "auto",
                backdropFilter: "blur(24px)",
                padding: 0,
                listStyle: "none",
              }}
            >
              {suggestions.map((s) => (
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
                    }}
                  >
                    <span style={{ display: "block", fontWeight: "bold" }}>
                      {s.text}
                    </span>
                    <span style={{ fontSize: "0.875rem", opacity: 0.75 }}>
                      {s.place_name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
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
                isLoading || !searchTerm.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
              opacity: isLoading || !searchTerm.trim() ? 0.5 : 1,
            }}
          >
            {isLoading ? "Calculating..." : "Start Drive"}
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
