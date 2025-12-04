'use client';

import { SkillCombobox } from '@/components/ui/skill-combobox';
import { Badge, Button, Input } from '@saint-giong/bamboo-ui';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  jobTitleSearch: string;
  setJobTitleSearch: (value: string) => void;
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  onSearch: () => void;
}

export function SearchBar({
  jobTitleSearch,
  setJobTitleSearch,
  skills,
  onSkillsChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="flex h-[4.375rem] items-center gap-4 border-b px-6 py-4">
      {/* Job Title Search */}
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          Job title
        </span>
        <Input
          placeholder="Search"
          className="w-48"
          value={jobTitleSearch}
          onChange={(e) => setJobTitleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Skill Tags */}
      <div className="flex flex-1 items-center gap-2">
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          Skill tags
        </span>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-48">
            <SkillCombobox
              value={skills}
              onValueChange={onSkillsChange}
              placeholder="Search..."
            />
          </div>

          {/* Selected Skills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    onSkillsChange(skills.filter((s) => s !== skill))
                  }
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button onClick={onSearch}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
}
