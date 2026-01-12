'use client';

import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@saint-giong/bamboo-ui';
import { ArrowLeft, Building2, MapPin, Phone, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

function CompanyDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Skeleton className="mb-4 h-24 w-24 rounded-full" />
                <Skeleton className="mb-2 h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await companyApi.get(companyId);
      setCompany(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load company details'
      );
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  if (isLoading) {
    return <CompanyDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-4 h-12 w-12 text-destructive/50" />
            <h3 className="mb-2 font-semibold text-lg">
              Error Loading Company
            </h3>
            <p className="mb-4 text-muted-foreground">{error}</p>
            <Button onClick={fetchCompany}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-semibold text-lg">Company Not Found</h3>
            <p className="text-muted-foreground">
              The company you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = getInitials(company.name);
  const location = [company.address, company.city, company.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/companies">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-4 h-24 w-24 border-4 border-primary/10">
                  <AvatarFallback className="bg-primary/5 font-bold text-2xl text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mb-1 font-bold text-xl">{company.name}</h2>
                {location && (
                  <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                {company.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{company.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* About Section */}
          {company.aboutUs && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {company.aboutUs}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Who We're Looking For */}
          {company.admissionDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Who We're Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {company.admissionDescription}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {company.city && (
                  <div>
                    <p className="text-muted-foreground text-sm">City</p>
                    <p className="font-medium">{company.city}</p>
                  </div>
                )}
                {company.country && (
                  <div>
                    <p className="text-muted-foreground text-sm">Country</p>
                    <p className="font-medium">{company.country}</p>
                  </div>
                )}
                {company.address && (
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground text-sm">Address</p>
                    <p className="font-medium">{company.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
