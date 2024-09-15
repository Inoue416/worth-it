"use client";
import { useEffect, useState, useRef } from "react";
import { PostItem } from "@/components/post-item/PostItem";
import type { GetPostDto } from "@/dtos/PostDto";
import { FetchLimit } from "@/defines/posts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type PostItemProps = {
	id: number;
	title: string;
	appealPoint: string;
	imageUrl: string;
	price: number;
	likes: number;
	links: string;
	category: string;
};

export default function Page() {
	const [posts, setPosts] = useState<GetPostDto[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const observer = useRef<IntersectionObserver | null>(null);

	// データを取得する関数

	// スクロール監視用のRef
	const lastPostRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const fetchPosts = async (page: number) => {
			setLoading(true);
			const response = await fetch(
				`/api/post?page=${page}&limit=${FetchLimit}`,
				{
					method: "GET",
				},
			);
			console.log("http status: ", response.status);
			if (response.status !== 200) {
				const res = await response.json();
				console.error(res.message);
				toast.error("データの取得に失敗しました。");
			}
			const data = await response.json();
			setPosts((prev) => [...prev, ...data]);
			setLoading(false);
			if (data.length < 20) {
				setHasMore(false);
			}
		};

		fetchPosts(page);
	}, [page]);

	useEffect(() => {
		if (loading) return;
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				setPage((prevPage) => prevPage + 1);
			}
		});

		if (lastPostRef.current) {
			observer.current.observe(lastPostRef.current);
		}
	}, [loading, hasMore]);

	return (
		<div className="max-w-7xl mx-auto">
			<h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
				みんなの投稿一覧
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{posts.map((item, index) => (
					<div
						key={item.id}
						ref={posts.length === index + 1 ? lastPostRef : null}
					>
						<PostItem key={item.id} {...item} />
					</div>
				))}
			</div>
		</div>
	);
}
