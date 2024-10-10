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
