import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

// configuration object
const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    //very simple what we are doing if user is logged in access the route otherwise not
    // return true authorized else not
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    // it get some info but here we need the user
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);
        // everything is ok return true
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });
        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      console.log(session, user);
      const existingGuest = await getGuest(session.user.email);
      session.user.guestId = existingGuest.id;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
