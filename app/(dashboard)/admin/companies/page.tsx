'use client';

import { Badge } from '@saint-giong/bamboo-ui';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CompanyProfile } from '@/lib/api/profile';
import { profileApi } from '@/lib/api/profile';
import {
  AdminToolbar,
  type ColumnDef,
  DataTable,
  EntityDetailSheet,
} from '../_components';

export default function CompaniesAdminPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(
    null
  );

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profileApi.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies by search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies;
    const query = searchQuery.toLowerCase();
    return companies.filter(
      (company) =>
        company.name?.toLowerCase().includes(query) ||
        company.city?.toLowerCase().includes(query) ||
        company.country?.toLowerCase().includes(query) ||
        company.id?.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);

  const columns: ColumnDef<CompanyProfile>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '280px',
      render: (value) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {String(value).slice(0, 8)}...
        </code>
      ),
    },
    {
      key: 'name',
      header: 'Company Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.logoUrl && (
            <Image
              src={row.logoUrl}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 rounded object-cover"
            />
          )}
          <span className="font-medium">{String(value || '-')}</span>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      render: (value) =>
        value ? (
          <Badge variant="outline">{String(value)}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: 'phone',
      header: 'Phone',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Companies"
        description="All registered company profiles"
        searchPlaceholder="Search by name, city, country, or ID..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchCompanies}
        isLoading={isLoading}
        totalCount={filteredCompanies.length}
      />

      <div className="flex-1 overflow-auto p-4">
        <DataTable
          columns={columns}
          data={filteredCompanies}
          isLoading={isLoading}
          onRowClick={setSelectedCompany}
          rowKey="id"
          emptyMessage="No companies found"
        />
      </div>

      <EntityDetailSheet
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        title={selectedCompany?.name || 'Company Details'}
        description={selectedCompany?.id}
        entity={selectedCompany}
      />
    </div>
  );
}
