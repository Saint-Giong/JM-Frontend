'use client';

import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@saint-giong/bamboo-ui';
import { RefreshCw, Search, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface AdminToolbarProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  totalCount?: number;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function AdminToolbar({
  title,
  description,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onRefresh,
  isLoading,
  totalCount,
  filters,
  actions,
}: AdminToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="space-y-3 border-b bg-background px-4 py-3">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg">{title}</h2>
          {totalCount !== undefined && (
            <Badge variant="secondary" className="tabular-nums">
              {totalCount.toLocaleString()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          )}
        </div>
      </div>

      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}

      {/* Search and filters row */}
      {(onSearchChange || filters) && (
        <div className="flex items-center gap-2">
          {onSearchChange && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 pr-8 pl-8"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
                  onClick={() => onSearchChange('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
          {filters && (
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72">
                {filters}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </div>
  );
}
