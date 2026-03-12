"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "How do I get access to the indicators on TradingView?",
        answer: "After completing your purchase, you will be prompted to provide your TradingView username. Within 24 hours (usually much faster), our team will grant you \"Invite-Only\" access. You will find the indicators under the \"Invite-only scripts\" tab in your TradingView."
    },
    {
        question: "Do these indicators work on the free version of TradingView?",
        answer: "Yes. All SolQuant indicators are optimized to work on the free, \"Basic\" version of TradingView. However, please note that TradingView's free plan limits the number of indicators you can have on a single chart at once."
    },
    {
        question: "Is this a \"buy/sell\" signal service?",
        answer: "No. SolQuant is a technical analysis suite designed for traders who want to understand market structure and institutional liquidity. While our Liquidation Visualizer provides \"Sweep\" labels for potential entries, these are meant to be used as part of a strategy."
    },
    {
        question: "Does the Liquidation Visualizer work for all coins?",
        answer: "The Liquidation Visualizer is most effective on high-volume assets with significant leverage activity, such as BTC, ETH, and major altcoins (SOL, JUP, etc.). It works by aggregating data from major exchanges like Binance, OKX, and Bybit."
    },
    {
        question: "Is there a refund policy?",
        answer: "Because this is a digital software product that provides immediate access to proprietary code and intellectual property, we do not offer refunds. We recommend reviewing our documentation and daily chart previews on X before subscribing."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full max-w-4xl px-6 py-24 mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
                <p className="mt-4 text-gray-400">Everything you need to know about the SolQuant suite.</p>
            </div>

            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className={`group border border-white/5 rounded-2xl transition-all duration-300 ${openIndex === index ? "bg-[#0a0a0a] border-solquant-gold/30 ring-1 ring-solquant-gold/20" : "bg-transparent hover:border-white/10"
                            }`}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        >
                            <span className={`font-medium transition-colors duration-300 ${openIndex === index ? "text-solquant-gold" : "text-gray-200 group-hover:text-white"
                                }`}>
                                {item.question}
                            </span>
                            <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-solquant-gold" : "text-gray-500"
                                }`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="px-6 pb-6 text-gray-400 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4 mt-1">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
