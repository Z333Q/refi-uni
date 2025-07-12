import React, { useState } from 'react';
import { PieChart, RefreshCw, Settings, Plus, TrendingUp, Bot } from 'lucide-react';
import { PerformanceChart } from './PerformanceChart';
import type { TradingAgent } from '../App';

interface BasketDetailProps {
  currentAgent?: TradingAgent;
}

export function BasketDetail({ currentAgent }: BasketDetailProps) {
  const [selectedBasket, setSelectedBasket] = useState('defi-blue');
  const [isRebalancing, setIsRebalancing] = useState(false);
  
  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Agent Selected</h2>
          <p className="text-gray-400">Select an active trading agent to manage baskets</p>
        </div>
      </div>
    );
  }

  const baskets = [
    { id: 'defi-blue', name: 'DeFi Blue Chip', value: '$45,230', change: '+2.4%' },
    { id: 'growth', name: 'High Growth', value: '$23,150', change: '+8.1%' },
    { id: 'stable', name: 'Yield Farming', value: '$12,890', change: '+0.3%' },
  ];

  const basketTokens = [
    { symbol: 'ETH', name: 'Ethereum', weight: 35, value: '$15,830', change: '+1.2%', color: '#627EEA' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', weight: 30, value: '$13,569', change: '+0.8%', color: '#F7931A' },
    { symbol: 'USDC', name: 'USD Coin', weight: 20, value: '$9,046', change: '+0.0%', color: '#2775CA' },
    { symbol: 'UNI', name: 'Uniswap', weight: 15, value: '$6,785', change: '+3.4%', color: '#FF007A' },
  ];

  const handleRebalance = () => {
    setIsRebalancing(true);
    setTimeout(() => setIsRebalancing(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold">Basket Management</h2>
            <span className="text-gray-400">•</span>
            <span className="text-lg text-[#43D4A0]">{currentAgent.name}</span>
          </div>
          <p className="text-gray-400">Manage token weights and rebalancing strategies for {currentAgent.strategy}</p>
        </div>
        <button className="flex items-center space-x-2 bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors">
          <Plus className="h-4 w-4" />
          <span>Create Basket</span>
        </button>
      </div>

      {/* Basket Selector */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Your Baskets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {baskets.map((basket) => (
            <button
              key={basket.id}
              onClick={() => setSelectedBasket(basket.id)}
              className={`text-left p-4 rounded-lg border transition-colors ${
                selectedBasket === basket.id
                  ? 'border-[#43D4A0] bg-[#43D4A0]/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <h4 className="font-semibold">{basket.name}</h4>
              <p className="text-xl font-bold mt-2">{basket.value}</p>
              <p className="text-sm text-[#43D4A0]">{basket.change}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Basket Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Visualization */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Token Allocation</h3>
            <button
              onClick={handleRebalance}
              disabled={isRebalancing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRebalancing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'Rebalancing...' : 'Rebalance Now'}</span>
            </button>
          </div>
          
          {/* Simple Doughnut Chart Representation */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <PieChart className="h-48 w-48 text-[#43D4A0]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">$45,230</div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {basketTokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: token.color }}
                  />
                  <span className="font-medium">{token.symbol}</span>
                </div>
                <span className="text-gray-400">{token.weight}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Token Details */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Token Performance</h3>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {basketTokens.map((token, index) => (
              <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: token.color }}
                    >
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <TrendingUp className={`h-4 w-4 ${
                    token.change.startsWith('+') ? 'text-[#43D4A0]' : 'text-red-400'
                  }`} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{token.value}</span>
                  <span className={`text-sm font-medium ${
                    token.change.startsWith('+') ? 'text-[#43D4A0]' : 'text-red-400'
                  }`}>
                    {token.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Basket Performance Chart */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <PerformanceChart height={240} />
      </div>

      {/* Rebalance Settings */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Rebalance Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h4 className="font-medium mb-2">Frequency</h4>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
              <option>Weekly</option>
              <option>Daily</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h4 className="font-medium mb-2">Threshold</h4>
            <input 
              type="number" 
              defaultValue="5"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="% deviation"
            />
          </div>
          
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h4 className="font-medium mb-2">Max Slippage</h4>
            <input 
              type="number" 
              defaultValue="0.5"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="% slippage"
            />
          </div>
        </div>
      </div>
    </div>
  );
}