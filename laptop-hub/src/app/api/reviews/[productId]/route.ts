export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ reviews: [] });
    }

    // Fetch user names from the public.users table
    const userIds = [...new Set(reviews.map((r: any) => r.user_id))];
    const { data: usersData } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    const userMap: Record<string, string> = {};
    if (usersData) {
      usersData.forEach((u: any) => {
        if (u.name) userMap[u.id] = u.name;
      });
    }

    const reviewsWithNames = reviews.map((r: any) => ({
      ...r,
      user_name: userMap[r.user_id] || "Verified Buyer",
    }));

    return NextResponse.json({ reviews: reviewsWithNames });
  } catch (error) {
    console.error("Unexpected error in GET reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
