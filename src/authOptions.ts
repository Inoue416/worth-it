import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "./lib/prismaClientProvider";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
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
            if (!user.email) {
                return false;
            }
            const prisma = await prismaClient;
            await prisma.user.upsert({
                where: { email: user.email },
                update: {
                  email: user.email,
                },
                create: {
                  email: user.email,
                },
            });
			return true;
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
	},
};
