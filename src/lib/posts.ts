// lib/posts.ts
import { prismaClient } from "./prismaClientProvider"; // prisma clientのパスはプロジェクトによる
import type { GetPostDto } from "@/dtos/PostDto";

const prisma = prismaClient;

export const getPosts = async (page: number, limit: number) => {
	const posts: Array<GetPostDto> = await prisma.post.findMany({
		select: {
			id: true,
			title: true,
			appealPoint: true,
			price: true,
			link: true,
			category: true,
			imageUrl: true,
			updatedAt: true,
		},
		skip: (page - 1) * limit,
		take: limit,
		orderBy: {
			createdAt: "desc",
		},
	});

	return posts;
};

export const deletePost = async (id: number, email: string) => {
	try {
		await prisma.post.delete({
			where: {
				id: id,
				email: email,
			},
		});
		return true;
	} catch (error) {
		console.error("Error deleting post:", error);
		return false;
	}
};
