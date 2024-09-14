"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-2 flex items-center justify-between">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" aria-label="メニューを開く">
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[250px] sm:w-[300px]">
						<nav className="flex flex-col gap-4">
							<Link
								href="/"
								className="text-lg font-semibold"
								onClick={() => setIsOpen(false)}
							>
								ホーム
							</Link>
							<Link
								href="/profile"
								className="text-lg font-semibold"
								onClick={() => setIsOpen(false)}
							>
								プロフィール
							</Link>
							<Link
								href="/settings"
								className="text-lg font-semibold"
								onClick={() => setIsOpen(false)}
							>
								設定
							</Link>
							<Link
								href="/logout"
								className="text-lg font-semibold"
								onClick={() => setIsOpen(false)}
							>
								ログアウト
							</Link>
						</nav>
					</SheetContent>
				</Sheet>

				<div className="flex-grow flex justify-center">
					<Link href="/" passHref>
						<Button
							variant="ghost"
							className="text-2xl font-bold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
							aria-label="トップページへ"
						>
							WorthIt
						</Button>
					</Link>
				</div>

				{/* 右側のスペースを確保するための空の要素 */}
				<div className="w-10"></div>
			</div>
		</header>
	);
};

export default Header;
