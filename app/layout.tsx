import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { Toaster } from "sonner";
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Next Store`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
            ${geistSans.variable}
            ${geistMono.variable}
            antialiased
            min-h-[100vh]
            `}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
