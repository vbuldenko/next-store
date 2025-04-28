import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { hashPassword } from "./lib/utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        let user = null;

        // logic to salt and hash password
        const pwHash = hashPassword(credentials.password as string);

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
