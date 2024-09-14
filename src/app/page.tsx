import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400">
				<h1 className="text-6xl font-bold text-gray-800 mb-8 text-center">
					WorthIt
				</h1>
				<p className="text-xl text-gray-600 mb-8 text-center max-w-md">
					買ってよかったものをみんなに共有しよう！
				</p>
				<Link href="/auth/login" passHref>
					<Button className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-200">
						ログイン
					</Button>
				</Link>
			</div>
		</>
	);
}
