import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paygent Demo",
  description: "Antler x Ralio hackathon project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
