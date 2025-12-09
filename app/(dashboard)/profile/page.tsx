'use client';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Separator,
  Textarea,
} from '@saint-giong/bamboo-ui';
import {
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Plus,
  Share2,
  User,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores';

// Mock job posts data
const mockJobPosts = [
  {
    id: '1',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque tellus lacus id praesent sapien in volutpat. Vitae sed nisl enim nibh lacus quis ultrices lorem. At...',
    skills: ['Skill', 'Tag'],
    postedAt: 'A day ago',
    type: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    salary: '30,000 - 80,000 USD',
  },
  {
    id: '2',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque tellus lacus id praesent sapien in volutpat. Vitae sed nisl enim nibh lacus quis ultrices lorem. At...',
    skills: ['Skill', 'Tag'],
    postedAt: 'A day ago',
    type: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    salary: '30,000 - 80,000 USD',
  },
  {
    id: '3',
    title: 'Social Media Manager',
    description:
      'Lorem ipsum dolor sit amet consectetur. Felis diam pellentesque tellus lacus id praesent sapien in volutpat. Vitae sed nisl enim nibh lacus quis ultrices lorem. At...',
    skills: ['Skill', 'Tag'],
    postedAt: 'A day ago',
    type: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    salary: '30,000 - 80,000 USD',
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile form state
  const [companyName, setCompanyName] = useState(
    user?.companyName ?? 'Saint Giong'
  );
  const [website, setWebsite] = useState('www.saintgiong.com');
  const [aboutUs, setAboutUs] = useState(
    'Lorem ipsum dolor sit amet consectetur. Posuere amet ac eu viverra. Praesent nunc aenean non est lacus nam aliquam non sagittis. Tortor enim suspendisse porta id. Libero egestas est vitae commodo ut. Adipiscing at diam phasellus laoreet sed id. Neque sed quis feugiat non facilisi erat. Tortor bibendum et libero proin nulla et eget aliquam. Velit odio nunc eros bibendum ut aliquam quam sit cras. Risus nisl viverra in sagittis. Faucibus consectetur lorem tellus egestas sagittis est.'
  );
  const [whoWeAreLookingFor, setWhoWeAreLookingFor] = useState(
    'Lorem ipsum dolor sit amet consectetur. Posuere amet ac eu viverra. Praesent nunc aenean non est lacus nam aliquam non sagittis. Tortor enim suspendisse porta id. Libero egestas est vitae commodo ut. Adipiscing at diam phasellus laoreet sed id. Neque sed quis feugiat non facilisi erat. Tortor bibendum et libero proin nulla et eget aliquam. Velit odio nunc eros bibendum ut aliquam quam sit cras. Risus nisl viverra in sagittis. Faucibus consectetur lorem tellus egestas sagittis est. Quisque ac enim diam nunc et morbi enim vitae eu. Ultrices odio nullam egestas aliquam id quis consectetur porttitor.'
  );

  // Contact info state
  const [address, setAddress] = useState(
    user?.address ?? '702 Nguyen Van Linh Boulevard, Tan Hung Ward'
  );
  const [phone, setPhone] = useState(user?.phoneNumber ?? '111 222 3333');
  const [email, setEmail] = useState(user?.email ?? 'example@email.com');

  const city = user?.city ?? 'Ho Chi Minh City';
  const country = user?.country ?? 'Vietnam';
  const displayName = companyName || 'Company Name';
  const initials = getInitials(displayName);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update the store
    updateProfile({
      companyName: companyName || undefined,
      address: address || undefined,
      phoneNumber: phone || undefined,
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditMode(false);

    // Hide success indicator after 2 seconds
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <User className="h-6 w-6" />
          <h1 className="font-semibold text-2xl">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View as Applicants</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant={isEditMode ? 'outline' : 'default'}
            className="gap-2"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isEditMode ? 'Cancel' : 'Edit'}
            </span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              {isEditMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-8">
                  {/* Edit Mode - Company Info */}
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24 md:h-32 md:w-32">
                        <AvatarFallback className="text-2xl md:text-3xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Upload Logo
                      </Button>
                    </div>

                    {/* Company Details Form */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Your company name"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={city}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={country}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="www.yourcompany.com"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* About Us */}
                  <div className="space-y-2">
                    <Label htmlFor="aboutUs">About Us</Label>
                    <Textarea
                      id="aboutUs"
                      value={aboutUs}
                      onChange={(e) => setAboutUs(e.target.value)}
                      placeholder="Tell potential applicants about your company..."
                      rows={6}
                    />
                  </div>

                  {/* Who We Are Looking For */}
                  <div className="space-y-2">
                    <Label htmlFor="whoWeAreLookingFor">
                      Who We Are Looking For
                    </Label>
                    <Textarea
                      id="whoWeAreLookingFor"
                      value={whoWeAreLookingFor}
                      onChange={(e) => setWhoWeAreLookingFor(e.target.value)}
                      placeholder="Describe the ideal candidates you're looking for..."
                      rows={6}
                    />
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Contact Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+84 111 222 3333"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contact@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    {saveSuccess && (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <Check className="h-4 w-4" />
                        Saved
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="flex flex-col gap-8 lg:flex-row">
                  {/* Main Content */}
                  <div className="flex-1 space-y-8">
                    {/* Company Header */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      <Avatar className="h-24 w-24 md:h-32 md:w-32">
                        <AvatarFallback className="text-2xl md:text-3xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h2 className="font-serif text-3xl md:text-4xl">
                          {displayName}
                        </h2>
                        <p className="text-muted-foreground">
                          {city}, {country}
                        </p>
                        <a
                          href={`https://${website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary text-sm hover:underline"
                        >
                          {website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <Separator />

                    {/* Who We Are Looking For */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl">
                        Who we are looking for
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {whoWeAreLookingFor}
                      </p>
                    </div>

                    <Separator />

                    {/* Job Posts */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="flex items-center gap-2 hover:opacity-70"
                        >
                          <h3 className="font-semibold text-xl">
                            Job Posts ({mockJobPosts.length})
                          </h3>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Job
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {mockJobPosts.map((job) => (
                          <Card
                            key={job.id}
                            className="cursor-pointer transition-shadow hover:shadow-md"
                          >
                            <CardContent className="space-y-4 p-5">
                              <h4 className="font-semibold text-lg">
                                {job.title}
                              </h4>
                              <p className="line-clamp-3 text-muted-foreground text-sm">
                                {job.description}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="font-normal"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="space-y-2 text-muted-foreground text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{job.postedAt}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{job.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4" />
                                  <span>{job.salary}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="w-full space-y-6 lg:w-80">
                    {/* About Us */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl">About us</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {aboutUs}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Quisque ac enim diam nunc et morbi enim vitae eu.
                        Ultrices odio nullam egestas aliquam id quis consectetur
                        porttitor. Amet erat in sapien lorem elementum tortor
                        interdum augue. Eleifend turpis quis metus id aliquet et
                        sit suscipit luctus. Erat dolor aenean condimentum
                        sagittis est ac id. Luctus dolor ut sem pellentesque.
                      </p>
                    </div>

                    <Separator />

                    {/* Contact */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-xl">Contact</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-muted-foreground">{address}</p>
                        </div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">(+84) {phone}</p>
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">{email}</p>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Linkedin className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Facebook className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Instagram className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
