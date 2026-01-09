'use client';

import type { FieldErrors } from '@/hooks';
import {
  Button,
  Input,
  Label,
  Separator,
  Textarea,
} from '@saint-giong/bamboo-ui';
import { Check } from 'lucide-react';
import { LogoUpload } from './logo-upload';
import type { ProfileFormData } from './types';

interface ProfileEditFormProps {
  formData: ProfileFormData;
  city: string;
  country: string;
  initials: string;
  isSaving: boolean;
  saveSuccess: boolean;
  error?: string | null;
  fieldErrors?: FieldErrors;
  companyId?: string;
  onFieldChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-destructive text-sm">{error}</p>;
}

export function ProfileEditForm({
  formData,
  city,
  country,
  initials,
  isSaving,
  saveSuccess,
  error,
  fieldErrors = {},
  companyId,
  onFieldChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Company Info */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Logo Upload */}
        <LogoUpload
          currentLogoUrl={formData.logoUrl}
          companyId={companyId ?? ''}
          onUploadComplete={(url) => onFieldChange('logoUrl', url)}
          initials={initials}
          disabled={!companyId || isSaving}
        />

        {/* Company Details Form */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => onFieldChange('companyName', e.target.value)}
              placeholder="Your company name"
              className={fieldErrors.name ? 'border-destructive' : ''}
            />
            <FieldError error={fieldErrors.name} />
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
              className={fieldErrors.address ? 'border-destructive' : ''}
            />
            <FieldError error={fieldErrors.address} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="+1234567890"
              className={fieldErrors.phone ? 'border-destructive' : ''}
            />
            {fieldErrors.phone ? (
              <FieldError error={fieldErrors.phone} />
            ) : (
              <p className="text-muted-foreground text-xs">
                Format: +[country code][number] (e.g., +1234567890)
              </p>
            )}
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

      {error && Object.keys(fieldErrors).length === 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="font-medium text-destructive text-sm">
            Error saving profile:
          </p>
          <p className="mt-1 whitespace-pre-line text-destructive text-sm">
            {error}
          </p>
        </div>
      )}

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
