'use client';

import { COMMON_SKILLS } from '@/lib/constants/skills';
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
  return (
    <Combobox multiple value={value} onValueChange={onValueChange}>
      <ComboboxTrigger
        className="w-full"
        placeholder={placeholder}
        displayValue={(v) => COMMON_SKILLS.find((s) => s === v)}
      />
      <ComboboxContent className="w-[--radix-popover-trigger-width]">
        <ComboboxInput placeholder="Search skills..." />
        <ComboboxList>
          <ComboboxEmpty>No skill found.</ComboboxEmpty>
          <ComboboxGroup>
            {COMMON_SKILLS.map((skill) => (
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
