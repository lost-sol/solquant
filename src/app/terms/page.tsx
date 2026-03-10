import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
    title: "Terms of Service | SolQuant",
    description: "Read the SolQuant terms of service.",
};

export default function TermsPage() {
    return <PolicyPage slug="terms" />;
}
