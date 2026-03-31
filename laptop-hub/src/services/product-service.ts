import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/utils/timeout";

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
    static async getRecentProducts(supabase: any, limit: number = 8) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, auctions(status, starting_bid, end_time, bids(amount))')
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (error) throw error;
                return data;
            })(),
            15000,
            'Request timed out. Please check your connection.'
        );
    }

    static async searchProducts(supabase: any, filters: any) {
        return withTimeout(
            (async () => {
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
            })(),
            15000,
            'Search request timed out.'
        );
    }

    static async getSellerProducts(supabase: any, sellerId: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, auctions(status)')
                    .eq('seller_id', sellerId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return data;
            })(),
            15000,
            'Request timed out.'
        );
    }

    static async getProductById(supabase: any, id: string) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, auction:auctions(*)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return data;
            })(),
            15000,
            'Request timed out.'
        );
    }

    static async createProduct(supabase: any, product: ProductInsert) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('products')
                    .insert(product)
                    .select()
                    .single();

                if (error) throw error;
                return data as Product;
            })(),
            20000,
            'Saving product timed out. Please try again.'
        );
    }

    static async updateProduct(supabase: any, id: string, product: ProductUpdate) {
        return withTimeout(
            (async () => {
                const { data, error } = await supabase
                    .from('products')
                    .update(product)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                return data as Product;
            })(),
            20000,
            'Updating product timed out. Please try again.'
        );
    }

    static async deleteProduct(supabase: any, id: string) {
        return withTimeout(
            (async () => {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            })(),
            15000,
            'Deletion timed out.'
        );
    }

    static async uploadImage(supabase: any, file: File, userId: string): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const uploadResult = await withTimeout(
            supabase.storage
                .from('product-images')
                .upload(filePath, file, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                }),
            30000,
            'Image upload timed out after 30 seconds.'
        );

        const { error: uploadError } = uploadResult as any;
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    }
}
