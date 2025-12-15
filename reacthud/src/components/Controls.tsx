import React from "react";
import { ExitIcon, HudIcon, MaximizeIcon, SettingsIcon } from "./Icons";

interface ControlsProps {
  isHudMode: boolean;
  isMph: boolean;
  onToggleHud: () => void;
  onToggleUnits: () => void;
  onExitNav: () => void;
  onOpenSettings: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isHudMode,
  isMph,
  onToggleHud,
  onToggleUnits,
  onExitNav,
  onOpenSettings,
}) => {
  const btnClass =
    "p-3 bg-gray-800/50 rounded-full backdrop-blur-sm text-white hover:bg-gray-700/70 transition-colors";
  const iconClass = `w-7 h-7 transform ${isHudMode ? "scale-x-[-1]" : ""}`;

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Full screen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const iconTransform = isHudMode ? "scaleX(-1)" : ("none" as string);

  return (
    <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 z-20">
      <button onClick={onExitNav} className={btnClass} aria-label="Exit">
        <ExitIcon className={iconClass} />
      </button>

      <button
        onClick={handleFullScreen}
        aria-label="Toggle Full Screen"
        className={btnClass}
      >
        <MaximizeIcon style={{ transform: iconTransform }} />
      </button>

      <button
        onClick={onToggleHud}
        className={btnClass}
        aria-label="Toggle HUD"
      >
        <HudIcon className={iconClass} />
      </button>

      <button
        onClick={onOpenSettings}
        className={btnClass}
        aria-label="Settings"
      >
        <SettingsIcon className={iconClass} />
      </button>

      <button
        onClick={onToggleUnits}
        className="px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm text-white text-lg font-bold hover:bg-gray-700/70"
      >
        <span className={`inline-block ${isHudMode ? "scale-x-[-1]" : ""}`}>
          {isMph ? "MPH" : "KM/H"}
        </span>
      </button>
    </div>
  );
};
