export interface StrategyMeta {
  id: string;
  name: string;
  description: string;
  signal_summary: string;
  timeframe: string;
  category: string;
  status: string;
}

export interface TokenMetrics {
  return_pct: number | null;
  max_dd_pct: number | null;
  profit_factor: number | null;
  win_rate: number | null;
  trades: number;
  sharpe_ratio: number | null;
  sortino_ratio: number | null;
  calmar: number | null;
  avg_trade_pnl_pct: number | null;
  best_trade_pct: number | null;
  worst_trade_pct: number | null;
  max_consecutive_wins: number;
  max_consecutive_losses: number;
  avg_bars_in_trade: number | null;
  start_date: string | null;
  end_date: string | null;
  initial_capital: number | null;
  final_equity: number | null;
}

export interface TokenComparisonEntry extends TokenMetrics {
  token: string;
}

export interface EquityCurveData {
  initial_capital: number;
  points: { date: string; equity: number }[];
}

export interface Trade {
  entry_time: string;
  exit_time: string;
  direction: string;
  entry_price: number;
  exit_price: number;
  pnl_pct: number;
  exit_reason: string;
}

export interface TradeDistributions {
  pnl_histogram?: { bucket: string; count: number }[];
  monthly_returns?: { month: string; return_pct: number; trades: number; wins: number }[];
}

export interface ParamEntry {
  value: number | string | boolean;
  avg_return: number;
  avg_dd: number;
  sample_count: number;
}

export interface StrategyData {
  strategy: StrategyMeta;
  best_params: Record<string, { params: Record<string, unknown>; metrics: TokenMetrics }>;
  token_comparison: TokenComparisonEntry[];
  equity_curves: Record<string, EquityCurveData>;
  trade_log: Record<string, Trade[]>;
  trade_distributions: Record<string, TradeDistributions>;
  parameter_sensitivity: Record<string, ParamEntry[]>;
}
