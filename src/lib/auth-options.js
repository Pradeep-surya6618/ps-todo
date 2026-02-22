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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() }).select(
          "+password",
        );
        if (!user) {
          throw new Error("No user found with this email");
        }
        if (!user.password) {
          throw new Error("Please use Google to sign in");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          throw new Error("Incorrect password");
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isOnboarded: user.isOnboarded,
          image: user.image,
          role: user.role,
          bio: user.bio,
          dob: user.dob,
          gender: user.gender,
          mobile: user.mobile,
          location: user.location,
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

        // Fetch fresh user data from DB to ensure sync
        try {
          await dbConnect();
          const dbUser = await User.findOne({
            $or: [{ _id: token.sub }, { email: token.email }],
          });

          if (dbUser) {
            session.user.isOnboarded = dbUser.isOnboarded;
            session.user.image = dbUser.image;
            session.user.role = dbUser.role;
            session.user.bio = dbUser.bio;
            session.user.dob = dbUser.dob;
            session.user.gender = dbUser.gender;
            session.user.name = dbUser.name;
            session.user.mobile = dbUser.mobile;
            session.user.location = dbUser.location;
          } else {
            session.user.isOnboarded = token.isOnboarded;
            session.user.image = token.image;
            session.user.name = token.name;
            session.user.role = token.role;
            session.user.bio = token.bio;
            session.user.dob = token.dob;
            session.user.gender = token.gender;
            session.user.mobile = token.mobile;
            session.user.location = token.location;
          }
        } catch (error) {
          console.error("Session callback error:", error);
          // Fallback to token
          session.user.isOnboarded = token.isOnboarded;
          session.user.image = token.image;
          session.user.name = token.name;
          session.user.role = token.role;
          session.user.bio = token.bio;
          session.user.dob = token.dob;
          session.user.gender = token.gender;
          session.user.mobile = token.mobile;
          session.user.location = token.location;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.isOnboarded = user.isOnboarded;
        token.role = user.role;
        token.bio = user.bio;
        token.dob = user.dob;
        token.gender = user.gender;
        token.mobile = user.mobile;
        token.location = user.location;
      }
      // Handle session updates (like after onboarding)
      if (trigger === "update") {
        // Handle explicit field updates
        if (session?.isOnboarded !== undefined)
          token.isOnboarded = session.isOnboarded;
        if (session?.role !== undefined) token.role = session.role;
        if (session?.bio !== undefined) token.bio = session.bio;
        if (session?.dob !== undefined) token.dob = session.dob;
        if (session?.gender !== undefined) token.gender = session.gender;
        if (session?.mobile !== undefined) token.mobile = session.mobile;
        if (session?.location !== undefined) token.location = session.location;
        if (session?.name !== undefined) token.name = session.name;

        // Force token change to trigger session refresh
        token.lastUpdated = Date.now();
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
