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
  AlertTriangle,
  Coins
} from 'lucide-react';
import type { TabType } from '../App';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOpen?: boolean;
  onClose?: () => void;
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

export function Sidebar({ activeTab, onTabChange, isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#151B23] border-r border-gray-800 min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <img 
            src="/green-logo-only-squareArtboard 1@0.25x.png" 
            alt="ReFi.Trading Logo" 
            className="h-9 w-9 self-center"
          />
          <div className="text-xl font-bold">ReFi.Trading</div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose?.();
                }}
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
    </>
  );
}