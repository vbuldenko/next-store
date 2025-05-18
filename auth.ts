import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db/prisma";
import { signInFormSchema } from "./lib/validators";
import { compare } from "./lib/encrypt";
import { cookies } from "next/headers";

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

const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt", // Store auth data in JWT for credentials provider
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    async session({ session, token, user, trigger }) {
      // Add the user ID to the session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      session.user.name = token.name;
      session.user.role = token.role;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    // authorized({ request, auth }) {
    //   // Array of regex patterns of paths we want to protect
    //   const protectedPaths = [
    //     /\/shipping-address/,
    //     /\/payment-method/,
    //     /\/place-order/,
    //     /\/profile/,
    //     /\/user\/(.*)/,
    //     /\/order\/(.*)/,
    //     /\/admin/,
    //   ];

    //   // Get pathname from the req URL object
    //   const { pathname } = request.nextUrl;
    //   // Check if user is not authenticated and accessing a protected path
    //   if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

    //   // Check for session cart cookie
    //   if (!request.cookies.get("sessionCartId")) {
    //     // Generate new session cart id cookie
    //     const sessionCartId = crypto.randomUUID();

    //     // Create new response and add the new headers
    //     const response = NextResponse.next({
    //       request: {
    //         headers: new Headers(request.headers),
    //       },
    //     });

    //     // Set newly generated sessionCartId in the response cookies
    //     response.cookies.set("sessionCartId", sessionCartId);

    //     return response;
    //   }

    //   return true;
    // },
  },
  pages: {
    signIn: "/sign-in",
    error: "/error", // Error page
    signOut: "/", // Redirect after signing out
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
