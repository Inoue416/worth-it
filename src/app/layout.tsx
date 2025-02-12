// import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header/Header";
import NextAuthProvider from "./providers/NextAuthProvider";
import { Toaster } from "@/components/ui/sonner";
// import Loading from "@/components/loading/Loading";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Worth It",
	description: "買ってよかった、ぜひお勧めしたいアイテムをお届けし合うサービス",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextAuthProvider>
					<Header />
					<div className="min-h-screen bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 py-12 px-4 sm:px-6 lg:px-8">
						{/* <Suspense fallback={<Loading />}>{children}</Suspense> */}
						{children}
					</div>
				</NextAuthProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
