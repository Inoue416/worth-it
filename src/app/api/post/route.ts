"use server";
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prismaClient } from "@/lib/prismaClientProvider";
import { FetchLimit } from "@/defines/posts";
import type { GetPostDto, SubmitPostDto } from "@/dtos/PostDto";

const prisma = prismaClient;

export type GetPostType = {
	posts: Array<GetPostDto>;
	nowOffset: number;
};

// async function handleGET(req: NextApiRequest, res: NextApiResponse) {
// 	const session = await getSession();
// 	const { nowOffset = "0" } = req.query;
// 	const nowOffsetNumber = Number.parseInt(nowOffset as string, 10);
// 	const skip = nowOffsetNumber * FetchLimit;

// 	try {
// 		const posts: Array<GetPostDto> = await prisma.post.findMany({
// 			select: {
// 				id: true,
// 				title: true,
// 				appealPoint: true,
// 				price: true,
// 				link: true,
// 				category: true,
// 				image_url: true,
// 				updated_at: true,
// 			},
// 			// TODO: 今後Whereでカテゴリを区切るようにする
// 			//   where: {
// 			//   },
// 			skip: skip,
// 			take: FetchLimit,
// 			orderBy: { updatedAt: "desc" },
// 		});
// 		const nextOffset = nowOffsetNumber + 1;
// 		res.status(200).json({
// 			posts,
// 			nowOffset: nextOffset,
// 		});
// 	} catch (error) {
// 		console.error("Error fetching posts:", error);
// 		res.status(500).json({ message: "Error fetching posts" });
// 	}
// }

async function handlePOST(req: NextRequest) {
	const session = await getSession();
	const postData: SubmitPostDto = await req.json();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		await prisma.post.create({
			data: {
				email: postData.email,
				title: postData.title,
				appealPoint: postData.appealPoint,
				price: postData.price,
				link: postData.link,
				category: postData.category,
				imageUrl: postData.imageUrl,
			},
		});

		return NextResponse.json(
			{ message: "Success create post." },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{ message: "Error creating post" },
			{ status: 500 },
		);
	}
}

export { handlePOST as POST };
// export { handleGET as GET, handlePOST as POST };
