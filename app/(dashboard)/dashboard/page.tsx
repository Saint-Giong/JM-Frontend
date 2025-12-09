'use client';

import { useAuthStore } from '@/stores';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@saint-giong/bamboo-ui';
import {
  ArrowRight,
  Bell,
  Briefcase,
  Clock,
  Eye,
  FileText,
  Home,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for dashboard statistics
const stats = [
  {
    title: 'Active Jobs',
    value: '12',
    description: '3 expiring soon',
    icon: Briefcase,
    trend: '+2 this week',
    trendUp: true,
  },
  {
    title: 'Total Applications',
    value: '248',
    description: 'Across all jobs',
    icon: FileText,
    trend: '+15 this week',
    trendUp: true,
  },
  {
    title: 'New Applicants',
    value: '24',
    description: 'Pending review',
    icon: Users,
    trend: '+8 today',
    trendUp: true,
  },
  {
    title: 'Profile Views',
    value: '1,234',
    description: 'Last 30 days',
    icon: Eye,
    trend: '+12%',
    trendUp: true,
  },
];

// Mock recent applications
const recentApplications = [
  {
    id: '1',
    applicantName: 'John Doe',
    jobTitle: 'Social Media Manager',
    appliedAt: '2 hours ago',
    status: 'new',
  },
  {
    id: '2',
    applicantName: 'Jane Smith',
    jobTitle: 'Frontend Developer',
    appliedAt: '5 hours ago',
    status: 'new',
  },
  {
    id: '3',
    applicantName: 'Mike Johnson',
    jobTitle: 'Social Media Manager',
    appliedAt: '1 day ago',
    status: 'reviewed',
  },
  {
    id: '4',
    applicantName: 'Sarah Williams',
    jobTitle: 'Data Engineer',
    appliedAt: '2 days ago',
    status: 'reviewed',
  },
];

// Mock active jobs
const activeJobs = [
  {
    id: '1',
    title: 'Social Media Manager',
    applications: 45,
    views: 320,
    daysLeft: 14,
  },
  {
    id: '2',
    title: 'Frontend Developer',
    applications: 78,
    views: 520,
    daysLeft: 7,
  },
  {
    id: '3',
    title: 'Data Engineer',
    applications: 32,
    views: 180,
    daysLeft: 21,
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const displayName =
    user?.companyName || user?.email?.split('@')[0] || 'there';
  const greeting = getGreeting();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Home className="h-6 w-6" />
          <div>
            <h1 className="font-semibold text-2xl">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              {greeting}, {displayName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/notifications">
              <Bell className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" className="gap-2" asChild>
            <Link href="/jobs/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Job</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">{stat.value}</div>
                  <p className="text-muted-foreground text-xs">
                    {stat.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>
                    Latest candidates who applied to your jobs
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/jobs">
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {application.applicantName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Applied for {application.jobTitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {application.status === 'new' && (
                          <Badge
                            variant="default"
                            className="bg-green-500 text-xs"
                          >
                            New
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-xs">
                          {application.appliedAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Jobs</CardTitle>
                  <CardDescription>
                    Your currently open job postings
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/jobs">
                    Manage jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{job.title}</p>
                        <div className="flex items-center gap-3 text-muted-foreground text-xs">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applications} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.views} views
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            job.daysLeft <= 7 ? 'destructive' : 'outline'
                          }
                          className="text-xs"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {job.daysLeft}d left
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <Link href="/jobs/new">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create Job Post</h3>
                    <p className="text-muted-foreground text-sm">
                      Post a new job opening
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <Link href="/applicant-search">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Search Candidates</h3>
                    <p className="text-muted-foreground text-sm">
                      Find matching applicants
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <Link href="/subscription">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Premium Features</h3>
                    <p className="text-muted-foreground text-sm">
                      Unlock advanced tools
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
