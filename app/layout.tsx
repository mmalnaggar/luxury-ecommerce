import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers'
import Header from './components/Header'

export const metadata: Metadata = {
  title: "Egyptian E-commerce Platform",
  description: "Modern e-commerce platform for Egyptian fashion brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
