import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: "%s | Maison",
    default: "Maison — Premium Fashion Boutique",
  },
  description:
    "Maison is an editorial fashion boutique offering considered clothing for a considered life. Ready-to-wear, outerwear, knitwear, and more.",
  keywords: ["fashion", "boutique", "luxury clothing", "editorial fashion", "sustainable fashion"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://maison.store",
    siteName: "Maison",
    title: "Maison — Premium Fashion Boutique",
    description: "Clothing as considered as the life it accompanies.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
