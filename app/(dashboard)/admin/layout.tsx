'use client';

import { Badge } from '@saint-giong/bamboo-ui';
import { Terminal } from 'lucide-react';
import type { ReactNode } from 'react';
import { AdminNav } from './_components';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center gap-3 border-b bg-background px-4 py-3">
        <Terminal className="h-5 w-5 text-amber-500" />
        <h1 className="font-semibold text-lg">Dev Tools</h1>
        <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
          Internal
        </Badge>
      </header>

      {/* Navigation */}
      <AdminNav />

      {/* Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
