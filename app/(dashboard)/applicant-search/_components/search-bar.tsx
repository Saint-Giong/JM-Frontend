'use client';

import { Badge, Button, Input } from '@saint-giong/bamboo-ui';
import { Search, X } from 'lucide-react';
import { SkillCombobox } from '@/components/ui/skill-combobox';

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
    <div className="flex flex-col gap-3 border-b px-4 py-3 sm:px-6 sm:py-4 md:h-[4.375rem] md:flex-row md:items-center md:gap-4">
      {/* Job Title Search */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          Job title
        </span>
        <Input
          placeholder="Search"
          className="w-full sm:w-48"
          value={jobTitleSearch}
          onChange={(e) => setJobTitleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Skill Tags */}
      <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          Skill tags
        </span>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="w-full sm:w-48">
            <SkillCombobox
              value={skills}
              onValueChange={onSkillsChange}
              placeholder="Search..."
            />
          </div>

          {/* Selected Skills */}
          {skills.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Search Button */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const { wsClient } = require('@/lib/realtime/ws-client');
            wsClient.getSocket()?.emit('test:notification');
          }}
          className="w-full sm:w-auto"
        >
          Test Noti
        </Button>
        <Button onClick={onSearch} className="w-full sm:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
