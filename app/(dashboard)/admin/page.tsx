'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import {
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  Database,
  Search,
  Send,
  Tag,
  Users,
} from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    title: 'Companies',
    description: 'Browse and manage company profiles',
    href: '/admin/companies',
    icon: Building2,
    color: 'text-blue-500',
  },
  {
    title: 'Subscriptions',
    description: 'View subscription status across platform',
    href: '/admin/subscriptions',
    icon: CreditCard,
    color: 'text-emerald-500',
  },
  {
    title: 'Payments',
    description: 'Track payment transactions',
    href: '/admin/payments',
    icon: Database,
    color: 'text-amber-500',
  },
  {
    title: 'Jobs',
    description: 'Browse all job posts',
    href: '/admin/jobs',
    icon: Briefcase,
    color: 'text-purple-500',
  },
  {
    title: 'Skill Tags',
    description: 'Manage skill tag taxonomy',
    href: '/admin/skill-tags',
    icon: Tag,
    color: 'text-pink-500',
  },
  {
    title: 'Discovery',
    description: 'Explore applicant search index',
    href: '/admin/discovery',
    icon: Users,
    color: 'text-cyan-500',
  },
  {
    title: 'Notifications',
    description: 'Test and send notifications',
    href: '/admin/notifications',
    icon: Bell,
    color: 'text-orange-500',
  },
  {
    title: 'API Tester',
    description: 'Test backend API endpoints',
    href: '/admin/api-tester',
    icon: Send,
    color: 'text-rose-500',
  },
];

export default function AdminPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Welcome card */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-amber-500" />
              Dev Tools Overview
            </CardTitle>
            <CardDescription>
              Internal tools for debugging, testing, and managing backend data.
              These tools are for development and troubleshooting purposes.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick links grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full transition-colors hover:border-foreground/20 hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium">{link.title}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>
              Backend services and their API prefixes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                { service: 'Auth', path: '/v1/auth/' },
                { service: 'Profile', path: '/v1/profile/' },
                { service: 'JobPost', path: '/v1/jobpost/' },
                { service: 'Discovery', path: '/v1/discovery/' },
                { service: 'Skill Tag', path: '/v1/tag/' },
                { service: 'Subscription', path: '/v1/subscription/' },
                { service: 'Payment', path: '/v1/payment/' },
                { service: 'Media', path: '/v1/media/' },
                { service: 'Notification', path: '/v1/noti/' },
              ].map(({ service, path }) => (
                <div
                  key={service}
                  className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                >
                  <span className="font-medium">{service}</span>
                  <code className="text-muted-foreground text-xs">{path}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
