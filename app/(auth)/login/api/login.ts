import { validateCredentials, type MockUser } from '@/mocks/users';
import type { LoginFormData } from './schema';

export interface LoginResponse {
    success: boolean;
    user?: Omit<MockUser, 'password'>;
    error?: string;
}

export async function login(data: LoginFormData): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // validate credentials
    const user = validateCredentials(data.email, data.password);

    if (!user) {
        return {
            success: false,
            error: 'Email or password is incorrect',
        };
    }

    // return user without pass
    const { password: _, ...userWithoutPassword } = user;

    return {
        success: true,
        user: userWithoutPassword,
    };
}

export async function loginWithGoogle(): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock Google user
    return {
        success: true,
        user: {
            id: 'google-1',
            email: 'google.user@gmail.com',
            companyName: 'Google User',
            country: 'United States',
            dialCode: '+1',
            createdAt: new Date().toISOString(),
        },
    };
}
