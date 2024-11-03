import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combines and merges Tailwind CSS classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
