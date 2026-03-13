import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import StrategyDetailClient from "./StrategyDetailClient";
import type { StrategyData } from "@/components/explorer/types";
import { getExplorerStrategies } from "@/lib/notion";

function loadStrategyData(id: string): StrategyData | null {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "backtest-explorer", `${id}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "src", "data", "backtest-explorer", "manifest.json"), "utf-8")
  );
  return manifest.strategies.map((s: { id: string }) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = loadStrategyData(id);
  if (!data) return { title: "Strategy Not Found | SolQuant" };

  const title = `${data.strategy.name} | Strategy Explorer | SolQuant`;
  const bestMetric = data.token_comparison && data.token_comparison.length > 0 
    ? data.token_comparison[0] 
    : null;
    
  const performanceSuffix = bestMetric && bestMetric.return_pct !== null
    ? ` Backtested with up to ${bestMetric.return_pct.toFixed(1)}% return on $${bestMetric.token}.`
    : "";
    
  const description = `${data.strategy.description}${performanceSuffix}`;
  
  // Find branded OG image from Notion metadata
  const explorerStrategies = await getExplorerStrategies();
  const explorerMeta = explorerStrategies.find((s: any) => s.id === id);
  const ogImage = explorerMeta?.ogImageUrl || "/images/twitter-header.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://solquant.xyz/strategies/explore/${id}`,
      images: [
        {
          url: ogImage,
          width: 1500,
          height: 500,
          alt: data.strategy.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = loadStrategyData(id);
  if (!data) {
    notFound();
    return null;
  }

  return <StrategyDetailClient data={data} />;
}
