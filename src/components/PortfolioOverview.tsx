import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, Bot } from 'lucide-react';
import { PerformanceChart } from './PerformanceChart';
import { RiskMonitor } from './RiskMonitor';
import type { TradingAgent } from '../App';

interface PortfolioOverviewProps {
  currentAgent?: TradingAgent;
}

export function PortfolioOverview({ currentAgent }: PortfolioOverviewProps) {
  const [pnl, setPnl] = useState(12847.53);
  const [varStatus, setVarStatus] = useState(0.127);
  
  useEffect(() => {
    if (currentAgent) {
      setPnl(currentAgent.pnl);
      setVarStatus(currentAgent.varStatus);
    }
    
    const interval = setInterval(() => {
      setPnl(prev => prev + (Math.random() - 0.5) * 100);
      setVarStatus(prev => Math.max(0, prev + (Math.random() - 0.5) * 0.01));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [currentAgent]);

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Agent Selected</h2>
          <p className="text-gray-400">Select an active trading agent to view portfolio data</p>
        </div>
      </div>
    );
  }
  const kpiCards = [
    {
      title: 'Total P&L',
      value: `$${pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.4%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Sharpe Ratio',
      value: '2.34',
      change: '+0.12',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Value at Risk',
      value: `${(varStatus * 100).toFixed(3)}%`,
      change: varStatus > 0.8 ? 'HIGH' : 'SAFE',
      trend: varStatus > 0.8 ? 'down' : 'up',
      icon: varStatus > 0.8 ? AlertTriangle : Shield
    },
    {
      title: 'Agent Status',
      value: currentAgent.status,
      change: '+1 today',
      trend: 'up',
      icon: Zap
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h2 className="text-2xl font-bold">Portfolio Overview</h2>
          <span className="text-gray-400">•</span>
          <span className="text-lg text-[#43D4A0]">{currentAgent.name}</span>
        </div>
        <p className="text-gray-400">Real-time performance metrics and risk monitoring for {currentAgent.strategy}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          const isRisk = kpi.title === 'Value at Risk';
          const isHigh = isRisk && varStatus > 0.8;
          
          return (
            <div 
              key={index}
              className={`bg-[#151B23] border rounded-xl p-4 md:p-6 transition-all duration-300 ${
                isHigh ? 'border-red-500/50 bg-red-900/10' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${
                  isHigh ? 'text-red-400' : 
                  kpi.trend === 'up' ? 'text-[#43D4A0]' : 'text-red-400'
                }`} />
                {isHigh && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <div>
                <h3 className="text-xs md:text-sm font-medium text-gray-400 mb-1">{kpi.title}</h3>
                <div className="text-lg md:text-2xl font-bold mb-2">{kpi.value}</div>
                <div className={`text-sm font-medium ${
                  isHigh ? 'text-red-400' :
                  kpi.trend === 'up' ? 'text-[#43D4A0]' : 'text-red-400'
                }`}>
                  {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4 md:p-6">
        <PerformanceChart height={280} />
      </div>

      {/* Risk Monitor */}
      <RiskMonitor />

      {/* Recent Activity */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'trade', desc: 'Rebalanced Tech Blue Chip basket', time: '2 min ago', status: 'success' },
            { type: 'proof', desc: 'VaR proof generated and verified', time: '5 min ago', status: 'success' },
            { type: 'alert', desc: 'Risk threshold adjusted to 0.8%', time: '1 hour ago', status: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 md:space-x-4 p-3 bg-gray-800/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.status === 'success' ? 'bg-[#43D4A0]' :
                activity.status === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
              }`} />
              <div className="flex-1">
                <p className="text-xs md:text-sm">{activity.desc}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}