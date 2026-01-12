'use client';

import {
  Badge,
  Button,
  Input,
  Label,
  Separator,
  Textarea,
} from '@saint-giong/bamboo-ui';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { SkillCombobox } from '@/components/ui/skill-combobox';
import type { JobFormData } from '../types';
import { EmploymentTypeSelector } from './employment-type-selector';
import { SalaryFormatSelector } from './salary-format-selector';
import { useJobForm } from './use-job-form';

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => void | Promise<void>;
  onSaveDraft?: (data: JobFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  saveDraftLabel?: string;
  isLoading?: boolean;
  isSavingDraft?: boolean;
}

export function JobForm({
  initialData,
  onSubmit,
  onSaveDraft,
  onCancel,
  submitLabel = 'Save',
  saveDraftLabel = 'Save as Draft',
  isLoading = false,
  isSavingDraft = false,
}: JobFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    setTitle,
    setDescription,
    setEmploymentTypes,
    setSalary,
    setLocation,
    setSkills,
    setExpiryDate,
    handleSubmit,
  } = useJobForm({
    initialData,
    onSubmit,
  });

  const handleRemoveSkill = (skill: string) => {
    setSkills(formData.skills.filter((s) => s !== skill));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const submitting = isSubmitting || isLoading || isSavingDraft;

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium text-sm">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Senior Full-Stack Developer"
          value={formData.title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium text-sm">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the job responsibilities, requirements, and benefits..."
          value={formData.description}
          onChange={(e) => setDescription(e.target.value)}
          className={`min-h-[200px] ${errors.description ? 'border-destructive' : ''}`}
        />
        {errors.description && (
          <p className="text-destructive text-sm">{errors.description}</p>
        )}
      </div>

      <Separator />

      {/* Employment Type */}
      <EmploymentTypeSelector
        value={formData.employmentTypes}
        onChange={setEmploymentTypes}
        error={errors.employmentTypes}
      />

      <Separator />

      {/* Salary */}
      <SalaryFormatSelector
        value={formData.salary}
        onChange={setSalary}
        error={errors.salary}
      />

      <Separator />

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="font-medium text-sm">
          Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          placeholder="e.g., Ho Chi Minh City, Vietnam"
          value={formData.location}
          onChange={(e) => setLocation(e.target.value)}
          className={errors.location ? 'border-destructive' : ''}
        />
        {errors.location && (
          <p className="text-destructive text-sm">{errors.location}</p>
        )}
      </div>

      <Separator />

      {/* Skills */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Technical Skills</Label>
        <SkillCombobox value={formData.skills} onValueChange={setSkills} />

        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Expiry Date */}
      <div className="space-y-2">
        <Label htmlFor="expiryDate" className="font-medium text-sm">
          Expiry Date (Optional)
        </Label>
        <div className="relative">
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate || ''}
            onChange={(e) => setExpiryDate(e.target.value || undefined)}
            className="pr-10"
          />
          <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-xs">
          Leave empty for no expiry date
        </p>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        {onSaveDraft && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            {isSavingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveDraftLabel}
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
