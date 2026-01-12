'use client';

import { useSkillTagsQuery } from '@/hooks/use-skill-tags';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@saint-giong/bamboo-ui';
import { useMemo } from 'react';

interface SkillComboboxProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
}

export function SkillCombobox({
  value,
  onValueChange,
  placeholder = 'Search skills...',
}: SkillComboboxProps) {
  // Fetch all skills from the backend API
  const { data: skillTagPage, isLoading } = useSkillTagsQuery(
    { page: 0, size: 100 },
    { staleTime: 5 * 60 * 1000 } // Cache for 5 minutes
  );

  // Extract skill names from API response
  const skills = useMemo(() => {
    return skillTagPage?.content.map((tag) => tag.name) ?? [];
  }, [skillTagPage]);

  return (
    <Combobox multiple value={value} onValueChange={onValueChange}>
      <ComboboxTrigger
        className="w-full"
        placeholder={placeholder}
        displayValue={(v) => skills.find((s) => s === v)}
      />
      <ComboboxContent className="w-[--radix-popover-trigger-width]">
        <ComboboxInput placeholder="Search skills..." />
        <ComboboxList>
          <ComboboxEmpty>
            {isLoading ? 'Loading skills...' : 'No skill found.'}
          </ComboboxEmpty>
          <ComboboxGroup>
            {skills.map((skill) => (
              <ComboboxItem key={skill} value={skill}>
                {skill}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
