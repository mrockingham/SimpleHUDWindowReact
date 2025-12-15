import React from "react";

// --- REPLACE ENUMS WITH CONST OBJECTS ---

// 1. AppState
export const AppState = {
  DESTINATION_SELECT: "DESTINATION_SELECT",
  LOADING: "LOADING",
  NAVIGATING: "NAVIGATING",
  ERROR: "ERROR",
} as const;

export type AppState = (typeof AppState)[keyof typeof AppState];


// 2. GeolocationStatus
export const GeolocationStatus = {
  PENDING: "PENDING",
  GRANTED: "GRANTED", // <--- CHANGED: This was "SUCCESS", now it matches your error
  DENIED: "DENIED",
  ERROR: "ERROR",
} as const;

export type GeolocationStatus = (typeof GeolocationStatus)[keyof typeof GeolocationStatus];


// --- INTERFACES ---

export interface Instruction {
  // We explicitly type the Icon component here
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  distance: number;
  action: string;
  location: [number, number];
}

export interface MapboxSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
}

export interface GeolocationData {
  coords: {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
  } | null;
  timestamp: number | null;
}