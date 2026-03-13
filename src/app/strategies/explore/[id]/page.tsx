import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import StrategyDetailClient from "./StrategyDetailClient";
import type { StrategyData } from "@/components/explorer/types";

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
  return {
    title: `${data.strategy.name} | Strategy Explorer | SolQuant`,
    description: data.strategy.description,
  };
}

export default async function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = loadStrategyData(id);
  if (!data) notFound();

  return <StrategyDetailClient data={data} />;
}
