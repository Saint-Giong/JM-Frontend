'use client';

import { CountryCombobox } from '@/components/ui/country-combobox';
import { SkillCombobox } from '@/components/ui/skill-combobox';
import {
  type ApplicantSearchFilters,
  COMMON_SKILLS,
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  type EducationDegree,
  type EmploymentType,
  type LocationFilter,
  type SalaryRange,
  type WorkExperienceFilter,
} from './types';
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@saint-giong/bamboo-ui';
import { RotateCcw, Search, X } from 'lucide-react';

interface ApplicantSearchFiltersProps {
  filters: ApplicantSearchFilters;
  onLocationChange: (location: LocationFilter | undefined) => void;
  onEducationChange: (education: EducationDegree[]) => void;
  onWorkExperienceChange: (workExperience: WorkExperienceFilter) => void;
  onEmploymentTypesChange: (types: EmploymentType[]) => void;
  onSkillsChange: (skills: string[]) => void;
  onFullTextSearchChange: (search: string) => void;
  onSalaryRangeChange?: (salaryRange: SalaryRange | undefined) => void;
  onReset: () => void;
}

export function ApplicantSearchFiltersPanel({
  filters,
  onLocationChange,
  onEducationChange,
  onWorkExperienceChange,
  onEmploymentTypesChange,
  onSkillsChange,
  onFullTextSearchChange,
  onSalaryRangeChange,
  onReset,
}: ApplicantSearchFiltersProps) {
  const handleEducationToggle = (degree: EducationDegree) => {
    const newEducation = filters.education.includes(degree)
      ? filters.education.filter((d) => d !== degree)
      : [...filters.education, degree];
    onEducationChange(newEducation);
  };

  const handleEmploymentTypeToggle = (type: EmploymentType) => {
    const newTypes = filters.employmentTypes.includes(type)
      ? filters.employmentTypes.filter((t) => t !== type)
      : [...filters.employmentTypes, type];
    onEmploymentTypesChange(newTypes);
  };

  const handleRemoveSkill = (skill: string) => {
    onSkillsChange(filters.skills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-6">
      {/* Full-text Search */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Full-text Search</Label>
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills, experience, summary..."
            className="pl-10"
            value={filters.fullTextSearch}
            onChange={(e) => onFullTextSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Location</Label>
        <RadioGroup
          value={filters.location?.type || 'country'}
          onValueChange={(value) =>
            onLocationChange({
              type: value as 'city' | 'country',
              value: '',
            })
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="country" id="country" />
            <Label htmlFor="country" className="font-normal">
              Country
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="city" id="city" />
            <Label htmlFor="city" className="font-normal">
              City
            </Label>
          </div>
        </RadioGroup>
        {filters.location?.type === 'city' ? (
          <Input
            placeholder="Enter city name..."
            value={filters.location?.value || ''}
            onChange={(e) =>
              onLocationChange({
                type: 'city',
                value: e.target.value,
              })
            }
          />
        ) : (
          <CountryCombobox
            value={filters.location?.value}
            onValueChange={(value) =>
              onLocationChange({
                type: 'country',
                value,
              })
            }
          />
        )}
      </div>

      {/* Education */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Education</Label>
        <div className="space-y-2">
          {EDUCATION_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={filters.education.includes(option.value)}
                onCheckedChange={() => handleEducationToggle(option.value)}
              />
              <Label htmlFor={option.value} className="font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Work Experience</Label>
        <RadioGroup
          value={filters.workExperience.type}
          onValueChange={(value) =>
            onWorkExperienceChange({
              type: value as 'none' | 'any' | 'keyword',
              value:
                value === 'keyword' ? filters.workExperience.value : undefined,
            })
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="exp-any" />
            <Label htmlFor="exp-any" className="font-normal">
              Any
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="exp-none" />
            <Label htmlFor="exp-none" className="font-normal">
              No experience
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="keyword" id="exp-keyword" />
            <Label htmlFor="exp-keyword" className="font-normal">
              Keyword search
            </Label>
          </div>
        </RadioGroup>
        {filters.workExperience.type === 'keyword' && (
          <Input
            placeholder="e.g., software engineer"
            value={filters.workExperience.value || ''}
            onChange={(e) =>
              onWorkExperienceChange({
                type: 'keyword',
                value: e.target.value,
              })
            }
          />
        )}
      </div>

      {/* Employment Types */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Employment Types</Label>
        <div className="space-y-2">
          {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={filters.employmentTypes.includes(option.value)}
                onCheckedChange={() => handleEmploymentTypeToggle(option.value)}
              />
              <Label htmlFor={option.value} className="font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">
          Technical Skills (OR logic)
        </Label>
        <SkillCombobox value={filters.skills} onValueChange={onSkillsChange} />

        {/* Selected Skills */}
        {filters.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.skills.map((skill) => (
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

        {/* Common Skills */}
        <div className="space-y-2">
          <span className="text-muted-foreground text-xs">Popular skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SKILLS.slice(0, 12).map((skill) => (
              <Badge
                key={skill}
                variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() =>
                  filters.skills.includes(skill)
                    ? onSkillsChange(filters.skills.filter((s) => s !== skill))
                    : onSkillsChange([...filters.skills, skill])
                }
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Range */}
      {onSalaryRangeChange && (
        <div className="space-y-3">
          <Label className="font-medium text-sm">Salary Range (USD)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.salaryRange?.min || ''}
              onChange={(e) =>
                onSalaryRangeChange({
                  ...filters.salaryRange,
                  min: e.target.value ? Number(e.target.value) : undefined,
                  currency: 'USD',
                })
              }
              className="flex-1"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.salaryRange?.max || ''}
              onChange={(e) =>
                onSalaryRangeChange({
                  ...filters.salaryRange,
                  max: e.target.value ? Number(e.target.value) : undefined,
                  currency: 'USD',
                })
              }
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Reset */}
      <Button variant="outline" className="w-full" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
}
