// Basic implementation of a custom Notion renderer
import React from 'react';

export default function NotionRenderer({ blocks }: { blocks: any[] }) {
    if (!blocks || blocks.length === 0) {
        return <p className="text-gray-500 font-mono">No content available.</p>;
    }

    return (
        <div className="space-y-6">
            {blocks.map((block) => {
                const type = block.type;
                const blockContent = block[type];

                switch (type) {
                    case 'paragraph':
                        return (
                            <p key={block.id} className="text-gray-300 leading-relaxed text-lg">
                                {blockContent.rich_text.map((text: any, idx: number) => (
                                    <span
                                        key={idx}
                                        className={`${text.annotations.bold ? "font-bold text-white" : ""}
                     ${text.annotations.italic ? "italic" : ""} 
                     ${text.annotations.code ? "font-mono bg-white/10 px-1 py-0.5 rounded text-solquant-blue text-sm" : ""}`}
                                    >
                                        {text.plain_text}
                                    </span>
                                ))}
                            </p>
                        );

                    case 'heading_1':
                        return <h1 key={block.id} className="text-4xl font-bold mt-12 mb-6 border-b border-border pb-4">{blockContent.rich_text[0]?.plain_text}</h1>;
                    case 'heading_2':
                        return <h2 key={block.id} className="text-3xl font-bold mt-10 mb-4">{blockContent.rich_text[0]?.plain_text}</h2>;
                    case 'heading_3':
                        return <h3 key={block.id} className="text-2xl font-bold mt-8 mb-3 text-gray-200">{blockContent.rich_text[0]?.plain_text}</h3>;

                    case 'callout':
                        return (
                            <div key={block.id} className="p-6 bg-solquant-blue/10 border-l-4 border-solquant-blue flex items-start space-x-4 wireframe-box">
                                <span className="text-xl">{blockContent.icon?.emoji || "💡"}</span>
                                <p className="text-gray-300">
                                    {blockContent.rich_text.map((text: any) => text.plain_text).join("")}
                                </p>
                            </div>
                        );

                    case 'code':
                        return (
                            <pre key={block.id} className="p-4 bg-black wireframe-box overflow-x-auto text-sm my-6 rounded-sm">
                                <code className="text-gray-300 font-mono">
                                    {blockContent.rich_text[0]?.plain_text}
                                </code>
                            </pre>
                        );

                    case 'image':
                        return (
                            <figure key={block.id} className="my-8 wireframe-box p-2">
                                {/* Normally we process Notion S3 URLs here. Using img for external fallback */}
                                <img
                                    src={blockContent.external?.url || blockContent.file?.url}
                                    alt="Notion Data"
                                    className="w-full h-auto"
                                />
                            </figure>
                        );

                    case 'bulleted_list_item':
                        return (
                            <li key={block.id} className="text-gray-300 ml-6 list-disc mb-2">
                                {blockContent.rich_text[0]?.plain_text}
                            </li>
                        );

                    case 'numbered_list_item':
                        return (
                            <li key={block.id} className="text-gray-300 ml-6 list-decimal mb-2">
                                {blockContent.rich_text[0]?.plain_text}
                            </li>
                        );

                    default:
                        return <div key={block.id} className="text-gray-600 text-xs py-2">[Unsupported Block: {type}]</div>;
                }
            })}
        </div>
    );
}
