import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "Rate My Flat — Honest reviews of UK rentals",
    template: "%s · Rate My Flat",
  },
  description:
    "See what it's actually like to live somewhere before you sign the lease. Reviews of UK flats by the people who lived in them.",
  openGraph: {
    type: "website",
    siteName: "Rate My Flat",
    title: "Rate My Flat — Honest reviews of UK rentals",
    description:
      "See what it's actually like to live somewhere before you sign the lease. Reviews of UK flats by the people who lived in them.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const cls =
    size === "sm"
      ? "text-base font-extrabold tracking-tight"
      : "text-xl font-extrabold tracking-tight";
  return (
    <span className={cls}>
      <span className="text-ink-900">Rate My </span>
      <span className="text-brand-green-600">Flat</span>
    </span>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-full flex flex-col bg-bg text-ink-900 antialiased">
        {/* Sticky header */}
        <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a
              href="/"
              aria-label="Rate My Flat — home"
              className="hover:opacity-80 transition-opacity motion-reduce:transition-none"
            >
              <Wordmark />
            </a>
            <nav className="flex items-center gap-3">
              <a
                href="/"
                className="hidden sm:inline text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors motion-reduce:transition-none"
              >
                Browse
              </a>
              <a
                href="/submit"
                className="inline-flex items-center rounded-lg bg-brand-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:ring-offset-2"
              >
                Submit a review
              </a>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>
        <Analytics />
        <SpeedInsights />

        {/* Footer */}
        <footer className="border-t border-ink-200 bg-ink-50 px-4 py-10 text-center">
          <div className="mx-auto max-w-xl space-y-4">
            <a
              href="/"
              className="inline-block hover:opacity-80 transition-opacity motion-reduce:transition-none"
            >
              <Wordmark size="sm" />
            </a>
            <p className="text-xs text-ink-500 leading-relaxed">
              Reviews represent the personal experiences of the people who wrote
              them. They are not verified. Rate My Flat is a beta site provided
              for informational purposes only.
            </p>
            <div className="flex items-center justify-center gap-5 text-xs text-ink-400">
              <a
                href="/terms"
                className="hover:text-ink-700 transition-colors motion-reduce:transition-none"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="hover:text-ink-700 transition-colors motion-reduce:transition-none"
              >
                Privacy
              </a>
              <span>© 2026 Rate My Flat</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
