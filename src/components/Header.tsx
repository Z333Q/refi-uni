import React from 'react';
import { Wallet, Power, AlertTriangle, Bot, Shield, Menu } from 'lucide-react';
import type { TradingAgent } from '../App';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  currentAgent?: TradingAgent;
  onMenuToggle?: () => void;
}

export function Header({ isConnected, onConnect, onDisconnect, currentAgent, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-[#151B23] border-b border-gray-800">
      <div className="px-6 py-4">
        {/* Top Row - Main Navigation */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="/green-logo-only-squareArtboard 1@0.25x.png" 
                  alt="ReFi.Trading Logo" 
                  className="h-5 w-5 md:h-6 md:w-6"
                />
                <div className="text-lg md:text-xl font-bold">ReFi.Trading</div>
              </div>
              <div className="hidden sm:block h-6 w-px bg-gray-700"></div>
              <h1 className="hidden sm:block text-sm md:text-lg font-medium text-gray-300">Trading Dashboard</h1>
            </div>

            {/* Network Status */}
            <div className="hidden lg:flex items-center space-x-2 bg-[#43D4A0]/10 border border-[#43D4A0]/30 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-[#43D4A0] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#43D4A0]">NYSE/NASDAQ</span>
            </div>
          </div>
          
          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {isConnected && (
              <>
                {/* Wallet Info */}
                <div className="hidden sm:flex items-center space-x-3 bg-gray-800/50 border border-gray-700 px-4 py-2 rounded-lg">
                  <Wallet className="h-4 w-4 text-[#43D4A0]" />
                  <span className="text-sm font-mono text-gray-300">0x8f2...a9c4</span>
                  <button
                    onClick={onDisconnect}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Disconnect"
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Deploy Agent Button */}
                <button
                  onClick={onConnect}
                  className="flex items-center space-x-2 bg-[#43D4A0] text-black px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors text-sm md:text-base"
                >
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">Deploy Agent</span>
                  <span className="sm:hidden">Deploy</span>
                </button>
              </>
            )}
            
            {!isConnected && (
              <button
                onClick={onConnect}
                className="flex items-center space-x-2 bg-[#43D4A0] text-black px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium hover:bg-[#3BC492] transition-colors text-sm md:text-base"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row - Agent & Risk Status */}
        {isConnected && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Current Agent */}
              {currentAgent && (
                <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-800/30 border border-gray-700 px-2 sm:px-3 py-1.5 rounded-lg">
                  <Bot className="h-4 w-4 text-[#43D4A0]" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium">{currentAgent.name}</span>
                    <span className="text-xs text-gray-400">{currentAgent.strategy}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Status */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              {/* System VaR */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Shield className="h-4 w-4 text-[#43D4A0]" />
                <span className="text-gray-400 hidden sm:inline">System VaR:</span>
                <span className="text-gray-400 sm:hidden">VaR:</span>
                <span className="text-[#43D4A0] font-medium">0.127%</span>
                <span className="text-xs text-gray-500 hidden sm:inline">(Safe)</span>
              </div>

              {/* Agent VaR */}
              {currentAgent && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentAgent.varStatus > 0.8 ? 'bg-red-500 animate-pulse' : 'bg-[#43D4A0]'
                  }`}></div>
                  <span className="text-gray-400 hidden sm:inline">Agent VaR:</span>
                  <span className="text-gray-400 sm:hidden">Agent:</span>
                  <span className={`font-medium ${
                    currentAgent.varStatus > 0.8 ? 'text-red-400' : 'text-[#43D4A0]'
                  }`}>
                    {(currentAgent.varStatus * 100).toFixed(3)}%
                  </span>
                  {currentAgent.varStatus > 0.8 && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-red-400 font-medium hidden sm:inline">HIGH RISK</span>
                      <span className="text-xs text-red-400 font-medium sm:hidden">HIGH</span>
                    </div>
                  )}
                </div>
              )}

              {/* Broker Status */}
              {currentAgent && (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#43D4A0] rounded-full"></div>
                  <span className="text-gray-400">Broker:</span>
                  <span className="text-[#43D4A0] font-medium">Connected</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}