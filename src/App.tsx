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
  Mail,
  CheckCircle
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
  console.log('🔍 App State Debug:', {
    isWalletConnected,
    agentsCount: agents.length,
    activeAgent,
    currentAgent: currentAgent?.name,
    showConnectWizard,
    shouldShowLanding: !isWalletConnected
  });

  const handleConnect = () => {
    console.log('handleConnect called, isWalletConnected:', isWalletConnected);
    if (!isWalletConnected) {
      // Show connect wizard, wallet connection happens inside wizard
      setShowConnectWizard(true);
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
    
    // Set wallet as connected when first agent is created
    if (!isWalletConnected) {
      setIsWalletConnected(true);
    }
    
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
          <div className="min-h-screen bg-midnight-canvas">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-card-bg/50 to-modal-bg/30" />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Wall-Street AI in
                    <span className="text-neon-green">
                      {" "}3 clicks
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Algorithmic trading powered by provable AI agents, designed for both retail and institutional investors.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-neon-green hover:bg-neon-green/90 text-black px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                      Launch Portfolio Analyzer
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
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                      <span className="text-gray-400">ReFinity© RL Agent Sharpe</span>
                      <span className="text-neon-green font-bold">+2.87</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-gray-400">Max DD</span>
                      <span className="text-red-400 font-bold">-7.48%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-400">CAGR</span>
                      <span className="text-blue-400 font-bold">+28.86%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Evolution of Trading Section */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">The Evolution of Trading</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* Manual DIY Stack */}
                  <div className="bg-card-bg border border-card-stroke rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Manual DIY Stack</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Emotional Trading Decisions</h4>
                          <p className="text-gray-400 text-sm">Subject to fear, greed, and behavioral biases</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Inconsistent Risk Management</h4>
                          <p className="text-gray-400 text-sm">Lack of systematic position sizing and drawdown control</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Limited Market Coverage</h4>
                          <p className="text-gray-400 text-sm">Unable to monitor and act on multiple markets 24/7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Provable Agent Stack */}
                  <div className="bg-card-bg border border-neon-green/30 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Provable Agent Stack</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Algorithmic Precision</h4>
                          <p className="text-gray-400 text-sm">Consistent execution based on proven strategies</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">Zero-Knowledge Verified Risk Caps</h4>
                          <p className="text-gray-400 text-sm">Mathematically enforced risk parameters with cryptographic proofs</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-medium">24/7 Multi-Market Coverage</h4>
                          <p className="text-gray-400 text-sm">Continuous monitoring across global markets and asset classes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-card-bg/50">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <Zap className="w-16 h-16 text-neon-green mx-auto mb-4" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your trading?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join our waitlist for early access to our beta program and be among the first to experience the future of algorithmic trading.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleConnect}
                    className="bg-neon-green hover:bg-neon-green/90 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Connect Wallet
                  </button>
                  <button className="border border-card-stroke text-gray-300 hover:bg-card-bg hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                    Try ROI Simulator
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-card-bg border-t border-card-stroke">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center mb-4">
                      <img 
                        src="/green-logo-only-squareArtboard 1@0.25x.png" 
                        alt="ReFi.Trading Logo" 
                        className="h-8 w-8 mr-3"
                      />
                      <span className="text-2xl font-bold text-white">ReFi.Trading</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Wall Street AI in three clicks. Democratizing algorithmic trading with provable agent technology.
                    </p>
                    <div className="flex space-x-4">
                      <Twitter className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                      <Linkedin className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                      <Github className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                      <Mail className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Products</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-neon-green transition-colors">ROI Simulator</a></li>
                      <li><a href="#" className="hover:text-neon-green transition-colors">Agent Marketplace</a></li>
                      <li><a href="#" className="hover:text-neon-green transition-colors">Live Trading Feed</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Documentation</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-neon-green transition-colors">Quick Start Guide</a></li>
                      <li><a href="#" className="hover:text-neon-green transition-colors">API Reference</a></li>
                      <li><a href="#" className="hover:text-neon-green transition-colors">SDK Examples</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-card-stroke mt-8 pt-8 text-center text-gray-400">
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
      
      {!isWalletConnected && !showConnectWizard ? (
        // Landing Page
        <div className="min-h-screen bg-midnight-canvas">
          {/* Debug Info */}
          <div className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded text-xs z-50">
            Wallet: {isWalletConnected ? 'Connected' : 'Not Connected'} | Agents: {agents.length}
          </div>

          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-card-bg/50 to-modal-bg/30" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Wall-Street AI in
                  <span className="text-neon-green">
                    {" "}3 clicks
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Algorithmic trading powered by provable AI agents, designed for both retail and institutional investors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleConnect}
                    className="bg-neon-green hover:bg-neon-green/90 text-black px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    Launch Portfolio Analyzer
                  </button>
                  <button className="border border-neon-green text-neon-green hover:bg-neon-green hover:text-black px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center">
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
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-gray-400">ReFinity© RL Agent Sharpe</span>
                    <span className="text-neon-green font-bold">+2.87</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-400">Max DD</span>
                    <span className="text-red-400 font-bold">-7.48%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-400">CAGR</span>
                    <span className="text-blue-400 font-bold">+28.86%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Evolution of Trading Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">The Evolution of Trading</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Manual DIY Stack */}
                <div className="bg-card-bg border border-card-stroke rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6">Manual DIY Stack</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Emotional Trading Decisions</h4>
                        <p className="text-gray-400 text-sm">Subject to fear, greed, and behavioral biases</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Inconsistent Risk Management</h4>
                        <p className="text-gray-400 text-sm">Lack of systematic position sizing and drawdown control</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Limited Market Coverage</h4>
                        <p className="text-gray-400 text-sm">Unable to monitor and act on multiple markets 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Provable Agent Stack */}
                <div className="bg-card-bg border border-neon-green/30 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6">Provable Agent Stack</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Algorithmic Precision</h4>
                        <p className="text-gray-400 text-sm">Consistent execution based on proven strategies</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">Zero-Knowledge Verified Risk Caps</h4>
                        <p className="text-gray-400 text-sm">Mathematically enforced risk parameters with cryptographic proofs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-neon-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium">24/7 Multi-Market Coverage</h4>
                        <p className="text-gray-400 text-sm">Continuous monitoring across global markets and asset classes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-card-bg/50">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <Zap className="w-16 h-16 text-neon-green mx-auto mb-4" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your trading?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join our waitlist for early access to our beta program and be among the first to experience the future of algorithmic trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleConnect}
                  className="bg-neon-green hover:bg-neon-green/90 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Connect Wallet
                </button>
                <button className="border border-card-stroke text-gray-300 hover:bg-card-bg hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  Try ROI Simulator
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-card-bg border-t border-card-stroke">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center mb-4">
                    <img 
                      src="/green-logo-only-squareArtboard 1@0.25x.png" 
                      alt="ReFi.Trading Logo" 
                      className="h-8 w-8 mr-3"
                    />
                    <span className="text-2xl font-bold text-white">ReFi.Trading</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Wall Street AI in three clicks. Democratizing algorithmic trading with provable agent technology.
                  </p>
                  <div className="flex space-x-4">
                    <Twitter className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                    <Linkedin className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                    <Github className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                    <Mail className="w-6 h-6 text-gray-400 hover:text-neon-green cursor-pointer transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Products</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-neon-green transition-colors">ROI Simulator</a></li>
                    <li><a href="#" className="hover:text-neon-green transition-colors">Agent Marketplace</a></li>
                    <li><a href="#" className="hover:text-neon-green transition-colors">Live Trading Feed</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Documentation</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-neon-green transition-colors">Quick Start Guide</a></li>
                    <li><a href="#" className="hover:text-neon-green transition-colors">API Reference</a></li>
                    <li><a href="#" className="hover:text-neon-green transition-colors">SDK Examples</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-card-stroke mt-8 pt-8 text-center text-gray-400">
                <p>© 2025 ReFi.Trading Inc. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        // Dashboard when wallet is connected
        <div className="flex h-screen">
          <Sidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={!isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <div className="flex-1 flex flex-col overflow-hidden bg-midnight-canvas">
            <Header 
              isConnected={isWalletConnected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              currentAgent={currentAgent}
              onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              {agents.length > 0 && (
                <AgentSelector 
                  agents={agents}
                  activeAgent={activeAgent}
                  onAgentChange={setActiveAgent}
                  onCreateNew={() => setShowConnectWizard(true)}
                />
              )}
              <main className="flex-1 overflow-auto p-6">
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
                      <Zap className="h-8 w-8 text-black" />
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
                renderMainContent()
              )}
              </main>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;