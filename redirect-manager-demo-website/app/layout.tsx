import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Header} from "@/components/organisms/Header";
import {Footer} from "@/components/organisms/Footer";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <main>
            <Header/>
            {children}
            <Footer/>
        </main>

        </body>
        </html>
    );
}
