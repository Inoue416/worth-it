"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Heart, ExternalLink, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { GetPostDto } from "@/dtos/PostDto";
import { toast } from "sonner";

export const PostItem = ({
	id,
	title,
	appealPoint,
	imageUrl,
	price,
	link,
	category,
	// TODO: 将来的には表示したい
	updatedAt,
}: GetPostDto) => {
	// TODO: いいね数をDBから取得する
	const [likes, setLikes] = useState(0);
	const [isLike, setIsLike] = useState(false);
	const handleLike = () => {
		const response = fetch(`/api/likes?postId=${id}`, {
			method: "POST",
		});
		response
			.then((item) => {
				if (item.status !== 200) {
					return;
				}
				if (isLike) {
					setLikes(likes - 1);
					setIsLike(!isLike);
					return;
				}
				setLikes(likes + 1);
				setIsLike(!isLike);
			})
			.catch((err) => {
				console.error(err);
				toast.error("いいねの処理に失敗しました。");
			});
	};

	useEffect(() => {
		const fetchLikes = async () => {
			const response = await fetch(`/api/likes?postId=${id}`, {
				method: "GET",
			});
			if (response.status !== 200) {
				return;
			}
			const data = await response.json();
			setLikes(data.likes);
			setIsLike(data.isLike);
		};
		fetchLikes();
	}, [id]);

	return (
		<motion.div
			className="group relative bg-white p-4 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
			whileHover={{ y: -5 }}
		>
			<a href={link} target="_blank" rel="noopener noreferrer">
				<div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-lg font-semibold truncate flex-grow">{title}</h3>
					<div className="flex items-center space-x-1 text-sm text-gray-500">
						<Tag className="h-4 w-4" />
						<span>{category}</span>
					</div>
				</div>
				<p className="text-sm text-gray-600 mb-3 line-clamp-2">{appealPoint}</p>
			</a>
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
						className={`h-5 w-5 ${isLike ? "fill-red-500 text-red-500" : ""}`}
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
