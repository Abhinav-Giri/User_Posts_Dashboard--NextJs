// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
};