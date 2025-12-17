'use client';

import type { FieldErrors } from '@/hooks';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
} from '@saint-giong/bamboo-ui';
import { Building2, Plus } from 'lucide-react';
import type { ProfileFormData } from './types';

interface CreateProfilePromptProps {
  formData: ProfileFormData;
  isSaving: boolean;
  error?: string | null;
  fieldErrors?: FieldErrors;
  onFieldChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-destructive text-sm">{error}</p>;
}

export function CreateProfilePrompt({
  formData,
  isSaving,
  error,
  fieldErrors = {},
  onFieldChange,
  onSubmit,
}: CreateProfilePromptProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Create Your Company Profile
          </CardTitle>
          <CardDescription>
            No company profile found. Create one to start posting jobs and
            connecting with candidates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Company Name - Required */}
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => onFieldChange('companyName', e.target.value)}
                placeholder="Enter your company name"
                className={fieldErrors.name ? 'border-destructive' : ''}
                required
              />
              <FieldError error={fieldErrors.name} />
            </div>

            <Separator />

            {/* Optional Fields */}
            <div className="space-y-4">
              <h4 className="font-medium text-muted-foreground text-sm">
                Optional Information
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => onFieldChange('city', e.target.value)}
                    placeholder="e.g., Ho Chi Minh City"
                    className={fieldErrors.city ? 'border-destructive' : ''}
                  />
                  <FieldError error={fieldErrors.city} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => onFieldChange('country', e.target.value)}
                    placeholder="e.g., Vietnam"
                    className={fieldErrors.country ? 'border-destructive' : ''}
                  />
                  <FieldError error={fieldErrors.country} />
                </div>
              </div>

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
                <Label htmlFor="aboutUs">About Us</Label>
                <Textarea
                  id="aboutUs"
                  value={formData.aboutUs}
                  onChange={(e) => onFieldChange('aboutUs', e.target.value)}
                  placeholder="Tell potential applicants about your company..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whoWeAreLookingFor">
                  Who We Are Looking For
                </Label>
                <Textarea
                  id="whoWeAreLookingFor"
                  value={formData.whoWeAreLookingFor}
                  onChange={(e) =>
                    onFieldChange('whoWeAreLookingFor', e.target.value)
                  }
                  placeholder="Describe the ideal candidates you're looking for..."
                  rows={4}
                />
              </div>
            </div>

            {error && Object.keys(fieldErrors).length === 0 && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
                <p className="font-medium text-destructive text-sm">
                  Error creating profile:
                </p>
                <p className="mt-1 whitespace-pre-line text-destructive text-sm">
                  {error}
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSaving}>
              <Plus className="mr-2 h-4 w-4" />
              {isSaving ? 'Creating...' : 'Create Company Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
