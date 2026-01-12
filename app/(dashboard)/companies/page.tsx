'use client';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
} from '@saint-giong/bamboo-ui';
import {
  Building2,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { type Company, companyApi } from '@/lib/api';

function getInitials(name: string): string {
  if (!name) return 'CO';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface CompanyCardProps {
  company: Company;
}

function CompanyCard({ company }: CompanyCardProps) {
  const initials = getInitials(company.name);
  const location = [company.city, company.country].filter(Boolean).join(', ');

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/5 font-semibold text-lg text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg">{company.name}</CardTitle>
            {location && (
              <CardDescription className="mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{location}</span>
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {company.aboutUs && (
          <p className="line-clamp-2 text-muted-foreground text-sm">
            {company.aboutUs}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {company.phone && (
            <Badge variant="secondary" className="text-xs">
              <Phone className="mr-1 h-3 w-3" />
              {company.phone}
            </Badge>
          )}
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/companies/${company.id}`}>
              View Details
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await companyApi.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      company.city?.toLowerCase().includes(query) ||
      company.country?.toLowerCase().includes(query) ||
      company.aboutUs?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-2xl">Companies</h1>
            <p className="text-muted-foreground">
              Browse all registered companies
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchCompanies}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCompanies.length === 0 && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-semibold text-lg">
              {searchQuery ? 'No companies found' : 'No companies yet'}
            </h3>
            <p className="max-w-sm text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Companies will appear here once registered'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Companies Grid */}
      {!isLoading && !error && filteredCompanies.length > 0 && (
        <>
          <p className="mb-4 text-muted-foreground text-sm">
            Showing {filteredCompanies.length} of {companies.length} companies
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
