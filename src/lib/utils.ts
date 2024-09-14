import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getBaseUrl() {
	const baseUrl = process.env.APP_URL;
	console.log("baseUrl", baseUrl);
	return baseUrl ? baseUrl : "";
}
