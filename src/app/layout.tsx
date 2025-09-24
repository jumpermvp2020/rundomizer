import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Генератор случайных чисел и случайностей | Бесплатные онлайн инструменты",
  description: "Генератор случайных чисел, слов, имён, цитат и многое другое. Честные результаты одним кликом. Быстро, бесплатно, без регистрации.",
  keywords: "генератор случайных чисел, случайное число, рандомайзер, генератор слов, генератор имён, орёл или решка, бросок кости, жребий, случайная цитата, генератор никнеймов, онлайн генератор",
  authors: [{ name: "Randomizer" }],
  creator: "Randomizer",
  publisher: "Randomizer",
  robots: "index, follow",
  alternates: {
    canonical: "https://rundomizer.ru",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon/favicon.svg", color: "#000000" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://rundomizer.ru",
    siteName: "Генератор случайностей",
    title: "Генератор случайных чисел и случайностей",
    description: "Быстрые и честные генераторы случайностей. Числа, слова, имена, цитаты и многое другое.",
    images: [
      {
        url: "https://rundomizer.ru/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Генератор случайностей",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Генератор случайных чисел и случайностей",
    description: "Быстрые и честные генераторы случайностей. Числа, слова, имена, цитаты и многое другое.",
    images: ["https://rundomizer.ru/og-image.jpg"],
  },
  verification: {
    google: "G-ZBTZ97PP8S",
    yandex: "your-yandex-verification-code",
  },
  category: "technology",
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Дополнительные SEO мета-теги */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Rundomizer" />
        <meta name="application-name" content="Rundomizer" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Генератор случайностей",
              "description": "Быстрые и честные генераторы случайностей. Числа, слова, имена, цитаты и многое другое.",
              "url": "https://rundomizer.ru",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "RUB"
              },
              "author": {
                "@type": "Organization",
                "name": "Randomizer"
              },
              "featureList": [
                "Генератор случайных чисел",
                "Генератор слов",
                "Генератор имён",
                "Генератор никнеймов",
                "Случайные цитаты",
                "Орёл или решка",
                "Бросок кости",
                "Жребий онлайн"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "ratingCount": "1000"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
