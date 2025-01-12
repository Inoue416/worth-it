import InfiniteScrollLoader from "../loading/InfiniteScrollLoader";

export interface PostListLayoutProps {
	title: string;
	isLoading: boolean;
	children: React.ReactNode;
}

export default function PostListLayout(props: PostListLayoutProps) {
	return (
		<div className="max-w-7xl mx-auto">
			<h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
				{props.title}
			</h1>
			{props.children}
			{props.isLoading && <InfiniteScrollLoader />}
		</div>
	);
}
