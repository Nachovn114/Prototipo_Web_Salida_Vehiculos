
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon: Icon, 
  label,
  className = ''
}) => (
  <button
    onClick={onClick}
    className={`fab group ${className}`}
    aria-label={label}
  >
    <Icon size={24} className="transition-transform duration-200 group-hover:scale-110" />
  </button>
);
