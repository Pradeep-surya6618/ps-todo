import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials.email);
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select(
          "+password",
        );
        if (!user) {
          console.log("Authorize failed: User not found");
          throw new Error("No user found with this email");
        }
        if (!user.password) {
          console.log(
            "Authorize failed: No password on user (Google account?)",
          );
          throw new Error("Please use Google to sign in");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          console.log("Authorize failed: Incorrect password");
          throw new Error("Incorrect password");
        }
        console.log("Authorize successful for:", credentials.email);
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isOnboarded: user.isOnboarded,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.isOnboarded = token.isOnboarded;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.isOnboarded = user.isOnboarded;
      }
      // Handle session updates (like after onboarding)
      if (trigger === "update" && session?.isOnboarded !== undefined) {
        token.isOnboarded = session.isOnboarded;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
};
