import { signupSchema, type SignupFormData } from './schema';

export type { SignupFormData };

export async function signup(data: SignupFormData) {
    // Validate with Zod
    const validated = signupSchema.parse(data);

    // TODO: Implement signup API call
    console.log('Signup with:', validated);
    return null;
}

export async function signupWithGoogle() {
    // TODO: Implement Google OAuth signup
    return null;
}
