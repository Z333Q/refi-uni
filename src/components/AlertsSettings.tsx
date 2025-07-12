import React, { useState } from 'react';
import { Bell, Mail, Webhook, TestTube, Save } from 'lucide-react';

export function AlertsSettings() {
  const [varThreshold, setVarThreshold] = useState(0.8);
  const [latencyThreshold, setLatencyThreshold] = useState(3.0);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [email, setEmail] = useState('trader@example.com');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const sendTestAlert = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Alerts & Settings</h2>
        <p className="text-gray-400">Configure risk thresholds and notification preferences</p>
      </div>

      {/* Risk Thresholds */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Thresholds</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              VaR Alert Threshold
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={varThreshold}
                onChange={(e) => setVarThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>0.1%</span>
                <span className={`font-medium ${
                  varThreshold > 1.5 ? 'text-red-400' : 
                  varThreshold > 1.0 ? 'text-yellow-400' : 'text-[#43D4A0]'
                }`}>
                  {varThreshold.toFixed(1)}%
                </span>
                <span>2.0%</span>
              </div>
              <p className="text-xs text-gray-500">
                Alert when Value at Risk exceeds this percentage
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Latency Alert Threshold
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={latencyThreshold}
                onChange={(e) => setLatencyThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>1.0s</span>
                <span className={`font-medium ${
                  latencyThreshold > 5.0 ? 'text-red-400' : 
                  latencyThreshold > 3.0 ? 'text-yellow-400' : 'text-[#43D4A0]'
                }`}>
                  {latencyThreshold.toFixed(1)}s
                </span>
                <span>10.0s</span>
              </div>
              <p className="text-xs text-gray-500">
                Alert when trade execution exceeds this latency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
        
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="rounded"
              />
              <Mail className="h-5 w-5 text-[#43D4A0]" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">Email Alerts</h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!emailEnabled}
                className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 ${
                  emailEnabled 
                    ? 'focus:border-[#43D4A0] focus:outline-none' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                placeholder="your-email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Receive instant alerts via email for critical events
              </p>
            </div>
          </div>

          {/* Webhook Notifications */}
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={webhookEnabled}
                onChange={(e) => setWebhookEnabled(e.target.checked)}
                className="rounded"
              />
              <Webhook className="h-5 w-5 text-[#43D4A0]" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">Webhook Integration</h4>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                disabled={!webhookEnabled}
                className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 ${
                  webhookEnabled 
                    ? 'focus:border-[#43D4A0] focus:outline-none' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                placeholder="https://your-app.com/webhook/alerts"
              />
              <p className="text-xs text-gray-500 mt-1">
                POST alerts to your application endpoint in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Alert Types</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'var_breach', name: 'VaR Threshold Breach', enabled: true, critical: true },
            { id: 'high_latency', name: 'High Trade Latency', enabled: true, critical: false },
            { id: 'failed_proof', name: 'Proof Verification Failed', enabled: true, critical: true },
            { id: 'rebalance_complete', name: 'Basket Rebalance Complete', enabled: false, critical: false },
            { id: 'compliance_fail', name: 'ACE Compliance Failure', enabled: true, critical: true },
            { id: 'gas_spike', name: 'High Gas Prices', enabled: false, critical: false }
          ].map((alertType) => (
            <div key={alertType.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked={alertType.enabled}
                  className="rounded"
                />
                <div>
                  <div className="font-medium">{alertType.name}</div>
                  {alertType.critical && (
                    <span className="text-xs text-red-400">Critical</span>
                  )}
                </div>
              </div>
              <Bell className={`h-4 w-4 ${alertType.enabled ? 'text-[#43D4A0]' : 'text-gray-500'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Test & Save */}
      <div className="flex items-center justify-between">
        <button
          onClick={sendTestAlert}
          disabled={testSent}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            testSent
              ? 'bg-green-900 text-green-300'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          <TestTube className="h-4 w-4" />
          <span>{testSent ? 'Test Alert Sent!' : 'Send Test Alert'}</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            isSaving
              ? 'bg-gray-700 text-gray-400'
              : 'bg-[#43D4A0] text-black hover:bg-[#3BC492]'
          }`}
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Sample Payload */}
      <div className="bg-[#151B23] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Webhook Payload Example</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`{
  "timestamp": "2024-01-20T15:30:45Z",
  "alert_type": "var_breach",
  "severity": "critical",
  "message": "VaR threshold exceeded",
  "data": {
    "current_var": 0.85,
    "threshold": 0.80,
    "basket_id": "defi-blue-chip",
    "portfolio_value": 45230.50
  },
  "action_required": true
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}