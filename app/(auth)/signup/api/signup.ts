import { createCompany } from '@/lib/api';
import { createMockUser, isEmailTaken, type MockUser } from '@/mocks/users';
import { type SignupFormData, signupSchema } from './schema';

export type { SignupFormData };

export interface SignupResponse {
  success: boolean;
  user?: Omit<MockUser, 'password'>;
  error?: string;
}

/**
 * Register a new user and create their company profile
 *
 * Flow:
 * 1. Validate input data
 * 2. Check if email is taken
 * 3. Create company via API
 * 4. Create user with company ID
 */
export async function signup(data: SignupFormData): Promise<SignupResponse> {
  // Validate with Zod
  const validated = signupSchema.parse(data);

  await new Promise((resolve) => setTimeout(resolve, 300));

  if (isEmailTaken(validated.email)) {
    return {
      success: false,
      error: 'Email is already registered',
    };
  }

  // Create company via API
  let companyId: string | undefined;
  try {
    const company = await createCompany({
      name: validated.companyName,
      phone:
        validated.dialCode && validated.phoneNumber
          ? `${validated.dialCode}${validated.phoneNumber}`
          : undefined,
      address: validated.address,
      city: validated.city,
      country: validated.country,
    });
    companyId = company.id;
  } catch (error) {
    console.error('Failed to create company:', error);
    // Continue without company ID if API fails (graceful degradation)
    // In production, you might want to fail the signup instead
  }

  // Create user with company ID
  const newUser = createMockUser({
    email: validated.email,
    password: validated.password,
    companyId,
    companyName: validated.companyName,
    country: validated.country,
    dialCode: validated.dialCode,
    phoneNumber: validated.phoneNumber,
    city: validated.city,
    address: validated.address,
  });

  // Return user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    success: true,
    user: userWithoutPassword,
  };
}

/**
 * Register with Google OAuth
 * Creates a company for the Google user as well
 */
export async function signupWithGoogle(): Promise<SignupResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const userId = `google-${Date.now()}`;
  const email = `user${Date.now()}@gmail.com`;

  // Create company for Google user
  let companyId: string | undefined;
  try {
    const company = await createCompany({
      name: 'My Company', // Default name for Google users
      country: 'United States',
    });
    companyId = company.id;
  } catch (error) {
    console.error('Failed to create company for Google user:', error);
  }

  const googleUser: Omit<MockUser, 'password'> = {
    id: userId,
    email,
    companyId,
    companyName: 'My Company',
    country: 'United States',
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    user: googleUser,
  };
}
