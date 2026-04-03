import { supabase as browserClient } from "@/lib/supabase/client";

export interface Product {
    id: string;
    name: string;
    brand: string;
    description: string | null;
    price: number;
    original_price: number | null;
    stock: number;
    badge: string | null;
    images: string[];
    specs: Record<string, string>;
    seller_id: string;
    created_at: string;
    updated_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert>;

export class ProductService {
    /**
     * Get recent products with auction data joined
     */
    static async getRecentProducts(limit: number = 8, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, auctions(status, starting_bid, end_time, bids(amount))')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('ProductService.getRecentProducts error:', error);
            throw error;
        }
    }

    /**
     * Advanced search with filters
     */
    static async searchProducts(filters: any, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            let query = supabase
                .from('products')
                .select('*, auctions(status, starting_bid, end_time, bids(amount))')
                .order('created_at', { ascending: false });

            if (filters?.brands && filters.brands.length > 0) {
                query = query.in('brand', filters.brands);
            }
            if (filters?.minPrice) {
                query = query.gte('price', parseInt(filters.minPrice));
            }
            if (filters?.maxPrice) {
                query = query.lte('price', parseInt(filters.maxPrice));
            }
            if (filters?.processors && filters.processors.length > 0) {
                query = query.in('specs->>Processor', filters.processors);
            }
            if (filters?.rams && filters.rams.length > 0) {
                query = query.in('specs->>RAM', filters.rams);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('ProductService.searchProducts error:', error);
            throw error;
        }
    }

    /**
     * Get all products for a specific seller
     */
    static async getSellerProducts(sellerId: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, auctions(status)')
                .eq('seller_id', sellerId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('ProductService.getSellerProducts error:', error);
            throw error;
        }
    }

    /**
     * Get a single product by ID
     */
    static async getProductById(id: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, auction:auctions(*)')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            // Handle row not found gracefully for details
            if ((error as any)?.code === 'PGRST116') {
                return null;
            }
            console.error('ProductService.getProductById error:', error);
            throw error;
        }
    }

    /**
     * Create a new product listing
     */
    static async createProduct(product: ProductInsert, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('products')
                .insert(product)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('ProductService.createProduct error:', error);
            throw error;
        }
    }

    /**
     * Update an existing product
     */
    static async updateProduct(id: string, updates: ProductUpdate, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('ProductService.updateProduct error:', error);
            throw error;
        }
    }

    /**
     * Permanent delete (Soft delete can be implemented similarly if needed)
     */
    static async deleteProduct(id: string, supabaseOverride?: any) {
        const supabase = supabaseOverride || browserClient;
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('ProductService.deleteProduct error:', error);
            throw error;
        }
    }
}
