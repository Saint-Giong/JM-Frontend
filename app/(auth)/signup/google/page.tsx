import type { Metadata } from 'next';
import GoogleSignupForm from './_components/GoogleSignupForm';

export const metadata: Metadata = {
  title: 'Complete Signup',
  description: 'Complete your company registration with Google',
};

export default function GoogleSignupPage() {
  return <GoogleSignupForm />;
}
