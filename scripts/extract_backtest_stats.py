import sys
import os

# DEBUG: Print sys.path to see where we are looking for modules
print(f"DEBUG sys.path: {sys.path}", file=sys.stderr)

# Avoid CWD conflict by removing '' from sys.path
if '' in sys.path:
    sys.path.remove('')
if os.getcwd() in sys.path:
    sys.path.remove(os.getcwd())

import pandas as pd
import json

def extract_stats(file_path):
    try:
        perf_df = pd.read_excel(file_path, sheet_name='Performance')
        trades_df = pd.read_excel(file_path, sheet_name='Trades analysis')
        trades_list_df = pd.read_excel(file_path, sheet_name='List of trades')
        
        # Performance metrics
        # The structure we saw was: {'Unnamed: 0': {...}, 'All USDT': {...}}
        perf_usdt = perf_df.set_index(perf_df.columns[0])[perf_df.columns[1]].to_dict()
        perf_pct = perf_df.set_index(perf_df.columns[0])[perf_df.columns[2]].to_dict()
        
        trades_usdt = trades_df.set_index(trades_df.columns[0])[trades_df.columns[1]].to_dict()
        trades_pct = trades_df.set_index(trades_df.columns[0])[trades_df.columns[2]].to_dict()
        
        net_profit = perf_usdt.get('Net profit', 0)
        net_profit_pct = perf_pct.get('Net profit', 0)
        if pd.isna(net_profit_pct):
            initial_capital = perf_usdt.get('Initial capital', 100)
            net_profit_pct = (net_profit / initial_capital) * 100 if initial_capital != 0 else 0
        
        total_trades = trades_usdt.get('Total trades', 0)
        win_rate = trades_pct.get('Percent profitable', 0)
        if pd.isna(win_rate):
            winning_trades = trades_usdt.get('Winning trades', 0)
            win_rate = (winning_trades / total_trades) * 100 if total_trades != 0 else 0
        
        max_drawdown = perf_usdt.get('Max equity drawdown (intrabar)', 0)
        max_drawdown_pct = perf_pct.get('Max equity drawdown (intrabar)', 0)
        # If the report has it, use it. Otherwise fallback to calculation (though it might be less accurate)
        if pd.isna(max_drawdown_pct):
            initial_capital = perf_usdt.get('Initial capital', 100)
            max_drawdown_pct = (max_drawdown / initial_capital) * 100 if initial_capital != 0 else 0
            
        # Extract date range
        start_date = ""
        end_date = ""
        if 'Date and time' in trades_list_df.columns:
            dates = pd.to_datetime(trades_list_df['Date and time'])
            start_date = dates.min().strftime('%b %d, %Y')
            end_date = dates.max().strftime('%b %d, %Y')

        return {
            "net_profit": net_profit,
            "net_profit_pct": float(net_profit_pct),
            "total_trades": int(total_trades),
            "win_rate": float(win_rate),
            "max_drawdown": max_drawdown,
            "max_drawdown_pct": float(max_drawdown_pct),
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
        return None

def main():
    base_dir = "/Users/zachwise/Desktop/Projects/SolQuant/backtest data/tradingview strategy examples"
    files = {
        "Liquidation Sweep": "SQ_Liq_Sweep_V2_BINANCE_ETHUSDT.P_2026-03-11_1b7ce.xlsx",
        "Mean Reversion MTF": "Strategy_Mean_Reversion_MTF_BINANCE_SOLUSDT.P_2026-03-11_42996.xlsx"
    }
    
    results = {}
    for name, filename in files.items():
        path = os.path.join(base_dir, filename)
        stats = extract_stats(path)
        if stats:
            results[name] = stats
            
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
