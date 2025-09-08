import "@/app/globals.css";
import NavBar from "@/components/layout/nav-bar";
import { QueryProvider } from "@/lib/query-client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider } from "../providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Platerly - Smart Recipe & Meal Planning",
  description: "Your recipes, groceries, and meal plans—streamlined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
