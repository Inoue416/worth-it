import { getCurrentUser } from "@/lib/auth";
const Top = async () => {
	const user = await getCurrentUser();
	return (
		<>
			<h1 className="text-3xl font-bold underline">{user?.name}</h1>
			<h1 className="text-3xl font-bold underline">{user?.email}</h1>
			<h1 className="text-3xl font-bold underline">{user?.image}</h1>
		</>
	);
};

export default Top;
