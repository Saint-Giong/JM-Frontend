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
} from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';
import {
  Filter,
  Globe,
  GraduationCap,
  Plus,
  Save,
  Tag,
  Wallet,
} from 'lucide-react';
import { availableSkills, educationLevels, employmentTypes } from './constants';
import type { SearchProfileFormData } from './use-subscription';

interface SearchProfileFormProps {
  formData: SearchProfileFormData;
  isSaving: boolean;
  onToggleSkill: (skill: string) => void;
  onToggleEmployment: (type: string) => void;
  onToggleEducation: (level: string) => void;
  onFieldChange: <K extends keyof SearchProfileFormData>(
    field: K,
    value: SearchProfileFormData[K]
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function SearchProfileForm({
  formData,
  isSaving,
  onToggleSkill,
  onToggleEmployment,
  onToggleEducation,
  onFieldChange,
  onSave,
  onCancel,
}: SearchProfileFormProps) {
  return (
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
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
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
                    formData.skills.includes(skill) ? 'default' : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    formData.skills.includes(skill)
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-background hover:bg-accent'
                  )}
                  onClick={() => onToggleSkill(skill)}
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
                    formData.employmentTypes.includes(type)
                      ? 'default'
                      : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    formData.employmentTypes.includes(type)
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-background hover:bg-accent'
                  )}
                  onClick={() => onToggleEmployment(type)}
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
            <Label className="flex items-center gap-2" htmlFor="country">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Country
            </Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => onFieldChange('country', e.target.value)}
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
                value={formData.minSalary}
                onChange={(e) => onFieldChange('minSalary', e.target.value)}
                placeholder="Min"
                className="bg-background"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                value={formData.maxSalary}
                onChange={(e) => onFieldChange('maxSalary', e.target.value)}
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
                    formData.education.includes(level) ? 'default' : 'outline'
                  }
                  className={cn(
                    'cursor-pointer transition-all',
                    formData.education.includes(level)
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-background hover:bg-accent'
                  )}
                  onClick={() => onToggleEducation(level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving || !formData.name.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
