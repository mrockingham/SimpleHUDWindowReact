import React from "react";

export interface IconProps {
  className?: string;
  size?: number | string; // New prop!
  style?: React.CSSProperties;
}

export const ArrowUpIcon: React.FC<IconProps> = ({ className, size = 175 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
    />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({
  className,
  size = 175,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
    />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({
  className,
  size = 175,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
    />
  </svg>
);

export const FlagIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>
);

export const HudIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"
    />
  </svg>
);

export const ArrowUturnLeftIcon: React.FC<IconProps> = ({
  className,
  size = 175,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3"
    />
  </svg>
);

export const ExitIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 15l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-1.007 1.11-.11.55.897.09 1.996.06 3.001.032 1.004.897 1.77 1.996.06.996-.09 1.007-.56 1.11-1.11.09-.542-.2-1.11-.5-1.66-.3-.55.06-1.11.5-1.11.55 0 .8.56.5 1.11-.09.542-.56 1.007-1.11 1.11-.55-.897-.09-1.996-.06-3.001-.032-1.004-.897-1.77-1.996-.06-.996.09-1.007.56-1.11 1.11-.09.542.2 1.11.5 1.66.3.55-.06 1.11-.5 1.11-.55 0-.8-.56-.5-1.11zM1.75 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM19.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.032 4.22a1.5 1.5 0 01-2.122 2.122 1.5 1.5 0 012.122-2.122zM13.854 4.22a1.5 1.5 0 012.122 2.122 1.5 1.5 0 01-2.122-2.122zM8.032 17.65a1.5 1.5 0 01-2.122-2.122 1.5 1.5 0 012.122 2.122zM13.854 17.65a1.5 1.5 0 012.122-2.122 1.5 1.5 0 01-2.122 2.122z"
    />
  </svg>
);

export const MaximizeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
  </svg>
);
