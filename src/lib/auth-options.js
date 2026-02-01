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
          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            session.user.isOnboarded = dbUser.isOnboarded;
            session.user.image = dbUser.image;
            session.user.role = dbUser.role;
            session.user.bio = dbUser.bio;
            session.user.dob = dbUser.dob;
            session.user.gender = dbUser.gender;
            session.user.name = dbUser.name; // Keep name in sync too
            session.user.mobile = dbUser.mobile;
            session.user.location = dbUser.location;
          } else {
            // Fallback to token if DB fetch fails or user weirdness
            session.user.isOnboarded = token.isOnboarded;
            session.user.image = token.image;
            session.user.role = token.role;
            session.user.bio = token.bio;
            session.user.dob = token.dob;
            session.user.gender = token.gender;
            session.user.mobile = token.mobile;
            session.user.location = token.location;
          }
        } catch (error) {
          console.error("Error fetching user in session:", error);
          // Fallback to token
          session.user.isOnboarded = token.isOnboarded;
          session.user.image = token.image;
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
        token.image = user.image;
        token.role = user.role;
        token.bio = user.bio;
        token.dob = user.dob;
        token.gender = user.gender;
        token.mobile = user.mobile;
        token.location = user.location;
      }
      // Handle session updates (like after onboarding)
      if (trigger === "update") {
        if (session?.isOnboarded !== undefined)
          token.isOnboarded = session.isOnboarded;
        if (session?.image !== undefined) token.image = session.image;
        if (session?.role !== undefined) token.role = session.role;
        if (session?.bio !== undefined) token.bio = session.bio;
        if (session?.dob !== undefined) token.dob = session.dob;
        if (session?.gender !== undefined) token.gender = session.gender;
        if (session?.mobile !== undefined) token.mobile = session.mobile;
        if (session?.location !== undefined) token.location = session.location;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
};
