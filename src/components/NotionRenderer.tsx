// Basic implementation of a custom Notion renderer
import React from 'react';

const getColorClass = (color: string) => {
    switch (color) {
        case 'gray': return 'text-gray-500';
        case 'brown': return 'text-amber-800';
        case 'orange': return 'text-solquant-gold'; // Map orange/yellow to brand gold
        case 'yellow': return 'text-solquant-gold';
        case 'green': return 'text-green-500';
        case 'blue': return 'text-solquant-blue';
        case 'purple': return 'text-purple-500';
        case 'pink': return 'text-pink-500';
        case 'red': return 'text-red-500';
        case 'gray_background': return 'bg-gray-800 px-1 rounded';
        case 'brown_background': return 'bg-amber-900/30 px-1 rounded';
        case 'orange_background': return 'bg-solquant-gold/20 px-1 rounded';
        case 'yellow_background': return 'bg-solquant-gold/10 px-1 rounded';
        case 'green_background': return 'bg-green-900/30 px-1 rounded';
        case 'blue_background': return 'bg-solquant-blue/20 px-1 rounded';
        case 'purple_background': return 'bg-purple-900/30 px-1 rounded';
        case 'pink_background': return 'bg-pink-900/30 px-1 rounded';
        case 'red_background': return 'bg-red-900/30 px-1 rounded';
        default: return '';
    }
};

const renderRichText = (richText: any[]) => {
    if (!richText) return null;
    return richText.map((text: any, idx: number) => {
        const { annotations } = text;
        const colorClass = getColorClass(annotations.color);

        return (
            <span
                key={idx}
                className={`
                    ${annotations.bold ? "font-bold text-white" : ""}
                    ${annotations.italic ? "italic" : ""} 
                    ${annotations.strikethrough ? "line-through" : ""}
                    ${annotations.underline ? "underline" : ""}
                    ${annotations.code ? "font-mono bg-white/10 px-1 py-0.5 rounded text-solquant-blue text-sm" : ""}
                    ${colorClass}
                `.trim()}
            >
                {text.plain_text}
            </span>
        );
    });
};

export default function NotionRenderer({ blocks }: { blocks: any[] }) {
    if (!blocks || blocks.length === 0) {
        return <p className="text-gray-500 font-mono">No content available.</p>;
    }

    return (
        <div className="space-y-6">
            {blocks.map((block) => {
                const type = block.type;
                const blockContent = block[type];
                const colorClass = blockContent.color ? getColorClass(blockContent.color) : '';

                switch (type) {
                    case 'paragraph':
                        return (
                            <p key={block.id} className={`text-gray-300 leading-relaxed text-lg ${colorClass}`}>
                                {renderRichText(blockContent.rich_text)}
                            </p>
                        );

                    case 'heading_1':
                        return (
                            <h1 key={block.id} className={`text-4xl font-bold mt-12 mb-6 border-b border-border pb-4 ${colorClass}`}>
                                {renderRichText(blockContent.rich_text)}
                            </h1>
                        );
                    case 'heading_2':
                        return (
                            <h2 key={block.id} className={`text-3xl font-bold mt-10 mb-4 ${colorClass}`}>
                                {renderRichText(blockContent.rich_text)}
                            </h2>
                        );
                    case 'heading_3':
                        return (
                            <h3 key={block.id} className={`text-2xl font-bold mt-8 mb-3 text-gray-200 ${colorClass}`}>
                                {renderRichText(blockContent.rich_text)}
                            </h3>
                        );

                    case 'callout':
                        return (
                            <div key={block.id} className="p-6 bg-solquant-blue/10 border-l-4 border-solquant-blue flex items-start space-x-4 wireframe-box">
                                <span className="text-xl">{blockContent.icon?.emoji || "💡"}</span>
                                <p className="text-gray-300">
                                    {renderRichText(blockContent.rich_text)}
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
                                <img
                                    src={blockContent.external?.url || blockContent.file?.url}
                                    alt="Notion Data"
                                    className="w-full h-auto"
                                />
                            </figure>
                        );

                    case 'bulleted_list_item':
                        return (
                            <li key={block.id} className={`text-gray-300 ml-6 list-disc mb-2 ${colorClass}`}>
                                {renderRichText(blockContent.rich_text)}
                            </li>
                        );

                    case 'numbered_list_item':
                        return (
                            <li key={block.id} className={`text-gray-300 ml-6 list-decimal mb-2 ${colorClass}`}>
                                {renderRichText(blockContent.rich_text)}
                            </li>
                        );

                    default:
                        return <div key={block.id} className="text-gray-600 text-xs py-2">[Unsupported Block: {type}]</div>;
                }
            })}
        </div>
    );
}
