"use client";

import { motion } from "framer-motion";

const circleVariants = {
	start: {
		y: "0%",
	},
	end: {
		y: "100%",
	},
};

const transition = {
	duration: 0.5,
	repeat: Number.POSITIVE_INFINITY,
	ease: "easeInOut",
};

const Loading = () => {
	return (
		<div className="fixed inset-0 bg-gradient-to-br from-yellow-100 to-amber-200 flex flex-col items-center justify-center">
			<div className="relative w-24 h-32">
				{[0, 1, 2].map((i) => (
					<motion.div
						key={i}
						className="absolute top-0 w-8 h-8 bg-yellow-500 rounded-full"
						style={{ left: `${i * 32}px` }}
						variants={circleVariants}
						initial="start"
						animate="end"
						transition={{
							duration: transition.duration,
							repeat: transition.repeat,
							repeatType: "reverse",
							ease: transition.ease,
							delay: i * 0.15,
						}}
					/>
				))}
			</div>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="mt-8 text-2xl font-bold text-yellow-800"
			>
				WorthIt
			</motion.div>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
				className="mt-2 text-lg text-yellow-700"
			>
				価値あるものをみんなに...
			</motion.p>
		</div>
	);
};

export default Loading;
