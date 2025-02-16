import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../provider";
import { LayoutWrapper } from "../components/LayoutWrapper"; // Import LayoutWrapper
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <Toaster richColors position="top-center"/>
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </Providers>
    </html>
  );
}