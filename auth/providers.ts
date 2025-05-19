import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Provider } from "next-auth/providers";
import prisma from "@/lib/db/prisma";
import { signInFormSchema } from "../lib/validators";
import { compare } from "../lib/encrypt";

export const providers: Provider[] = [
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
        // Validate the credentials with Zod schema
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const { email, password } =
          credentials as typeof signInFormSchema._type;
        // Check if email and password are provided

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // If user doesn't exist or password doesn't match
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const { password: paswordHash, ...userWithoutPassword } = user;

        // Compare the provided password with the stored hash
        const passwordMatch = await compare(password, paswordHash);

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return userWithoutPassword;
      } catch (error) {
        console.error("Auth error:", error);
        throw error;
      }
    },
  }),
  Google({
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: profile.role ?? "user",
      };
    },
  }),
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
