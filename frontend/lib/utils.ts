import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COMMUNITY_CONTRACT_ADDRESS = "0x664d86CF8D30EEC4169393a70EB3aa796BE85642";
export const CHAIN_ID = "1115";