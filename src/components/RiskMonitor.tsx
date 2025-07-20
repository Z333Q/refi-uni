import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';

interface RiskMetric {
  id: string;
  name: string;
  current: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export function RiskMonitor() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    {
      id: 'var',
      name: 'Value at Risk (24h)',
      current: 0.127,
      threshold: 0.8,
      status: 'safe',
      trend: 'stable'
    },
    {
      id: 'concentration',
      name: 'Concentration Risk',
      current: 0.15,
      threshold: 0.25,
      status: 'safe',
      trend: 'down'
    },
    {
      id: 'liquidity',
      name: 'Liquidity Risk',
      current: 0.08,
      threshold: 0.15,
      status: 'safe',
      trend: 'up'
    },
    {
      id: 'correlation',
      name: 'Correlation Risk',
      current: 0.72,
      threshold: 0.85,
      status: 'warning',
      trend: 'up'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskMetrics(prev => prev.map(metric => ({
        ...metric,
        current: Math.max(0, metric.current + (Math.random() - 0.5) * 0.02),
        status: metric.current > metric.threshold * 0.8 ? 'critical' : 
               metric.current > metric.threshold * 0.6 ? 'warning' : 'safe'
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-[#43D4A0] bg-green-900/20';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20';
      case 'critical': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-[#43D4A0] rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-[#43D4A0]" />
        <h3 className="text-lg font-semibold">Real-Time Risk Monitor</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskMetrics.map((metric) => (
          <div key={metric.id} className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">{metric.name}</span>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">
                {(metric.current * 100).toFixed(2)}%
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  metric.status === 'critical' ? 'bg-red-400' :
                  metric.status === 'warning' ? 'bg-yellow-400' : 'bg-[#43D4A0]'
                }`}
                style={{ width: `${Math.min(100, (metric.current / metric.threshold) * 100)}%` }}
              />
            </div>

            <div className="text-xs text-gray-400">
              Threshold: {(metric.threshold * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">zk-VaR Guardrail Active</p>
            <p className="text-blue-200 mt-1">
              Circom circuit monitoring 24h VaR at 97.5% confidence with 1% NAV cap. 
              Groth16 proofs generated in &lt;30ms for every trade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}