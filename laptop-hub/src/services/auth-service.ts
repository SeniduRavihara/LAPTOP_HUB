import { withTimeout } from "@/lib/utils/timeout";

/**
 * AuthService
 * Handles all core authentication operations using the provided Supabase client.
 * Environment-agnostic: works in both Client and Server components.
 */
export class AuthService {
    /**
     * Standard sign in with email and password
     */
    static async signIn(supabase: any, email: string, password: string) {
        return withTimeout(
            () => supabase.auth.signInWithPassword({
                email,
                password,
            }).then(({ data, error }: any) => {
                if (error) throw error;
                return data;
            }),
            60000,
            "Sign-in timed out. Please try again."
        );
    }

    /**
     * OAuth sign in with Google
     */
    static async signInWithGoogle(supabase: any) {
        return withTimeout(
            () => supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            }).then(({ data, error }: any) => {
                if (error) throw error;
                return data;
            }),
            20000,
            "Google sign-in timed out."
        );
    }

    /**
     * Standard sign up with email, password, and optional metadata
     */
    static async signUp(supabase: any, email: string, password: string, metadata?: any) {
        return withTimeout(
            () => supabase.auth.signUp({
                email,
                password,
                options: metadata ? { data: metadata } : undefined,
            }).then(({ data, error }: any) => {
                if (error) throw error;
                return data;
            }),
            60000,
            "Sign-up timed out. Please check your connection."
        );
    }

    /**
     * Signs out the current user
     */
    static async signOut(supabase: any) {
        return withTimeout(
            () => supabase.auth.signOut().then(({ error }: any) => {
                if (error) throw error;
            }),
            15000,
            "Sign-out timed out."
        );
    }

    /**
     * Fetches the current active session
     */
    static async getSession(supabase: any) {
        return withTimeout(
            () => supabase.auth.getSession().then(({ data: { session }, error }: any) => {
                if (error) throw error;
                return session;
            }),
            20000,
            "Session fetch timed out."
        );
    }

    /**
     * Sets up a listener for auth state changes
     * Returns an unsubscribe function
     */
    static onAuthStateChange(supabase: any, callback: (event: any, session: any) => void) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
        return subscription;
    }

    /**
     * Fetches the current user details
     */
    static async getUser(supabase: any) {
        return withTimeout(
            () => supabase.auth.getUser().then(({ data: { user }, error }: any) => {
                if (error) throw error;
                return user;
            }),
            20000,
            "User fetch timed out."
        );
    }

    /**
     * Exchanges an auth code for a session
     */
    static async exchangeCodeForSession(supabase: any, code: string) {
        return withTimeout(
            () => supabase.auth.exchangeCodeForSession(code).then(({ data, error }: any) => {
                if (error) throw error;
                return data;
            }),
            20000,
            "Auth code exchange timed out."
        );
    }
}
