import type { Metadata } from "next";
// Deployment Verification: GitHub -> Vercel Link Test
import { Oxanium, Roboto } from "next/font/google";
import Image from "next/image";
import { GoogleAnalytics } from '@next/third-parties/google';
import AnimatedBackground from "@/components/AnimatedBackground";
import TopNav from "@/components/TopNav";
import "./globals.css";

const oxanium = Oxanium({
    variable: "--font-oxanium",
    subsets: ["latin"],
});

const roboto = Roboto({
    variable: "--font-roboto",
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
});

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
            <body
                className={`${roboto.variable} ${oxanium.variable} antialiased bg-background text-foreground font-sans`}
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
                    <footer className="border-t border-border py-8 mt-auto">
                        <div className="container mx-auto px-6 text-center text-sm text-gray-500 wireframe-text">
                            &copy; {new Date().getFullYear()} SolQuant. Momentum is velocity, but Liquidity is gravity.
                        </div>
                    </footer>
                </div>
            </body>
            <GoogleAnalytics gaId="G-KGEZHNT6VW" />
        </html>
    );
}
