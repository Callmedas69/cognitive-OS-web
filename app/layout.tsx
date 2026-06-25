import type { Metadata } from "next";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "./_components/Nav";
import MoodBar from "./_components/MoodBar";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["400", "700"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "cognitiveOS: stop relearning your own project",
    description:
      "An AI filesystem for developers with executive dysfunction. Open your laptop and know exactly what to do.",
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
      className={`${spaceMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MoodBar />
        <Nav />
        {children}
      </body>
    </html>
  );
}
