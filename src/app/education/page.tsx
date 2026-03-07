import Link from "next/link";
import { getEducationArticles } from "@/lib/notion";

export default async function EducationPage() {
    const articles = await getEducationArticles();

    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl tracking-tight mb-4">Trading Education & Best Practices</h1>
            <p className="text-xl text-gray-400 font-mono mb-8">
                Master the psychological and mechanical edge required for professional trading.
            </p>

            <div className="py-6 my-8 border-l-2 border-solquant-gold pl-6">
                <h2 className="text-2xl font-bold mb-2">Philosophy of Edge</h2>
                <p className="text-gray-300">
                    Indicators are only as powerful as the hands that use them. This section is dedicated to 
                    developing the mental framework and execution strategies used by institutional desks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {articles.map((article: any) => (
                    <Link key={article.id} href={`/education/${article.slug}`} className="group flex flex-col bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden transition-all duration-300">
                        {article.imageUrl && (
                            <div className="w-full h-40 bg-black relative border-b border-white/5 overflow-hidden">
                                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-white flex items-center mb-2 group-hover:text-[#e0a82e] transition-colors">
                                <span className="text-[#e0a82e] mr-2">📚</span> {article.title}
                            </h3>
                            <p className="text-sm font-mono text-gray-400 mb-4 flex-grow leading-relaxed line-clamp-2">
                                {article.summary || "Select to learn more about this best practice."}
                            </p>
                            <span className="text-xs font-mono px-2 py-1 rounded self-start bg-white/10 text-gray-300">
                                Education
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
