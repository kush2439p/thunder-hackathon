import type { Metadata } from "next";
import "./theme.css";
import "./interactive.css";
import "./refinement.css";
import "./final.css";
import "./discovery.css";
export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  title: "STRIKE | Your next connection",
  description:
    "Learn, build, and discover your next connection. A STRIKE homepage recreation for Thunder Hackathon 6.0.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/assets/font-0.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
