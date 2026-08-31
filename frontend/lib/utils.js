import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes securely
 * Required by Aceternity UI components
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
