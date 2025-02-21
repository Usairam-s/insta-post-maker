import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google"; // Updated font imports
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400", // Added weight property
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${outfit.variable} antialiased`} // Updated class names
      >
        {children}
      </body>
    </html>
  );
}
