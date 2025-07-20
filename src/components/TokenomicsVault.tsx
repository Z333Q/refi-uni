import React, { useState } from 'react';
import { Coins, Flame, TrendingUp, Info, Zap } from 'lucide-react';

export function TokenomicsVault() {
  const [refiPrice] = useState(0.30);
  const [totalSupply] = useState(100000000);
  const [circulatingSupply] = useState(75000000);
  const [burnedTokens] = useState(2500000);
  const [stakingApr] = useState(12.5);
  const [protocolRevenue] = useState(125000);

  const marketCap = circulatingSupply * refiPrice;
  const burnRate = 0.15; // 15% of protocol revenue

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Economics</h2>
        <p className="text-gray-400">Fee structure, revenue sharing, and platform metrics</p>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Coins className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">REFI Price</span>
          </div>
          <div className="text-xl font-bold">${refiPrice.toFixed(3)}</div>
          <div className="text-sm text-[#43D4A0]">+8.2% (24h)</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">Market Cap</span>
          </div>
          <div className="text-xl font-bold">${(marketCap / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-400">Fully Diluted: ${(totalSupply * refiPrice / 1000000).toFixed(1)}M</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="h-5 w-5 text-red-400" />
            <span className="text-sm text-gray-400">Burned</span>
          </div>
          <div className="text-xl font-bold">{(burnedTokens / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-red-400">{((burnedTokens / totalSupply) * 100).toFixed(1)}% of supply</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">Staking APR</span>
          </div>
          <div className="text-xl font-bold">{stakingApr}%</div>
          <div className="text-sm text-[#43D4A0]">Real yield</div>
        </div>
      </div>

      {/* Burn Mechanism */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Burn Mechanism</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Protocol Revenue Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Token Burns</span>
                <div className="text-right">
                  <div className="font-bold text-red-400">{(burnRate * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-400">${(protocolRevenue * burnRate).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Staking Rewards</span>
                <div className="text-right">
                  <div className="font-bold text-[#43D4A0]">60%</div>
                  <div className="text-sm text-gray-400">${(protocolRevenue * 0.6).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-300">Development Fund</span>
                <div className="text-right">
                  <div className="font-bold text-blue-400">25%</div>
                  <div className="text-sm text-gray-400">${(protocolRevenue * 0.25).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Burn Statistics</h4>
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Next Burn (Estimated)</div>
                <div className="text-lg font-bold text-red-400">
                  {((protocolRevenue * burnRate) / refiPrice).toLocaleString()} REFI
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on current protocol revenue
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Burn Frequency</div>
                <div className="text-lg font-bold">Weekly</div>
                <div className="text-xs text-gray-500 mt-1">
                  Every Sunday at 00:00 UTC
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Deflationary Pressure</div>
                <div className="text-lg font-bold text-red-400">-2.5% annually</div>
                <div className="text-xs text-gray-500 mt-1">
                  At current burn rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Mechanics */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Staking Mechanics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Gas Subsidy Tiers</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">1,000+ $REFIN:</span>
                <span className="text-[#43D4A0]">100% subsidy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">500-999 $REFIN:</span>
                <span className="text-yellow-400">75% subsidy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">100-499 $REFIN:</span>
                <span className="text-orange-400">50% subsidy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400"><100 $REFIN:</span>
                <span className="text-gray-400">No subsidy</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Lock Periods</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">No lock:</span>
                <span className="text-gray-400">8% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">30 days:</span>
                <span className="text-yellow-400">12% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">90 days:</span>
                <span className="text-orange-400">16% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">365 days:</span>
                <span className="text-[#43D4A0]">25% APR</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Reward Sources</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Trading fees:</span>
                <span className="text-[#43D4A0]">40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Basket mgmt:</span>
                <span className="text-[#43D4A0]">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">API usage:</span>
                <span className="text-[#43D4A0]">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Liquidations:</span>
                <span className="text-[#43D4A0]">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Metrics */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Protocol Health</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#43D4A0]">$2.1M</div>
            <div className="text-sm text-gray-400">Monthly Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#43D4A0]">847</div>
            <div className="text-sm text-gray-400">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#43D4A0]">99.8%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#43D4A0]">0</div>
            <div className="text-sm text-gray-400">VaR Breaches</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Tokenomics Model</p>
            <p className="text-blue-200 mt-1">
              REFI follows a deflationary model with real yield staking. Protocol revenue 
              is distributed to stakers (60%), burned (15%), and allocated to development (25%). 
              Gas subsidies incentivize long-term staking and platform usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
  );
}