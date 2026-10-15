import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Octalve Invoice",
  description: "Invoicing and merchant payments, built by Octalve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
