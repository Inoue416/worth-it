"use client";
import Loading from "@/components/loading/Loading";
import PostForm from "@/components/post-form/PostForm";
import { useMyPostGetById } from "@/hooks/useMyPostGetById";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Page = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const postId = searchParams.get("postId");
	if (!postId || postId === "") {
		toast.error("不正なアクセスです");
		return router.push("/");
	}

	const { post, isLoading, fetchMyPost } = useMyPostGetById();

	useEffect(() => {
		fetchMyPost(Number(postId));
	}, [fetchMyPost, postId]);

	if (isLoading) {
		return <Loading />;
	}
	return <PostForm title="投稿の編集" defaultPost={post} />;
};

export default Page;
