import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "koora4you — بث مباشر للمباريات",
  description:
    "شاهد القنوات التلفزيونية الحية والمباريات الرياضية وتابع أحدث المباريات من جميع أنحاء العالم",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
