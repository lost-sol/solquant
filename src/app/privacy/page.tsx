import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
    title: "Privacy Policy | SolQuant",
    description: "Your privacy is important to us. Read the SolQuant privacy policy to understand how we handle your data.",
};

export default function PrivacyPage() {
    return <PolicyPage slug="privacy" />;
}
