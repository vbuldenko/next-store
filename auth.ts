import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// import { hashPassword } from "./lib/utils";
import { ZodError } from "zod";
import { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db/prisma";
// import { signInFormSchema } from "./lib/validators";

const providers: Provider[] = [
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
      try {
        let user;

        if (!credentials) {
          user = null;
        }
        // const { email, password } = await signInFormSchema.parseAsync(
        //   credentials
        // );

        // logic to salt and hash password
        // const pwHash = hashPassword(credentials.password as string);

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      } catch (error) {
        // Handle error
        console.error("Error during sign-in:", error);
        if (error instanceof ZodError) {
          // Return `null` to indicate that the credentials are invalid
          return null;
        }
        throw new Error("Invalid credentials.");
      }
    },
  }),
  Google,
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  providers,
  pages: {
    signIn: "/signin",
  },
});
