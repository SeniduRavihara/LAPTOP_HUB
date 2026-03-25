import { withTimeout } from "@/lib/utils/timeout";

export class ProfileService {
    /**
     * Fetches a user profile from the `users` table
     */
    static async getUserProfile(supabase: any, userId: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                return data;
            })(),
            10000,
            'Request timed out'
        );
    }

    /**
     * Updates user role (Admin functionality)
     */
    static async updateUserRole(supabase: any, userId: string, role: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('users')
                    .update({ role })
                    .eq('id', userId)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            })(),
            15000,
            'Update timed out'
        );
    }
}
