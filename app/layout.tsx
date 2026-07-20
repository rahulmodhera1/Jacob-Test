import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stockview — Markets, simply",
    template: "%s — Stockview",
  },
  description: "A calm, simple view of the stock market. Indices, movers, and charts without the noise.",
};

// Applies the saved theme before first paint to avoid a flash of the wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-20 pt-8 sm:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
