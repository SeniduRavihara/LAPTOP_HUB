import { getURL } from "@/lib/utils/url";
import { supabase as browserClient } from "@/lib/supabase/client";

/**
 * AuthService
 * Handles all core authentication operations using the provided Supabase client.
 * Environment-agnostic: works in both Client and Server components.
 */
export class AuthService {
    /**
     * Standard sign in with email and password
     */
    static async signIn(email: string, password: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuthService.signIn error:', error);
            throw error;
        }
    }

    /**
     * OAuth sign in with Google
     */
    static async signInWithGoogle(supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${getURL()}/auth/callback`,
                },
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuthService.signInWithGoogle error:', error);
            throw error;
        }
    }

    /**
     * Standard sign up with email, password, and optional metadata
     */
    static async signUp(email: string, password: string, metadata?: any, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: metadata ? { data: metadata } : undefined,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuthService.signUp error:', error);
            throw error;
        }
    }

    /**
     * Signs out the current user
     */
    static async signOut(supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('AuthService.signOut error:', error);
            throw error;
        }
    }

    /**
     * Fetches the current active session
     */
    static async getSession(supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            // Log but don't swallow if it's a critical error
            if (error instanceof Error) {
                console.error('AuthService.getSession error:', error.message);
            }
            return null;
        }
    }

    /**
     * Sets up a listener for auth state changes
     * Returns an unsubscribe function
     */
    static onAuthStateChange(callback: (event: string, session: any) => void, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
            callback(event, session);
        });

        return {
            unsubscribe: () => subscription.unsubscribe(),
        };
    }

    /**
     * Exchange a code for a session (OAuth callback)
     */
    static async exchangeCodeForSession(code: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('AuthService.exchangeCodeForSession error:', error);
            throw error;
        }
    }

    /**
     * Fetches the current user profile from the session
     */
    static async getUser(supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('AuthService.getUser error:', error);
            return null;
        }
    }
}
