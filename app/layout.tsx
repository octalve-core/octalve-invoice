import type { Metadata } from "next";
import "./globals.css";
import "@/src/features/invoice/sapphire-document.css";

export const metadata: Metadata = {
  title: "Octalve Finance",
  description: "Invoices, expenses, payments and business financial records, built by Octalve.",
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
