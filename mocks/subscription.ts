import { Bell, Search, Users, Zap } from 'lucide-react';

// Types
export interface SearchProfile {
  id: string;
  name: string;
  skills: string[];
  employmentStatus: string[];
  country: string;
  salaryRange: { min: number; max: number | null };
  education: string[];
  isActive: boolean;
  matchCount: number;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PremiumFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// Mock search profiles
export const mockSearchProfiles: SearchProfile[] = [
  {
    id: '1',
    name: 'Full-Stack Software Engineers',
    skills: ['React', 'Spring Boot', 'Docker'],
    employmentStatus: ['Full-time', 'Internship'],
    country: 'Vietnam',
    salaryRange: { min: 800, max: null },
    education: ['Bachelor', 'Master'],
    isActive: true,
    matchCount: 12,
  },
  {
    id: '2',
    name: 'Contractual Data Engineers',
    skills: ['Python', 'AWS', 'Snowflake'],
    employmentStatus: ['Contract'],
    country: 'Singapore',
    salaryRange: { min: 1200, max: null },
    education: ['Master', 'Doctorate'],
    isActive: true,
    matchCount: 5,
  },
];

// Available skills for search profiles
export const availableSkills = [
  'React',
  'Spring Boot',
  'Kafka',
  'Docker',
  'Python',
  'AWS',
  'Snowflake',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'Kubernetes',
];

// Employment types
export const employmentTypes = [
  'Full-time',
  'Part-time',
  'Fresher',
  'Internship',
  'Contract',
];

// Education levels
export const educationLevels = ['Bachelor', 'Master', 'Doctorate'];

// Premium features displayed on subscription page
export const premiumFeatures: PremiumFeature[] = [
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Instant alerts when candidates match your criteria',
  },
  {
    icon: Search,
    title: 'Custom Search Profiles',
    description: 'Save unlimited candidate search configurations',
  },
  {
    icon: Zap,
    title: 'Automatic Matching',
    description: 'AI-powered candidate recommendations',
  },
  {
    icon: Users,
    title: 'Priority Support',
    description: 'Dedicated support team for your needs',
  },
];

// Free plan features
export const freeFeatures: PlanFeature[] = [
  { name: 'Up to 5 job postings', included: true },
  { name: 'Basic applicant tracking', included: true },
  { name: 'Email notifications', included: true },
  { name: 'Custom search profiles', included: false },
  { name: 'Real-time candidate alerts', included: false },
  { name: 'Advanced analytics', included: false },
];

// Premium plan features
export const premiumFeaturesList: PlanFeature[] = [
  { name: 'Unlimited job postings', included: true },
  { name: 'Advanced applicant tracking', included: true },
  { name: 'Real-time notifications', included: true },
  { name: 'Custom search profiles', included: true },
  { name: 'AI candidate matching', included: true },
  { name: 'Priority support', included: true },
];
