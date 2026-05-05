"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, role: string) {
  try {
    // 1. Update the public.users table
    const { error: tableError } = await supabaseAdmin
      .from("users")
      .update({ role })
      .eq("id", userId)

    if (tableError) {
      console.error("Error updating public.users table:", tableError)
      return { success: false, error: tableError.message }
    }

    // 2. Update the auth.users metadata
    // This is crucial because the middleware and many auth checks rely on metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { user_metadata: { role } }
    )

    if (authError) {
      console.error("Error updating auth metadata:", authError)
      // We don't necessarily want to fail the whole thing if auth metadata update fails,
      // but it's usually better to be consistent.
      return { success: false, error: authError.message }
    }

    revalidatePath("/admin/users")
    revalidatePath("/admin/sellers")
    
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error in updateUserRole:", error)
    return { success: false, error: error.message }
  }
}
