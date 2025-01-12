"use client";
import { useMyPosts } from "@/hooks/useMyPosts";
import PostListLayout from "@/components/layout/PostListLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ManagedPostItem } from "@/components/post-item/ManagedPostItem";

export default function Page() {
	const { myPosts, isLoading } = useMyPosts();

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
										console.log("Delete id: ", id);
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
