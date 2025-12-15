import React from "react";

interface StatusScreenProps {
  title: string;
  message: string;
  children?: React.ReactNode;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({
  title,
  message,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white p-8 text-center z-50 relative">
      {/* Title with HUD Glow */}
      <h1
        className="text-4xl md:text-5xl font-bold text-[var(--hud-color)] mb-6"
        style={{
          filter: "drop-shadow(0 0 10px var(--hud-color))",
        }}
      >
        {title}
      </h1>

      {/* Message Text */}
      <p className="text-lg md:text-xl text-gray-300 max-w-md leading-relaxed">
        {message}
      </p>

      {/* Action Buttons (e.g. "Try Again") */}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
};
