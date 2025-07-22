import React, { useState, useEffect } from 'react';
import { ChevronRight, Wallet, Zap, Shield, CheckCircle, Eye, EyeOff, AlertTriangle, ExternalLink } from 'lucide-react';

interface ConnectWizardProps {
  onComplete: (agentData: { name: string; strategy: string; brokerId: string; apiKeys: Record<string, string> }) => void;
  onClose: () => void;
  isAdditionalAgent?: boolean;
}

interface BrokerConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  keyFields: {
    name: string;
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    required: boolean;
  }[];
  docsUrl: string;
}

export function ConnectWizard({ onComplete, onClose, isAdditionalAgent = false }: ConnectWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [apiKeyErrors, setApiKeyErrors] = useState<Record<string, string>>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [gasEstimate] = useState('$2.34');
  const [connectionError, setConnectionError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const brokerConfigs: BrokerConfig[] = [
    {
      id: 'alpaca',
      name: 'Alpaca Markets',
      icon: '🦙',
      description: 'Commission-free stock trading',
      keyFields: [
        { name: 'apiKey', label: 'API Key ID', type: 'text', placeholder: 'PKTEST...', required: true },
        { name: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'Your secret key', required: true }
      ],
      docsUrl: 'https://alpaca.markets/docs/api-documentation/api-v2/'
    },
    {
      id: 'tradier',
      name: 'Tradier',
      icon: '📈',
      description: 'Professional trading platform',
      keyFields: [
        { name: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Your access token', required: true }
      ],
      docsUrl: 'https://documentation.tradier.com/brokerage-api/getting-started'
    },
    {
      id: 'ibkr',
      name: 'Interactive Brokers',
      icon: '🏦',
      description: 'Global markets access',
      keyFields: [
        { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Your client ID', required: true },
        { name: 'username', label: 'Username', type: 'text', placeholder: 'Your IBKR username', required: true },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Your IBKR password', required: true }
      ],
      docsUrl: 'https://interactivebrokers.github.io/tws-api/'
    }
  ];

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
  ];

  const brokers = [
    { id: 'alpaca', name: 'Alpaca Markets', icon: '🦙', description: 'Commission-free trading' },
    { id: 'tradier', name: 'Tradier', icon: '📈', description: 'Professional trading platform' },
    { id: 'ibkr', name: 'Interactive Brokers', icon: '🏦', description: 'Global markets access' },
    { id: 'robinhood', name: 'Robinhood', icon: '🏹', description: 'Simple mobile trading' },
  ];

  const brokerApiFields: Record<string, { label: string; placeholder: string; type: 'text' | 'password' }[]> = {
    alpaca: [
      { label: 'API Key ID', placeholder: 'PKTEST...', type: 'text' },
      { label: 'Secret Key', placeholder: 'Your secret key', type: 'password' }
    ],
    tradier: [
      { label: 'Access Token', placeholder: 'Your access token', type: 'password' }
    ],
    ibkr: [
      { label: 'Client ID', placeholder: 'Your client ID', type: 'text' },
      { label: 'Username', placeholder: 'Your IBKR username', type: 'text' },
      { label: 'Password', placeholder: 'Your IBKR password', type: 'password' }
    ],
    robinhood: [
      { label: 'Username', placeholder: 'Your Robinhood username', type: 'text' },
      { label: 'Password', placeholder: 'Your Robinhood password', type: 'password' }
    ]
  };

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

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

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
      // Provide more informative error messages for common MetaMask issues
      if (error.message === 'Failed to connect to MetaMask' || error.message.includes('Failed to connect')) {
        setConnectionError('Unable to connect to MetaMask. Please ensure MetaMask is installed, unlocked, and try refreshing the page.');
      } else {
        setConnectionError(error.message || 'Failed to connect to MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  const testApiConnection = async () => {
    if (!selectedBroker) return;
    
    setTestingConnection(true);
    setApiKeyErrors({});
    
    try {
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate validation results
      const fields = brokerApiFields[selectedBroker] || [];
      const missingFields = fields.filter(field => !apiKeys[field.label]);
      
      if (missingFields.length > 0) {
        const errors: Record<string, string> = {};
        missingFields.forEach(field => {
          errors[field.label] = 'This field is required';
        });
        setApiKeyErrors(errors);
        throw new Error('Missing required fields');
      }
      
      // Success - move to next step
      setStep(step + 1);
    } catch (error) {
      console.error('API connection test failed:', error);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedWallet === 'metamask' && !isAdditionalAgent) {
      connectToMetaMask();
    } else if (step === 2 && selectedBroker) {
      // Move to API key input step
      setStep(3);
    } else if (step === 3 && selectedBroker) {
      // Test API connection
      testApiConnection();
    } else if (step === 3 && !selectedBroker) {
      // Skip API setup, go to strategy selection
      setStep(4);
    } else if (step < 6) {
      setStep(step + 1);
    } else {
      const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
      onComplete({
        name: agentName || selectedTemplateData?.name || 'Trading Agent',
        strategy: selectedTemplateData?.name || 'Custom Strategy',
        brokerId: selectedBroker || '',
        apiKeys: apiKeys
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
    if (step === 2) return selectedBroker;
    if (step === 3) return !testingConnection; // Allow proceeding even without API keys
    if (step === 4) return selectedTemplate;
    if (step === 5) return agentName.trim().length > 0;
    if (step === 6) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-white flex items-center justify-center p-4 md:p-6">
      <div className="bg-[#151B23] rounded-2xl p-4 md:p-8 w-full max-w-2xl border border-gray-800">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {isAdditionalAgent ? 'Deploy Additional Agent' : 'Deploy Your Trading Agent'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium flex-shrink-0 ${
                  i <= step ? 'bg-[#43D4A0] text-black' : 'bg-gray-700 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle className="h-3 w-3 md:h-5 md:w-5" /> : i}
                </div>
                {i < 6 && (
                  <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 flex-shrink-0 ${
                    i < step ? 'bg-[#43D4A0]' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs md:text-sm text-gray-400">
            Step {step} of 6: {
              step === 1 ? (isAdditionalAgent ? 'Verify Wallet' : 'Connect Wallet') : 
              step === 2 ? 'Select Broker' :
              step === 3 ? 'Connect Broker' :
              step === 4 ? 'Choose Strategy' : 
              step === 5 ? 'Configure Agent' :
              'Confirm Deployment'
            }
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">
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
                <p className="text-red-400 text-xs md:text-sm">{connectionError}</p>
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
                  <span className="text-xl md:text-2xl">{wallet.icon}</span>
                  <span className="font-medium text-sm md:text-base">
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
            <h3 className="text-base md:text-lg font-semibold mb-4">Select Your Broker</h3>
            <div className="space-y-3">
              {brokers.map((broker) => (
                <button
                  key={broker.id}
                  onClick={() => setSelectedBroker(broker.id)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                    selectedBroker === broker.id
                      ? 'border-[#43D4A0] bg-[#43D4A0]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl md:text-2xl">{broker.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm md:text-base">{broker.name}</div>
                    <div className="text-xs md:text-sm text-gray-400">{broker.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Connect Your Broker</h3>
            <p className="text-sm text-gray-400 mb-6">
              Securely connect to {brokers.find(b => b.id === selectedBroker)?.name} to enable automated trading
            </p>
            
            {/* Progress Indicator */}
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="text-blue-300 font-medium">API Configuration</p>
                  <p className="text-blue-200 text-sm">This step takes most users 2-3 minutes</p>
                </div>
              </div>
            </div>

            {/* Broker-specific instructions */}
            {selectedBroker && (
              <div className="mb-6 bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{brokers.find(b => b.id === selectedBroker)?.icon}</span>
                  <h4 className="font-semibold">Setting up {brokers.find(b => b.id === selectedBroker)?.name}</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  {selectedBroker === 'alpaca' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-[#43D4A0] rounded-full flex items-center justify-center text-xs font-bold text-black mt-0.5">1</span>
                        <p>Log into your Alpaca account and go to <strong>Paper Trading → API Keys</strong></p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-[#43D4A0] rounded-full flex items-center justify-center text-xs font-bold text-black mt-0.5">2</span>
                        <p>Click <strong>"Generate New Key"</strong> and enable <strong>Trading permissions</strong></p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-[#43D4A0] rounded-full flex items-center justify-center text-xs font-bold text-black mt-0.5">3</span>
                        <p>Copy both the <strong>Key ID</strong> and <strong>Secret Key</strong> below</p>
                      </div>
                    </>
                  )}
                  
                  {selectedBroker === 'tradier' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-[#43D4A0] rounded-full flex items-center justify-center text-xs font-bold text-black mt-0.5">1</span>
                        <p>Go to <strong>My Account → API Access</strong> in your Tradier dashboard</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-[#43D4A0] rounded-full flex items-center justify-center text-xs font-bold text-black mt-0.5">2</span>
                        <p>Create a new <strong>Sandbox Access Token</strong> for testing</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-[#43D4A0] rounded-full flex items-center justify-center text-xs font-bold text-black mt-0.5">3</span>
                        <p>Copy the generated token and paste it below</p>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <a
                      href={brokerConfigs.find(b => b.id === selectedBroker)?.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-[#43D4A0] hover:text-[#3BC492] text-sm"
                    >
                      <span>📖 Detailed setup guide</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* API Key Form */}
            <div className="space-y-4">
              {selectedBroker && brokerApiFields[selectedBroker]?.map((field, index) => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {field.label}
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={visibleKeys.has(field.label) ? 'text' : field.type}
                      value={apiKeys[field.label] || ''}
                      onChange={(e) => {
                        setApiKeys(prev => ({ ...prev, [field.label]: e.target.value }));
                        // Clear error when user starts typing
                        if (apiKeyErrors[field.label]) {
                          setApiKeyErrors(prev => ({ ...prev, [field.label]: '' }));
                        }
                      }}
                      className={`w-full bg-gray-800 border rounded-lg px-3 py-2 pr-10 focus:outline-none transition-colors ${
                        apiKeyErrors[field.label] 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-[#43D4A0]'
                      }`}
                      placeholder={field.placeholder}
                    />
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility(field.label)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {visibleKeys.has(field.label) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  {apiKeyErrors[field.label] && (
                    <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{apiKeyErrors[field.label]}</span>
                    </p>
                  )}
                </div>
              ))}
              
              {/* Environment Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setApiKeys(prev => ({ ...prev, environment: 'sandbox' }))}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      (apiKeys.environment || 'sandbox') === 'sandbox'
                        ? 'border-[#43D4A0] bg-[#43D4A0]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">Sandbox</div>
                    <div className="text-xs text-gray-400">Safe testing environment</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiKeys(prev => ({ ...prev, environment: 'live' }))}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      apiKeys.environment === 'live'
                        ? 'border-red-500 bg-red-900/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">Live Trading</div>
                    <div className="text-xs text-gray-400">Real money trading</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-green-300 font-medium">🔒 Your API keys are secure</p>
                  <p className="text-green-200 mt-1">
                    Keys are encrypted with AES-256 and stored securely. We never store them in plain text 
                    and they're only used for authorized trading operations.
                  </p>
                </div>
              </div>
            </div>

            {/* Skip Option */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep(4)}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Skip for now - I'll add API keys later in Settings
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Choose Strategy Template</h3>
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
                      <h4 className="font-semibold text-sm md:text-base">{template.name}</h4>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">{template.description}</p>
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

        {step === 5 && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Configure Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">
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
                <h4 className="font-medium mb-2 text-sm md:text-base">Selected Strategy</h4>
                <div className="text-xs md:text-sm text-gray-400">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {templates.find(t => t.id === selectedTemplate)?.description}
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-sm md:text-base">Selected Broker</h4>
                <div className="text-xs md:text-sm text-gray-400">
                  {brokers.find(b => b.id === selectedBroker)?.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {brokers.find(b => b.id === selectedBroker)?.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Confirm Deployment</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Wallet:</span>
                <span>{wallets.find(w => w.id === selectedWallet)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Broker:</span>
                <span>{brokers.find(b => b.id === selectedBroker)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Strategy:</span>
                <span>{templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Setup Fee:</span>
                <span className="text-[#43D4A0]">Free</span>
              </div>
              <div className="flex justify-between text-sm">
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

        <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-3 sm:space-y-0">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 md:px-6 py-2 text-gray-400 hover:text-white transition-colors text-sm md:text-base"
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center justify-center space-x-2 px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
              canProceed()
                ? 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>
              {isConnecting && step === 1 ? 'Connecting...' :
               testingConnection && step === 3 ? 'Testing Connection...' :
               step === 3 ? 'Continue' :
               step === 6 ? 'Deploy Agent' : 'Continue'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}