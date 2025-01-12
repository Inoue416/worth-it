"use client";
import type { EditPostDto, GetPostDto } from "@/dtos/PostDto";
import { useState } from "react";
import { toast } from "sonner";
import { app } from "@/lib/firebase/firebaseProvider";
import { fetchImage } from "@/lib/firebase/firebaseStorage";
import { useRouter } from "next/navigation";

export const useMyPostGetById = () => {
	const router = useRouter();
	const [post, setPost] = useState<EditPostDto | undefined>(undefined);
	const [isLoading, setLoading] = useState(true);

	const fetchMyPost = async (postId: number) => {
		try {
			const res = await fetch("/api/get-by-id-my-post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postId }),
			});

			if (!res.ok) {
				setPost(undefined);
				toast.error("不正なアクセスです");
				router.push("/");
			}

			const data = (await res.json()).posts as GetPostDto;
			const fetchImageResponse = await fetchImage(app, data.imageUrl);
			const defaultPost: EditPostDto = {
				id: data.id,
				title: data.title,
				appealPoint: data.appealPoint,
				price: data.price,
				link: data.link,
				category: data.category,
				updatedAt: data.updatedAt,
				imageUrl: data.imageUrl,
				imageSrc: fetchImageResponse,
			};
			setPost(defaultPost);
		} catch (error) {
			console.error(error);
			toast.error("不正なアクセスです");
			router.push("/");
		} finally {
			setLoading(false);
		}
	};

	return { post, isLoading, fetchMyPost };
};
