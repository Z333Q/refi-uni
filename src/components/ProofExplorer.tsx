import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, Eye, Copy, Bot } from 'lucide-react';
import type { TradingAgent } from '../App';

interface Proof {
  id: string;
  timestamp: string;
  type: 'var' | 'compliance' | 'execution';
  status: 'verified' | 'pending' | 'failed';
  tradeId: string;
  proofHash: string;
  verificationTime: number;
  varValue?: number;
  agentId?: string;
}

interface ProofExplorerProps {
  currentAgent?: TradingAgent;
}

export function ProofExplorer({ currentAgent }: ProofExplorerProps) {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Agent Selected</h2>
          <p className="text-gray-400">Select an active trading agent to explore proofs</p>
        </div>
      </div>
    );
  }
  useEffect(() => {
    const mockProofs: Proof[] = [
      {
        id: 'proof_001',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        type: 'var',
        status: 'verified',
        tradeId: 'trade_12847',
        proofHash: '0x9f3a...d7e2',
        verificationTime: 28,
        varValue: 0.127,
        agentId: currentAgent.id
      },
      {
        id: 'proof_002',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'compliance',
        status: 'verified',
        tradeId: 'trade_12846',
        proofHash: '0x8e2b...c6d1',
        verificationTime: 31
      },
      {
        id: 'proof_003',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'execution',
        status: 'verified',
        tradeId: 'trade_12845',
        proofHash: '0x7d1c...b5c0',
        verificationTime: 24
      },
      {
        id: 'proof_004',
        timestamp: new Date(Date.now() - 10000).toISOString(),
        type: 'var',
        status: 'pending',
        tradeId: 'trade_12848',
        proofHash: '0x6c0b...a4bf',
        verificationTime: 0,
        varValue: 0.089
      }
    ];

    setProofs(mockProofs);

    // Simulate new proofs
    const interval = setInterval(() => {
      const newProof: Proof = {
        id: `proof_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: ['var', 'compliance', 'execution'][Math.floor(Math.random() * 3)] as Proof['type'],
        status: 'verified',
        tradeId: `trade_${Math.floor(Math.random() * 10000)}`,
        proofHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
        verificationTime: Math.floor(Math.random() * 40) + 10,
        varValue: Math.random() * 0.5
      };

      setProofs(prev => [newProof, ...prev.slice(0, 19)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getProofTypeColor = (type: string) => {
    switch (type) {
      case 'var': return 'text-[#43D4A0] bg-green-900/20';
      case 'compliance': return 'text-blue-400 bg-blue-900/20';
      case 'execution': return 'text-purple-400 bg-purple-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-[#43D4A0] bg-green-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Proof Explorer</h2>
        <p className="text-gray-400">Zero-knowledge proof audit trail and verification</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Proofs', value: '12,847', icon: Shield },
          { label: 'Avg Gen Time', value: '29ms', icon: Clock },
          { label: 'Success Rate', value: '100%', icon: CheckCircle },
          { label: 'Active Queue', value: '2', icon: Eye }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="h-5 w-5 text-[#43D4A0]" />
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proof List */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Proofs</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {proofs.map((proof) => (
              <div
                key={proof.id}
                onClick={() => setSelectedProof(proof)}
                className="p-4 bg-gray-800/30 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getProofTypeColor(proof.type)}`}>
                      {proof.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">{formatTime(proof.timestamp)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proof.status)}`}>
                    {proof.status}
                  </span>
                </div>
                
                <div className="text-sm">
                  <div className="font-mono text-gray-300">{proof.proofHash}</div>
                  <div className="text-gray-400 mt-1">
                    Trade: {proof.tradeId} • {proof.verificationTime}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proof Details */}
        <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Proof Details</h3>
          
          {selectedProof ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Proof ID</label>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{selectedProof.id}</span>
                    <button
                      onClick={() => copyToClipboard(selectedProof.id)}
                      className="text-gray-400 hover:text-[#43D4A0] transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Type</label>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getProofTypeColor(selectedProof.type)}`}>
                    {selectedProof.type.toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Proof Hash</label>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm break-all">{selectedProof.proofHash}</span>
                  <button
                    onClick={() => copyToClipboard(selectedProof.proofHash)}
                    className="text-gray-400 hover:text-[#43D4A0] transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Trade ID</label>
                  <div className="font-mono text-sm">{selectedProof.tradeId}</div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Verification Time</label>
                  <div className="text-sm">{selectedProof.verificationTime}ms</div>
                </div>
              </div>

              {selectedProof.varValue !== undefined && (
                <div>
                  <label className="text-sm text-gray-400">VaR Value</label>
                  <div className={`text-sm font-medium ${
                    selectedProof.varValue > 0.8 ? 'text-red-400' : 'text-[#43D4A0]'
                  }`}>
                    {(selectedProof.varValue * 100).toFixed(3)}%
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
                <h4 className="font-medium mb-2">Verification Result</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Circuit:</span>
                    <span>Groth16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Public Inputs:</span>
                    <span>3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Constraints:</span>
                    <span>1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verification:</span>
                    <span className="text-[#43D4A0]">✓ Valid</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#43D4A0] text-black py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors">
                View on BaseScan
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a proof to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}