"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { useSession, signIn } from "next-auth/react";
import { getBaseUrl } from "@/lib/utils";

const LoginForm = () => {
	const { data: session, status } = useSession();
	const baseUrl = getBaseUrl();
	const redirectUrl = `${baseUrl}`;
	if (status !== "authenticated") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							ログイン
						</CardTitle>
						<CardDescription className="text-center">
							SNSアカウントでログインしてください
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<Button
							variant="outline"
							className="w-full"
							onClick={() =>
								signIn("google", { callbackUrl: redirectUrl, prompt: "login" })
							}
						>
							<FaGoogle className="mr-2 h-4 w-4" />
							Googleでログイン
						</Button>

						<Button variant="outline" className="w-full">
							<FaXTwitter className="mr-2 h-4 w-4" />
							Twitterでログイン
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}
};

export default LoginForm;
