'use client';

import type {
  EducationDegree,
  EmploymentType,
  LocationFilter,
  WorkExperienceFilter,
} from '@/components/applicant/types';
import {
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from '@/components/applicant/types';
import { SkillCombobox } from '@/components/ui/skill-combobox';
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@saint-giong/bamboo-ui';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
  fullTextSearch: string;
  onFullTextSearchChange: (value: string) => void;
  location?: LocationFilter;
  onLocationChange: (location: LocationFilter | undefined) => void;
  education: EducationDegree[];
  onEducationChange: (education: EducationDegree[]) => void;
  workExperience: WorkExperienceFilter;
  onWorkExperienceChange: (workExperience: WorkExperienceFilter) => void;
  employmentTypes: EmploymentType[];
  onEmploymentTypesChange: (types: EmploymentType[]) => void;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onSearch: () => void;
}

const LOCATION_OPTIONS = [
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'United States', label: 'United States' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Australia', label: 'Australia' },
];

const CITY_OPTIONS = [
  { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
  { value: 'Hanoi', label: 'Hanoi' },
  { value: 'Da Nang', label: 'Da Nang' },
  { value: 'New York', label: 'New York' },
  { value: 'Tokyo', label: 'Tokyo' },
];

export function SearchFilters({
  fullTextSearch,
  onFullTextSearchChange,
  location,
  onLocationChange,
  education,
  onEducationChange,
  workExperience,
  onWorkExperienceChange,
  employmentTypes,
  onEmploymentTypesChange,
  skills,
  onSkillsChange,
  onSearch,
}: SearchFiltersProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workExpKeyword, setWorkExpKeyword] = useState(
    workExperience.type === 'keyword' ? workExperience.value || '' : ''
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  const handleLocationTypeChange = (type: 'city' | 'country') => {
    onLocationChange({ type, value: '' });
  };

  const handleLocationValueChange = (value: string) => {
    if (location) {
      onLocationChange({ ...location, value });
    } else {
      onLocationChange({ type: 'country', value });
    }
  };

  const handleEducationToggle = (degree: EducationDegree) => {
    if (education.includes(degree)) {
      onEducationChange(education.filter((d) => d !== degree));
    } else {
      onEducationChange([...education, degree]);
    }
  };

  const handleWorkExpTypeChange = (type: 'none' | 'any' | 'keyword') => {
    if (type === 'keyword') {
      onWorkExperienceChange({ type, value: workExpKeyword });
    } else {
      onWorkExperienceChange({ type });
    }
  };

  const handleWorkExpKeywordChange = (value: string) => {
    setWorkExpKeyword(value);
    if (workExperience.type === 'keyword') {
      onWorkExperienceChange({ type: 'keyword', value });
    }
  };

  const handleEmploymentTypeToggle = (type: EmploymentType) => {
    if (employmentTypes.includes(type)) {
      onEmploymentTypesChange(employmentTypes.filter((t) => t !== type));
    } else {
      onEmploymentTypesChange([...employmentTypes, type]);
    }
  };

  const clearAllFilters = () => {
    onLocationChange(undefined);
    onEducationChange([]);
    onWorkExperienceChange({ type: 'any' });
    onEmploymentTypesChange([]);
    onSkillsChange([]);
  };

  // Build filter summary chips
  const filterChips: { label: string; onRemove: () => void }[] = [];

  if (location?.value) {
    filterChips.push({
      label: `${location.type === 'city' ? 'City' : 'Country'}: ${location.value}`,
      onRemove: () => onLocationChange(undefined),
    });
  }

  education.forEach((edu) => {
    const label = EDUCATION_OPTIONS.find((o) => o.value === edu)?.label || edu;
    filterChips.push({
      label,
      onRemove: () => onEducationChange(education.filter((e) => e !== edu)),
    });
  });

  if (workExperience.type === 'none') {
    filterChips.push({
      label: 'No experience',
      onRemove: () => onWorkExperienceChange({ type: 'any' }),
    });
  } else if (workExperience.type === 'keyword' && workExperience.value) {
    filterChips.push({
      label: `Exp: "${workExperience.value}"`,
      onRemove: () => onWorkExperienceChange({ type: 'any' }),
    });
  }

  employmentTypes.forEach((type) => {
    const label =
      EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === type)?.label || type;
    filterChips.push({
      label,
      onRemove: () =>
        onEmploymentTypesChange(employmentTypes.filter((t) => t !== type)),
    });
  });

  skills.forEach((skill) => {
    filterChips.push({
      label: skill,
      onRemove: () => onSkillsChange(skills.filter((s) => s !== skill)),
    });
  });

  const hasActiveFilters = filterChips.length > 0;

  return (
    <div className="border-b px-4 py-3 sm:px-6">
      {/* Search row */}
      <div className="flex gap-2">
        <Input
          placeholder="Search keywords..."
          className="flex-1"
          value={fullTextSearch}
          onChange={(e) => onFullTextSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Filter Dialog Trigger */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shrink-0 gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {filterChips.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Search Filters</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              {/* Skills */}
              <div className="space-y-2">
                <Label className="font-medium">Skills</Label>
                <SkillCombobox
                  value={skills}
                  onValueChange={onSkillsChange}
                  placeholder="Add skills..."
                />
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            onSkillsChange(skills.filter((s) => s !== skill))
                          }
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label className="font-medium">Location</Label>
                <RadioGroup
                  value={location?.type || 'country'}
                  onValueChange={(v) =>
                    handleLocationTypeChange(v as 'city' | 'country')
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="country" id="loc-country" />
                    <Label htmlFor="loc-country" className="cursor-pointer">
                      Country
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="city" id="loc-city" />
                    <Label htmlFor="loc-city" className="cursor-pointer">
                      City
                    </Label>
                  </div>
                </RadioGroup>
                <Select
                  value={location?.value || ''}
                  onValueChange={handleLocationValueChange}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        location?.type === 'city'
                          ? 'Select city...'
                          : 'Select country...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(location?.type === 'city'
                      ? CITY_OPTIONS
                      : LOCATION_OPTIONS
                    ).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <Label className="font-medium">Education Level</Label>
                <div className="flex flex-wrap gap-4">
                  {EDUCATION_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`edu-${opt.value}`}
                        checked={education.includes(opt.value)}
                        onCheckedChange={() => handleEducationToggle(opt.value)}
                      />
                      <Label
                        htmlFor={`edu-${opt.value}`}
                        className="cursor-pointer"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <Label className="font-medium">Work Experience</Label>
                <RadioGroup
                  value={workExperience.type}
                  onValueChange={(v) =>
                    handleWorkExpTypeChange(v as 'none' | 'any' | 'keyword')
                  }
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="any" id="exp-any" />
                    <Label htmlFor="exp-any" className="cursor-pointer">
                      Any
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="none" id="exp-none" />
                    <Label htmlFor="exp-none" className="cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="keyword" id="exp-keyword" />
                    <Label htmlFor="exp-keyword" className="cursor-pointer">
                      Keyword
                    </Label>
                  </div>
                </RadioGroup>
                {workExperience.type === 'keyword' && (
                  <Input
                    placeholder="e.g. software engineer"
                    value={workExpKeyword}
                    onChange={(e) => handleWorkExpKeywordChange(e.target.value)}
                  />
                )}
              </div>

              {/* Employment Types */}
              <div className="space-y-3">
                <Label className="font-medium">Employment Types</Label>
                <div className="flex flex-wrap gap-4">
                  {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`emp-${opt.value}`}
                        checked={employmentTypes.includes(opt.value)}
                        onCheckedChange={() =>
                          handleEmploymentTypeToggle(opt.value)
                        }
                      />
                      <Label
                        htmlFor={`emp-${opt.value}`}
                        className="cursor-pointer"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setDialogOpen(false);
                    onSearch();
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={onSearch} size="icon" className="shrink-0 sm:hidden">
          <Search className="h-4 w-4" />
        </Button>
        <Button onClick={onSearch} className="hidden shrink-0 sm:flex">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-muted-foreground text-xs">Active:</span>
          {filterChips.map((chip, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 py-0.5 text-xs"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-muted-foreground text-xs hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
