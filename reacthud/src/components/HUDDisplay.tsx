import React, { useMemo } from "react";
import { type Instruction } from "../types";

interface HUDDisplayProps {
  speedDisplay: string;
  unit: string;
  currentInstruction: Instruction;
  distanceToTurn: string;
}

// --- 3D Building Component ---
// This creates a wireframe cube using CSS 3D transforms
const BuildingBlock: React.FC<{
  x: string; // Left/Right position
  z: number; // Depth position
  width: number;
  height: number;
  delay: number; // Animation delay to scatter them
}> = ({ x, z, width, height }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: `${z}px`,
        width: `${width}px`,
        height: `${height}px`,
        transformStyle: "preserve-3d",
        transform: "rotateX(-90deg) translateZ(0)", // Stand the building up
        transformOrigin: "bottom",
      }}
    >
      {/* Front Face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid var(--hud-color)",
          backgroundColor: "rgba(0,0,0,0.5)",
          boxShadow: "0 0 5px var(--hud-color)",
          opacity: 0.6,
          transform: `translateZ(${width / 2}px)`,
        }}
      />
      {/* Top Face (Roof) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${width}px`, // Top is square-ish
          border: "1px solid var(--hud-color)",
          backgroundColor: "rgba(0,0,0,0.8)",
          transformOrigin: "top",
          transform: "rotateX(-90deg)",
        }}
      />
      {/* Side Face (Outer) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${width}px`,
          height: "100%",
          border: "1px solid var(--hud-color)",
          backgroundColor: "rgba(0,0,0,0.5)",
          transformOrigin: "left",
          transform: "rotateY(-90deg)",
        }}
      />
    </div>
  );
};

// --- The City Generation Layer ---
const RetroCity: React.FC<{ speed: number }> = ({ speed }) => {
  // Determine animation duration based on speed
  // Faster speed = Lower duration (faster animation)
  // If stopped (0), we set a super slow crawl just for effect
  const duration = speed > 0 ? Math.max(1, 100 / speed) : 20;

  // Generate some static "random" buildings so they don't flicker on re-render
  // We use useMemo so they calculate once
  const leftBuildings = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      z: i * 200, // Space them out every 200px
      width: 40 + Math.random() * 40,
      height: 60 + Math.random() * 120,
    }));
  }, []);

  const rightBuildings = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      z: i * 200 + 100, // Offset slightly from left side
      width: 40 + Math.random() * 40,
      height: 60 + Math.random() * 120,
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Container that moves towards the camera */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          animation: `moveCity ${duration}s linear infinite`,
        }}
      >
        {/* LEFT SIDE BUILDINGS */}
        {leftBuildings.map((b, i) => (
          <BuildingBlock
            key={`l-${i}`}
            x="5%" // Position on left edge of road
            z={b.z}
            width={b.width}
            height={b.height}
            delay={0}
          />
        ))}

        {/* RIGHT SIDE BUILDINGS */}
        {rightBuildings.map((b, i) => (
          <BuildingBlock
            key={`r-${i}`}
            x="85%" // Position on right edge of road
            z={b.z}
            width={b.width}
            height={b.height}
            delay={0}
          />
        ))}
      </div>

      <style>{`
        @keyframes moveCity {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); } /* Move one 'grid unit' forward */
        }
      `}</style>
    </div>
  );
};

// --- The Cool 3D Road Component ---
const RetroRoad: React.FC<{
  turnDirection: "straight" | "left" | "right" | "slight-left" | "slight-right";
  speed: number;
}> = ({ turnDirection, speed }) => {
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
        top: "0%", // Started higher to accommodate buildings
        left: 0,
        width: "100%",
        height: "55%", // Lower half of screen
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        perspective: "600px", // Essential for 3D effect
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-50%",
          width: "200%",
          height: "100%",
          transformStyle: "preserve-3d", // Allow children to be 3D
          transform: "rotateX(60deg) translateY(20%)", // Tilt the floor
          transformOrigin: "bottom",
        }}
      >
        {/* 1. The City Layer (Buildings) */}
        {/* We place this BEFORE the fog so they fade out properly */}
        <RetroCity speed={speed} />

        {/* 2. The Road Surface */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.5,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Vertical Lane Dividers */}
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

          {/* Horizon Fade (Fog) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "60%", // Fade the top 60%
              background:
                "linear-gradient(to bottom, black 20%, transparent 100%)",
              zIndex: 2, // Sit on top of buildings at the horizon
            }}
          />
        </div>

        {/* 3. The Curving Road Lines */}
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
            transform: "translateZ(2px)", // Lift off the floor
            zIndex: 10,
          }}
        >
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

  const numericSpeed = parseInt(speedDisplay) || 0;

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
      {/* 1. The Background Road Layer */}
      <RetroRoad turnDirection={turnDirection} speed={numericSpeed} />

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
            ...whiteGlowStyle,
            width: "25vmin",
            height: "25vmin",
            color: "white",
          }}
        />
      </div>

      {/* BOTTOM: Speed & Text */}
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
              fontSize: "15vmin",
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
