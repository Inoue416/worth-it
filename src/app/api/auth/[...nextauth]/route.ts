import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import TwitterProvider from "next-auth/providers/twitter"

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}),
		// TwitterProvider({
		//   clientId: process.env.TWITTER_CLIENT_ID!,
		//   clientSecret: process.env.TWITTER_CLIENT_SECRET!,
		// }),
	],
	// 必要に応じて追加の設定をここに記述
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
