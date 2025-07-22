import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { BasketDetail } from './components/BasketDetail';
import { TradeStream } from './components/TradeStream';
import { ProofExplorer } from './components/ProofExplorer';
import { WalletStaking } from './components/WalletStaking';
import { ApiKeys } from './components/ApiKeys';
import { AlertsSettings } from './components/AlertsSettings';
import { ComplianceAudit } from './components/ComplianceAudit';
import { GuardianConsole } from './components/GuardianConsole';
import { ConnectWizard } from './components/ConnectWizard';
import { AgentSelector } from './components/AgentSelector';
import { RiskMonitor } from './components/RiskMonitor';
import { TokenomicsVault } from './components/TokenomicsVault';
import { Settings } from './components/Settings';

export type TabType = 'portfolio' | 'basket' | 'trades' | 'proofs' | 'risk' | 'tokenomics' | 'wallet' | 'settings' | 'alerts' | 'compliance' | 'guardian';

export interface TradingAgent {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'deploying';
  deployedAt: string;
  totalValue: number;
  pnl: number;
  varStatus: number;
  baskets: number;
  brokerId?: string;
  brokerConnected?: boolean;
}
function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio');
  const [isConnected, setIsConnected] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [agents, setAgents] = useState<TradingAgent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      // If already connected, go directly to agent deployment
      setShowWizard(true);
    } else {
      // If not connected, show connection wizard
      setShowWizard(true);
    }
  };

  // Handle wallet disconnection - hide sidebar and reset state
  const handleDisconnect = () => {
    setIsConnected(false);
    setSidebarOpen(false); // Close sidebar when wallet disconnects
    setActiveAgent(null); // Clear active agent
    setAgents([]); // Clear all agents
  };
  const handleWizardComplete = (agentData: { name: string; strategy: string; brokerId: string; apiKeys: Record<string, string> }) => {
    const newAgent: TradingAgent = {
      id: `agent_${Date.now()}`,
      name: agentData.name,
      strategy: agentData.strategy,
      status: 'deploying',
      deployedAt: new Date().toISOString(),
      totalValue: 0,
      pnl: 0,
      varStatus: 0.05,
      baskets: 1,
      brokerId: agentData.brokerId,
      brokerConnected: true
    };
    
    setAgents(prev => [...prev, newAgent]);
    setActiveAgent(newAgent.id);
    setIsConnected(true);
    setShowWizard(false);
    
    // Simulate deployment completion
    setTimeout(() => {
      setAgents(prev => prev.map(agent => 
        agent.id === newAgent.id 
          ? { ...agent, status: 'active' as const, totalValue: 45230, pnl: 12847.53 }
          : agent
      ));
    }, 3000);
  };

  const handleCreateNewAgent = () => {
    setShowWizard(true);
  };

  const currentAgent = agents.find(agent => agent.id === activeAgent);
  if (showWizard) {
    return (
      <ConnectWizard 
        onComplete={handleWizardComplete} 
        onClose={() => setShowWizard(false)}
        isAdditionalAgent={agents.length > 0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-midnight-canvas text-snow-white flex flex-col">
      <div className="flex">
        {/* Conditional Sidebar - Only show when wallet is connected */}
        {isConnected && (
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <div className={`flex-1 ${isConnected ? '' : 'ml-0'} flex flex-col`}>
          <Header 
            isConnected={isConnected} 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            currentAgent={currentAgent}
            onMenuToggle={isConnected ? () => setSidebarOpen(!sidebarOpen) : undefined}
          />
          
          {/* Agent Selector - Only show when wallet is connected and agents exist */}
          {isConnected && agents.length > 0 && (
            <AgentSelector
              agents={agents}
              activeAgent={activeAgent}
              onAgentChange={setActiveAgent}
              onCreateNew={handleCreateNewAgent}
            />
          )}
          
          <main className="p-4 md:p-6 flex-1">
            {!isConnected ? (
              <div className="max-w-6xl mx-auto space-y-16 font-inter flex flex-col min-h-full">
                {/* Hero Section */}
                <div className="text-center space-y-8 flex-1 flex flex-col justify-center">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                    Wall-Street AI in{' '}
                    <span className="text-neon-green">3 clicks</span>
                  </h1>
                  <p className="text-lg md:text-xl text-blue-gray max-w-4xl mx-auto leading-relaxed">
                    Algorithmic trading powered by provable AI agents, designed for both retail and institutional investors.
                  </p>
                  
                  {/* Primary CTAs */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <a 
                      href="https://refi.trading/analyzer/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neon-green text-black px-8 py-4 rounded-default font-semibold text-lg hover:bg-[#3BC492] transition-refi transform hover:scale-105 shadow-card hover:glow-neon"
                    >
                      Launch ROI Simulator →
                    </a>
                    <button className="px-8 py-4 bg-transparent border-2 border-card-stroke hover:border-neon-green text-snow-white rounded-default font-semibold text-lg transition-refi">
                      Watch Live Trading
                    </button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold text-center text-neon-green">
                    ReFinity© RL Agent Performance Against 3Y Buy & Hold
                  </h2>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                      <span className="text-blue-gray">Sharpe</span>
                      <span className="text-neon-green font-bold">+2.07</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-blue-gray">Max DD</span>
                      <span className="text-red-400 font-bold">-7.48%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                      <span className="text-blue-gray">CAGR</span>
                      <span className="text-neon-green font-bold">+28.06%</span>
                    </div>
                  </div>
                </div>

                {/* The Evolution of Trading Section */}
                <div className="bg-[#121821] border border-[#1E2B3A] rounded-lg p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">The Evolution of Trading</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Provable Agent Stack */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-neon-green mb-6">Provable Agent Stack</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center mt-1">
                            <span className="text-neon-green text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-neon-green">Algorithmic Precision</h4>
                            <p className="text-sm text-blue-gray">Consistent execution based on proven strategies</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center mt-1">
                            <span className="text-neon-green text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-neon-green">Zero-Knowledge Verified Risk Caps</h4>
                            <p className="text-sm text-blue-gray">Mathematically enforced risk parameters with cryptographic proofs</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center mt-1">
                            <span className="text-neon-green text-sm">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-neon-green">24/7 Multi-Market Coverage</h4>
                            <p className="text-sm text-blue-gray">Continuous monitoring across global markets and asset classes</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Manual DIY Stack */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-red-400 mb-6">Manual DIY Stack</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center mt-1">
                            <span className="text-red-400 text-sm">✕</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-400">Emotional Trading Decisions</h4>
                            <p className="text-sm text-blue-gray">Subject to fear, greed, and behavioral biases</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center mt-1">
                            <span className="text-red-400 text-sm">✕</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-400">Inconsistent Risk Management</h4>
                            <p className="text-sm text-blue-gray">Lack of systematic position sizing and drawdown control</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center mt-1">
                            <span className="text-red-400 text-sm">✕</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-400">Limited Market Coverage</h4>
                            <p className="text-sm text-blue-gray">Unable to monitor and act on multiple markets 24/7</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ready to Transform Section */}
                <div className="text-center space-y-8">
                  <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Ready to transform your trading?</h2>
                  <p className="text-lg text-blue-gray max-w-3xl mx-auto">
                    Join our waitlist for early access to our beta program and be among the first to experience the future of algorithmic trading.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={handleConnect}
                      className="bg-neon-green text-black px-8 py-4 rounded-default font-semibold text-lg hover:bg-[#3BC492] transition-refi transform hover:scale-105 shadow-card hover:glow-neon"
                    >
                      Connect Wallet
                    </button>
                    <a 
                      href="https://refi.trading/analyzer/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-transparent border-2 border-card-stroke hover:border-neon-green text-snow-white rounded-default font-semibold text-lg transition-refi"
                    >
                      Try ROI Simulator
                    </a>
                  </div>
                </div>


                {/* The Evolution of Trading Section */}
                <div className="bg-[#121821] border border-[#1E2B3A] rounded-lg p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4">The Evolution of Trading</h3>
                  <p className="text-[#A8B8C5] mb-6 text-base md:text-lg">
                    Traditional trading relies on intuition and delayed data. Our provable AI agents execute trades with mathematical precision, backed by cryptographic proof systems that ensure every decision is verifiable and compliant.
                  </p>
                  <a 
                    href="https://refi.trading/analyzer/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-neon-green hover:bg-[#3BC492] text-black rounded-lg font-semibold transition-all duration-300 ease-in-out"
                  >
                    Launch Portfolio Analyzer
                  </a>
                </div>

                {/* Waitlist Call to Action Section */}
                <div className="bg-[#121821] border border-[#1E2B3A] rounded-lg p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    Ready to transform your trading?
                  </h3>
                  <p className="text-[#A8B8C5] mb-6 text-base md:text-lg max-w-2xl mx-auto">
                    Get priority access to our institutional-grade trading platform. Join thousands of traders already using AI-powered strategies with proven risk management and regulatory compliance.
                  </p>
                  <a 
                    href="https://refi.trading/waitlist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-neon-green hover:bg-[#3BC492] text-black rounded-lg font-semibold transition-all duration-300 ease-in-out"
                  >
                    Join Waitlist
                  </a>
                </div>

                {/* Footer Section */}
                <footer className="border-t border-card-stroke pt-12 mt-auto">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <img 
                          src="/green-logo-only-squareArtboard 1@0.25x.png" 
                          alt="ReFi.Trading Logo" 
                          className="h-6 w-6"
                        />
                        <div className="text-lg font-bold">ReFi.Trading</div>
                      </div>
                      <p className="text-sm text-blue-gray mb-4">
                        Wall Street AI in three clicks. Democratizing algorithmic trading with provable agent technology.
                      </p>
                      <div className="flex space-x-4">
                        <a href="#" className="text-blue-gray hover:text-neon-green transition-colors">
                          <span className="sr-only">Twitter</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                        <a href="#" className="text-blue-gray hover:text-neon-green transition-colors">
                          <span className="sr-only">GitHub</span>
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-snow-white mb-4">Products</h3>
                      <ul className="space-y-2 text-sm text-blue-gray">
                        <li><a href="#" className="hover:text-neon-green transition-colors">ROI Simulator</a></li>
                        <li><a href="#" className="hover:text-neon-green transition-colors">Agent Marketplace</a></li>
                        <li><a href="#" className="hover:text-neon-green transition-colors">Live Trading Feed</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-snow-white mb-4">Governance</h3>
                      <ul className="space-y-2 text-sm text-blue-gray">
                        <li><a href="#" className="hover:text-neon-green transition-colors">Staking & Rewards</a></li>
                        <li><a href="#" className="hover:text-neon-green transition-colors">Node Operator</a></li>
                        <li><a href="#" className="hover:text-neon-green transition-colors">Proposals</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-snow-white mb-4">Documentation</h3>
                      <ul className="space-y-2 text-sm text-blue-gray">
                        <li><a href="#" className="hover:text-neon-green transition-colors">Quick Start Guide</a></li>
                        <li><a href="#" className="hover:text-neon-green transition-colors">API Reference</a></li>
                        <li><a href="#" className="hover:text-neon-green transition-colors">SDK Examples</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t border-card-stroke mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-blue-gray">© 2025 ReFi.Trading. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <a href="#" className="text-sm text-blue-gray hover:text-neon-green transition-colors">SOC-2 Roadmap</a>
                      <a href="#" className="text-sm text-blue-gray hover:text-neon-green transition-colors">Quantstamp Audit Booked</a>
                    </div>
                  </div>
                </footer>

                {/* Value Proposition Section */}

              </div>
            ) : (
              <>
                {activeTab === 'portfolio' && <PortfolioOverview currentAgent={currentAgent} />}
                {activeTab === 'basket' && <BasketDetail currentAgent={currentAgent} />}
                {activeTab === 'trades' && <TradeStream currentAgent={currentAgent} />}
                {activeTab === 'proofs' && <ProofExplorer currentAgent={currentAgent} />}
                {activeTab === 'risk' && <RiskMonitor />}
                {activeTab === 'tokenomics' && <TokenomicsVault />}
                {activeTab === 'wallet' && <WalletStaking />}
                {activeTab === 'settings' && <Settings />}
                {activeTab === 'alerts' && <AlertsSettings />}
                {activeTab === 'compliance' && <ComplianceAudit />}
                {activeTab === 'guardian' && <GuardianConsole />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;