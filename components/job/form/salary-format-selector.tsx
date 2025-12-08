'use client';

import type {
  EstimationType,
  JobSalary,
  JobSalaryEstimation,
  JobSalaryNegotiable,
  JobSalaryRange,
} from '../types';
import { CURRENCY_OPTIONS, ESTIMATION_TYPE_OPTIONS } from '../types';
import {
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@saint-giong/bamboo-ui';

interface SalaryFormatSelectorProps {
  value: JobSalary;
  onChange: (salary: JobSalary) => void;
  error?: string;
}

export function SalaryFormatSelector({
  value,
  onChange,
  error,
}: SalaryFormatSelectorProps) {
  const handleTypeChange = (type: 'range' | 'estimation' | 'negotiable') => {
    switch (type) {
      case 'range':
        onChange({
          type: 'range',
          min: 0,
          max: 0,
          currency: 'USD',
        } as JobSalaryRange);
        break;
      case 'estimation':
        onChange({
          type: 'estimation',
          estimationType: 'about',
          amount: 0,
          currency: 'USD',
        } as JobSalaryEstimation);
        break;
      case 'negotiable':
        onChange({ type: 'negotiable' } as JobSalaryNegotiable);
        break;
    }
  };

  const handleRangeChange = (field: 'min' | 'max', val: string) => {
    if (value.type !== 'range') return;
    onChange({
      ...value,
      [field]: val ? Number(val) : 0,
    });
  };

  const handleEstimationChange = (
    field: 'estimationType' | 'amount',
    val: string
  ) => {
    if (value.type !== 'estimation') return;
    if (field === 'estimationType') {
      onChange({
        ...value,
        estimationType: val as EstimationType,
      });
    } else {
      onChange({
        ...value,
        amount: val ? Number(val) : 0,
      });
    }
  };

  const handleCurrencyChange = (currency: string) => {
    if (value.type === 'negotiable') return;
    onChange({
      ...value,
      currency,
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Salary</Label>

      <RadioGroup
        value={value.type}
        onValueChange={(v) =>
          handleTypeChange(v as 'range' | 'estimation' | 'negotiable')
        }
        className="space-y-4"
      >
        {/* Range Option */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="range" id="salary-range" />
            <Label
              htmlFor="salary-range"
              className="font-normal cursor-pointer"
            >
              Range
            </Label>
          </div>
          {value.type === 'range' && (
            <div className="ml-6 flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={value.min || ''}
                onChange={(e) => handleRangeChange('min', e.target.value)}
                className="w-28"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={value.max || ''}
                onChange={(e) => handleRangeChange('max', e.target.value)}
                className="w-28"
              />
              <Select
                value={value.currency}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Estimation Option */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="estimation" id="salary-estimation" />
            <Label
              htmlFor="salary-estimation"
              className="font-normal cursor-pointer"
            >
              Estimation
            </Label>
          </div>
          {value.type === 'estimation' && (
            <div className="ml-6 flex items-center gap-2">
              <Select
                value={value.estimationType}
                onValueChange={(v) =>
                  handleEstimationChange('estimationType', v)
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTIMATION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={value.amount || ''}
                onChange={(e) =>
                  handleEstimationChange('amount', e.target.value)
                }
                className="w-28"
              />
              <Select
                value={value.currency}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Negotiable Option */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="negotiable" id="salary-negotiable" />
          <Label
            htmlFor="salary-negotiable"
            className="font-normal cursor-pointer"
          >
            Negotiable
          </Label>
        </div>
      </RadioGroup>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
