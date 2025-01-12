"use server";
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prismaClient } from "@/lib/prismaClientProvider";
import type { GetPostDto } from "@/dtos/PostDto";

async function handlePOST(req: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const email = session.user?.email;
	if (!email) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const { postId } = await req.json();
	if (!postId) {
		return NextResponse.json(
			{ message: "post idがありません" },
			{ status: 400 },
		);
	}

	try {
		const getData = await prismaClient.post.findFirst({
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
			where: {
				id: Number.parseInt(postId as string),
				email: email,
			},
		});
		const posts: GetPostDto | undefined =
			getData === null
				? undefined
				: {
						id: getData.id,
						title: getData.title,
						appealPoint: getData.appealPoint,
						price: getData.price,
						link: getData.link,
						category: getData.category,
						imageUrl: getData.imageUrl,
						updatedAt: getData.updatedAt,
					};
		return NextResponse.json({ posts: posts }, { status: 200 });
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ message: "Error fetching posts" },
			{ status: 500 },
		);
	}
}

export { handlePOST as POST };
