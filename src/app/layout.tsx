import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tjutruss.com"),
  title: {
    default: "TJU TRUSS SYSTEM | CV. Tri Jaya Utama - Konstruksi Rangka Atap Baja Ringan Presisi",
    template: "%s | TJU TRUSS SYSTEM",
  },
  description:
    "CV. Tri Jaya Utama (TJU Truss) - Fabrikasi dan konstruksi rangka atap baja ringan berstandar SNI dan software engineering bersertifikat HAKI dengan garansi struktur 10 tahun.",
  keywords: [
    "TJU Truss",
    "CV Tri Jaya Utama",
    "Baja Ringan Semarang",
    "Rangka Atap Baja Ringan",
    "Kuda-kuda Baja Ringan",
    "Software HAKI Baja Ringan",
    "Pabrik Baja Ringan Galvalum",
    "Aplikator Baja Ringan Jawa Tengah",
    "Garansi Struktur Atap 10 Tahun",
  ],
  authors: [{ name: "CV. Tri Jaya Utama", url: "https://tjutruss.com" }],
  creator: "CV. Tri Jaya Utama",
  publisher: "CV. Tri Jaya Utama",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/logogram_tju.png" },
      { url: "/images/logogram_tju.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logogram_tju.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/logogram_tju.png",
    apple: "/images/logogram_tju.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US", "zh_CN"],
    url: "https://tjutruss.com",
    siteName: "TJU TRUSS SYSTEM",
    title: "TJU TRUSS SYSTEM | CV. Tri Jaya Utama - Konstruksi Rangka Atap Baja Ringan Presisi",
    description:
      "Fabrikasi dan konstruksi rangka atap baja ringan berstandar SNI dan software engineering HAKI dengan garansi struktur 10 tahun.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "TJU TRUSS SYSTEM Rangka Atap Baja Ringan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TJU TRUSS SYSTEM | Konstruksi Rangka Atap Baja Ringan Presisi",
    description:
      "Fabrikasi dan konstruksi rangka atap baja ringan berstandar SNI dan software engineering HAKI dengan garansi struktur 10 tahun.",
    images: [
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
