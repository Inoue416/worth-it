"use server";
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prismaClient } from "@/lib/prismaClientProvider";
import { FetchLimit } from "@/defines/posts";
import { getPosts } from "@/lib/posts";
import type { GetPostDto, SubmitPostDto } from "@/dtos/PostDto";

const prisma = prismaClient;

export type GetPostType = {
	posts: Array<GetPostDto>;
	nowOffset: number;
};

async function handleGET(req: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const searchParams = req.nextUrl.searchParams;
	const page = searchParams.get("page") ?? "1";
	const limit = searchParams.get("limit") ?? FetchLimit.toString();
	const pageNumber = Number.parseInt(page as string, 10);
	const limitNumber = Number.parseInt(limit as string, 10);

	try {
		const posts: Array<GetPostDto> = await getPosts(pageNumber, limitNumber);
		return NextResponse.json(posts, { status: 200 });
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ message: "Error fetching posts" },
			{ status: 500 },
		);
	}
}

async function handlePOST(req: NextRequest) {
	const session = await getSession();
	const postData: SubmitPostDto = await req.json();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const firebaseStorageUrl = process.env.FIREBASE_STORAGE_URL ?? "";
		const imageUrl =
			postData.imageName === ""
				? ""
				: `${firebaseStorageUrl}/${postData.imageName}`;
		await prisma.post.create({
			data: {
				email: postData.email,
				title: postData.title,
				appealPoint: postData.appealPoint,
				price: postData.price,
				link: postData.link,
				category: postData.category,
				imageUrl: imageUrl,
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

export { handleGET as GET, handlePOST as POST };
