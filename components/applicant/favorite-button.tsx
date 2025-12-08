'use client';

import { Button } from '@saint-giong/bamboo-ui';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  size?: 'sm' | 'default' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  isFavorite,
  onClick,
  size = 'sm',
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  return (
    <Button size={size} variant="ghost" onClick={onClick} className={className}>
      <Heart
        className={`h-4 w-4 ${showLabel ? 'mr-1' : ''} ${
          isFavorite ? 'fill-current text-red-500' : ''
        }`}
      />
      {showLabel && (isFavorite ? 'Remove favorite' : 'Mark as favorite')}
    </Button>
  );
}
