export type SubmitPostDto = {
	email: string;
	title: string;
	appealPoint: string;
	price: number;
	link: string;
	category: string;
	// DBに合わせている
	imageName: string;
};

export type GetPostDto = {
	id: number;
	title: string;
	appealPoint: string;
	price: number;
	link: string;
	category: string;
	imageUrl: string;
	updatedAt: Date;
};

export type MyPostDto = {
	id: number;
	title: string;
	appealPoint: string;
	price: number;
	category: string;
	imageUrl: string;
	updatedAt: Date;
};

export interface EditPostDto extends GetPostDto {
	imageSrc: string;
}

export interface EditSubmitPostDto extends SubmitPostDto {
	id: number;
}
