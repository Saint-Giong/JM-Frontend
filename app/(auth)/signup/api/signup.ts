import { createMockUser, isEmailTaken, type MockUser } from '@/mocks/users';
import { type SignupFormData, signupSchema } from './schema';

export type { SignupFormData };

export interface SignupResponse {
  success: boolean;
  user?: Omit<MockUser, 'password'>;
  error?: string;
}

export async function signup(data: SignupFormData): Promise<SignupResponse> {
  // Validate with Zod
  const validated = signupSchema.parse(data);

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (isEmailTaken(validated.email)) {
    return {
      success: false,
      error: 'Email is already registered',
    };
  }

  // create
  const newUser = createMockUser({
    email: validated.email,
    password: validated.password,
    companyName: validated.companyName,
    country: validated.country,
    dialCode: validated.dialCode,
    phoneNumber: validated.phoneNumber,
    city: validated.city,
    address: validated.address,
  });

  // return without pass
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    success: true,
    user: userWithoutPassword,
  };
}

export async function signupWithGoogle(): Promise<SignupResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock
  const googleUser: Omit<MockUser, 'password'> = {
    id: `google-${Date.now()}`,
    email: `user${Date.now()}@gmail.com`,
    companyName: '',
    country: 'United States',
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    user: googleUser,
  };
}
