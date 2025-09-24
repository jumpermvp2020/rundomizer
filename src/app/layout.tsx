import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZBTZ97PP8S"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZBTZ97PP8S');
            `,
          }}
        />
        {/* /Google Analytics */}

        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104267684', 'ym');

              ym(104267684, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/104267684"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

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
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
