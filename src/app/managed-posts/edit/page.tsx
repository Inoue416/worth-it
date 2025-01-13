import { Suspense } from "react";
import EditPage from "./edit-page";
import Loading from "@/components/loading/Loading";

export default function Page() {
	return (
		<Suspense fallback={<Loading />}>
			<EditPage />
		</Suspense>
	);
}
