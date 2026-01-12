'use client';

import { Badge } from '@saint-giong/bamboo-ui';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { JobPostResponse } from '@/lib/api/jobpost';
import { jobPostApi } from '@/lib/api/jobpost';
import {
  AdminToolbar,
  type ColumnDef,
  DataTable,
  EntityDetailSheet,
} from '../_components';

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPostResponse | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await jobPostApi.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Filter jobs by search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.id?.toLowerCase().includes(query) ||
        job.title?.toLowerCase().includes(query) ||
        job.city?.toLowerCase().includes(query) ||
        job.country?.toLowerCase().includes(query) ||
        job.companyId?.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  const columns: ColumnDef<JobPostResponse>[] = [
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
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{String(value || '-')}</span>
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
      key: 'city',
      header: 'Location',
      render: (value, row) => (
        <span>
          {String(value || '-')}
          {row.country && `, ${row.country}`}
        </span>
      ),
    },
    {
      key: 'published',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <Badge
          className={
            value
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }
        >
          {value ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'postedDate',
      header: 'Posted',
      sortable: true,
      render: (value) =>
        value ? (
          new Date(String(value)).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: 'expiryDate',
      header: 'Expires',
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-muted-foreground">-</span>;
        const date = new Date(String(value));
        const isExpired = date < new Date();
        return (
          <span className={isExpired ? 'text-rose-500' : ''}>
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Jobs"
        description="All job posts across the platform"
        searchPlaceholder="Search by title, company, location, or ID..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={fetchJobs}
        isLoading={isLoading}
        totalCount={filteredJobs.length}
      />

      <div className="flex-1 overflow-auto p-4">
        <DataTable
          columns={columns}
          data={filteredJobs}
          isLoading={isLoading}
          onRowClick={setSelectedJob}
          rowKey="id"
          emptyMessage="No jobs found"
        />
      </div>

      <EntityDetailSheet
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || 'Job Details'}
        description={selectedJob?.id}
        entity={selectedJob}
      />
    </div>
  );
}
