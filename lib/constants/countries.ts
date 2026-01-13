import countriesData from '../../public/countries.json';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  shardId: number;
}

export const countries: Country[] = countriesData as Country[];

export function filterCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) || c.dialCode.includes(query)
  );
}
