'use client';

import { CountryPhoneRow } from '@/components/common/CountryPhoneRow';
import { FormInput } from '@/components/common/Form';

interface CompanyStepProps {
  companyName: string;
  companyNameError?: string;
  country: string;
  dialCode: string;
  phoneNumber: string;
  phoneError?: string;
  onCompanyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyNameBlur: () => void;
  onCountryNameChange: (name: string) => void;
  onDialCodeChange: (code: string) => void;
  onPhoneNumberChange: (num: string) => void;
}

export function CompanyStep({
  companyName,
  companyNameError,
  country,
  dialCode,
  phoneNumber,
  phoneError,
  onCompanyNameChange,
  onCompanyNameBlur,
  onCountryNameChange,
  onDialCodeChange,
  onPhoneNumberChange,
}: CompanyStepProps) {
  return (
    <>
      {/* Company Name */}
      <FormInput
        label="Company Name"
        name="companyName"
        type="text"
        placeholder="Your company name"
        required
        value={companyName}
        onChange={onCompanyNameChange}
        onBlur={onCompanyNameBlur}
        error={companyNameError}
      />

      {/* Country and Phone */}
      <CountryPhoneRow
        countryValue={country}
        dialCode={dialCode}
        phoneNumber={phoneNumber}
        phoneError={phoneError}
        onCountryNameChange={onCountryNameChange}
        onDialCodeChange={onDialCodeChange}
        onPhoneNumberChange={onPhoneNumberChange}
      />
    </>
  );
}
