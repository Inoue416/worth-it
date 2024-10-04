import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getBaseUrl() {
	const baseUrl =
		process.env.APP_URL ||
		process.env.NEXT_PUBLIC_VERCEL_URL ||
		"localhost:3000";
	console.log("baseUrl", baseUrl);
	return baseUrl ? baseUrl : "";
}
