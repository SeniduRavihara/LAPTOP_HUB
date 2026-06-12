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

function validateAuctionData(auctionData: any) {
  const startingBid = Number(auctionData?.starting_bid)
  if (!Number.isFinite(startingBid) || startingBid <= 0) {
    return "Starting bid must be greater than 0"
  }

  if (auctionData?.reserve_price !== null && auctionData?.reserve_price !== undefined && auctionData?.reserve_price !== "") {
    const reservePrice = Number(auctionData.reserve_price)
    if (!Number.isFinite(reservePrice)) {
      return "Reserve price must be a valid number"
    }
    if (reservePrice < startingBid) {
      return "Reserve price must be greater than or equal to starting bid"
    }
  }

  return null
}

export async function adminCreateAuction(auctionData: any) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const validationError = validateAuctionData(auctionData)
    if (validationError) return { success: false, error: validationError }

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

    const validationError = validateAuctionData(updates)
    if (validationError) return { success: false, error: validationError }

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

    // First delete all associated bids
    const { error: bidsDeleteError } = await supabaseAdmin
      .from("bids")
      .delete()
      .eq("auction_id", id)

    if (bidsDeleteError) {
      console.error("Error deleting auction bids:", bidsDeleteError)
      return { success: false, error: bidsDeleteError.message }
    }

    // Now delete the auction itself
    const { error: auctionDeleteError } = await supabaseAdmin
      .from("auctions")
      .delete()
      .eq("id", id)

    if (auctionDeleteError) {
      console.error("Admin Auction Delete Error:", auctionDeleteError)
      return { success: false, error: auctionDeleteError.message }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/auctions")
    revalidatePath("/seller/products")
    
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected Admin Auction Delete Error:", error)
    return { success: false, error: error.message }
  }
}

export async function closeAuctionAction(id: string) {
  try {
    const user = await getRequestingUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const isOwner = await checkAuctionOwnership(id, user.id, user.role || 'customer')
    if (!isOwner) return { success: false, error: "Unauthorized auction ownership" }

    const { AuctionService } = await import("@/services/auction-service")
    
    const data = await AuctionService.closeAuction(id, supabaseAdmin)
    
    revalidatePath("/admin/products")
    revalidatePath("/admin/auctions")
    revalidatePath("/seller/products")
    revalidatePath("/seller/auctions")
    revalidatePath(`/seller/auctions/${id}`)
    
    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected Auction Close Error:", error)
    return { success: false, error: error.message }
  }
}
