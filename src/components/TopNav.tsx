"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname?.startsWith(path);
    };

    return (
        <nav className="hidden md:flex space-x-8 text-sm wireframe-text items-center">
            <Link
                href="/"
                className={`transition-colors ${isActive("/") ? "text-solquant-gold font-bold" : "hover:text-solquant-gold"}`}
            >
                Home
            </Link>
            <Link
                href="/docs"
                className={`transition-colors ${isActive("/docs") ? "text-solquant-gold font-bold" : "hover:text-solquant-gold"}`}
            >
                Indicators
            </Link>

            <a
                href="https://x.com/Sol_Quant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on X"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>

            <Link
                href="https://whop.com/solquant"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 font-bold text-black transition-all duration-200 bg-solquant-gold border border-transparent rounded-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold"
            >
                Unlock
            </Link>
        </nav>
    );
}
