'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Crown,
  Filter,
  Globe,
  GraduationCap,
  Plus,
  Save,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface SearchProfile {
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

// Mock saved search profiles
const mockSearchProfiles: SearchProfile[] = [
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

const availableSkills = [
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

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Fresher',
  'Internship',
  'Contract',
];

const educationLevels = ['Bachelor', 'Master', 'Doctorate'];

const premiumFeatures = [
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

const freeFeatures = [
  { name: 'Up to 5 job postings', included: true },
  { name: 'Basic applicant tracking', included: true },
  { name: 'Email notifications', included: true },
  { name: 'Custom search profiles', included: false },
  { name: 'Real-time candidate alerts', included: false },
  { name: 'Advanced analytics', included: false },
];

const premiumFeaturesList = [
  { name: 'Unlimited job postings', included: true },
  { name: 'Advanced applicant tracking', included: true },
  { name: 'Real-time notifications', included: true },
  { name: 'Custom search profiles', included: true },
  { name: 'AI candidate matching', included: true },
  { name: 'Priority support', included: true },
];

export default function SubscriptionPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchProfiles, setSearchProfiles] = useState(mockSearchProfiles);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New profile form state
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    string[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPremium(true);
    setIsProcessing(false);
  };

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleToggleEmployment = (type: string) => {
    setSelectedEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleToggleEducation = (level: string) => {
    setSelectedEducation((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSaveProfile = async () => {
    if (!newProfileName.trim()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProfile: SearchProfile = {
      id: crypto.randomUUID(),
      name: newProfileName,
      skills: selectedSkills,
      employmentStatus: selectedEmploymentTypes,
      country: selectedCountry,
      salaryRange: {
        min: minSalary ? Number(minSalary) : 0,
        max: maxSalary ? Number(maxSalary) : null,
      },
      education: selectedEducation,
      isActive: true,
      matchCount: 0,
    };

    setSearchProfiles((prev) => [...prev, newProfile]);
    setIsCreating(false);
    resetForm();
    setIsSaving(false);
  };

  const resetForm = () => {
    setNewProfileName('');
    setSelectedSkills([]);
    setSelectedEmploymentTypes([]);
    setSelectedCountry('');
    setMinSalary('');
    setMaxSalary('');
    setSelectedEducation([]);
  };

  const handleDeleteProfile = (id: string) => {
    setSearchProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-2xl tracking-tight">
                Subscription
              </h1>
              {isPremium && (
                <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {isPremium
                ? 'Manage your premium features and search profiles'
                : 'Upgrade to unlock powerful recruitment tools'}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {isPremium ? (
          /* Premium User View */
          <div className="p-6">
            <Tabs defaultValue="features" className="mx-auto max-w-5xl">
              <TabsList className="mb-6 grid w-full grid-cols-2 lg:flex lg:w-auto lg:grid-cols-none">
                <TabsTrigger value="features" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Premium Features</span>
                </TabsTrigger>
                <TabsTrigger value="profiles" className="gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search Profiles</span>
                </TabsTrigger>
              </TabsList>

              {/* Premium Features Tab */}
              <TabsContent value="features" className="space-y-6">
                {/* Status Card */}
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30 shadow-xl">
                          <Crown className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Premium Plan Active
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Your subscription renews on January 15, 2026
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          Manage Billing
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          Cancel Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {premiumFeatures.map((feature) => (
                    <Card
                      key={feature.title}
                      className="group transition-all hover:shadow-md"
                    >
                      <CardContent className="flex items-start gap-4 p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      className="h-auto justify-start gap-3 p-4"
                      asChild
                    >
                      <Link href="/applicant-search">
                        <Search className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">Search Candidates</p>
                          <p className="text-muted-foreground text-xs">
                            Find matching applicants
                          </p>
                        </div>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto justify-start gap-3 p-4"
                      onClick={() => {
                        const tabsElement = document.querySelector(
                          '[data-state="inactive"][value="profiles"]'
                        ) as HTMLButtonElement;
                        tabsElement?.click();
                      }}
                    >
                      <Plus className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">Create Search Profile</p>
                        <p className="text-muted-foreground text-xs">
                          Set up automatic matching
                        </p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Search Profiles Tab */}
              <TabsContent value="profiles" className="space-y-6">
                {/* Header with Create Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">Search Profiles</h2>
                    <p className="text-muted-foreground text-sm">
                      Create profiles to automatically match candidates
                    </p>
                  </div>
                  {!isCreating && (
                    <Button
                      onClick={() => setIsCreating(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Profile
                    </Button>
                  )}
                </div>

                {/* Create New Profile Form */}
                {isCreating && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Plus className="h-5 w-5 text-primary" />
                        Create Search Profile
                      </CardTitle>
                      <CardDescription>
                        Define criteria to automatically match candidates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Profile Name */}
                      <div className="space-y-2">
                        <Label htmlFor="profileName">Profile Name</Label>
                        <Input
                          id="profileName"
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          placeholder="e.g., Full-Stack Software Engineers"
                          className="bg-background"
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        {/* Technical Skills */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            Technical Skills
                          </Label>
                          <div className="flex flex-wrap gap-1.5">
                            {availableSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant={
                                  selectedSkills.includes(skill)
                                    ? 'default'
                                    : 'outline'
                                }
                                className={cn(
                                  'cursor-pointer transition-all',
                                  selectedSkills.includes(skill)
                                    ? 'bg-primary hover:bg-primary/90'
                                    : 'bg-background hover:bg-accent'
                                )}
                                onClick={() => handleToggleSkill(skill)}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Employment Status */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            Employment Status
                          </Label>
                          <div className="flex flex-wrap gap-1.5">
                            {employmentTypes.map((type) => (
                              <Badge
                                key={type}
                                variant={
                                  selectedEmploymentTypes.includes(type)
                                    ? 'default'
                                    : 'outline'
                                }
                                className={cn(
                                  'cursor-pointer transition-all',
                                  selectedEmploymentTypes.includes(type)
                                    ? 'bg-primary hover:bg-primary/90'
                                    : 'bg-background hover:bg-accent'
                                )}
                                onClick={() => handleToggleEmployment(type)}
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-5 md:grid-cols-3">
                        {/* Location */}
                        <div className="space-y-2">
                          <Label
                            className="flex items-center gap-2"
                            htmlFor="country"
                          >
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            Country
                          </Label>
                          <Input
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            placeholder="e.g., Vietnam"
                            className="bg-background"
                          />
                        </div>

                        {/* Salary Range */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            Salary (USD)
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={minSalary}
                              onChange={(e) => setMinSalary(e.target.value)}
                              placeholder="Min"
                              className="bg-background"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                              type="number"
                              value={maxSalary}
                              onChange={(e) => setMaxSalary(e.target.value)}
                              placeholder="Max"
                              className="bg-background"
                            />
                          </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            Education
                          </Label>
                          <div className="flex flex-wrap gap-1.5">
                            {educationLevels.map((level) => (
                              <Badge
                                key={level}
                                variant={
                                  selectedEducation.includes(level)
                                    ? 'default'
                                    : 'outline'
                                }
                                className={cn(
                                  'cursor-pointer transition-all',
                                  selectedEducation.includes(level)
                                    ? 'bg-primary hover:bg-primary/90'
                                    : 'bg-background hover:bg-accent'
                                )}
                                onClick={() => handleToggleEducation(level)}
                              >
                                {level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-end gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsCreating(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSaving || !newProfileName.trim()}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isSaving ? 'Saving...' : 'Save Profile'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Saved Profiles */}
                {searchProfiles.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-1 font-semibold text-lg">
                        No search profiles yet
                      </h3>
                      <p className="mb-4 text-center text-muted-foreground text-sm">
                        Create a profile to automatically match candidates
                      </p>
                      <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Profile
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchProfiles.map((profile) => (
                      <Card
                        key={profile.id}
                        className="group transition-all hover:shadow-md"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate text-base">
                                {profile.name}
                              </CardTitle>
                              <CardDescription className="mt-1 flex items-center gap-1.5">
                                <Bell className="h-3.5 w-3.5" />
                                <span className="font-medium text-primary">
                                  {profile.matchCount}
                                </span>{' '}
                                matches found
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={
                                  profile.isActive ? 'default' : 'secondary'
                                }
                                className={cn(
                                  'text-xs',
                                  profile.isActive &&
                                    'bg-green-500 hover:bg-green-600'
                                )}
                              >
                                {profile.isActive ? 'Active' : 'Paused'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                                onClick={() => handleDeleteProfile(profile.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Skills */}
                          {profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {profile.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-2 text-muted-foreground text-sm">
                            {profile.country && (
                              <p className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5" />
                                {profile.country}
                              </p>
                            )}
                            {profile.employmentStatus.length > 0 && (
                              <p className="flex items-center gap-1.5">
                                <Filter className="h-3.5 w-3.5" />
                                {profile.employmentStatus.length > 2
                                  ? `${profile.employmentStatus.length} types`
                                  : profile.employmentStatus.join(', ')}
                              </p>
                            )}
                            {(profile.salaryRange.min > 0 ||
                              profile.salaryRange.max) && (
                              <p className="flex items-center gap-1.5">
                                <Wallet className="h-3.5 w-3.5" />$
                                {profile.salaryRange.min}
                                {profile.salaryRange.max
                                  ? `-$${profile.salaryRange.max}`
                                  : '+'}
                              </p>
                            )}
                            {profile.education.length > 0 && (
                              <p className="flex items-center gap-1.5">
                                <GraduationCap className="h-3.5 w-3.5" />
                                {profile.education.length > 2
                                  ? `${profile.education.length} levels`
                                  : profile.education.join(', ')}
                              </p>
                            )}
                          </div>

                          <Separator />

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full gap-2"
                            asChild
                          >
                            <Link href="/applicant-search">
                              View Matches
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* How It Works */}
                <Card className="mt-4 border-dashed bg-muted/30">
                  <CardContent className="p-6">
                    <h4 className="mb-4 text-center font-medium">
                      How Automatic Matching Works
                    </h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        {
                          step: '1',
                          title: 'Define Criteria',
                          desc: 'Set your ideal candidate requirements',
                        },
                        {
                          step: '2',
                          title: 'Auto Scanning',
                          desc: 'System scans new applicant profiles',
                        },
                        {
                          step: '3',
                          title: 'Instant Alerts',
                          desc: 'Get notified when matches are found',
                        },
                      ].map((item) => (
                        <div key={item.step} className="text-center">
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {item.step}
                          </div>
                          <h5 className="font-medium text-sm">{item.title}</h5>
                          <p className="text-muted-foreground text-xs">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Free User - Upgrade View */
          <div className="relative">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b bg-gradient-to-b from-amber-50/80 via-orange-50/50 to-background px-6 py-16 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background">
              {/* Decorative elements */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="-top-24 absolute right-0 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-300/20 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
                <div className="-bottom-12 absolute left-0 h-64 w-64 rounded-full bg-gradient-to-tr from-orange-200/30 to-amber-300/20 blur-3xl dark:from-orange-500/10 dark:to-amber-500/5" />
              </div>

              <div className="relative mx-auto max-w-4xl text-center">
                <Badge
                  variant="outline"
                  className="mb-6 border-amber-300 bg-amber-100/50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Upgrade to Premium
                </Badge>

                <h2 className="mb-4 font-serif text-4xl tracking-tight md:text-5xl">
                  Find Your Perfect
                  <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Candidates Faster
                  </span>
                </h2>

                <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                  Unlock powerful AI-driven matching, real-time notifications,
                  and custom search profiles to streamline your recruitment.
                </p>

                {/* Pricing */}
                <div className="mb-8 inline-flex items-baseline gap-1 rounded-2xl bg-background/80 px-6 py-3 shadow-lg backdrop-blur">
                  <span className="font-semibold font-serif text-5xl tracking-tight">
                    $29
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    size="lg"
                    className="min-w-[200px] gap-2 bg-gradient-to-r from-amber-500 to-orange-500 font-medium text-white shadow-lg shadow-orange-500/25 hover:from-amber-600 hover:to-orange-600"
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Crown className="h-4 w-4" />
                        Upgrade Now
                      </>
                    )}
                  </Button>
                  <p className="text-muted-foreground text-sm">
                    Cancel anytime. No hidden fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Plans Comparison */}
            <div className="mx-auto max-w-5xl px-6 py-12">
              <h3 className="mb-8 text-center font-semibold text-2xl">
                Compare Plans
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Free Plan */}
                <Card className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Free Plan
                      <Badge variant="secondary" className="ml-auto">
                        Current
                      </Badge>
                    </CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-4xl">$0</span>
                      <span className="text-muted-foreground">/forever</span>
                    </div>
                    <CardDescription>
                      Basic features for small teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {freeFeatures.map((feature) => (
                        <li
                          key={feature.name}
                          className="flex items-center gap-3"
                        >
                          {feature.included ? (
                            <Check className="h-5 w-5 shrink-0 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                          )}
                          <span
                            className={cn(
                              !feature.included && 'text-muted-foreground/60'
                            )}
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="relative border-2 border-amber-500/50 bg-gradient-to-b from-amber-50/50 to-background shadow-xl dark:from-amber-950/20">
                  {/* Popular Badge */}
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2">
                    <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-white shadow-lg">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Recommended
                    </Badge>
                  </div>

                  <CardHeader className="pt-8">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      Premium Plan
                    </CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-4xl">$29</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>
                      Everything you need to hire faster
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {premiumFeaturesList.map((feature) => (
                        <li
                          key={feature.name}
                          className="flex items-center gap-3"
                        >
                          <Check className="h-5 w-5 shrink-0 text-green-500" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="mt-6 w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      onClick={handleUpgrade}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Upgrade to Premium'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Secure payment via Stripe
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Cancel anytime
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
