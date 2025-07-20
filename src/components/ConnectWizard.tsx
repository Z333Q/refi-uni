import React, { useState, useEffect } from 'react';
import { ChevronRight, Wallet, Zap, Shield, CheckCircle } from 'lucide-react';

interface ConnectWizardProps {
  onComplete: (agentData: { name: string; strategy: string }) => void;
  onClose: () => void;
  isAdditionalAgent?: boolean;
}

export function ConnectWizard({ onComplete, onClose, isAdditionalAgent = false }: ConnectWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('');
  const [gasEstimate] = useState('$2.34');
  const [connectionError, setConnectionError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
  ];

  const templates = [
    { 
      id: 'defi-blue', 
      name: 'Tech Blue Chip', 
      description: 'AAPL, MSFT, GOOGL, TSLA (Conservative)',
      allocation: 'Equal weight, monthly rebalance',
      risk: 'Low'
    },
    { 
      id: 'growth', 
      name: 'High Growth', 
      description: 'NVDA, AMD, NFLX, AMZN (Aggressive)',
      allocation: 'Vol-weighted, weekly rebalance',
      risk: 'High'
    },
    { 
      id: 'stable', 
      name: 'Dividend Focus', 
      description: 'JNJ, PG, KO, PFE (Stable)',
      allocation: 'Dividend-optimized, quarterly rebalance',
      risk: 'Very Low'
    },
  ];

  const connectToMetaMask = async () => {
    setConnectionError('');
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and try again.');
      }

      // Get the connected account
      const address = accounts[0];
      
      // Move to next step after successful connection
      setTimeout(() => {
        setStep(2);
      }, 500);
      
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      setConnectionError(error.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedWallet === 'metamask' && !isAdditionalAgent) {
      connectToMetaMask();
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
      onComplete({
        name: agentName || selectedTemplateData?.name || 'Trading Agent',
        strategy: selectedTemplateData?.name || 'Custom Strategy'
      });
    }
  };

  // If this is an additional agent (wallet already connected), start at step 2
  useEffect(() => {
    if (isAdditionalAgent && step === 1) {
      setSelectedWallet('metamask'); // Auto-select the connected wallet
      setStep(2); // Skip to strategy selection
    }
  }, [isAdditionalAgent, step]);

  const canProceed = () => {
    if (step === 1) return selectedWallet && !isConnecting;
    if (step === 2) return selectedTemplate;
    if (step === 3) return agentName.trim().length > 0;
    if (step === 4) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-white flex items-center justify-center p-6">
      <div className="bg-[#151B23] rounded-2xl p-8 w-full max-w-2xl border border-gray-800">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {isAdditionalAgent ? 'Deploy Additional Agent' : 'Deploy Your Trading Agent'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
          </div>
          
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-[#43D4A0] text-black' : 'bg-gray-700 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle className="h-5 w-5" /> : i}
                </div>
                {i < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i < step ? 'bg-[#43D4A0]' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Step {step} of 4: {
              step === 1 ? (isAdditionalAgent ? 'Verify Wallet' : 'Connect Wallet') : 
              step === 2 ? 'Choose Strategy' : 
              step === 3 ? 'Configure Agent' :
              'Confirm Deployment'
            }
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isAdditionalAgent ? 'Wallet Connected' : 'Select Your Wallet'}
            </h3>
            {isAdditionalAgent && (
              <div className="mb-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-green-300 font-medium">Wallet Already Connected</p>
                    <p className="text-green-200 text-sm">
                      Deploying additional agent to the same wallet: 0x8f2...a9c4
                    </p>
                  </div>
                </div>
              </div>
            )}
            {connectionError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{connectionError}</p>
              </div>
            )}
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => {
                    setSelectedWallet(wallet.id);
                  }}
                  disabled={isAdditionalAgent}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                    isAdditionalAgent ? 'opacity-50 cursor-not-allowed border-gray-700' :
                    selectedWallet === wallet.id
                      ? 'border-[#43D4A0] bg-[#43D4A0]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="font-medium">
                    {wallet.name}
                  </span>
                  {isAdditionalAgent && wallet.id === 'metamask' && (
                    <CheckCircle className="h-5 w-5 text-[#43D4A0] ml-auto" />
                  )}
                  <div className="flex-1" />
                  <Wallet className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Strategy Template</h3>
            <div className="space-y-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-[#43D4A0] bg-[#43D4A0]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{template.allocation}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      template.risk === 'Low' ? 'bg-green-900 text-green-300' :
                      template.risk === 'High' ? 'bg-red-900 text-red-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {template.risk} Risk
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Configure Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-[#43D4A0] focus:outline-none"
                  placeholder="e.g., DeFi Alpha Agent, Conservative Portfolio Bot"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Choose a descriptive name to identify this agent in your dashboard
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">Selected Strategy</h4>
                <div className="text-sm text-gray-400">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {templates.find(t => t.id === selectedTemplate)?.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Confirm Deployment</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Wallet:</span>
                <span>{wallets.find(w => w.id === selectedWallet)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Strategy:</span>
                <span>{templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas Fee:</span>
                <span className="text-[#43D4A0]">{gasEstimate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Proof Generation:</span>
                <span className="text-[#43D4A0]">~30ms</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium">Zero-Knowledge Risk Proof</p>
                  <p className="text-blue-200 mt-1">
                    Your trading agent will generate cryptographic proofs for every trade, 
                    ensuring compliance and risk management without revealing sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed()
                ? 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>
              {isConnecting && step === 1 ? 'Connecting...' : 
               step === 4 ? 'Deploy Agent' : 'Continue'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}