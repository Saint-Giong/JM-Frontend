'use client';

import { COMMON_SKILLS } from '@/lib/constants/skills';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@saint-giong/bamboo-ui';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface SkillComboboxProps {
  selectedSkills: string[];
  onSelectSkill: (skill: string) => void;
  placeholder?: string;
}

export function SkillCombobox({
  selectedSkills,
  onSelectSkill,
  placeholder = 'Search skills...',
}: SkillComboboxProps) {
  const [open, setOpen] = useState(false);

  const availableSkills = COMMON_SKILLS.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search skills..." className="h-9" />
          <CommandList>
            <CommandEmpty>No skill found.</CommandEmpty>
            <CommandGroup>
              {availableSkills.map((skill) => (
                <CommandItem
                  key={skill}
                  value={skill}
                  onSelect={(currentValue) => {
                    onSelectSkill(currentValue);
                    setOpen(false);
                  }}
                >
                  {skill}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
