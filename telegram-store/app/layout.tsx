import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = { title: "Kriuk & Teguk", description: "Toko snack dan minuman langsung dari Telegram" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#fff8ef" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><Script src="https://telegram.org/js/telegram-web-app.js?62" strategy="beforeInteractive" />{children}</body></html>;
}
