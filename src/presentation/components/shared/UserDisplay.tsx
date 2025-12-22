import { X } from 'lucide-react';
import { useUserStore } from '@application';

interface UserDisplayProps {
  onClear: () => void;
  size?: 'sm' | 'md';
}

export const UserDisplay = ({ onClear, size = 'md' }: UserDisplayProps) => {
  const name = useUserStore((state) => state.name);
  const avatar = useUserStore((state) => state.avatar);

  if (!name || !avatar) {
    return null;
  }

  const containerStyles = size === 'sm' 
    ? 'bg-surface-muted rounded-lg p-3 border border-surface-muted'
    : 'bg-surface-muted rounded-lg p-4 border border-surface-muted';
  
  const labelStyles = size === 'sm'
    ? 'text-xs font-medium text-gray-dark'
    : 'text-sm font-medium text-gray-dark';
  
  const avatarSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const gapStyles = size === 'sm' ? 'gap-2' : 'gap-3';
  const iconSize = size === 'sm' ? 14 : 16;
  const marginBottom = size === 'sm' ? 'mb-2' : 'mb-3';
  const textStyles = size === 'sm' 
    ? 'text-sm font-medium text-gray-dark'
    : 'font-medium text-gray-dark';

  return (
    <div className={containerStyles}>
      <div className={`flex items-center justify-between ${marginBottom}`}>
        <span className={labelStyles}>User</span>
        <button
          type="button"
          onClick={onClear}
          className="text-gray hover:text-gray-dark transition-colors"
          aria-label="Clear user"
        >
          <X size={iconSize} />
        </button>
      </div>
      <div className={`flex items-center ${gapStyles}`}>
        <img
          src={avatar}
          alt={name}
          className={`${avatarSize} rounded-full object-cover`}
        />
        <span className={textStyles}>{name}</span>
      </div>
    </div>
  );
};

