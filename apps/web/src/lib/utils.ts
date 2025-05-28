import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeCitationsFromText(text: string): string {
  // Remove citations in the format [1], [2], etc.
  return text.replace(/\[\d+\]/g, '').trim();
}
