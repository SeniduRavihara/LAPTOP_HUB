import { supabase as browserClient } from "@/lib/supabase/client";

export interface Address {
  id: string;
  user_id: string;
  full_name?: string;
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
  static async getAddresses(userId: string, supabaseOverride?: any): Promise<Address[]> {
    const supabase = supabaseOverride || browserClient;
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('AddressService.getAddresses error:', error);
      return [];
    }
  }

  /**
   * Creates a new address for a user
   */
  static async createAddress(addressData: Partial<Address>, supabaseOverride?: any) {
    const supabase = supabaseOverride || browserClient;
    try {
      const { data, error } = await supabase
        .from("addresses")
        .insert([addressData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AddressService.createAddress error:', error);
      throw error;
    }
  }

  /**
   * Updates an existing address
   */
  static async updateAddress(addressId: string, addressData: Partial<Address>, supabaseOverride?: any) {
    const supabase = supabaseOverride || browserClient;
    try {
      const { data, error } = await supabase
        .from("addresses")
        .update(addressData)
        .eq("id", addressId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AddressService.updateAddress error:', error);
      throw error;
    }
  }

  /**
   * Deletes an address
   */
  static async deleteAddress(addressId: string, supabaseOverride?: any) {
    const supabase = supabaseOverride || browserClient;
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('AddressService.deleteAddress error:', error);
      throw error;
    }
  }

  /**
   * Sets an address as default for a user
   */
  static async setDefaultAddress(userId: string, addressId: string, supabaseOverride?: any) {
    const supabase = supabaseOverride || browserClient;
    try {
      const { data, error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", addressId)
        .eq("user_id", userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AddressService.setDefaultAddress error:', error);
      throw error;
    }
  }
}
