import React from "react";
import {
  ArrowUpIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  FlagIcon,
  ArrowUturnLeftIcon,
  type IconProps, // Import the interface so we can use it in the return type
} from "./components/Icons";

// --- Constants ---
export const M_S_TO_KMH = 3.6;
export const M_S_TO_MPH = 2.23694;
export const MANEUVER_THRESHOLD_METERS = 30;

// --- Helper Functions ---

// UPDATED: Return type now explicitly includes IconProps (which has size)
export const getIconForManeuver = (
  maneuver: any
): React.FC<IconProps> => {
  const type = maneuver?.type;
  const modifier = maneuver?.modifier;
  if (type === "arrive") return FlagIcon;
  if (modifier?.includes("uturn")) return ArrowUturnLeftIcon;
  if (modifier?.includes("right")) return ArrowRightIcon;
  if (modifier?.includes("left")) return ArrowLeftIcon;
  return ArrowUpIcon; // Default
};

export function getDistance(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number }
): number {
  const R = 6371e3; // metres
  const φ1 = (from.lat * Math.PI) / 180;
  const φ2 = (to.lat * Math.PI) / 180;
  const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
  const Δλ = ((to.lon - from.lon) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const formatDistance = (distanceMeters: number, isMph: boolean): string => {
  if (isMph) {
    const feet = distanceMeters * 3.28084;
    if (feet < 528) return `${Math.round(feet / 10) * 10} ft`;
    return `${(feet / 5280).toFixed(1)} mi`;
  } else {
    if (distanceMeters < 1000)
      return `${Math.round(distanceMeters / 10) * 10} m`;
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }
};