"use server";
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prismaClient } from "@/lib/prismaClientProvider";
import type { MyPostDto } from "@/dtos/PostDto";

async function handlePOST(req: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const email = session.user?.email;
	if (!email) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const getData = await prismaClient.post.findMany({
			where: {
				email: email,
			},
		});
		const posts: MyPostDto[] | undefined = getData.map((post) => {
			return {
				id: post.id,
				title: post.title,
				appealPoint: post.appealPoint,
				price: post.price,
				category: post.category,
				imageUrl: post.imageUrl,
				updatedAt: post.updatedAt,
			};
		});
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
