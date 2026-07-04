import type { Metadata } from "next";
import { Space_Mono, Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import Nav from "./_components/Nav";
import MoodBar from "./_components/MoodBar";
import SmoothScroll from "./_components/SmoothScroll";
import SkipLink from "./_components/SkipLink";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Brand-locked display face (design spec v1.2). Single weight.
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://cognitiveos.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "cognitiveOS: stop relearning your own project",
  description:
    "An AI filesystem for developers with executive dysfunction. Open your laptop and know exactly what to do. Free, open source, npx cognitiveos init.",
  keywords: [
    "executive dysfunction",
    "ADHD",
    "developer tools",
    "AI filesystem",
    "cognitiveOS",
    "context",
    "CLI",
  ],
  authors: [{ name: "0xDas" }],
  openGraph: {
    title: "cognitiveOS: stop relearning your own project",
    description:
      "An AI filesystem for developers with executive dysfunction. Open your laptop and know exactly what to do.",
    url: SITE_URL,
    siteName: "cognitiveOS",
    type: "website",
    images: [
      {
        url: "/0xnull.svg",
        width: 1200,
        height: 630,
        alt: "0xNull, the cognitiveOS mascot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "cognitiveOS: stop relearning your own project",
    description:
      "An AI filesystem for developers with executive dysfunction. Open your laptop and know exactly what to do.",
    images: ["/0xnull.svg"],
  },
  appleWebApp: {
    title: "CogOS",
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
      className={`${spaceMono.variable} ${outfit.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SkipLink />

        {/* Fixed UI lives OUTSIDE the smooth wrapper (ScrollSmoother transforms
            #smooth-content, which would break position: fixed). */}
        <MoodBar />
        <Nav />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
