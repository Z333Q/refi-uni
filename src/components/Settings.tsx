import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  User, 
  Shield, 
  Bell, 
  Download, 
  CreditCard,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  brokerId: string;
  brokerName: string;
  keyType: 'live' | 'sandbox';
  created: string;
  lastUsed: string;
  status: 'active' | 'expired' | 'revoked';
  permissions: string[];
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

export function Settings() {
  const [activeSection, setActiveSection] = useState('api-keys');
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

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

  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Trading',
      brokerId: 'alpaca',
      brokerName: 'Alpaca Markets',
      keyType: 'live',
      created: '2024-01-15',
      lastUsed: '2 minutes ago',
      status: 'active',
      permissions: ['read', 'trade']
    },
    {
      id: '2',
      name: 'Development Testing',
      brokerId: 'tradier',
      brokerName: 'Tradier',
      keyType: 'sandbox',
      created: '2024-01-10',
      lastUsed: '1 hour ago',
      status: 'active',
      permissions: ['read']
    }
  ]);

  const [newKeyData, setNewKeyData] = useState<Record<string, string>>({});

  const settingsSections = [
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data & Export', icon: Download }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testConnection = async (brokerId: string) => {
    setTestingConnection(brokerId);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(null);
  };

  const handleAddKey = () => {
    if (!selectedBroker) return;
    
    const broker = brokerConfigs.find(b => b.id === selectedBroker);
    if (!broker) return;

    // Validate required fields
    const missingFields = broker.keyFields
      .filter(field => field.required && !newKeyData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Here you would normally save the API key securely
    console.log('Adding API key for broker:', selectedBroker, newKeyData);
    
    setShowAddKeyModal(false);
    setSelectedBroker(null);
    setNewKeyData({});
  };

  const renderApiKeysSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-gray-400 text-sm">Manage broker connections and API access</p>
        </div>
        <button
          onClick={() => setShowAddKeyModal(true)}
          className="flex items-center space-x-2 bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add API Key</span>
        </button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {brokerConfigs.find(b => b.id === apiKey.brokerId)?.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{apiKey.name}</h4>
                  <p className="text-sm text-gray-400">{apiKey.brokerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  apiKey.status === 'active' ? 'bg-green-900 text-green-300' :
                  apiKey.status === 'expired' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {apiKey.status}
                </span>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Environment</label>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  apiKey.keyType === 'live' ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'
                }`}>
                  {apiKey.keyType === 'live' ? 'Production' : 'Sandbox'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Permissions</label>
                <div className="flex flex-wrap gap-1">
                  {apiKey.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-[#43D4A0] text-black text-xs font-medium rounded"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Created: {apiKey.created} • Last used: {apiKey.lastUsed}
              </div>
              <button
                onClick={() => testConnection(apiKey.brokerId)}
                disabled={testingConnection === apiKey.brokerId}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  testingConnection === apiKey.brokerId
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {testingConnection === apiKey.brokerId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Secure Storage</p>
            <p className="text-blue-200 mt-1">
              API keys are encrypted using AES-256 and stored securely. Keys are only decrypted 
              when needed for trading operations and are never logged or transmitted in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <p className="text-gray-400 text-sm">Manage your profile and account preferences</p>
      </div>

      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
        <h4 className="font-semibold mb-4">Profile Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Time Zone</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+0 (GMT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Security Settings</h3>
        <p className="text-gray-400 text-sm">Manage your account security and authentication</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold mb-4">Two-Factor Authentication</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Add an extra layer of security to your account</p>
              <p className="text-xs text-gray-400 mt-1">Status: Not enabled</p>
            </div>
            <button className="bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold mb-4">Password</h4>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
            />
            <button className="bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-400">Manage your account, security, and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[#151B23] border border-gray-800 rounded-xl p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#43D4A0] text-black font-semibold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
            {activeSection === 'api-keys' && renderApiKeysSection()}
            {activeSection === 'account' && renderAccountSection()}
            {activeSection === 'security' && renderSecuritySection()}
            {activeSection === 'notifications' && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Notification settings coming soon</p>
              </div>
            )}
            {activeSection === 'billing' && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Billing settings coming soon</p>
              </div>
            )}
            {activeSection === 'data' && (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Data export options coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add API Key Modal */}
      {showAddKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add API Key</h3>
            
            {!selectedBroker ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">Select your broker to get started:</p>
                <div className="grid grid-cols-1 gap-3">
                  {brokerConfigs.map((broker) => (
                    <button
                      key={broker.id}
                      onClick={() => setSelectedBroker(broker.id)}
                      className="flex items-center space-x-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 rounded-lg transition-colors text-left"
                    >
                      <span className="text-2xl">{broker.icon}</span>
                      <div>
                        <h4 className="font-medium">{broker.name}</h4>
                        <p className="text-sm text-gray-400">{broker.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const broker = brokerConfigs.find(b => b.id === selectedBroker);
                  if (!broker) return null;

                  return (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">{broker.icon}</span>
                        <div>
                          <h4 className="font-medium">{broker.name}</h4>
                          <p className="text-sm text-gray-400">{broker.description}</p>
                        </div>
                      </div>

                      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-blue-300 font-medium">Where to find your API keys:</p>
                            <p className="text-blue-200 mt-1">
                              Log into your {broker.name} account and navigate to the API section. 
                              Create new API keys with trading permissions enabled.
                            </p>
                            <a
                              href={broker.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-300 hover:text-blue-200 mt-2"
                            >
                              <span>View documentation</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Configuration Name
                          </label>
                          <input
                            type="text"
                            value={newKeyData.name || ''}
                            onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
                            placeholder="e.g., Production Trading, Test Account"
                          />
                        </div>

                        {broker.keyFields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              {field.label} {field.required && <span className="text-red-400">*</span>}
                            </label>
                            <input
                              type={field.type}
                              value={newKeyData[field.name] || ''}
                              onChange={(e) => setNewKeyData(prev => ({ ...prev, [field.name]: e.target.value }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
                              placeholder={field.placeholder}
                              required={field.required}
                            />
                          </div>
                        ))}

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Environment
                          </label>
                          <select
                            value={newKeyData.environment || 'sandbox'}
                            onChange={(e) => setNewKeyData(prev => ({ ...prev, environment: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
                          >
                            <option value="sandbox">Sandbox (Testing)</option>
                            <option value="live">Live (Production)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddKeyModal(false);
                  setSelectedBroker(null);
                  setNewKeyData({});
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              {selectedBroker && (
                <button
                  onClick={() => setSelectedBroker(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
              )}
              {selectedBroker && (
                <button
                  onClick={handleAddKey}
                  className="px-4 py-2 bg-[#43D4A0] text-black hover:bg-[#3BC492] rounded-lg font-medium transition-colors"
                >
                  Add API Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}