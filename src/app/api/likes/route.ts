import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createLike, getIsLike, getLikes } from "@/lib/likes";

async function handleGET(req: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401});
	}
    const searchParams = req.nextUrl.searchParams;
	const postId = searchParams.get("postId") ?? "-1";
	try {
		const likes = await getLikes(Number.parseInt(postId as string));
		const isLike = await getIsLike(
			session.user?.email ?? "",
			Number.parseInt(postId as string),
		);
		return NextResponse.json({ likes: likes, isLike: isLike }, { status: 200 });
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
	}
}

async function handlePOST(req: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
    const searchParams = req.nextUrl.searchParams;
	const email = session.user?.email;
	const postId = searchParams.get("postId") ?? "-1";
	try {
		const result = await createLike(
			email ?? "",
			Number.parseInt(postId as string),
		);
		if (!result) {
			return NextResponse.json({ message: "Error creating post" }, { status: 500 });
		} else {
			return NextResponse.json({ message: "Success create post." }, { status: 200 });
		}
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json({ message: "Error creating post" }, { status: 500 });
	}
}

export { handleGET as GET, handlePOST as POST };
