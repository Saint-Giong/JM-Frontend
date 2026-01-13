'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ScrollArea,
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
      <ComboboxContent className="w-[--radix-popover-trigger-width] p-0">
        <ComboboxInput placeholder="Search country..." />
        <ScrollArea className="h-[300px]">
          <ComboboxList className="p-0">
            <ComboboxEmpty>No country found.</ComboboxEmpty>
            {countries.map((country) => (
              <ComboboxItem key={country.name} value={country.name}>
                {country.name}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ScrollArea>
      </ComboboxContent>
    </Combobox>
  );
}
