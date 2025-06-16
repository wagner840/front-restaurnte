import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para normalizar strings, garantindo correspondência insensível a maiúsculas/minúsculas
export const normalizeString = (str: string | undefined | null): string => {
  if (typeof str !== "string") return "";
  return str.trim().toLowerCase();
};
