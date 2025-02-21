import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "../../../models/User";
import connectDB from "../../../lib/connectDb";
connectDB();

export const authOptions = {
  // adapter: connectDB,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      
      async authorize(credentials, req) {
        const email = credentials.email;
        const password = credentials.password;

        const user = await UserModel.findOne({ email });
        if (user) return loginUser({ password, user });
        else throw new Error("Email not found");
      },
    }),
  ],
  session: {
    strategy: "jwt",

  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,

  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.isSuperAdmin = user.isSuperAdmin;
        // console.log({ user, token });
      }
      return token;
    },

    async session({ session, token, user }) {
      session.user.isSuperAdmin = token.isSuperAdmin;
      return session;
    },
  },
}

const loginUser = async ({ password, user }) => {
  if (password === user.password) return user;
  else throw new Error("Incorrect password");
};

export default NextAuth(authOptions)