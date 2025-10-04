import React from 'react';
import { cn } from '../../lib/utils';

interface CustomAvatarProps {
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  src?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function CustomAvatar({ 
  initials, 
  color = '#3b82f6', 
  size = 'md',
  className,
  src
}: CustomAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-medium text-white shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {src ? (
        <img 
          src={src} 
          alt={initials} 
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
