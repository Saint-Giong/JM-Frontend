import { Briefcase, Eye, FileText, Users } from 'lucide-react';

export interface DashboardStat {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendUp: boolean;
}

export interface RecentApplication {
  id: string;
  applicantName: string;
  jobTitle: string;
  appliedAt: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface ActiveJob {
  id: string;
  title: string;
  applications: number;
  views: number;
  daysLeft: number;
}

export const dashboardStats: DashboardStat[] = [
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

export const recentApplications: RecentApplication[] = [
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

export const activeJobs: ActiveJob[] = [
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
