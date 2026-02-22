import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function createMailtoLink(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}): string {
  const company = data.company?.trim() || "Unknown";
  const subject = encodeURIComponent(`Technical Review Request from ${company}`);
  const body = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${company}\n\nMessage:\n${data.message}`
  );
  return `mailto:contact@nokulabs.com?subject=${subject}&body=${body}`;
}