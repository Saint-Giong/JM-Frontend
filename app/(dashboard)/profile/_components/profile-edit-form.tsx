'use client';

import {
  Avatar,
  AvatarFallback,
  Button,
  Input,
  Label,
  Separator,
  Textarea,
} from '@saint-giong/bamboo-ui';
import { Check } from 'lucide-react';
import type { ProfileFormData } from './types';

interface ProfileEditFormProps {
  formData: ProfileFormData;
  city: string;
  country: string;
  initials: string;
  isSaving: boolean;
  saveSuccess: boolean;
  onFieldChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  formData,
  city,
  country,
  initials,
  isSaving,
  saveSuccess,
  onFieldChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Company Info */}
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
              value={formData.companyName}
              onChange={(e) => onFieldChange('companyName', e.target.value)}
              placeholder="Your company name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} disabled className="bg-muted" />
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
              value={formData.website}
              onChange={(e) => onFieldChange('website', e.target.value)}
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
          value={formData.aboutUs}
          onChange={(e) => onFieldChange('aboutUs', e.target.value)}
          placeholder="Tell potential applicants about your company..."
          rows={6}
        />
      </div>

      {/* Who We Are Looking For */}
      <div className="space-y-2">
        <Label htmlFor="whoWeAreLookingFor">Who We Are Looking For</Label>
        <Textarea
          id="whoWeAreLookingFor"
          value={formData.whoWeAreLookingFor}
          onChange={(e) => onFieldChange('whoWeAreLookingFor', e.target.value)}
          placeholder="Describe the ideal candidates you're looking for..."
          rows={6}
        />
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="+84 111 222 3333"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
