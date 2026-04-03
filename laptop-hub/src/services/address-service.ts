import { withTimeout } from "@/lib/utils/timeout";

export interface Address {
  id: string;
  user_id: string;
  street_line_1: string;
  street_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
}

export class AddressService {
  /**
   * Fetches all addresses for a user
   */
  static async getAddresses(supabase: any, userId: string): Promise<Address[]> {
    return withTimeout(
      () =>
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false })
          .then(({ data, error }: any) => {
            if (error) throw error;
            return data || [];
          }),
      20000,
      "Request timed out"
    );
  }

  /**
   * Creates a new address for a user
   */
  static async createAddress(supabase: any, addressData: Partial<Address>) {
    return withTimeout(
      () =>
        supabase
          .from("addresses")
          .insert([addressData])
          .select()
          .single()
          .then(({ data, error }: any) => {
            if (error) throw error;
            return data;
          }),
      20000,
      "Create timed out"
    );
  }

  /**
   * Updates an existing address
   */
  static async updateAddress(supabase: any, addressId: string, addressData: Partial<Address>) {
    return withTimeout(
      () =>
        supabase
          .from("addresses")
          .update(addressData)
          .eq("id", addressId)
          .select()
          .single()
          .then(({ data, error }: any) => {
            if (error) throw error;
            return data;
          }),
      20000,
      "Update timed out"
    );
  }

  /**
   * Deletes an address
   */
  static async deleteAddress(supabase: any, addressId: string) {
    return withTimeout(
      () =>
        supabase
          .from("addresses")
          .delete()
          .eq("id", addressId)
          .then(({ error }: any) => {
            if (error) throw error;
          }),
      20000,
      "Delete timed out"
    );
  }

  /**
   * Sets an address as default for a user
   * (The database trigger handles unsetting other defaults)
   */
  static async setDefaultAddress(supabase: any, userId: string, addressId: string) {
    return withTimeout(
      () =>
        supabase
          .from("addresses")
          .update({ is_default: true })
          .eq("id", addressId)
          .eq("user_id", userId)
          .select()
          .single()
          .then(({ data, error }: any) => {
            if (error) throw error;
            return data;
          }),
      20000,
      "Update timed out"
    );
  }
}
