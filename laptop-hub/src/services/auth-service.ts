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
            (async () => {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                return data;
            })(),
            20000,
            "Sign-in timed out. Please try again."
        );
    }

    /**
     * OAuth sign in with Google
     */
    static async signInWithGoogle(supabase: any) {
        // Sign in with OAuth usually redirects, so timeout might not be useful here
        // but let's wrap the initial call anyway
        return withTimeout(
            (async () => {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                return data;
            })(),
            15000,
            "Google sign-in timed out."
        );
    }

    /**
     * Standard sign up with email, password, and optional metadata
     */
    static async signUp(supabase: any, email: string, password: string, metadata?: any) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: metadata ? { data: metadata } : undefined,
                });
                if (error) throw error;
                return data;
            })(),
            20000,
            "Sign-up timed out. Please check your connection."
        );
    }

    /**
     * Signs out the current user
     */
    static async signOut(supabase: any) {
        return withTimeout(
            (async () => {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
            })(),
            10000,
            "Sign-out timed out."
        );
    }

    /**
     * Fetches the current active session
     */
    static async getSession(supabase: any) {
        return withTimeout(
            (async () => {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                return session;
            })(),
            10000,
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
            (async () => {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                return user;
            })(),
            10000,
            "User fetch timed out."
        );
    }

    /**
     * Exchanges an auth code for a session
     */
    static async exchangeCodeForSession(supabase: any, code: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) throw error;
                return data;
            })(),
            15000,
            "Auth code exchange timed out."
        );
    }
}
