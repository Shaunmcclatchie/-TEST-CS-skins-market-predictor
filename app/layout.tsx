import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKIN / SIGNAL — CS2 Market Intelligence",
  description: "Research the CS2 market with live prices, transparent signals and a backtested forecast lab.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
