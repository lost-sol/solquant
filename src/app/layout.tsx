import type { Metadata } from "next";
import { Oxanium, Roboto } from "next/font/google";
import Image from "next/image";
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
    title: "SolQuant | Stop Guessing. Start Seeing.",
    description: "High-precision tools for traders who want to see the market's wireframe—the hidden structure of volume, leverage, and time.",
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
        </html>
    );
}
