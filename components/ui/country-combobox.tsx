'use client';

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
import { countries } from '@/lib/constants/countries';

interface CountryComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CountryCombobox({
  value,
  onValueChange,
  placeholder = 'Select country...',
}: CountryComboboxProps) {
  return (
    <Combobox value={value} onValueChange={onValueChange}>
      <ComboboxTrigger
        className="w-full"
        placeholder={placeholder}
        displayValue={(v) => v}
      />
      <ComboboxContent className="w-[--radix-popover-trigger-width]">
        <ComboboxInput placeholder="Search country..." />
        <ComboboxList className="max-h-[300px] overflow-y-auto">
          <ComboboxEmpty>No country found.</ComboboxEmpty>
          <ComboboxGroup>
            {countries.map((country) => (
              <ComboboxItem key={country.name} value={country.name}>
                {country.name}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
