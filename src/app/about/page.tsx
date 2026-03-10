import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
    title: "About SolQuant",
    description: "Learn about SolQuant—how we build high-precision tools for traders to see the market's true skeleton.",
};

export default function AboutPage() {
    return <PolicyPage slug="about" />;
}
