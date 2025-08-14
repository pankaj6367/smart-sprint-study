import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, BarChart3, Calendar, Lightbulb } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'stats', label: 'Progress', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'tips', label: 'Focus Tips', icon: Lightbulb },
  ];

  return (
    <nav className="glass-card p-2 rounded-full w-fit mx-auto">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                ${isActive ? 'glow-button' : 'hover:bg-muted/50'}
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;