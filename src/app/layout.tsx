import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from '@vercel/speed-insights/next';
import LazyFeedbackButton from '@/components/LazyFeedbackButton';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true, // Preload the font for faster loading
  adjustFontFallback: true, // Reduce layout shift with better fallback fonts
});

export const metadata: Metadata = {
  title: "ReviewQR - AI-Powered Reviews Made Easy",
  description: "Generate personalized QR codes for AI-assisted review creation",
  icons: {
    icon: '/logo.png',
  }
};

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
            <LazyFeedbackButton />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
