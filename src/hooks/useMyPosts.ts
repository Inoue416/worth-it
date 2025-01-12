"use client";

import type { MyPostDto } from "@/dtos/PostDto";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export const useMyPosts = () => {
	const router = useRouter();
	const [myPosts, setPosts] = useState<MyPostDto[] | undefined>(undefined);
	const [isLoading, setLoading] = useState(true);

	// 非同期処理をメモ化
	const fetchMyPosts = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/get-my-post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				console.error("不正なアクセスです");
				router.push("/");
				return;
			}

			const getData = await res.json();
			const posts = getData.posts as MyPostDto[] | undefined;
			setPosts(posts);
		} catch (error) {
			console.error("エラーが発生しました。");
			router.push("/");
		} finally {
			setLoading(false);
		}
	}, [router]); // routerが変更されると再計算

	// 初回ロード時に実行
	useEffect(() => {
		fetchMyPosts();
	}, [fetchMyPosts]);

	return { myPosts, isLoading };
};
