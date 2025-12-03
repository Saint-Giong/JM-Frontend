import { loginSchema, type LoginFormData } from './schema';

export async function login(data: LoginFormData) {
    // Validate with Zod
    const validated = loginSchema.parse(data);
    
    // TODO: Implement login API call
    console.log('Login with:', validated);
    return null;
}

export async function loginWithGoogle() {
    // TODO: Implement Google OAuth2.0 login API call
    return null;
}
