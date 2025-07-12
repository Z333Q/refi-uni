import React, { useState, useEffect } from 'react'
import { Activity, Clock, Search, Filter, ExternalLink, Bot } from 'lucide-react'
import type { TradingAgent } from './App'
import { useSubscription } from '@apollo/client'
import { TRADE_FILLED } from '../graphql/queries'

interface Trade {
  id: string;
  timestamp: string;
  txHash: string;
  token: string;
  type: 'buy' | 'sell';
  quantity: string;
  price: string;
  latency: number;
  status: 'completed' | 'pending' | 'failed';
  agentId?: string;
}

interface TradeStreamProps {
  currentAgent?: TradingAgent;
}

export function TradeStream({ currentAgent }: TradeStreamProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data } = useSubscription(TRADE_FILLED)

  useEffect(() => {
    if (data?.tradeFilled) {
      setTrades((prev) => [data.tradeFilled, ...prev.slice(0, 19)])
    }
  }, [data])

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Agent Selected</h2>
          <p className="text-gray-400">Select an active trading agent to view trade stream</p>
        </div>
      </div>
    )
  }
  const filteredTrades = trades.filter(trade => {
    const matchesFilter = filter === 'all' || trade.type === filter;
    const matchesSearch = trade.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.txHash.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 2) return 'text-[#43D4A0]';
    if (latency < 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Trade Stream</h2>
        <p className="text-gray-400">Real-time trade execution with latency monitoring</p>
      </div>

      {/* Controls */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by token or tx hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-[#43D4A0] focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
            >
              <option value="all">All Trades</option>
              <option value="buy">Buy Orders</option>
              <option value="sell">Sell Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Latency', value: '2.1s', status: 'good' },
          { label: 'Total Trades', value: '1,247', status: 'neutral' },
          { label: 'Success Rate', value: '99.8%', status: 'good' },
          { label: 'Active Proofs', value: '3', status: 'neutral' }
        ].map((stat, index) => (
          <div key={index} className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className={`text-xl font-bold ${
              stat.status === 'good' ? 'text-[#43D4A0]' : 'text-white'
            }`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Trade Table */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tx Hash</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Token</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Latency</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTrades.map((trade) => (
                <tr 
                  key={trade.id} 
                  className={`hover:bg-gray-800/30 transition-colors ${
                    trade.latency > 3 ? 'bg-yellow-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formatTime(trade.timestamp)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{trade.txHash}</td>
                  <td className="px-6 py-4 text-sm font-medium">{trade.token}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.type === 'buy' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{trade.quantity}</td>
                  <td className="px-6 py-4 text-sm">{trade.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={getLatencyColor(trade.latency)}>
                      {trade.latency.toFixed(1)}s
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.status === 'completed' ? 'bg-green-900 text-green-300' :
                      trade.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-gray-400 hover:text-[#43D4A0] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}