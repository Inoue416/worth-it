import { useState, useEffect } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

// バリデーションスキーマの定義
const urlSchema = z.string().url("有効なURLを入力してください");
const keywordsSchema = z
	.string()
	.min(3, "3文字以上入力してください")
	.max(1000, "1000文字以内で入力してください");

interface AIAppealPointGeneratorProps {
	onGenerate: (generatedText: string) => void;
}

export function AIAppealPointGenerator({
	onGenerate,
}: AIAppealPointGeneratorProps) {
	const [url, setUrl] = useState("");
	const [keywords, setKeywords] = useState("");
	const [generatedText, setGeneratedText] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [isUrlError, setIsUrlError] = useState(false);
	const [isKeywordsError, setIsKeywordsError] = useState(false);
	const [urlError, setUrlError] = useState("");
	const [keywordsError, setKeywordsError] = useState("");

	const simulateStreaming = async (text: string) => {
		setGeneratedText("");
		setIsGenerating(true);
		for (let i = 0; i < text.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setGeneratedText((prev) => prev + text[i]);
		}
		setIsGenerating(false);
	};

	const handleGenerate = async (type: "url" | "keywords") => {
		// ここで実際のAI生成ロジックを実装します
		// 今回はシミュレーションとしてプレースホルダーを使用します
		const text =
			type === "url"
				? `mock message これはURL: ${url} に基づいて生成されたアピールポイントです。商品の特徴や利点が詳細に説明されています。`
				: `mock message これはキーワード: ${keywords} に基づいて生成されたアピールポイントです。製品の主要な特徴や利点が強調されています。`;

		await simulateStreaming(text);
	};

	const validateUrl = (inputUrl: string) => {
		try {
			urlSchema.parse(inputUrl);
			setUrlError("");
			setIsUrlError(false);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setUrlError(error.errors[0].message);
			}
			setIsUrlError(true);
		}
	};

	const validateKeywords = (inputKeywords: string) => {
		try {
			keywordsSchema.parse(inputKeywords);
			setKeywordsError("");
			setIsKeywordsError(false);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setKeywordsError(error.errors[0].message);
			}
			setIsKeywordsError(true);
		}
	};

	const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(event.target.value);
		validateUrl(event.target.value);
	};

	const handleChangeKeywords = (event: React.ChangeEvent<HTMLInputElement>) => {
		setKeywords(event.target.value);
		validateKeywords(event.target.value);
	};

	return (
		<div className="mt-6 p-4 border rounded-lg bg-gray-50">
			<h3 className="text-lg font-semibold mb-4">AIアピールポイント生成</h3>
			<Tabs defaultValue="url" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="url">URLから生成</TabsTrigger>
					<TabsTrigger value="keywords">キーワードから生成</TabsTrigger>
				</TabsList>
				<TabsContent value="url">
					<div className="space-y-2">
						<Label htmlFor="url">商品ページURL</Label>
						<div className="space-y-2">
							<div className="flex space-x-2">
								<Input
									id="url"
									value={url}
									onChange={(e) => handleChangeUrl(e)}
									placeholder="https://example.com/product"
								/>
								<Button
									onClick={() => handleGenerate("url")}
									disabled={isGenerating || isUrlError || url === ""}
								>
									<Sparkles className="w-4 h-4 mr-2" />
									生成
								</Button>
							</div>
							{urlError && <p className="text-sm text-red-500">{urlError}</p>}
						</div>
					</div>
				</TabsContent>
				<TabsContent value="keywords">
					<div className="space-y-2">
						<Label htmlFor="keywords">キーワード（カンマ区切り）</Label>
						<div className="space-y-2">
							<div className="flex space-x-2">
								<Input
									id="keywords"
									value={keywords}
									onChange={(e) => handleChangeKeywords(e)}
									placeholder="高品質,耐久性,デザイン"
								/>
								<Button
									onClick={() => handleGenerate("keywords")}
									disabled={isGenerating || isKeywordsError || keywords === ""}
								>
									<Sparkles className="w-4 h-4 mr-2" />
									生成
								</Button>
							</div>
							{keywordsError && (
								<p className="text-sm text-red-500">{keywordsError}</p>
							)}
						</div>
					</div>
				</TabsContent>
			</Tabs>
			{(generatedText || isGenerating) && (
				<div className="mt-4">
					<Label htmlFor="generated-text">生成されたアピールポイント</Label>
					<Textarea
						id="generated-text"
						value={generatedText}
						readOnly
						className="mt-2"
						rows={5}
					/>
					{isGenerating ? (
						<div className="mt-2 text-sm text-gray-500">生成中...</div>
					) : (
						<Button
							onClick={() => onGenerate(generatedText)}
							className="mt-2 w-full"
							type="button"
						>
							生成結果を適用する
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
