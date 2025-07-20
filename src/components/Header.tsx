import React from 'react';
import { Wallet, Power, AlertTriangle, Bot } from 'lucide-react';
import type { TradingAgent } from '../App';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  currentAgent?: TradingAgent;
}

export function Header({ isConnected, onConnect, onDisconnect, currentAgent }: HeaderProps) {
  return (
    <header className="bg-[#151B23] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Trading Dashboard</h1>
          {currentAgent && (
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full text-sm">
              <Bot className="h-4 w-4 text-[#43D4A0]" />
              <span>{currentAgent.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 bg-[#43D4A0] text-black px-3 py-1 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            Base Mainnet
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isConnected && (
            <>
              {currentAgent && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Agent VaR:</span>
                  <span className={`font-medium ${
                    currentAgent.varStatus > 0.8 ? 'text-red-400' : 'text-[#43D4A0]'
                  }`}>
                    {(currentAgent.varStatus * 100).toFixed(3)}% {currentAgent.varStatus > 0.8 ? '(HIGH RISK)' : '(Safe)'}
                  </span>
                  {currentAgent.varStatus > 0.8 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>System VaR:</span>
                <span className="text-[#43D4A0] font-medium">0.127% (Safe)</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-[#43D4A0]" />
                <span className="text-sm font-mono">0x8f2...a9c4</span>
              </div>
              
              <button
                onClick={onDisconnect}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Disconnect"
              >
                <Power className="h-5 w-5" />
              </button>
            </>
          )}
          
          {!isConnected && (
            <button
              onClick={onConnect}
              className="bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors"
            >
              Connect Wallet
            </button>
          )}
          
          {isConnected && (
            <button
              onClick={onConnect}
              className="bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors"
            >
              Deploy Agent
            </button>
          )}
        </div>
      </div>
    </header>
  );
}