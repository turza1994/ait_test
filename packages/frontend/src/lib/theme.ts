import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Design tokens for consistent spacing
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem", 
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
}

// Design tokens for consistent border radius
export const borderRadius = {
  sm: "0.25rem",
  md: "0.5rem", 
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
}

// Typography scale
export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem", 
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
}

// Breakpoints for responsive design
export const breakpoints = {
  sm: "640px",
  md: "768px", 
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
}