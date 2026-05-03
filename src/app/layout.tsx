import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site-config";
import { Providers } from "@/providers/Providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Classes 1–8 • IIT mentors`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(`https://${site.domain}`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) may inject attributes like cz-shortcut-listen on <body> before React hydrates. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
