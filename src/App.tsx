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

  const handleWizardComplete = (agentData: { name: string; strategy: string }) => {
    const newAgent: TradingAgent = {
      id: `agent_${Date.now()}`,
      name: agentData.name,
      strategy: agentData.strategy,
      status: 'deploying',
      deployedAt: new Date().toISOString(),
      totalValue: 0,
      pnl: 0,
      varStatus: 0.05,
      baskets: 1
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
    <div className="min-h-screen bg-[#0E1117] text-white">
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
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Welcome to ReFinity</h2>
                  <p className="text-gray-400 mb-6 text-sm md:text-base px-4">Connect your wallet to start trading with Wall-Street-grade rails on ReFinity Protocol</p>
                  <button
                    onClick={handleConnect}
                    className="bg-[#43D4A0] text-black px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-[#3BC492] transition-colors text-sm md:text-base"
                  >
                    Connect Wallet
                  </button>
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