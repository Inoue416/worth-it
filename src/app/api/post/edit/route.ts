"use server";
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prismaClient } from "@/lib/prismaClientProvider";
import type { EditSubmitPostDto } from "@/dtos/PostDto";

const prisma = prismaClient;

async function handlePOST(req: NextRequest) {
	const session = await getSession();
	const postData: EditSubmitPostDto = await req.json();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const firebaseStorageUrl = process.env.FIREBASE_STORAGE_URL ?? "";
		const imageUrl =
			postData.imageName === ""
				? ""
				: `${firebaseStorageUrl}/${postData.imageName}`;
		await prisma.post.update({
			data: {
				email: postData.email,
				title: postData.title,
				appealPoint: postData.appealPoint,
				price: postData.price,
				link: postData.link,
				category: postData.category,
				imageUrl: imageUrl,
			},
			where: {
				id: postData.id,
			},
		});

		return NextResponse.json(
			{ message: "Success update post." },
			{ status: 200 },
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
