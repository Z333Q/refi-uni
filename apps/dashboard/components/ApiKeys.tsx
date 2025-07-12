import React, { useState } from 'react';
import { Key, Copy, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  created: string;
  lastUsed: string;
  requests: number;
  rateLimit: number;
}

export function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production App',
      key: 'refi_live_4f8e9d2a1b3c5e7f9a2d4c6e8f1a3b5c',
      scopes: ['read', 'trade', 'baskets'],
      created: '2024-01-15',
      lastUsed: '2 minutes ago',
      requests: 12847,
      rateLimit: 1000
    },
    {
      id: '2',
      name: 'Development',
      key: 'refi_test_1a2b3c4d5e6f7a8b9c1d2e3f4a5b6c7d',
      scopes: ['read', 'trade'],
      created: '2024-01-10',
      lastUsed: '1 hour ago',
      requests: 3421,
      rateLimit: 100
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    scopes: [] as string[]
  });

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

  const deleteKey = (keyId: string) => {
    setApiKeys(keys => keys.filter(k => k.id !== keyId));
  };

  const createKey = () => {
    if (!newKeyData.name || newKeyData.scopes.length === 0) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyData.name,
      key: `refi_${newKeyData.scopes.includes('trade') ? 'live' : 'test'}_${Math.random().toString(16).substring(2)}`,
      scopes: newKeyData.scopes,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requests: 0,
      rateLimit: newKeyData.scopes.includes('trade') ? 1000 : 100
    };

    setApiKeys(keys => [...keys, newKey]);
    setNewKeyData({ name: '', scopes: [] });
    setShowCreateModal(false);
  };

  const toggleScope = (scope: string) => {
    setNewKeyData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }));
  };

  const availableScopes = [
    { id: 'read', name: 'Read Portfolio', desc: 'View portfolio and basket data' },
    { id: 'trade', name: 'Execute Trades', desc: 'Submit trade orders and rebalance baskets' },
    { id: 'baskets', name: 'Manage Baskets', desc: 'Create and modify basket configurations' },
    { id: 'proofs', name: 'Access Proofs', desc: 'View and verify zero-knowledge proofs' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">API Keys</h2>
          <p className="text-gray-400">Manage API access for your applications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Key</span>
        </button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span>Created: {apiKey.created}</span>
                  <span>Last used: {apiKey.lastUsed}</span>
                </div>
              </div>
              <button
                onClick={() => deleteKey(apiKey.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
                  <code className="flex-1 text-sm font-mono">
                    {visibleKeys.has(apiKey.id) 
                      ? apiKey.key 
                      : apiKey.key.substring(0, 12) + '••••••••••••••••••••••••'
                    }
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="text-gray-400 hover:text-[#43D4A0] transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {apiKey.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="px-2 py-1 bg-[#43D4A0] text-black text-xs font-medium rounded"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Requests Today</div>
                <div className="text-lg font-bold">{apiKey.requests.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Rate Limit</div>
                <div className="text-lg font-bold">{apiKey.rateLimit}/min</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Usage</div>
                <div className="text-lg font-bold text-[#43D4A0]">
                  {((apiKey.requests / apiKey.rateLimit) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-lg font-bold text-[#43D4A0]">Active</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:border-[#43D4A0] focus:outline-none"
                  placeholder="My Application"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {availableScopes.map((scope) => (
                    <label key={scope.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newKeyData.scopes.includes(scope.id)}
                        onChange={() => toggleScope(scope.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{scope.name}</div>
                        <div className="text-sm text-gray-400">{scope.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createKey}
                disabled={!newKeyData.name || newKeyData.scopes.length === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !newKeyData.name || newKeyData.scopes.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
                }`}
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
        <div className="space-y-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">REST API</h4>
            <code className="text-sm text-gray-300">
              curl -H "Authorization: Bearer YOUR_API_KEY" https://api.refinity.io/v1/portfolio
            </code>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">WebSocket</h4>
            <code className="text-sm text-gray-300">
              wss://ws.refinity.io/v1/stream?token=YOUR_API_KEY
            </code>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Key className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-300 font-medium">Integration Example</p>
                <p className="text-blue-200 mt-1">
                  Check our documentation for SDKs in JavaScript, Python, and Go. 
                  Most integrations require ≤ 10 lines of code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}