import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "NHIH 360° Discovery Tour | Ministry of Health, Sierra Leone",
  description:
    "Programme-facing engagement and booking portal for the National Health Information Hub (NHIH), DPPI, Ministry of Health, Sierra Leone. Understanding health data sources, workflows, and operational decision-making.",
  keywords: [
    "NHIH",
    "Ministry of Health Sierra Leone",
    "DPPI",
    "360 Discovery Tour",
    "Health Information Systems",
    "DHIS2",
    "mSupply",
    "Health Operational Dashboard",
    "Sierra Leone Health Data",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
