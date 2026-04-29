import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rate My Flat — Honest reviews of UK rentals",
  description:
    "See what it's actually like to live somewhere before you sign the lease. Reviews of UK flats by the people who lived in them.",
  openGraph: {
    title: "Rate My Flat — Honest reviews of UK rentals",
    description:
      "See what it's actually like to live somewhere before you sign the lease. Reviews of UK flats by the people who lived in them.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-auto border-t border-gray-100 px-4 py-6 text-center text-xs text-gray-400">
          Reviews represent the personal experiences of the people who wrote them. They are not verified. Rate My Flat is a beta site provided for informational purposes only.
        </footer>
      </body>
    </html>
  );
}
