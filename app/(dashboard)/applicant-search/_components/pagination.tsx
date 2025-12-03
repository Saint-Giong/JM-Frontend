'use client';

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@saint-giong/bamboo-ui';
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [pagePopoverOpen, setPagePopoverOpen] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  const [pageInputError, setPageInputError] = useState(false);

  if (totalPages <= 1) return null;

  const handleGoToPage = () => {
    const page = parseInt(pageInputValue, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPagePopoverOpen(false);
      setPageInputError(false);
    } else {
      setPageInputError(true);
      setTimeout(() => {
        setPageInputError(false);
        setPageInputValue(String(currentPage));
      }, 500);
    }
  };

  // Generate page numbers with ellipsis
  const pages: (number | 'ellipsis')[] = [];
  pages.push(1);

  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  if (rangeStart > 2) {
    pages.push('ellipsis');
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) {
    pages.push('ellipsis');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 border-t p-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Previous</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(page)}
              className="h-9 w-9"
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next</span>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Next</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>

      {/* Page popover */}
      <Popover
        open={pagePopoverOpen}
        onOpenChange={(open) => {
          setPagePopoverOpen(open);
          if (!open) setPageInputError(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-2 tabular-nums"
            onClick={() => {
              setPageInputValue(String(currentPage));
              setPageInputError(false);
            }}
          >
            {currentPage} / {totalPages}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="center">
          <div className="space-y-2">
            <p className="font-medium text-sm">Go to page</p>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={pageInputValue}
                onChange={(e) => {
                  setPageInputValue(e.target.value);
                  setPageInputError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGoToPage();
                  }
                }}
                className={`h-8 transition-all ${
                  pageInputError
                    ? 'animate-[shake_0.5s_ease-in-out] border-red-500 text-red-500 focus-visible:ring-red-500'
                    : ''
                }`}
                autoFocus
              />
              <Button size="sm" className="h-8" onClick={handleGoToPage}>
                Go
              </Button>
            </div>
            {pageInputError && (
              <p className="text-red-500 text-xs">Enter 1-{totalPages}</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
