import React from 'react';
import { cn } from '@/lib/utils';

type RiskLevel = 'bajo' | 'medio' | 'alto';
type BadgeSize = 'sm' | 'md' | 'lg';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: BadgeSize;
  showText?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level = 'bajo',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const riskConfig = {
    bajo: {
      emoji: '✅',
      label: 'Bajo',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
    },
    medio: {
      emoji: '⚠️',
      label: 'Medio',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
    },
    alto: {
      emoji: '🚨',
      label: 'Alto',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
    },
  };

  const config = riskConfig[level];

  return (
    <div className={cn(
      'inline-flex items-center justify-center rounded-full border-2',
      config.bgColor,
      config.borderColor,
      sizeClasses[size],
      className
    )}>
      <span className={cn('leading-none', textSizeClasses[size])}>
        {config.emoji}
      </span>
      {showText && (
        <span className={cn('ml-2 font-medium', config.textColor, textSizeClasses[size])}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default RiskBadge;
