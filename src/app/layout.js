import { Geist, Geist_Mono, Just_Another_Hand } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const handFont = Just_Another_Hand({
  weight: "400",
  variable: "--font-hand",
  subsets: ["latin"],
});

export const metadata = {
  title: "SunMoonie",
  description:
    "SunMoonie: Harmonies your workflow between the energy of the sun and the calm of the moon. A premium, cosmic task management experience.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/Moon.jpg",
    apple: "/icons/Moon.jpg",
  },
};

export const viewport = {
  themeColor: "#FF2E63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${handFont.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
