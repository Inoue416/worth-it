"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Categories } from "@/defines/categories";
import { app } from "@/lib/firebase/firebaseProvider";

import {
	Upload,
	JapaneseYen,
	Link as LinkIcon,
	Type,
	FileText,
	Tag,
	Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import type {
	EditPostDto,
	EditSubmitPostDto,
	SubmitPostDto,
} from "@/dtos/PostDto";
import { uploadImage } from "@/lib/firebase/firebaseStorage";
import { resizeImage } from "@/lib/utils";
import { AIAppealPointGenerator } from "./AiAppealPointGenerator";
import { validateSafeString, INVALID_CHARS_MESSAGE } from "@/lib/validations";

const formSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください")
		.refine(
			(val) => validateSafeString(val, "タイトル").success,
			(val) =>
				validateSafeString(val, "タイトル").error || {
					message: INVALID_CHARS_MESSAGE,
				},
		),
	appealPoint: z
		.string()
		.min(1, "アピールポイントは必須です")
		.max(500, "アピールポイントは500文字以内で入力してください")
		.refine(
			(val) => validateSafeString(val, "アピールポイント").success,
			(val) =>
				validateSafeString(val, "アピールポイント").error || {
					message: INVALID_CHARS_MESSAGE,
				},
		),
	price: z
		.number()
		.min(0, "価格は0円以上で入力してください")
		.max(1000000000, "価格は10億円以内で入力してください"),
	link: z.string().url("有効なURLを入力してください"),
	category: z.string().min(1, "カテゴリーを選択してください"),
});

type FormData = z.infer<typeof formSchema>;

export interface PostFormProps {
	title: string;
	defaultPost?: EditPostDto;
}

