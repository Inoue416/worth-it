"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
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
import { toast } from "sonner"
import { Categories } from "@/defines/categories";

import {
	Upload,
	JapaneseYen,
	Link as LinkIcon,
	Type,
	FileText,
	Tag,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { SubmitPostDto } from "@/dtos/PostDto";

const formSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	appealPoint: z
		.string()
		.min(1, "アピールポイントは必須です")
		.max(500, "アピールポイントは500文字以内で入力してください"),
	price: z.number().min(0, "価格は0以上で入力してください"),
	link: z.string().url("有効なURLを入力してください"),
	category: z.string().min(1, "カテゴリーを選択してください"),
	// image: z
	// 	.instanceof(FileList)
	// 	.nullable(),
});

type FormData = z.infer<typeof formSchema>;

const PostForm = () => {
    const router = useRouter();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: FormData) => {
		const userInfo = await getCurrentUser();
		// toast({
		// 	title: "商品が投稿されました",
		// 	description: "商品の投稿が完了しました。",
		// });
		const submitData: SubmitPostDto = {
			email: userInfo?.email ?? "",
			title: data.title,
			appealPoint: data.appealPoint,
			price: data.price,
			link: data.link,
			category: data.category,
			// TODO: 現状、画像アップロード機能は使えないのでダミーを
			imageUrl: "/placeholder.svg?height=200&width=300",
		};
		const res = await fetch("/api/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(submitData),
		});
        const responseData = await res.json();
		if (!res.ok && res.status !== 201) {
			console.error("error: ", responseData.message);
            toast.error("投稿の登録に失敗しました。時間を空けて再度お試しください。");
		} else {
            reset();
            setImagePreview(null);
            toast.success("投稿の登録に成功しました。");
            router.push("/post-list");
        }
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex items-center justify-center">
			<Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
				<CardContent className="p-8">
					<h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
						おすすめ商品を投稿
					</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<AnimatePresence>
							{Object.keys(errors).length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">エラー: </strong>
									<span className="block sm:inline">
										フォームに誤りがあります。修正してください。
									</span>
								</motion.div>
							)}
						</AnimatePresence>

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
									{errors.price.message}
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
									<p className="text-xs text-gray-500">
										PNG, JPG, GIF up to 10MB
									</p>
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
							disabled={!isValid || isSubmitting}
						>
							{isSubmitting ? "投稿中..." : "投稿する"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default PostForm;
