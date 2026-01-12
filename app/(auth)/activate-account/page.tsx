import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ActivateAccountContent } from './_components/ActivateAccountContent';

export const metadata: Metadata = {
  title: 'Activate Account',
};

export default function ActivateAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ActivateAccountContent />
    </Suspense>
  );
}
