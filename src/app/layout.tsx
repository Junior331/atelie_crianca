import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";

const notoSans = Noto_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Ateliê de Criança",
  description: "Ateliê de Criança",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body className={`${notoSans.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
