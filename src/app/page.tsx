"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading/Loading";

export default function Home() {
	const { data: session, status } = useSession();
	if (status === "loading") return <Loading />;

	const fetchHelloWorld = async () => {
		const res = await fetch("/api/hello");
		const { message } = await res.json();
		console.log("Fetch DB Result: ", message);
	};
	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-center">
				{status === "authenticated" ? (
					<>
						<h1 className="text-6xl font-bold text-gray-800 mb-8 text-center">
							WorthIt
						</h1>
						<p className="text-xl text-gray-600 mb-8 text-center max-w-md">
							買ってよかったものをみんなに共有しよう！
						</p>
						<div className="flex space-x-6">
							<Link href={"/post-form"}>
								<Button className="w-32 flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-md shadow-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
									投稿する
								</Button>
							</Link>
							<Link href={"/post-list"}>
								<Button className="w-32 flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 rounded-md shadow-md hover:from-gray-500 hover:to-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
									みんなの投稿を見る
								</Button>
							</Link>
						</div>
					</>
				) : (
					<>
						<h1 className="text-6xl font-bold text-gray-800 mb-8 text-center">
							WorthIt
						</h1>
						<p className="text-xl text-gray-600 mb-8 text-center max-w-md">
							買ってよかったものをみんなに共有しよう！
						</p>
						<Link href="/login" passHref>
							<Button className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-200">
								ログイン
							</Button>
						</Link>
						<Button
							className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-5 rounded-full text-lg font-semibold transition-colors duration-200"
							onClick={() => {}}
						>
							DB接続テスト用
						</Button>
					</>
				)}
			</div>
		</>
	);
}
