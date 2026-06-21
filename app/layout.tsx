import "./globals.css";
import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Does Demo Day Hype Predict YC Success? | Data Study",
  description:
    "We tracked 259 of the most hyped YC companies to find out if early fundraising momentum predicts long-term outcomes. R²=0.09 — Demo Day hype is a weak predictor of startup success.",
  openGraph: {
    title: "Does Demo Day Hype Predict YC Success?",
    description: "We tracked 259 of the most hyped YC companies across 20 years. The data says no.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-yc-cream text-yc-dark">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
