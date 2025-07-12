import React, { useState, useEffect } from 'react';
import { FileCheck, Clock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface DigestEntry {
  id: string;
  timestamp: string;
  merkleRoot: string;
  tradeCount: number;
  status: 'confirmed' | 'pending' | 'failed';
  txHash: string;
}

interface AceLog {
  id: string;
  timestamp: string;
  walletAddress: string;
  action: string;
  policy: string;
  result: 'pass' | 'fail';
  reason?: string;
}

export function ComplianceAudit() {
  const [digestHistory, setDigestHistory] = useState<DigestEntry[]>([]);
  const [aceLogs, setAceLogs] = useState<AceLog[]>([]);
  const [lastDigest, setLastDigest] = useState<string>('2 hours ago');

  useEffect(() => {
    // Mock digest history
    const mockDigests: DigestEntry[] = [
      {
        id: 'digest_001',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        merkleRoot: '0x3f7a...e9d2',
        tradeCount: 247,
        status: 'confirmed',
        txHash: '0x8b4e...f3a1'
      },
      {
        id: 'digest_002',
        timestamp: new Date(Date.now() - 93600000).toISOString(), // 26 hours ago
        merkleRoot: '0x2e6b...d8c1',
        tradeCount: 189,
        status: 'confirmed',
        txHash: '0x7c3d...e2b0'
      },
      {
        id: 'digest_003',
        timestamp: new Date(Date.now() - 180000000).toISOString(), // 50 hours ago
        merkleRoot: '0x1d5a...c7b0',
        tradeCount: 312,
        status: 'confirmed',
        txHash: '0x6b2c...d1af'
      }
    ];

    // Mock ACE logs
    const mockAceLogs: AceLog[] = [
      {
        id: 'ace_001',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        walletAddress: '0x8f2a...b9c4',
        action: 'trade_execution',
        policy: 'KYC_VERIFICATION',
        result: 'pass'
      },
      {
        id: 'ace_002',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        walletAddress: '0x7e1d...a8f3',
        action: 'basket_creation',
        policy: 'OFAC_SANCTIONS',
        result: 'pass'
      },
      {
        id: 'ace_003',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        walletAddress: '0x6d0c...9e2b',
        action: 'trade_execution',
        policy: 'JURISDICTION_CHECK',
        result: 'fail',
        reason: 'Restricted jurisdiction detected'
      }
    ];

    setDigestHistory(mockDigests);
    setAceLogs(mockAceLogs);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  const isDigestOverdue = () => {
    const lastDigestTime = new Date(digestHistory[0]?.timestamp);
    const hoursAgo = (new Date().getTime() - lastDigestTime.getTime()) / (1000 * 60 * 60);
    return hoursAgo > 25;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Compliance & Audit</h2>
        <p className="text-gray-400">CCIP digest history and ACE compliance monitoring</p>
      </div>

      {/* Alert Banner */}
      {isDigestOverdue() && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-300">Digest Overdue</h3>
              <p className="text-red-200 text-sm">
                Last CCIP digest was submitted more than 25 hours ago. 
                New digest submission required for compliance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileCheck className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">CCIP Status</span>
          </div>
          <div className="text-xl font-bold text-[#43D4A0]">Active</div>
          <div className="text-xs text-gray-500">Last: {lastDigest}</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">ACE Policy</span>
          </div>
          <div className="text-xl font-bold text-[#43D4A0]">Passing</div>
          <div className="text-xs text-gray-500">98.7% success rate</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">Total Trades</span>
          </div>
          <div className="text-xl font-bold">12,847</div>
          <div className="text-xs text-gray-500">This month</div>
        </div>

        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ExternalLink className="h-5 w-5 text-[#43D4A0]" />
            <span className="text-sm text-gray-400">Audit Trail</span>
          </div>
          <div className="text-xl font-bold text-[#43D4A0]">100%</div>
          <div className="text-xs text-gray-500">Coverage</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CCIP Digest History */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">CCIP Digest Timeline</h3>
          <div className="space-y-4">
            {digestHistory.map((digest, index) => (
              <div key={digest.id} className="relative">
                {index < digestHistory.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-700"></div>
                )}
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    digest.status === 'confirmed' ? 'bg-[#43D4A0]' :
                    digest.status === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {digest.status === 'confirmed' ? (
                      <CheckCircle className="h-4 w-4 text-black" />
                    ) : digest.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-black" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-black" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Digest #{digest.id.split('_')[1]}</span>
                      <span className="text-sm text-gray-400">{getTimeSince(digest.timestamp)}</span>
                    </div>
                    
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Merkle Root: <span className="font-mono">{digest.merkleRoot}</span></div>
                      <div>Trades: {digest.tradeCount}</div>
                      <div className="flex items-center space-x-2">
                        <span>Tx Hash: <span className="font-mono">{digest.txHash}</span></span>
                        <button className="text-[#43D4A0] hover:text-[#3BC492] transition-colors">
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACE Compliance Logs */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">ACE Compliance Log</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {aceLogs.map((log) => (
              <div key={log.id} className="p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${
                      log.result === 'pass' ? 'bg-[#43D4A0]' : 'bg-red-400'
                    }`} />
                    <span className="font-medium">{log.policy.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-sm text-gray-400">{formatTime(log.timestamp)}</span>
                </div>
                
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Action: {log.action.replace(/_/g, ' ')}</div>
                  <div>Wallet: <span className="font-mono">{log.walletAddress}</span></div>
                  {log.reason && (
                    <div className="text-red-400">Reason: {log.reason}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Policies */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Active Compliance Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'KYC Verification', status: 'active', coverage: '100%' },
            { name: 'OFAC Sanctions', status: 'active', coverage: '100%' },
            { name: 'Jurisdiction Check', status: 'active', coverage: '100%' },
            { name: 'AML Monitoring', status: 'active', coverage: '100%' },
            { name: 'Risk Scoring', status: 'active', coverage: '98.7%' },
            { name: 'Transaction Limits', status: 'active', coverage: '100%' }
          ].map((policy, index) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{policy.name}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  policy.status === 'active' 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {policy.status}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Coverage: <span className="text-[#43D4A0]">{policy.coverage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}