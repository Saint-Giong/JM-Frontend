'use client';

import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@saint-giong/bamboo-ui';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { JsonViewer } from './json-viewer';

interface EntityDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  entity: unknown;
  actions?: ReactNode;
}

export function EntityDetailSheet({
  isOpen,
  onClose,
  title = 'Details',
  description,
  entity,
  actions,
}: EntityDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>{title}</SheetTitle>
              {description && (
                <SheetDescription>{description}</SheetDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            <JsonViewer data={entity} maxHeight="none" />
          </div>
        </ScrollArea>

        {actions && (
          <div className="flex flex-shrink-0 justify-end gap-2 border-t pt-4">
            {actions}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
