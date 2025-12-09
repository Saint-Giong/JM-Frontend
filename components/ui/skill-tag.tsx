'use client';

import { Badge } from '@saint-giong/bamboo-ui';
import { cn } from '@saint-giong/bamboo-ui/utils';

interface SkillTagProps {
  /** The skill name to display */
  skill: string;
  /** Whether the skill is selected */
  selected?: boolean;
  /** Callback when the tag is clicked */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * A reusable skill tag component that displays a skill with optional
 * selection state and click behavior.
 */
export function SkillTag({
  skill,
  selected = false,
  onClick,
  className,
}: SkillTagProps) {
  const isInteractive = !!onClick;

  return (
    <Badge
      variant={selected ? 'default' : 'outline'}
      className={cn(
        'transition-all',
        isInteractive && 'cursor-pointer',
        selected
          ? 'bg-primary hover:bg-primary/90'
          : 'bg-background hover:bg-accent',
        className
      )}
      onClick={onClick}
    >
      {skill}
    </Badge>
  );
}

interface SkillTagListProps {
  /** List of available skills */
  skills: string[];
  /** List of selected skills */
  selectedSkills?: string[];
  /** Callback when a skill is toggled */
  onToggle?: (skill: string) => void;
  /** Additional class names for the container */
  className?: string;
}

/**
 * A list of skill tags with optional multi-select functionality.
 */
export function SkillTagList({
  skills,
  selectedSkills = [],
  onToggle,
  className,
}: SkillTagListProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {skills.map((skill) => (
        <SkillTag
          key={skill}
          skill={skill}
          selected={selectedSkills.includes(skill)}
          onClick={onToggle ? () => onToggle(skill) : undefined}
        />
      ))}
    </div>
  );
}
