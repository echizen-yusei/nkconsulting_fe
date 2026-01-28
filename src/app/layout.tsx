import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/background.css";
import "@/styles/text-color.css";
import "@/styles/spacing.css";
import "@/styles/button.css";
import "@/styles/text-style.css";
import "@/styles/border.css";
import { QueryClientProvider } from "@/libs/react-query";
import { NextIntlClientProvider } from "next-intl";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { Toaster } from "sonner";
import { getToken } from "@/libs/server";
import UserProvider from "@/components/providers/UserProvider";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NK Consulting",
  description: "NK Consulting",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
        <NextIntlClientProvider>
          <QueryClientProvider>
            <UserProvider token={token}>
              {children}
              <Toaster position="bottom-left" richColors closeButton />
            </UserProvider>
          </QueryClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
