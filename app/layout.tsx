import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Analyze",
  description:
    "Using AI and previous cryptocurrency prices to approximate the future currency-specific market events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          {
            //Ami nem kopogtat majd az ajtó
          }
        </nav>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
