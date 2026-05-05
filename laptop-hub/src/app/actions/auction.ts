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

async function checkAuctionOwnership(id: string, userId: string, role: string) {
  if (role === 'admin') return true
  
  const { data: auction } = await supabaseAdmin
    .from("auctions")
    .select("seller_id")
    .eq("id", id)
    .single()
    
  return auction && auction.seller_id === userId
}

export async function adminCreateAuction(auctionData: any) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    // Logic: Only owner of the product (or admin) can create auction
    if (user.role !== 'admin') {
       const { data: product } = await supabaseAdmin
        .from("products")
        .select("seller_id")
        .eq("id", auctionData.product_id)
        .single()
        
       if (!product || product.seller_id !== user.id) {
         return { success: false, error: "Unauthorized product ownership" }
       }
       // Force correct seller_id
       auctionData.seller_id = user.id
    }

    const { data, error } = await supabaseAdmin
      .from("auctions")
      .insert(auctionData)
      .select()
      .single()

    if (error) {
      console.error("Admin Auction Create Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/auctions")
    revalidatePath("/seller/products")
    
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected Admin Auction Create Error:", error)
    return { success: false, error: error.message }
  }
}

export async function adminUpdateAuction(id: string, updates: any) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const isOwner = await checkAuctionOwnership(id, user.id, user.role || 'customer')
    if (!isOwner) return { success: false, error: "Unauthorized auction ownership" }

    const { data, error } = await supabaseAdmin
      .from("auctions")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Admin Auction Update Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/auctions")
    revalidatePath("/seller/products")
    
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected Admin Auction Update Error:", error)
    return { success: false, error: error.message }
  }
}

export async function adminCancelAuction(id: string) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const isOwner = await checkAuctionOwnership(id, user.id, user.role || 'customer')
    if (!isOwner) return { success: false, error: "Unauthorized auction ownership" }

    const { data, error } = await supabaseAdmin
      .from("auctions")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Admin Auction Cancel Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/auctions")
    revalidatePath("/seller/products")
    
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected Admin Auction Cancel Error:", error)
    return { success: false, error: error.message }
  }
}
