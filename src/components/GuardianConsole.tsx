import React, { useState } from 'react';
import { Shield, Users, Pause, Play, AlertTriangle, CheckCircle } from 'lucide-react';

export function GuardianConsole() {
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  const guardians = [
    { address: '0x8f2a...b9c4', name: 'Guardian Alpha', status: 'online', lastSeen: '2 min ago' },
    { address: '0x7e1d...a8f3', name: 'Guardian Beta', status: 'online', lastSeen: '5 min ago' },
    { address: '0x6d0c...9e2b', name: 'Guardian Gamma', status: 'offline', lastSeen: '2 hours ago' }
  ];

  const multisigStatus = {
    required: 2,
    total: 3,
    pending: 0
  };

  const handlePauseToggle = () => {
    if (!isPaused) {
      setShowPauseModal(true);
    } else {
      setIsPaused(false);
    }
  };

  const confirmPause = () => {
    setIsPaused(true);
    setShowPauseModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Guardian Console</h2>
        <p className="text-gray-400">Emergency controls and multi-signature management</p>
      </div>

      {/* Emergency Alert */}
      {isPaused && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-300">System Paused</h3>
              <p className="text-red-200 text-sm">
                All trading operations have been suspended. New trades and rebalancing are disabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">System Status</span>
          </div>
          <div className={`text-xl font-bold ${isPaused ? 'text-red-400' : 'text-[#43D4A0]'}`}>
            {isPaused ? 'Paused' : 'Active'}
          </div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">Guardians Online</span>
          </div>
          <div className="text-xl font-bold">2/3</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">Multisig Required</span>
          </div>
          <div className="text-xl font-bold">{multisigStatus.required}/{multisigStatus.total}</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Pending Txs</span>
          </div>
          <div className="text-xl font-bold">{multisigStatus.pending}</div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <h4 className="font-medium">Circuit Breaker</h4>
                <p className="text-sm text-gray-400">Pause all trading operations</p>
              </div>
              <button
                onClick={handlePauseToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPaused
                    ? 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <h4 className="font-medium">Force Settlement</h4>
                <p className="text-sm text-gray-400">Emergency position closure</p>
              </div>
              <button
                disabled={!isPaused}
                className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
              >
                Execute
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <h4 className="font-medium">Upgrade Protocol</h4>
                <p className="text-sm text-gray-400">Deploy new contract version</p>
              </div>
              <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                Propose
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <h4 className="font-medium">Emergency Withdrawal</h4>
                <p className="text-sm text-gray-400">Allow user fund recovery</p>
              </div>
              <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Management */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Guardian Signers</h3>
        
        <div className="space-y-4">
          {guardians.map((guardian, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  guardian.status === 'online' ? 'bg-[#43D4A0]' : 'bg-red-400'
                }`} />
                <div>
                  <div className="font-medium">{guardian.name}</div>
                  <div className="text-sm text-gray-400 font-mono">{guardian.address}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  guardian.status === 'online' ? 'text-[#43D4A0]' : 'text-red-400'
                }`}>
                  {guardian.status}
                </div>
                <div className="text-xs text-gray-400">{guardian.lastSeen}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-300 font-medium">Multi-Signature Security</p>
              <p className="text-blue-200 mt-1">
                All critical operations require {multisigStatus.required} out of {multisigStatus.total} guardian signatures. 
                Emergency actions are logged on-chain for full transparency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Guardian Activity */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'System status check', guardian: 'Guardian Alpha', time: '5 min ago', status: 'completed' },
            { action: 'Threshold review', guardian: 'Guardian Beta', time: '1 hour ago', status: 'completed' },
            { action: 'Multisig proposal', guardian: 'Guardian Alpha', time: '3 hours ago', status: 'signed' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div>
                <div className="font-medium">{activity.action}</div>
                <div className="text-sm text-gray-400">by {activity.guardian}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#43D4A0]">{activity.status}</div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pause Confirmation Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151B23] border border-red-500 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-300">Confirm Emergency Pause</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                This will immediately halt all trading operations, including:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li>New trade execution</li>
                <li>Basket rebalancing</li>
                <li>Proof generation</li>
                <li>API access (read-only mode)</li>
              </ul>
              <p className="text-red-300 text-sm font-medium">
                This action requires guardian multisig approval and will be logged on-chain.
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPause}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}