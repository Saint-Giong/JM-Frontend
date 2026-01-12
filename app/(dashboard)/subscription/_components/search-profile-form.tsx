'use client';

import { SkillTagList } from '@/components/ui/skill-tag';
import {
  educationLevels,
  employmentTypes,
} from '@/mocks/subscription';
import type { SkillTag } from '@/lib/api/tag/tag.types';
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
} from '@saint-giong/bamboo-ui';
import {
  Filter,
  Globe,
  GraduationCap,
  Plus,
  Save,
  Tag,
  Wallet,
} from 'lucide-react';
import type { SearchProfileFormData } from './use-subscription';

interface SearchProfileFormProps {
  formData: SearchProfileFormData;
  isSaving: boolean;
  availableSkillTags: SkillTag[];
  onToggleSkill: (skillId: number) => void;
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
  availableSkillTags,
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
            <SkillTagList
              skills={availableSkillTags.map(tag => tag.name)}
              selectedSkills={availableSkillTags
                .filter(tag => formData.skillIds.includes(tag.id))
                .map(tag => tag.name)}
              onToggle={(skillName) => {
                const tag = availableSkillTags.find(t => t.name === skillName);
                if (tag) onToggleSkill(tag.id);
              }}
            />
          </div>

          {/* Employment Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Employment Status
            </Label>
            <SkillTagList
              skills={employmentTypes}
              selectedSkills={formData.employmentTypes}
              onToggle={onToggleEmployment}
            />
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
            <SkillTagList
              skills={educationLevels}
              selectedSkills={formData.education}
              onToggle={onToggleEducation}
            />
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
