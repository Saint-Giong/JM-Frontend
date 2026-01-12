'use client';

import type { ApplicantDocument, ApplicantPage } from '@/lib/api/discovery';
import { discoveryApi } from '@/lib/api/discovery';
import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
  AdminToolbar,
  type ColumnDef,
  DataTable,
  EntityDetailSheet,
  type PaginationState,
} from '../_components';

export default function DiscoveryAdminPage() {
  const [applicantsPage, setApplicantsPage] = useState<ApplicantPage | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantDocument | null>(null);

  const fetchApplicants = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use search if query exists, otherwise get all
      const data = searchQuery
        ? await discoveryApi.searchApplicants({
            query: searchQuery,
            page,
            size: pageSize,
          })
        : await discoveryApi.getAllApplicants({ page, size: pageSize });
      setApplicantsPage(data);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // Reset to first page on new search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(0);
  };

  const columns: ColumnDef<ApplicantDocument>[] = [
    {
      key: 'applicantId',
      header: 'ID',
      width: '180px',
      render: (value) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {String(value).slice(0, 8)}...
        </code>
      ),
    },
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.avatarUrl && (
            <Image
              src={row.avatarUrl}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
          )}
          <span className="font-medium">
            {String(value || '')} {row.lastName}
          </span>
        </div>
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
      key: 'skillIds',
      header: 'Skills',
      render: (value) => {
        const skills = value as number[] | undefined;
        if (!skills?.length)
          return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {skills.length} skills
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'educationList',
      header: 'Education',
      render: (value) => {
        const education = value as { degree?: string }[] | undefined;
        if (!education?.length)
          return <span className="text-muted-foreground">-</span>;
        const degrees = education.map((e) => e.degree).filter(Boolean);
        const highest = degrees.includes('DOCTORATE')
          ? 'PhD'
          : degrees.includes('MASTER')
            ? 'Master'
            : degrees.includes('BACHELOR')
              ? 'Bachelor'
              : '-';
        return <Badge variant="outline">{highest}</Badge>;
      },
    },
    {
      key: 'workExperienceList',
      header: 'Experience',
      render: (value) => {
        const experience = value as unknown[] | undefined;
        if (!experience?.length)
          return <span className="text-muted-foreground">-</span>;
        return (
          <Badge variant="secondary" className="text-xs">
            {experience.length} positions
          </Badge>
        );
      },
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (value) =>
        value ? (
          new Date(String(value)).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  const pagination: PaginationState | undefined = applicantsPage
    ? {
        page: applicantsPage.number,
        size: applicantsPage.size,
        totalElements: applicantsPage.totalElements,
        totalPages: applicantsPage.totalPages,
      }
    : undefined;

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Discovery Index"
        description="Browse Elasticsearch applicant search index"
        searchPlaceholder="Search applicants by name, skills, location..."
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onRefresh={fetchApplicants}
        isLoading={isLoading}
        totalCount={applicantsPage?.totalElements}
      />

      <Tabs
        defaultValue="applicants"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="search-profiles">Search Profiles</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="applicants"
          className="mt-0 flex-1 overflow-auto p-4"
        >
          <DataTable
            columns={columns}
            data={applicantsPage?.content || []}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(0);
            }}
            onRowClick={setSelectedApplicant}
            rowKey="applicantId"
            emptyMessage="No applicants found in the index"
          />
        </TabsContent>

        <TabsContent
          value="search-profiles"
          className="mt-0 flex-1 overflow-auto p-4"
        >
          <SearchProfilesTab />
        </TabsContent>
      </Tabs>

      <EntityDetailSheet
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        title={
          selectedApplicant
            ? `${selectedApplicant.firstName} ${selectedApplicant.lastName}`
            : 'Applicant Details'
        }
        description={selectedApplicant?.applicantId}
        entity={selectedApplicant}
      />
    </div>
  );
}

// Search Profiles sub-tab
function SearchProfilesTab() {
  // Note: This would need a company ID or an admin endpoint to list all profiles
  // For now, show a placeholder

  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <p className="text-muted-foreground">
          Search profiles are company-specific.
        </p>
        <p className="mt-1 text-muted-foreground text-sm">
          Use the main Discovery browser to view individual company profiles.
        </p>
      </div>
    </div>
  );
}
