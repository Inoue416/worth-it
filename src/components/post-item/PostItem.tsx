"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { PostItemProps } from "@/app/post-list/page";

export const PostItem = ({
	name,
	appealPoint,
	imageUrl,
	price,
	likes: initialLikes,
}: PostItemProps) => {
	const [likes, setLikes] = useState(initialLikes);

	const handleLike = () => {
		setLikes((prevLikes) => prevLikes + 1);
		// ここに実際のいいね処理を追加する（APIコールなど）
	};

	return (
		<motion.div
			className="group relative bg-white p-4 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
			whileHover={{ y: -5 }}
		>
			<div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
				<Image
					src={imageUrl}
					alt={name}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>
			<h3 className="text-lg font-semibold mb-2 truncate">{name}</h3>
			<p className="text-sm text-gray-600 mb-3 line-clamp-2">{appealPoint}</p>
			<div className="flex items-center justify-between">
				<p className="text-xl font-bold text-emerald-600">
					¥{price.toLocaleString()}
				</p>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleLike}
					className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
				>
					<Heart
						className={`h-5 w-5 ${likes > 0 ? "fill-red-500 text-red-500" : ""}`}
					/>
					<span className="text-sm font-medium">{likes}</span>
				</Button>
			</div>
			<Button
				variant="ghost"
				size="sm"
				className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
			>
				<ExternalLink className="h-4 w-4 text-gray-600" />
			</Button>
		</motion.div>
	);
};
