"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { PostItem } from "@/components/post-item/PostItem";
import type { GetPostDto } from "@/dtos/PostDto";
import { FetchLimit } from "@/defines/posts";
import { toast } from "sonner";
import PostListLayout from "@/components/layout/PostListLayout";

export default function Page() {
	const [posts, setPosts] = useState<GetPostDto[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const observer = useRef<IntersectionObserver | null>(null);
	const lastPostRef = useRef<HTMLDivElement | null>(null);
	const initialFetchDone = useRef(false);

	const fetchPosts = useCallback(async (pageNum: number) => {
		if (initialFetchDone.current && pageNum === 1) return;

		setLoading(true);
		try {
			const response = await fetch(
				`/api/post?page=${pageNum}&limit=${FetchLimit}`,
				{
					method: "GET",
				},
			);
			if (!response.ok) {
				throw new Error("データの取得に失敗しました。");
			}
			const data = await response.json();
			setPosts((prev) => (pageNum === 1 ? data : [...prev, ...data]));
			setHasMore(data.length === FetchLimit);
			if (pageNum === 1) initialFetchDone.current = true;
		} catch (error) {
			console.error(error);
			toast.error("データの取得に失敗しました。");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPosts(page);
	}, [page, fetchPosts]);

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
		<PostListLayout title="みんなの投稿一覧" isLoading={loading}>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{posts.map((item, index) => (
					<div
						key={item.id}
						ref={posts.length === index + 1 ? lastPostRef : null}
					>
						<PostItem {...item} />
					</div>
				))}
			</div>
		</PostListLayout>
	);
}
