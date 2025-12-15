import React, { useMemo } from "react";
import { type Instruction } from "../types";

interface HUDDisplayProps {
  speedDisplay: string;
  unit: string;
  currentInstruction: Instruction;
  distanceToTurn: string;
}

// --- The Cool 3D Road Component ---
const RetroRoad: React.FC<{
  turnDirection: "straight" | "left" | "right" | "slight-left" | "slight-right";
}> = ({ turnDirection }) => {
  const OFFSET = 25;

  const getPaths = () => {
    let leftPath = "";
    let rightPath = "";

    switch (turnDirection) {
      case "left":
        leftPath = `M ${50 - OFFSET} 100 C ${50 - OFFSET} 60 ${
          10 - OFFSET
        } 60 ${0 - OFFSET} 60`;
        rightPath = `M ${50 + OFFSET} 100 C ${50 + OFFSET} 60 ${
          10 + OFFSET
        } 60 ${0 + OFFSET} 60`;
        break;
      case "right":
        leftPath = `M ${50 - OFFSET} 100 C ${50 - OFFSET} 60 ${
          90 - OFFSET
        } 60 ${100 - OFFSET} 60`;
        rightPath = `M ${50 + OFFSET} 100 C ${50 + OFFSET} 60 ${
          90 + OFFSET
        } 60 ${100 + OFFSET} 60`;
        break;
      case "slight-left":
        leftPath = `M ${50 - OFFSET} 100 C ${50 - OFFSET} 50 ${
          30 - OFFSET
        } 20 ${20 - OFFSET} 0`;
        rightPath = `M ${50 + OFFSET} 100 C ${50 + OFFSET} 50 ${
          30 + OFFSET
        } 20 ${20 + OFFSET} 0`;
        break;
      case "slight-right":
        leftPath = `M ${50 - OFFSET} 100 C ${50 - OFFSET} 50 ${
          70 - OFFSET
        } 20 ${80 - OFFSET} 0`;
        rightPath = `M ${50 + OFFSET} 100 C ${50 + OFFSET} 50 ${
          70 + OFFSET
        } 20 ${80 + OFFSET} 0`;
        break;
      default:
        leftPath = `M ${50 - OFFSET} 100 L ${50 - OFFSET} 0`;
        rightPath = `M ${50 + OFFSET} 100 L ${50 + OFFSET} 0`;
    }
    return { leftPath, rightPath };
  };

  const { leftPath, rightPath } = getPaths();

  return (
    <div
      style={{
        position: "absolute",
        // CHANGED: We push the road down to the bottom 55% of the screen
        // This leaves the top empty for the Arrow to float in pure black
        top: "0%",
        left: 0,
        width: "100%",
        height: "55%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        perspective: "600px",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-50%",
          width: "200%",
          height: "100%",
          transform: "rotateX(60deg) translateY(20%)",
          transformOrigin: "bottom",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.5,
          }}
        >
          {/* Vertical Lane Dividers ONLY (Removed Horizontal Bars) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "20vw",
              opacity: 0.4,
            }}
          >
            {/* The Lane Lines */}
            <div
              style={{
                width: "2px",
                height: "100%",
                background: "var(--hud-color)",
              }}
            />
            <div
              style={{
                width: "2px",
                height: "100%",
                background: "var(--hud-color)",
              }}
            />
            <div
              style={{
                width: "2px",
                height: "100%",
                background: "var(--hud-color)",
              }}
            />
          </div>

          {/* Gradient to fade the road out at the horizon */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "50%",
              background: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>

        {/* The Curving Road Lines */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: "25%",
            width: "50%",
            height: "120%",
            opacity: 1,
            filter: "drop-shadow(0 0 10px var(--hud-color))",
            transform: "translateZ(2px)",
          }}
        >
          {/* Blurred Glow Lines */}
          <path
            d={leftPath}
            stroke="var(--hud-color)"
            strokeWidth="3"
            fill="none"
            style={{ filter: "blur(4px)" }}
          />
          <path
            d={rightPath}
            stroke="var(--hud-color)"
            strokeWidth="3"
            fill="none"
            style={{ filter: "blur(4px)" }}
          />

          {/* Sharp White Center Lines */}
          <path d={leftPath} stroke="white" strokeWidth="1" fill="none" />
          <path d={rightPath} stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
};

// --- Main Component ---

export const HUDDisplay: React.FC<HUDDisplayProps> = ({
  speedDisplay,
  unit,
  currentInstruction,
  distanceToTurn,
}) => {
  const { icon: Icon, action } = currentInstruction;

  const glowStyle = {
    filter:
      "drop-shadow(0 0 8px var(--hud-color)) drop-shadow(0 0 15px var(--hud-color))",
  };

  const whiteGlowStyle = {
    filter: "drop-shadow(0 0 10px white) drop-shadow(0 0 20px white)",
  };

  const turnDirection = useMemo(() => {
    const text = action?.toLowerCase() || "";
    if (text.includes("slight right") || text.includes("bear right"))
      return "slight-right";
    if (text.includes("slight left") || text.includes("bear left"))
      return "slight-left";
    if (text.includes("right")) return "right";
    if (text.includes("left")) return "left";
    return "straight";
  }, [action]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "2rem",
        paddingBottom: "1rem",
      }}
    >
      {/* 1. The Background Road Layer (Now positioned at bottom) */}
      <RetroRoad turnDirection={turnDirection} />

      {/* 2. The Content Layer */}

      {/* TOP: Distance */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <span
          style={{
            ...glowStyle,
            fontWeight: "bold",
            lineHeight: 1,
            fontSize: "15vmin",
            color: "var(--hud-color)",
          }}
        >
          {distanceToTurn}
        </span>
      </div>

      {/* CENTER: Arrow (White & Large) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",

          marginTop: "6rem",
        }}
      >
        <Icon
          style={{
            ...whiteGlowStyle, // Using white glow for the arrow
            width: "25vmin", // Responsive size
            height: "25vmin",
            color: "white", // Force white color
          }}
        />
      </div>

      {/* BOTTOM: Speed & Text (Sitting on the Road) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          flex: 1,
          paddingBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            color: "var(--hud-color)",
          }}
        >
          <span
            style={{
              ...glowStyle,
              fontFamily: "monospace",
              fontWeight: "bold",
              lineHeight: 1,
              fontSize: "15vmin", // Slightly smaller than distance
            }}
          >
            {speedDisplay}
          </span>
          <span
            style={{
              ...glowStyle,
              fontFamily: "sans-serif",
              fontWeight: 300,
              marginLeft: "0.5rem",
              fontSize: "5vmin",
            }}
          >
            {unit}
          </span>
        </div>

        <span
          style={{
            // ...glowStyle,
            display: "block",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            padding: "0.5rem 1rem",
            borderRadius: "0.75rem",
            marginTop: "0.5rem",
            maxWidth: "90%",
            fontSize: "5vmin",
            fontWeight: 600,
            letterSpacing: "0.025em",
            lineHeight: 1.25,
            color: "var(--hud-color)",
            border: "1px solid var(--hud-color)",
          }}
        >
          {action}
        </span>
      </div>
    </div>
  );
};
