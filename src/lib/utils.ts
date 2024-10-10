import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getBaseUrl() {
	const baseUrl =
		process.env.APP_URL ||
		process.env.NEXT_PUBLIC_VERCEL_URL ||
		"localhost:3000";
	console.log("baseUrl", baseUrl);
	return baseUrl ? baseUrl : "";
}

export const getCurrentFormattedTime = (): string => {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため+1
	const day = String(now.getDate()).padStart(2, "0");

	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export const resizeImage = (file: File): Promise<File | null> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target?.result as string;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject("Canvas context not available");
					return;
				}

				// 元の画像サイズの1/2に設定
				canvas.width = img.width / 2;
				canvas.height = img.height / 2;

				// 画像を描画
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// CanvasをBlobに変換してFileに戻す
				canvas.toBlob((blob) => {
					if (blob) {
						const resizedFile = new File([blob], file.name, {
							type: file.type,
							lastModified: Date.now(),
						});
						resolve(resizedFile);
					} else {
						reject("Failed to convert canvas to Blob");
					}
				}, file.type);
			};

			img.onerror = (error) => reject(error);
		};

		reader.onerror = (error) => reject(error);

		// 画像ファイルをDataURLとして読み込む
		reader.readAsDataURL(file);
	});
};
