import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium rounded-md tracking-tight',
    md: 'text-xs px-2.5 py-0.5 font-medium rounded-md tracking-tight',
  };

  const variantStyles = {
    default: 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/60',
    neutral: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
    success: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60',
    warning: 'bg-amber-950/50 text-amber-300 border border-amber-800/60',
    danger: 'bg-rose-950/50 text-rose-300 border border-rose-800/60',
    info: 'bg-sky-950/50 text-sky-300 border border-sky-800/60',
    teal: 'bg-teal-950/50 text-teal-300 border border-teal-800/60',
    purple: 'bg-purple-950/50 text-purple-300 border border-purple-800/60',
  };

  const dotColors = {
    default: 'bg-zinc-400',
    neutral: 'bg-zinc-500',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-sky-400',
    teal: 'bg-teal-400',
    purple: 'bg-purple-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
