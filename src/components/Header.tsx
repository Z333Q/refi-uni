import React from 'react';
import { Wallet, Power, AlertTriangle, Bot, Shield, Menu } from 'lucide-react';
import type { TradingAgent } from '../App';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  currentAgent?: TradingAgent;
  onMenuToggle?: () => void; // Optional - only available when wallet is connected
}

export function Header({ isConnected, onConnect, onDisconnect, currentAgent, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-card-bg border-b border-card-stroke">
      <div className="px-6 py-4">
        {/* Top Row - Main Navigation */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Mobile Menu Button */}
            {/* Mobile Menu Button - Only show when wallet is connected */}
            {isConnected && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            
            {/* Title */}
            <h1 className="text-lg md:text-xl font-medium text-gray-300">Trading Dashboard</h1>

            {/* Network Status */}
            <div className="hidden lg:flex items-center space-x-2 bg-neon-green/10 border border-neon-green/30 px-3 py-1.5 rounded-default">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-neon-green">NYSE/NASDAQ</span>
            </div>
          </div>
          
          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {isConnected && (
              <>
                {/* Wallet Info */}
                <div className="hidden sm:flex items-center space-x-3 bg-modal-bg/50 border border-card-stroke px-4 py-2 rounded-default">
                  <Wallet className="h-4 w-4 text-neon-green" />
                  <span className="text-sm font-mono text-blue-gray">0x8f2...a9c4</span>
                  <button
                    onClick={onDisconnect}
                    className="p-1 text-blue-gray hover:text-alert-red transition-refi"
                    title="Disconnect"
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Deploy Agent Button */}
                <button
                  onClick={onConnect}
                  className="flex items-center space-x-2 bg-neon-green text-black px-3 md:px-4 py-2 rounded-default font-medium hover:opacity-90 transition-refi text-sm md:text-base"
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
                className="flex items-center space-x-2 bg-neon-green text-black px-4 md:px-6 py-2 md:py-2.5 rounded-default font-medium hover:opacity-90 transition-refi text-sm md:text-base"
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
                <div className="flex items-center space-x-2 sm:space-x-3 bg-modal-bg/30 border border-card-stroke px-2 sm:px-3 py-1.5 rounded-default">
                  <Bot className="h-4 w-4 text-neon-green" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium">{currentAgent.name}</span>
                    <span className="text-xs text-blue-gray">{currentAgent.strategy}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Status */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              {/* System VaR */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Shield className="h-4 w-4 text-neon-green" />
                <span className="text-blue-gray hidden sm:inline">System VaR:</span>
                <span className="text-blue-gray sm:hidden">VaR:</span>
                <span className="text-neon-green font-medium">0.127%</span>
                <span className="text-xs text-blue-gray/70 hidden sm:inline">(Safe)</span>
              </div>

              {/* Agent VaR */}
              {currentAgent && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentAgent.varStatus > 0.8 ? 'bg-alert-red animate-pulse' : 'bg-neon-green'
                  }`}></div>
                  <span className="text-blue-gray hidden sm:inline">Agent VaR:</span>
                  <span className="text-blue-gray sm:hidden">Agent:</span>
                  <span className={`font-medium ${
                    currentAgent.varStatus > 0.8 ? 'text-alert-red' : 'text-neon-green'
                  }`}>
                    {(currentAgent.varStatus * 100).toFixed(3)}%
                  </span>
                  {currentAgent.varStatus > 0.8 && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3 text-alert-red" />
                      <span className="text-xs text-alert-red font-medium hidden sm:inline">HIGH RISK</span>
                      <span className="text-xs text-alert-red font-medium sm:hidden">HIGH</span>
                    </div>
                  )}
                </div>
              )}

              {/* Broker Status */}
              {currentAgent && (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-blue-gray">Broker:</span>
                  <span className="text-neon-green font-medium">Connected</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}