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
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md z-50">
      <div
        className={`p-6 bg-gray-900/80 rounded-lg border border-gray-700 w-full max-w-sm text-white transform ${
          isHudMode ? "scale-x-[-1]" : ""
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>

        {/* Color Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3 text-gray-300">
            HUD Color
          </label>
          <div className="flex justify-between">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={`w-12 h-12 rounded-full transition-transform transform hover:scale-110 ${
                  color === c ? "ring-2 ring-offset-2 ring-offset-gray-900" : ""
                }`}
                style={{ backgroundColor: c, ringColor: c }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Size Adjustment */}
        <div className="mb-8">
          <label
            htmlFor="size-slider"
            className="block text-lg font-semibold mb-3 text-gray-300"
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
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: color }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Smaller</span>
            <span>Larger</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-6 py-3 text-xl font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
