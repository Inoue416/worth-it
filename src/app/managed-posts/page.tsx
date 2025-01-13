"use client";
import { useRouter } from "next/navigation";
import { useMyPosts } from "@/hooks/useMyPosts";
import PostListLayout from "@/components/layout/PostListLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ManagedPostItem } from "@/components/post-item/ManagedPostItem";
import { toast } from "sonner";
import { deletePostType } from "../api/post/route";

export default function Page() {
	const { myPosts, isLoading } = useMyPosts();
	const router = useRouter();

	const requestDeletePost = async (id: number) => {
		const deleteReqBody: deletePostType = { postId: id }
		const res = await fetch("/api/post", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(deleteReqBody),
		});

		const data = await res.json();

		if (!res.ok) {
			console.error(data.message);
			toast.error("削除時にエラーが発生しました。");
		}

		console.log(data.message);
		toast.success("投稿を削除しました。");
		window.location.reload();
	};

	return (
		<PostListLayout title="投稿管理" isLoading={isLoading}>
			{myPosts ? (
				myPosts.length > 0 ? (
					myPosts.map((item, index) => (
						<div key={item.id}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
								<ManagedPostItem
									{...item}
									onDelete={(id: number) => {
										requestDeletePost(id);
									}}
								/>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-10">
						<p className="text-xl text-gray-500">記事がありません。</p>
						<Link href="/post-form" passHref>
							<Button className="mt-4">
								<Plus className="mr-2 h-4 w-4" /> 新規投稿を作成
							</Button>
						</Link>
					</div>
				)
			) : (
				<></>
			)}
		</PostListLayout>
	);
}
