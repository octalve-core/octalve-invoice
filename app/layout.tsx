import type { Metadata } from "next";
import "./globals.css";
import "@/src/features/invoice/sapphire-document.css";

export const metadata: Metadata = {
  title: "Octalve Invoice",
  description: "Invoicing and merchant payments, built by Octalve.",
  icons: {
    icon: "/branding/octalve-invoice-icon.png",
    apple: "/branding/octalve-invoice-icon.png",
    shortcut: "/branding/octalve-invoice-icon.png",
  },
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
