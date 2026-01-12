'use client';

import type { PaymentDetails } from '@/lib/api/payment';
import { paymentApi } from '@/lib/api/payment';
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
  SUCCESSFUL: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  FAILED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  CANCELLED: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

const methodColors: Record<string, string> = {
  VISA: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  CREDIT_CARD: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  E_WALLET: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
};

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null
  );

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await paymentApi.list();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Filter payments by search query
  const filteredPayments = useMemo(() => {
    if (!searchQuery) return payments;
    const query = searchQuery.toLowerCase();
    return payments.filter(
      (payment) =>
        payment.id?.toLowerCase().includes(query) ||
        payment.companyId?.toLowerCase().includes(query) ||
        payment.status?.toLowerCase().includes(query) ||
        payment.method?.toLowerCase().includes(query)
    );
  }, [payments, searchQuery]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const columns: ColumnDef<PaymentDetails>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '180px',
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
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value, row) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(Number(value) || 0, row.currency)}
        </span>
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
      key: 'method',
      header: 'Method',
      render: (value) =>
        value ? (
          <Badge
            variant="outline"
            className={methodColors[String(value)] || ''}
          >
            {String(value).replace('_', ' ')}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: 'purchasedAt',
      header: 'Date',
      sortable: true,
      render: (value) =>
        value ? (
          new Date(String(value)).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Payments"
        description="All payment transactions"
        searchPlaceholder="Search by ID, company, status, or method..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchPayments}
        isLoading={isLoading}
        totalCount={filteredPayments.length}
      />

      <div className="flex-1 overflow-auto p-4">
        <DataTable
          columns={columns}
          data={filteredPayments}
          isLoading={isLoading}
          onRowClick={setSelectedPayment}
          rowKey="id"
          emptyMessage="No payments found"
        />
      </div>

      <EntityDetailSheet
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Details"
        description={selectedPayment?.id}
        entity={selectedPayment}
      />
    </div>
  );
}
