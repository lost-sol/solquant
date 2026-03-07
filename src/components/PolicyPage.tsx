import { getPolicies, getPageContent } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const policies = await getPolicies();
    return policies.map((p: any) => ({
        slug: p.slug,
    }));
}

export default async function PolicyPage({ slug }: { slug: string }) {
    const policies = await getPolicies();
    const policyMeta = policies.find((p: any) => p.slug === slug);

    if (!policyMeta) {
        notFound();
    }

    const blocks = await getPageContent(policyMeta.id);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 mb-8">
                    <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-solquant-blue/10 text-solquant-blue border border-solquant-blue/20 uppercase tracking-widest">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{policyMeta.title}</h1>
                </div>
                <div className="h-px bg-border mb-12"></div>
                <div className="prose prose-invert max-w-none">
                    <NotionRenderer blocks={blocks} />
                </div>
            </div>
        </div>
    );
}
