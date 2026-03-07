import type { Metadata } from "next";
// Deployment Verification: GitHub -> Vercel Link Test
import Image from "next/image";
import { GoogleAnalytics } from '@next/third-parties/google';
import AnimatedBackground from "@/components/AnimatedBackground";
import TopNav from "@/components/TopNav";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://solquant.xyz"),
    title: "SolQuant | Stop Guessing. Start Seeing.",
    description: "High-precision tools for traders who want to see the market's wireframe—the hidden structure of volume, leverage, and time.",
    openGraph: {
        title: "SolQuant | Stop Guessing. Start Seeing.",
        description: "High-precision tools for traders who want to see the market's wireframe—the hidden structure of volume, leverage, and time.",
        url: "https://solquant.xyz/",
        siteName: "SolQuant",
        images: [
            {
                url: "/images/twitter-header.png",
                width: 1500,
                height: 500,
                alt: "SolQuant",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SolQuant | Stop Guessing. Start Seeing.",
        description: "High-precision tools for traders who want to see the market's wireframe—the hidden structure of volume, leverage, and time.",
        creator: "@SolQuant",
        images: ["/images/twitter-header.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
            </head>
            <body
                className="antialiased bg-background text-foreground"
            >
                <AnimatedBackground />
                <div className="relative z-10 flex flex-col min-h-screen">
                    <header className="wireframe-box border-b border-border sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md">
                        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                            <a href="/" className="flex items-center space-x-3 text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                                <Image src="/images/logo.png" alt="SolQuant Logo" width={40} height={40} className="object-contain" />
                                <div className="font-mono">
                                    <span className="text-white">Sol</span>
                                    <span className="text-solquant-gold">Quant</span>
                                </div>
                            </a>
                            <TopNav />
                        </div>
                    </header>
                    <main className="flex-grow">
                        {children}
                    </main>
                    <footer className="border-t border-border py-12 mt-auto">
                        <div className="container mx-auto px-6 text-center text-sm text-gray-400 wireframe-text space-y-6">
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-widest font-mono">
                                <a href="/about" className="text-gray-300 hover:text-solquant-gold transition-colors">About</a>
                                <a href="/privacy" className="text-gray-300 hover:text-solquant-gold transition-colors">Privacy</a>
                                <a href="/terms" className="text-gray-300 hover:text-solquant-gold transition-colors">Terms</a>
                            </div>
                            <div className="space-y-4">

                                <div className="text-gray-500">
                                    <strong>&copy; {new Date().getFullYear()} SolQuant </strong> |
                                    <strong> Contact & Location:</strong> 1555 Sherman Ave #212, Evanston, IL 60201 |
                                    <strong> Support:</strong> mr.lost.sol.1+solquant@gmail.com
                                </div>
                                <div className="max-w-3xl mx-auto text-xs opacity-70 leading-relaxed text-gray-500">

                                    SolQuant is an independent provider of technical analysis tools. We are not affiliated with, endorsed by, or partnered with TradingView, Inc., the Solana Foundation, or any cryptocurrency exchange. Our tools do not provide financial advice.
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
            <GoogleAnalytics gaId="G-KGEZHNT6VW" />
        </html>
    );
}
