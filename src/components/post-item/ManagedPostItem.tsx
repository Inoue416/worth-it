"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { MyPostDto } from "@/dtos/PostDto";
import { app } from "@/lib/firebase/firebaseProvider";
import { fetchImage } from "@/lib/firebase/firebaseStorage";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ManagedPostItemProps extends MyPostDto {
	onDelete: (id: number) => void;
}

export const ManagedPostItem = ({
	id,
	title,
	appealPoint,
	imageUrl,
	price,
	category,
	onDelete,
}: ManagedPostItemProps) => {
	const [imageSrc, setImageSrc] = useState<string>("");

	useEffect(() => {
		fetchImage(app, imageUrl)
			.then((imageSrc) => {
				setImageSrc(imageSrc);
			})
			.catch((error) => {
				setImageSrc("");
				console.error("Error fetching image:", error);
			});
	}, [imageUrl]);

	return (
		<motion.div
			className="group relative bg-white p-4 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-[400px] flex flex-col"
			whileHover={{ y: -5 }}
		>
			<div className="flex-grow flex flex-col">
				<div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
					<Image
						src={imageSrc ?? ""}
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
				<p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
					{appealPoint}
				</p>
			</div>
			<div className="flex items-center justify-between mt-auto">
				<p className="text-xl font-bold text-emerald-600">
					¥{price.toLocaleString()}
				</p>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
						>
							<Edit2 className="h-5 w-5" />
							<span className="text-sm font-medium">管理</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Link
								href={`/managed-posts/edit?postId=${id}`}
								className="flex items-center w-full"
							>
								<Edit2 className="mr-2 h-4 w-4" />
								<span>編集</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onDelete(id)}>
							<Trash2 className="mr-2 h-4 w-4" />
							<span>削除</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</motion.div>
	);
};
