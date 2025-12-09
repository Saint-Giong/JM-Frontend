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
