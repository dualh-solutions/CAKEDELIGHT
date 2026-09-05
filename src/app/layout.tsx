import type { Metadata } from "next";
import { Fredoka, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attock Cake Delight",
  description: "Delicious custom cakes and desserts in Attock and Kamra. Joy in every bite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${poppins.variable} scroll-smooth`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-poppins text-text-primary bg-bg-light antialiased selection:bg-gold selection:text-text-primary">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
