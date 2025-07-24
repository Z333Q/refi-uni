import React, { useState } from 'react';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Globe, 
  ChevronRight, 
  Play,
  Menu,
  X,
  Twitter,
  Linkedin,
  Github,
  Mail
} from 'lucide-react';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RiskMonitor } from './components/RiskMonitor';
import { TradeStream } from './components/TradeStream';
import { BasketDetail } from './components/BasketDetail';
import { AgentSelector } from './components/AgentSelector';
import { ConnectWizard } from './components/ConnectWizard';
import { ProofExplorer } from './components/ProofExplorer';
import { WalletStaking } from './components/WalletStaking';
import { AlertsSettings } from './components/AlertsSettings';
import { ComplianceAudit } from './components/ComplianceAudit';
import { GuardianConsole } from './components/GuardianConsole';
import { TokenomicsVault } from './components/TokenomicsVault';
import { PerformanceChart } from './components/PerformanceChart';
import { PortfolioOverview } from './components/PortfolioOverview';
import { Settings } from './components/Settings';

export type TabType = 'portfolio' | 'risk' | 'trades' | 'basket' | 'proofs' | 'wallet' | 'alerts' | 'compliance' | 'guardian' | 'tokenomics' | 'settings';

export interface TradingAgent {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'deploying';
  totalValue: number;
  pnl: number;
  varStatus: number;
}
function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [agents, setAgents] = useState<TradingAgent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [showConnectWizard, setShowConnectWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentAgent = agents.find(agent => agent.id === activeAgent);

  // Debug logging for state tracking
  console.log('App State:', {
    isWalletConnected,
    agentsCount: agents.length,
    activeAgent,
    currentAgent: currentAgent?.name
  });
  const handleConnect = () => {
    console.log('handleConnect called, isWalletConnected:', isWalletConnected);
    if (!isWalletConnected) {
      // Connect wallet first
      setIsLoading(true);
      setIsWalletConnected(true);
      setShowConnectWizard(true);
      setIsLoading(false);
    } else {
      // Deploy additional agent
      setShowConnectWizard(true);
    }
  };

  const handleDisconnect = () => {
    console.log('handleDisconnect called');
    setIsWalletConnected(false);
    setAgents([]);
    setActiveAgent(null);
    setActiveTab('portfolio');
    setIsMobileMenuOpen(false);
  };

  const handleAgentComplete = (agentData: { name: string; strategy: string; brokerId: string; apiKeys: Record<string, string> }) => {
    console.log('handleAgentComplete called with:', agentData);
    const newAgent: TradingAgent = {
      id: `agent_${Date.now()}`,
      name: agentData.name,
      strategy: agentData.strategy,
      status: 'active',
      totalValue: 45230,
      pnl: Math.random() * 2000 - 1000,
      varStatus: Math.random() * 0.5
    };
    
    console.log('Creating new agent:', newAgent);
    setAgents(prev => [...prev, newAgent]);
    setActiveAgent(newAgent.id);
    setShowConnectWizard(false);
    
    // Ensure we're on the portfolio tab after agent creation
    setActiveTab('portfolio');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <PortfolioOverview currentAgent={currentAgent} />;
      case 'risk':
        return <RiskMonitor />;
      case 'trades':
        return <TradeStream currentAgent={currentAgent} />;
      case 'basket':
        return <BasketDetail currentAgent={currentAgent} />;
      case 'proofs':
        return <ProofExplorer currentAgent={currentAgent} />;
      case 'wallet':
        return <WalletStaking />;
      case 'alerts':
        return <AlertsSettings />;
      case 'compliance':
        return <ComplianceAudit />;
      case 'guardian':
        return <GuardianConsole />;
      case 'tokenomics':
        return <TokenomicsVault />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20" />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    The Future of
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {" "}DeFi Trading
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Harness the power of AI-driven reinforcement learning agents to optimize your DeFi portfolio with institutional-grade risk management and real-time market intelligence.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                      Launch Portfolio Analyzer
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                    <button className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center">
                      <Play className="mr-2 w-5 h-5" />
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Performance Metrics */}
            <section className="py-16 bg-black/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    **ReFinity© RL Agent Performance vs. 3-Year Buy-and-Hold Strategy**
                  </h2>
                  <p className="text-gray-400">Real performance data from our reinforcement learning algorithms</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 rounded-xl border border-green-500/20">
                    <div className="text-green-400 text-2xl font-bold">+247%</div>
                    <div className="text-gray-300 text-sm">Total Returns</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6 rounded-xl border border-blue-500/20">
                    <div className="text-blue-400 text-2xl font-bold">1.34</div>
                    <div className="text-gray-300 text-sm">Sharpe Ratio</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 rounded-xl border border-purple-500/20">
                    <div className="text-purple-400 text-2xl font-bold">-12%</div>
                    <div className="text-gray-300 text-sm">Max Drawdown</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 p-6 rounded-xl border border-orange-500/20">
                    <div className="text-orange-400 text-2xl font-bold">89%</div>
                    <div className="text-gray-300 text-sm">Win Rate</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">Advanced DeFi Intelligence</h2>
                  <p className="text-gray-400">Cutting-edge features designed for professional traders</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-8 rounded-xl border border-slate-600/20 hover:border-purple-500/40 transition-all duration-300">
                    <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Trading</h3>
                    <p className="text-gray-400">Advanced reinforcement learning algorithms that adapt to market conditions in real-time.</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-8 rounded-xl border border-slate-600/20 hover:border-purple-500/40 transition-all duration-300">
                    <Shield className="w-12 h-12 text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">Risk Management</h3>
                    <p className="text-gray-400">Institutional-grade risk controls with dynamic position sizing and stop-loss mechanisms.</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-8 rounded-xl border border-slate-600/20 hover:border-purple-500/40 transition-all duration-300">
                    <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                    <p className="text-gray-400">Sub-second execution speeds with direct DEX integration and MEV protection.</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-8 rounded-xl border border-slate-600/20 hover:border-purple-500/40 transition-all duration-300">
                    <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">Advanced Analytics</h3>
                    <p className="text-gray-400">Comprehensive portfolio analytics with real-time P&L tracking and performance attribution.</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-8 rounded-xl border border-slate-600/20 hover:border-purple-500/40 transition-all duration-300">
                    <Users className="w-12 h-12 text-pink-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">Social Trading</h3>
                    <p className="text-gray-400">Follow top performers and share strategies with our community of professional traders.</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 p-8 rounded-xl border border-slate-600/20 hover:border-purple-500/40 transition-all duration-300">
                    <Globe className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">Multi-Chain</h3>
                    <p className="text-gray-400">Trade across Ethereum, Polygon, Arbitrum, and other leading DeFi ecosystems.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Trading?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of traders already using ReFi.Trading to maximize their DeFi returns.
                </p>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                  Get Started Today
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/40 border-t border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
                      <span className="text-2xl font-bold text-white">ReFi.Trading</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      The next generation of DeFi trading powered by artificial intelligence and reinforcement learning.
                    </p>
                    <div className="flex space-x-4">
                      <Twitter className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                      <Linkedin className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                      <Github className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                      <Mail className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Platform</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Portfolio Analyzer</a></li>
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Risk Monitor</a></li>
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Trade Stream</a></li>
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Analytics</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                      <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-400">
                  <p>© 2025 ReFi.Trading Inc. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {showConnectWizard && (
        <ConnectWizard 
          onComplete={handleAgentComplete}
          onClose={() => setShowConnectWizard(false)}
          isAdditionalAgent={agents.length > 0}
        />
      )}
      
      {!isWalletConnected ? (
        // Show landing page when wallet not connected
        renderMainContent()
      ) : (
        // Show dashboard when wallet is connected
        <div className="flex h-screen">
          <Sidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              isConnected={isWalletConnected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              currentAgent={currentAgent}
              onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            {agents.length > 0 && (
              <AgentSelector 
                agents={agents}
                activeAgent={activeAgent}
                onAgentChange={setActiveAgent}
                onCreateNew={() => setShowConnectWizard(true)}
              />
            )}
            <main className="flex-1 overflow-auto bg-midnight-canvas p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#43D4A0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                  </div>
                </div>
              ) : agents.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-[#43D4A0] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bot className="h-8 w-8 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Welcome to ReFi.Trading</h2>
                    <p className="text-gray-400 mb-6">
                      Get started by deploying your first AI trading agent. 
                      Connect your broker and choose a strategy to begin automated trading.
                    </p>
                    <button
                      onClick={() => setShowConnectWizard(true)}
                      className="bg-[#43D4A0] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#3BC492] transition-colors"
                    >
                      Deploy Your First Agent
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {renderMainContent()}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;