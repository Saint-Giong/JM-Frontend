'use client';

import type { Subscription } from '@/lib/api/subscription';
import { subscriptionApi } from '@/lib/api/subscription';
import { Badge } from '@saint-giong/bamboo-ui';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminToolbar,
  type ColumnDef,
  DataTable,
  EntityDetailSheet,
} from '../_components';

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  EXPIRED: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  CANCELLED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

export default function SubscriptionsAdminPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await subscriptionApi.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Filter subscriptions by search query
  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery) return subscriptions;
    const query = searchQuery.toLowerCase();
    return subscriptions.filter(
      (sub) =>
        sub.subscriptionId?.toLowerCase().includes(query) ||
        sub.companyId?.toLowerCase().includes(query) ||
        sub.status?.toLowerCase().includes(query)
    );
  }, [subscriptions, searchQuery]);

  const columns: ColumnDef<Subscription>[] = [
    {
      key: 'subscriptionId',
      header: 'ID',
      width: '200px',
      render: (value) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {String(value).slice(0, 8)}...
        </code>
      ),
    },
    {
      key: 'companyId',
      header: 'Company',
      render: (value) => (
        <Link
          href={`/admin/companies?search=${value}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
          onClick={(e) => e.stopPropagation()}
        >
          <code className="text-xs">{String(value).slice(0, 8)}...</code>
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <Badge className={statusColors[String(value)] || ''}>
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      sortable: true,
      render: (value) =>
        value ? (
          new Date(String(value)).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: 'transactionId',
      header: 'Transaction',
      render: (value) =>
        value ? (
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {String(value).slice(0, 8)}...
          </code>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Subscriptions"
        description="All subscription records across the platform"
        searchPlaceholder="Search by ID, company, or status..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchSubscriptions}
        isLoading={isLoading}
        totalCount={filteredSubscriptions.length}
      />

      <div className="flex-1 overflow-auto p-4">
        <DataTable
          columns={columns}
          data={filteredSubscriptions}
          isLoading={isLoading}
          onRowClick={setSelectedSubscription}
          rowKey="subscriptionId"
          emptyMessage="No subscriptions found"
        />
      </div>

      <EntityDetailSheet
        isOpen={!!selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        title="Subscription Details"
        description={selectedSubscription?.subscriptionId}
        entity={selectedSubscription}
      />
    </div>
  );
}
