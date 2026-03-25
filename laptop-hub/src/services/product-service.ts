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
            () => supabase
                    .from('products')
                    .select('*, auctions(status, starting_bid, end_time, bids(amount))')
                    .order('created_at', { ascending: false })
                    .limit(limit)
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            'Request timed out. Please check your connection.'
        );
    }

    static async getSellerProducts(supabase: any, sellerId: string) {
        return withTimeout(
            () => supabase
                    .from('products')
                    .select('*, auctions(status)')
                    .eq('seller_id', sellerId)
                    .order('created_at', { ascending: false })
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            'Request timed out.'
        );
    }

    static async getProductById(supabase: any, id: string) {
        return withTimeout(
            () => supabase
                    .from('products')
                    .select('*, auction:auctions(*)')
                    .eq('id', id)
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data;
                    }),
            60000,
            'Request timed out.'
        );
    }

    static async createProduct(supabase: any, product: ProductInsert) {
        return withTimeout(
            () => supabase
                    .from('products')
                    .insert(product)
                    .select()
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data as Product;
                    }),
            60000,
            'Saving product timed out. Please try again.'
        );
    }

    static async updateProduct(supabase: any, id: string, product: ProductUpdate) {
        return withTimeout(
            () => supabase
                    .from('products')
                    .update(product)
                    .eq('id', id)
                    .select()
                    .single()
                    .then(({ data, error }: any) => {
                        if (error) throw error;
                        return data as Product;
                    }),
            60000,
            'Updating product timed out. Please try again.'
        );
    }

    static async deleteProduct(supabase: any, id: string) {
        return withTimeout(
            () => supabase
                    .from('products')
                    .delete()
                    .eq('id', id)
                    .then(({ error }: any) => {
                        if (error) throw error;
                    }),
            30000,
            'Deletion timed out.'
        );
    }

    static async uploadImage(supabase: any, file: File, userId: string): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const uploadResult = await withTimeout(
            () => supabase.storage
                .from('product-images')
                .upload(filePath, file, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                }),
            120000, // 120s for images
            'Image upload timed out after 60 seconds.'
        );

        const { error: uploadError } = uploadResult as any;
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    }
}
