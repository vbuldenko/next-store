import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db/prisma";
import { signInFormSchema } from "./lib/validators";
import { compare } from "./lib/encrypt";
import { NextResponse } from "next/server";

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
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt", // Store auth data in JWT for credentials provider
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is authenticated, add their ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user ID to the session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ request, auth }) {
      // Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;
      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      }

      return true;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Error page
    signOut: "/", // Redirect after signing out
  },
});
