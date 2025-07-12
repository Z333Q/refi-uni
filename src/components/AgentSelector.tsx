import React from 'react';
import { Plus, Bot, TrendingUp, TrendingDown, Pause, Play } from 'lucide-react';
import type { TradingAgent } from '../App';

interface AgentSelectorProps {
  agents: TradingAgent[];
  activeAgent: string | null;
  onAgentChange: (agentId: string) => void;
  onCreateNew: () => void;
}

export function AgentSelector({ agents, activeAgent, onAgentChange, onCreateNew }: AgentSelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#43D4A0] bg-green-900/20';
      case 'paused': return 'text-yellow-400 bg-yellow-900/20';
      case 'deploying': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      case 'deploying': return <Bot className="h-3 w-3 animate-pulse" />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#151B23] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-gray-400">Trading Agents</h3>
          <div className="flex items-center space-x-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => onAgentChange(agent.id)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg border transition-colors ${
                  activeAgent === agent.id
                    ? 'border-[#43D4A0] bg-[#43D4A0]/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <Bot className="h-4 w-4 text-[#43D4A0]" />
                <div className="text-left">
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.strategy}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span>{agent.status}</span>
                  </span>
                  
                  {agent.status === 'active' && (
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        ${agent.totalValue.toLocaleString()}
                      </div>
                      <div className={`text-xs flex items-center ${
                        agent.pnl >= 0 ? 'text-[#43D4A0]' : 'text-red-400'
                      }`}>
                        {agent.pnl >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {agent.pnl >= 0 ? '+' : ''}${agent.pnl.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 bg-[#43D4A0] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC492] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Deploy New Agent</span>
        </button>
      </div>
      
      {agents.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-gray-400">Total Agents</div>
            <div className="text-lg font-bold">{agents.length}</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-gray-400">Active</div>
            <div className="text-lg font-bold text-[#43D4A0]">
              {agents.filter(a => a.status === 'active').length}
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-gray-400">Total Value</div>
            <div className="text-lg font-bold">
              ${agents.reduce((sum, agent) => sum + agent.totalValue, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-gray-400">Combined P&L</div>
            <div className={`text-lg font-bold ${
              agents.reduce((sum, agent) => sum + agent.pnl, 0) >= 0 ? 'text-[#43D4A0]' : 'text-red-400'
            }`}>
              ${agents.reduce((sum, agent) => sum + agent.pnl, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}