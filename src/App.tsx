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
    <div className="min-h-screen bg-midnight-canvas text-snow-white">
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1">
          <Header 
            isConnected={isConnected} 
            onConnect={handleConnect}
            onDisconnect={() => setIsConnected(false)}
            currentAgent={currentAgent}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          
          {isConnected && agents.length > 0 && (
            <AgentSelector
              agents={agents}
              activeAgent={activeAgent}
              onAgentChange={setActiveAgent}
              onCreateNew={handleCreateNewAgent}
            />
          )}
          
          <main className="p-4 md:p-6">
            {!isConnected ? (
              <div className="max-w-4xl mx-auto text-center space-y-8 font-inter">
                {/* Value Proposition Section */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-neon-green to-blue-400 bg-clip-text text-transparent">
                    Wall Street AI in 3 Clicks
                  </h2>
                  <p className="text-lg md:text-xl text-blue-gray max-w-3xl mx-auto leading-relaxed">
                    Deploy institutional-grade trading algorithms with zero-knowledge proof verification. Advanced risk management meets accessible automation for serious traders.
                  </p>
                  
                  {/* Primary CTA */}
                  <button
                    onClick={handleConnect}
                    className="bg-neon-green text-black px-8 py-4 rounded-default font-semibold text-lg hover:bg-[#3BC492] transition-refi transform hover:scale-105 shadow-card hover:glow-neon"
                  >
                    Connect Wallet
                  </button>
                  
                  {/* Secondary CTAs */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <button className="px-6 py-3 bg-card-bg hover:bg-modal-bg text-snow-white rounded-default font-medium transition-refi border border-card-stroke hover:border-neon-green">
                      Launch Portfolio Analyzer
                    </button>
                    <button className="px-6 py-3 bg-card-bg hover:bg-modal-bg text-snow-white rounded-default font-medium transition-refi border border-card-stroke hover:border-neon-green">
                      Watch Live Trading
                    </button>
                  </div>
                </div>

                {/* Performance Metrics Section */}
                <div className="bg-[#121821] border border-[#1E2B3A] rounded-lg p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-neon-green">
                    ReFinity© RL Agent Performance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-neon-green">+2.07</div>
                      <div className="text-blue-gray mt-1">Sharpe Ratio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-neon-green">{'< 7.48%'}</div>
                      <div className="text-blue-gray mt-1">Max Drawdown</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-neon-green">+28.06%</div>
                      <div className="text-blue-gray mt-1">CAGR</div>
                    </div>
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
                  <h3 className="text-xl md:text-2xl font-bold text-[#43D4A0] mb-4">
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