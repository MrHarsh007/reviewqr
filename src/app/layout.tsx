import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ReviewQR - AI-Powered Reviews Made Easy",
  description: "Generate personalized QR codes for AI-assisted review creation",
  icons: {
    icon: '/logo.png',
  }
};

import FeedbackButton from "@/components/FeedbackButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
            <FeedbackButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
