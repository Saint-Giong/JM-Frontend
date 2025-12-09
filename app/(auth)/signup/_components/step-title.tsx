'use client';

import { FormHeader } from '@/components/common/Form';

const subtitles: Record<string, string | ((email?: string) => string)> = {
  Account: 'Set up your login credentials.',
  Company: 'Tell us about your company.',
  Location: 'Where is your company located?',
  Verify: (email?: string) =>
    `We've sent a verification code to ${email || 'your email'}.`,
};

interface StepTitleProps {
  title: string;
  email?: string;
}

export function StepTitle({ title, email }: StepTitleProps) {
  const subtitleValue = subtitles[title];
  const subtitle =
    typeof subtitleValue === 'function' ? subtitleValue(email) : subtitleValue;

  return <FormHeader title={title} subtitle={subtitle} />;
}
