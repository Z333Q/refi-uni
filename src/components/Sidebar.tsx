import React from 'react';
import { 
  TrendingUp, 
  PieChart, 
  Activity, 
  Shield, 
  Wallet, 
  Key, 
  Bell, 
  FileCheck, 
  UserCheck,
  Zap,
  AlertTriangle,
  Coins
} from 'lucide-react';
import type { TabType } from '../App';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const menuItems = [
  { id: 'portfolio' as TabType, label: 'Portfolio', icon: TrendingUp },
  { id: 'basket' as TabType, label: 'Baskets', icon: PieChart },
  { id: 'trades' as TabType, label: 'Trade Stream', icon: Activity },
  { id: 'proofs' as TabType, label: 'Proof Explorer', icon: Shield },
  { id: 'risk' as TabType, label: 'Risk Monitor', icon: AlertTriangle },
  { id: 'tokenomics' as TabType, label: 'Tokenomics', icon: Coins },
  { id: 'wallet' as TabType, label: 'Wallet & Staking', icon: Wallet },
  { id: 'api' as TabType, label: 'API Keys', icon: Key },
  { id: 'alerts' as TabType, label: 'Alerts', icon: Bell },
  { id: 'compliance' as TabType, label: 'Compliance', icon: FileCheck },
  { id: 'guardian' as TabType, label: 'Guardian', icon: UserCheck },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-[#151B23] border-r border-gray-800 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="relative">
            <Zap className="h-8 w-8 text-[#43D4A0]" fill="currentColor" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#43D4A0] rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="text-xl font-bold">ReFi.Trading</div>
            <div className="text-xs text-gray-400 font-medium">ReFinity Protocol</div>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-[#43D4A0] text-black font-semibold' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}