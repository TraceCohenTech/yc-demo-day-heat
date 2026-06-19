import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Does Demo Day Heat Predict YC Success? | Data Study",
  description:
    "We tracked 50+ YC companies to find out if early fundraising momentum predicts long-term outcomes. R²=0.09 — Demo Day heat is a weak predictor of startup success.",
  openGraph: {
    title: "Does Demo Day Heat Predict YC Success?",
    description: "We tracked 50+ YC companies across 20 years. The data says no.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-yc-cream text-yc-dark">{children}</body>
    </html>
  );
}
