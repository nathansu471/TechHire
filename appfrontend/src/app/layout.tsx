// app/layout.tsx
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/context/auth";

export const metadata: Metadata = {
  title: { default: "TechHire", template: "%s | TechHire" },
  description: "Job tracking and applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Auth context available to Navbar and pages */}
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
