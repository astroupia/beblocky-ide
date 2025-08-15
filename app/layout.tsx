import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github-dark.min.css";

export const metadata: Metadata = {
  title: "Beblocky IDE",
  description: "Created with Beblocky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
