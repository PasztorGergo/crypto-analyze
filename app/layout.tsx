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
      <body className={`${inter.className} max-h-screen`}>
        <header className="flex flex-col items-center gap-8 w-full py-16 px-32">
          <h1 className="text-3xl font-bold">Crypto-Analyze</h1>
          <p>
            Made by <abbr title="Gergő Pásztor">KDDQON</abbr>
          </p>
        </header>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
