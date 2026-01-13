'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@saint-giong/bamboo-ui';
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
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="flex-shrink-0 border-b p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>{title}</SheetTitle>
              {description && (
                <SheetDescription className="mt-1">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <JsonViewer data={entity} maxHeight="none" />
        </div>

        {actions && (
          <div className="flex flex-shrink-0 justify-end gap-2 border-t p-6 pt-4">
            {actions}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
