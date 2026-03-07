"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function SidebarLink({ href, children }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`text-sm transition-colors block py-1 ${
                isActive 
                    ? "text-solquant-gold font-bold" 
                    : "text-gray-300 hover:text-white"
            }`}
        >
            {children}
        </Link>
    );
}
