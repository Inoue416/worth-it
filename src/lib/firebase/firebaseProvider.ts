import { initializeApp } from "firebase/app";
import {
	initializeAppCheck,
	ReCaptchaV3Provider,
	getToken,
} from "firebase/app-check";
import { firebaseConfig } from "@/lib/firebase/firebaseConfig";
import { reCAPTCHASiteKey } from "@/lib/firebase/reCAPTCHAConfig";

const app = initializeApp(firebaseConfig);

// AppCheckの初期化
if (typeof window !== "undefined") {
	// 2.AppCheck 初期化
	const appCheck = initializeAppCheck(app, {
		provider: new ReCaptchaV3Provider(reCAPTCHASiteKey ?? ""),
		isTokenAutoRefreshEnabled: true,
	});
	getToken(appCheck)
		.then(() => {
			console.log("AppCheck:Success");
		})
		.catch((error) => {
			console.log(error.message);
			throw error;
		});
}

export { app };
