import React, { useState } from 'react';
import { Wallet, Zap, TrendingUp, Info } from 'lucide-react';

export function WalletStaking() {
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [refiBalance] = useState(2500);
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = () => {
    setIsStaking(true);
    setTimeout(() => setIsStaking(false), 2000);
  };

  const subsidyRate = Math.min(stakeAmount / 1000, 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Wallet & Staking</h2>
        <p className="text-gray-400">Manage gas subsidies and REFI token staking</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wallet className="h-8 w-8 text-[#43D4A0]" />
            <div>
              <h3 className="font-semibold">USD Balance</h3>
              <p className="text-sm text-gray-400">Trading Account</p>
            </div>
          </div>
          <div className="text-2xl font-bold">$45,230</div>
          <div className="text-sm text-gray-400 mt-1">Available Balance</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-8 w-8 text-[#43D4A0]" />
            <div>
              <h3 className="font-semibold">REFI Balance</h3>
              <p className="text-sm text-gray-400">Governance Token</p>
            </div>
          </div>
          <div className="text-2xl font-bold">{refiBalance.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">≈ $750.00</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-[#43D4A0]" />
            <div>
              <h3 className="font-semibold">Staked REFI</h3>
              <p className="text-sm text-gray-400">For Gas Subsidy</p>
            </div>
          </div>
          <div className="text-2xl font-bold">{stakeAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">APY: 12.5%</div>
        </div>
      </div>

      {/* Staking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Stake REFI Tokens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stake Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-16 focus:border-[#43D4A0] focus:outline-none"
                  min="0"
                  max={refiBalance}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  REFI
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Available: {refiBalance.toLocaleString()} REFI</span>
                <button
                  onClick={() => setStakeAmount(refiBalance)}
                  className="text-[#43D4A0] hover:text-[#3BC492] transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Estimated APY</span>
                <span className="font-medium text-[#43D4A0]">12.5%</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Monthly Rewards</span>
                <span className="font-medium">{((stakeAmount * 0.125) / 12).toFixed(2)} REFI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Lock Period</span>
                <span className="font-medium">30 days</span>
              </div>
            </div>

            <button
              onClick={handleStake}
              disabled={isStaking || stakeAmount < 100}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isStaking || stakeAmount < 100
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
              }`}
            >
              {isStaking ? 'Staking...' : `Stake ${stakeAmount} REFI`}
            </button>

            {stakeAmount < 100 && (
              <div className="flex items-center space-x-2 text-sm text-yellow-400">
                <Info className="h-4 w-4" />
                <span>Minimum stake: 100 REFI</span>
              </div>
            )}
          </div>
        </div>

        {/* Gas Subsidy Status */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Gas Subsidy Status</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Subsidy Rate</span>
                <span className="font-medium">{(subsidyRate * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-[#43D4A0] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subsidyRate * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {stakeAmount >= 1000 ? 'Maximum subsidy achieved' : `Stake ${1000 - stakeAmount} more REFI for 100% subsidy`}
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="font-medium mb-3">Recent Gas Usage</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">This Month</span>
                  <span>$42.18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subsidized</span>
                  <span className="text-[#43D4A0]">-$32.14</span>
                </div>
                <div className="flex justify-between font-medium border-t border-gray-700 pt-2">
                  <span>Your Cost</span>
                  <span>$10.04</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium">Paymaster Integration</p>
                  <p className="text-blue-200 mt-1">
                    Gas fees are automatically subsidized through ERC-4337 Paymaster 
                    based on your REFI stake amount.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Unstake REFI
              </button>
              <button className="bg-[#43D4A0] hover:bg-[#3BC492] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Claim Rewards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Staking History</h3>
        <div className="space-y-3">
          {[
            { type: 'stake', amount: '500 REFI', date: '2 days ago', status: 'completed' },
            { type: 'reward', amount: '12.5 REFI', date: '1 week ago', status: 'completed' },
            { type: 'stake', amount: '300 REFI', date: '2 weeks ago', status: 'completed' },
          ].map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  tx.type === 'stake' ? 'bg-[#43D4A0]' : 'bg-blue-400'
                }`} />
                <div>
                  <div className="font-medium">
                    {tx.type === 'stake' ? 'Staked' : 'Reward Claimed'} {tx.amount}
                  </div>
                  <div className="text-sm text-gray-400">{tx.date}</div>
                </div>
              </div>
              <span className="text-sm text-[#43D4A0]">{tx.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}