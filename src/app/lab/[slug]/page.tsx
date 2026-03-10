import { getLiveRoadmap, getPageContent } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const roadmap = await getLiveRoadmap();
    return roadmap.map((item: any) => ({
        slug: item.slug,
    }));
}

export default async function RoadmapDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const roadmap = await getLiveRoadmap();

    // Find the item by slug
    const roadmapItem = roadmap.find((item: any) => item.slug === resolvedParams.slug);

    if (!roadmapItem) {
        notFound();
    }

    // Fetch from Notion (using the one in local notion-data.json)
    const blocks = await getPageContent(roadmapItem.id);

    return (
        <div className="prose prose-invert max-w-none px-6 py-24 md:py-32">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-solquant-gold/10 text-solquant-gold border border-solquant-gold/20 uppercase tracking-widest mb-3">
                                {roadmapItem.status}
                            </span>
                            <h1 className="text-4xl md:text-5xl tracking-tight mb-0">{roadmapItem.title}</h1>
                            {roadmapItem.date && (
                                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-4">
                                    {new Date(roadmapItem.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/10 mb-12"></div>

                {/* Dynamic Content */}
                <NotionRenderer blocks={blocks} />
                
                <div className="mt-20 pt-12 border-t border-white/5">
                    <a 
                        href="/" 
                        className="text-solquant-gold hover:text-yellow-600 transition-colors font-mono text-sm flex items-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Development Lab
                    </a>
                </div>
            </div>
        </div>
    );
}