const PostForm = (props: PostFormProps) => {
	const router = useRouter();
	const [imagePreview, setImagePreview] = useState<string | null>(
		props.defaultPost?.imageSrc ?? null,
	);
	const [imageFile, setImageFile] = useState<File | undefined>(undefined);
	const [ableImageSize, setAbleImageSize] = useState<boolean>(true);
	const defaultPost = props.defaultPost;
	console.log("defaultPost: ", defaultPost);
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isValid, isSubmitting, isDirty },
		reset,
		setValue,
	} = useForm<FormData>({
		defaultValues: {
			title: defaultPost?.title ?? "",
			appealPoint: defaultPost?.appealPoint ?? "",
			price: defaultPost?.price ?? 0,
			link: defaultPost?.link ?? "",
			category: defaultPost?.category ?? "",
		},
		resolver: zodResolver(formSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: FormData) => {
		const userInfo = await getCurrentUser();
		const imageName =
			defaultPost === undefined
				? await uploadImage(userInfo?.email ?? "", app, imageFile ?? undefined)
				: imageFile === undefined
					? defaultPost.imageUrl
					: await uploadImage(
							userInfo?.email ?? "",
							app,
							imageFile ?? undefined,
						);
		const submitData: SubmitPostDto | EditSubmitPostDto =
			defaultPost === undefined
				? {
						email: userInfo?.email ?? "",
						title: data.title,
						appealPoint: data.appealPoint,
						price: data.price,
						link: data.link,
						category: data.category,
						imageName: imageName ?? "",
					}
				: {
						id: defaultPost.id,
						email: userInfo?.email ?? "",
						title: data.title,
						appealPoint: data.appealPoint,
						price: data.price,
						link: data.link,
						category: data.category,
						imageName: imageName ?? "",
					};
		const apiMethod =
			defaultPost === undefined ? "POST" : "PUT";
		const res = await fetch("/api/post", {
			method: apiMethod,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(submitData),
		});
		const responseData = await res.json();
		if (!res.ok && res.status !== 200) {
			console.error("error: ", responseData.message);
			toast.error("投稿の登録に失敗しました。時間を空けて再度お試しください。");
		} else {
			reset();
			setImagePreview(null);
			toast.success("投稿の登録に成功しました。");
			router.push("/post-list");
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				// 画像を1/2にリサイズ
				const resizedFile = await resizeImage(file);
				const resizedFileSize = resizedFile?.size ?? 0;
				if (resizedFileSize >= 1024 * 1024 * 5) {
					setAbleImageSize(false);
					setImageFile(undefined);
					return;
				}

				setImageFile(resizedFile ?? undefined);
				if (resizedFile) {
					const reader = new FileReader();
					reader.onloadend = () => {
						// リサイズされた画像をプレビューにセット
						setImagePreview(reader.result as string);
					};
					reader.readAsDataURL(resizedFile); // リサイズ後の画像を読み込む
				}
			} catch (error) {
				console.error("Image resize failed:", error);
			}
		}
	};

	const [showAIGenerator, setShowAIGenerator] = useState(false);
	const handleAIGenerated = (generatedText: string) => {
		setValue("appealPoint", generatedText, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	return (
		<div className="flex items-center justify-center">
			<Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
				<CardContent className="p-8">
					<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
						{props.title}
					</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label
								htmlFor="title"
								className="text-sm font-medium text-gray-700 flex items-center"
							>
								<Type className="w-4 h-4 mr-2" />
								タイトル
							</Label>
							<Input
								id="title"
								{...register("title")}
								className="rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
							/>
							{errors.title && (
								<p className="text-sm text-red-500 mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="category"
								className="text-sm font-medium text-gray-700 flex items-center"
							>
								<Tag className="w-4 h-4 mr-2" />
								カテゴリー
							</Label>
							<Controller
								name="category"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Select onValueChange={onChange} value={value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="カテゴリーを選択" />
										</SelectTrigger>
										<SelectContent>
											{Categories.map((item, idx) => (
												<SelectItem key={idx.toString()} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.category && (
								<p className="text-sm text-red-500 mt-1">
									{errors.category.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="appealPoint"
								className="text-sm font-medium text-gray-700 flex items-center"
							>
								<FileText className="w-4 h-4 mr-2" />
								アピールポイント
							</Label>
							<Textarea
								id="appealPoint"
								{...register("appealPoint")}
								className="rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
							/>
							{errors.appealPoint && (
								<p className="text-sm text-red-500 mt-1">
									{errors.appealPoint.message}
								</p>
							)}
						</div>

						<div className="mt-6 mb-4">
							<Button
								type="button"
								onClick={() => setShowAIGenerator(!showAIGenerator)}
								variant={showAIGenerator ? "outline" : "default"}
								className={showAIGenerator ? "w-full" : "w-full"}
							>
								<Sparkles className="w-4 h-4 mr-2" />
								{showAIGenerator ? "閉じる" : "AIで生成"}
							</Button>
						</div>

						{showAIGenerator && (
							<AIAppealPointGenerator onGenerate={handleAIGenerated} />
						)}

						<div className="space-y-2">
							<Label
								htmlFor="price"
								className="text-sm font-medium text-gray-700 flex items-center"
							>
								<JapaneseYen className="w-4 h-4 mr-2" />
								値段
							</Label>
							<Input
								id="price"
								type="number"
								{...register("price", { valueAsNumber: true })}
								className="rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
							/>
							{errors.price && (
								<p className="text-sm text-red-500 mt-1">
									{errors.price.message === "Expected number, received nan"
										? "値段を入力してください"
										: errors.price.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="link"
								className="text-sm font-medium text-gray-700 flex items-center"
							>
								<LinkIcon className="w-4 h-4 mr-2" />
								リンク
							</Label>
							<Input
								id="link"
								type="url"
								{...register("link")}
								className="rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
							/>
							{errors.link && (
								<p className="text-sm text-red-500 mt-1">
									{errors.link.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="image"
								className="text-sm font-medium text-gray-700 flex items-center"
							>
								<Upload className="w-4 h-4 mr-2" />
								商品の画像
							</Label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								<div className="space-y-1 text-center">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<div className="flex text-sm text-gray-600">
										<label
											htmlFor="image"
											className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500"
										>
											<span>画像をアップロード</span>
											<Input
												id="image"
												type="file"
												accept="image/*"
												// {...register("image")}
												onChange={handleImageChange}
												className="sr-only"
											/>
										</label>
										<p className="pl-1">またはドラッグ＆ドロップ</p>
									</div>
									<p className="text-xs text-gray-500">PNG, JPG up to 9MB</p>
									{!ableImageSize && (
										<p className="text-xs text-red-500 mt-2">
											9MB以内の画像をアップロードして下さい
										</p>
									)}
								</div>
							</div>
							<AnimatePresence>
								{imagePreview && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={{ duration: 0.3 }}
										className="mt-4"
									>
										<img
											src={imagePreview}
											alt="プレビュー"
											className="max-w-full h-auto max-h-48 rounded-md mx-auto"
										/>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-md shadow-md hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
							disabled={!isValid || isSubmitting || !ableImageSize || !isDirty}
						>
							{defaultPost === undefined
								? isSubmitting
									? "投稿中..."
									: "投稿する"
								: isSubmitting
									? "更新中..."
									: "更新する"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default PostForm;
