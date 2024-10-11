import { getDownloadURL, getStorage } from "firebase/storage";
import { ref, uploadBytesResumable } from "firebase/storage";
import type { FirebaseApp } from "firebase/app";
import { getCurrentFormattedTime } from "@/lib/utils";

export const uploadImage = async (
	userEmail: string,
	app: FirebaseApp,
	file: File | undefined,
) => {
	console.log("file: ", file);
	if (userEmail === "" || file === undefined) {
		return "";
	}
	const nowTimeString = new Date().getTime().toString();
	try {
		const nowTimeString = getCurrentFormattedTime();
		const uploadFileName = `${nowTimeString}_${userEmail}_${file.name}`;
		// Storage リファレンスを作成
		const storage = getStorage(app);
		const storageRef = ref(storage, uploadFileName);

		// ファイルのアップロードを開始
		const uploadTask = uploadBytesResumable(storageRef, file);

		// アップロードの進捗状況を監視
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				// アップロード進捗 (例: パーセンテージ表示)
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress}% done`);
			},
			(error) => {
				// エラーハンドリング
				console.error("Upload failed", error);
				return "";
			},
			() => {
				// アップロード完了時の処理
				console.log("Upload complete!");
			},
		);
		return uploadFileName;
	} catch (error) {
		console.error("Error in upload:", error);
		return "";
	}
};

// TODO: 画像のフェッチ
export const fetchImage = async (app: FirebaseApp, imageUrl: string) => {
	if (imageUrl === "") {
		return "";
	}

	try {
		const storage = getStorage(app);
		const storageRef = ref(storage, imageUrl);

		const url = await getDownloadURL(storageRef);
		console.log("Ref Url: ", url);

		return url;
	} catch (error) {
		console.error("Error fetching image:", error);
		return "";
	}
};
