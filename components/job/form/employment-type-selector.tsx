'use client';

import {
  Checkbox,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@saint-giong/bamboo-ui';
import type { EmploymentType } from '@/components/applicant/types';

interface EmploymentTypeSelectorProps {
  value: EmploymentType[];
  onChange: (types: EmploymentType[]) => void;
  error?: string;
}

export function EmploymentTypeSelector({
  value,
  onChange,
  error,
}: EmploymentTypeSelectorProps) {
  // Get current working hours selection (full-time or part-time)
  const workingHours = value.find(
    (t) => t === 'full-time' || t === 'part-time'
  );

  // Handle working hours change (mutually exclusive)
  const handleWorkingHoursChange = (type: 'full-time' | 'part-time') => {
    // Remove any existing working hours type and add the new one
    const filtered = value.filter(
      (t) => t !== 'full-time' && t !== 'part-time'
    );
    onChange([...filtered, type]);
  };

  // Handle position type toggle (internship, contract - can coexist)
  const handlePositionTypeToggle = (type: 'internship' | 'contract') => {
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Working Hours - Mutually Exclusive */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Working Hours</Label>
        <RadioGroup
          value={workingHours || ''}
          onValueChange={(v) =>
            handleWorkingHoursChange(v as 'full-time' | 'part-time')
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full-time" id="full-time" />
            <Label htmlFor="full-time" className="cursor-pointer font-normal">
              Full-time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="part-time" id="part-time" />
            <Label htmlFor="part-time" className="cursor-pointer font-normal">
              Part-time
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Position Type - Can Coexist */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Position Type (Optional)</Label>
        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internship"
              checked={value.includes('internship')}
              onCheckedChange={() => handlePositionTypeToggle('internship')}
            />
            <Label htmlFor="internship" className="cursor-pointer font-normal">
              Internship
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contract"
              checked={value.includes('contract')}
              onCheckedChange={() => handlePositionTypeToggle('contract')}
            />
            <Label htmlFor="contract" className="cursor-pointer font-normal">
              Contract
            </Label>
          </div>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
