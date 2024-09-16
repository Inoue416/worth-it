import { prismaClient } from "./prismaClientProvider";

const prisma = prismaClient;

export const getLikes = async (postId: number) => {
	const likes: number = await prisma.like.count({
		where: {
			postId,
		},
	});
	return likes;
};

export const getIsLike = async (email: string, postId: number) => {
	if (email === "" || postId === -1) return false;
	try {
		const like = await prisma.like.count({
			where: {
				email: email,
				postId: postId,
			},
		});
		return like > 0;
	} catch (error) {
		console.error("Error fetching likes:", error);
		return false;
	}
};

export const createLike = async (email: string, postId: number) => {
	if (email === "" || postId === -1) return false;
	try {
		const like = await prisma.like.count({
			where: {
				email: email,
				postId: postId,
			},
		});
		if (like > 0) {
			return deleteLike(email, postId);
		}
		await prisma.like.create({
			data: {
				email,
				postId,
			},
		});
		return true;
	} catch (error) {
		console.error("Error creating like:", error);
		return false;
	}
};

export const deleteLike = async (email: string, postId: number) => {
	try {
		await prisma.like.deleteMany({
			where: {
				email: email,
				postId: postId,
			},
		});
		return true;
	} catch (error) {
		console.error("Error deleting like:", error);
		return false;
	}
};
