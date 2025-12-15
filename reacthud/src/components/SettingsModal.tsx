import React from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  onColorChange: (color: string) => void;
  size: number;
  onSizeChange: (size: number) => void;
  isHudMode: boolean;
}

const COLORS = [
  "#06b6d4", // Cyan
  "#22c55e", // Green
  "#fafafa", // White
  "#eab308", // Yellow
  "#f43f5e", // Red
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  color,
  onColorChange,
  size,
  onSizeChange,
  isHudMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "24rem",
          backgroundColor: "rgba(17, 24, 39, 0.9)", // Gray-900
          border: "1px solid #374151",
          borderRadius: "1rem",
          padding: "1.5rem",
          color: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          // Apply the mirror flip if HUD mode is on
          transform: isHudMode ? "scaleX(-1)" : "none",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Settings
        </h2>

        {/* Color Selection */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "1.125rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#d1d5db",
            }}
          >
            HUD Color
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                aria-label={`Select color ${c}`}
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "9999px",
                  backgroundColor: c,
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  // This creates the "Ring" effect using Box Shadow instead of Tailwind classes
                  boxShadow:
                    color === c
                      ? `0 0 0 2px #111827, 0 0 0 4px ${c}` // The gap (#111827) then the ring (color)
                      : "none",
                  transform: color === c ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Size Adjustment */}
        <div style={{ marginBottom: "2rem" }}>
          <label
            htmlFor="size-slider"
            style={{
              display: "block",
              fontSize: "1.125rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#d1d5db",
            }}
          >
            Text Size
          </label>
          <input
            id="size-slider"
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={size}
            onChange={(e) => onSizeChange(parseFloat(e.target.value))}
            style={{
              width: "100%",
              height: "0.5rem",
              borderRadius: "0.5rem",
              appearance: "none",
              backgroundColor: "#374151",
              cursor: "pointer",
              accentColor: color, // Uses the selected HUD color for the slider thumb
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "#9ca3af",
            }}
          >
            <span>Smaller</span>
            <span>Larger</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1.125rem",
            fontWeight: 600,
            backgroundColor: "#374151",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#4b5563")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#374151")
          }
        >
          Close
        </button>
      </div>
    </div>
  );
};
