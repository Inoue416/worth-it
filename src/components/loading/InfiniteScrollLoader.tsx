import { useEffect, useState } from "react";

const InfiniteScrollLoader = () => {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length < 3 ? `${prev}.` : ""));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex items-center justify-center p-4 w-full">
			<div className="space-y-2 text-center">
				<div className="flex justify-center space-x-2">
					{[0, 1, 2].map((item, index) => (
						<div
							key={item}
							className={`w-3 h-3 bg-amber-700 rounded-full animate-bounce ${
								index === 0
									? "animate-delay-0"
									: index === 1
										? "animate-delay-150"
										: "animate-delay-300"
							}`}
						/>
					))}
				</div>
				<p className="text-sm font-medium text-amber-800">
					Loading more items{dots}
				</p>
			</div>
		</div>
	);
};

export default InfiniteScrollLoader;
