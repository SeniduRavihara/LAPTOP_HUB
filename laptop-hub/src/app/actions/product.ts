"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getRequestingUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // Get user role from public.users table
  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()
    
  return { ...user, role: profile?.role }
}

export async function adminUpdateProduct(id: string, productData: any) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Check if the user is an admin OR the owner of the product
    if (user.role !== 'admin') {
      const { data: existingProduct } = await supabaseAdmin
        .from("products")
        .select("seller_id")
        .eq("id", id)
        .single()
        
      if (!existingProduct || existingProduct.seller_id !== user.id) {
        return { success: false, error: "You do not have permission to edit this product" }
      }
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Admin Product Update Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/seller/products")
    revalidatePath(`/admin/products/${id}/edit`)
    revalidatePath(`/seller/products/${id}/edit`)
    
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected Admin Product Update Error:", error)
    return { success: false, error: error.message }
  }
}

export async function adminCreateProduct(productData: any) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Ensure the seller_id is set to the current user if not an admin
    const finalProductData = {
      ...productData,
      seller_id: user.role === 'admin' ? (productData.seller_id || user.id) : user.id
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(finalProductData)
      .select()
      .single()

    if (error) {
      console.error("Admin Product Create Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/seller/products")
    
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected Admin Product Create Error:", error)
    return { success: false, error: error.message }
  }
}

export async function adminDeleteProduct(id: string) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Check if the user is an admin OR the owner of the product
    if (user.role !== 'admin') {
      const { data: existingProduct } = await supabaseAdmin
        .from("products")
        .select("seller_id")
        .eq("id", id)
        .single()
        
      if (!existingProduct || existingProduct.seller_id !== user.id) {
        return { success: false, error: "You do not have permission to delete this product" }
      }
    }

    // Attempt deletion
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Admin Product Delete Error:", error)
      if (error.code === '23503') {
        return { 
          success: false, 
          error: "This product cannot be deleted because it is associated with active orders, auction bids, or reviews. Try setting its stock to 0 or ending the auctions instead." 
        }
      }
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/seller/products")
    
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected Admin Product Delete Error:", error)
    return { success: false, error: error.message }
  }
}

