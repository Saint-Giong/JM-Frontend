import type { Metadata } from 'next';
import VerifyForm from './_components/VerifyForm';

export const metadata: Metadata = {
  title: 'Verify Account',
};

export default function VerifyPage() {
  return <VerifyForm />;
}
