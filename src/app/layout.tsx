import type { Metadata } from "next";

import { StoreProvider } from "./providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Охотничий каталог",
  description: "Каталог товаров с корзиной и избранным",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}