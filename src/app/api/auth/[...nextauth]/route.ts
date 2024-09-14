import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import TwitterProvider from "next-auth/providers/twitter"

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		// TwitterProvider({
		//   clientId: process.env.TWITTER_CLIENT_ID!,
		//   clientSecret: process.env.TWITTER_CLIENT_SECRET!,
		// }),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			return true;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl;
		},
		async session({ session, token }) {
			// Send properties to the client, like an access_token and user id from a provider.
			session.user = { ...token };
			return session;
		},
		async jwt({ token, trigger, session }) {
			if (trigger === "update") token.user = session.user;
			return token;
		},
	}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
