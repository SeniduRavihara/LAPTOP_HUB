import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_id, rating, comment } = body;

    if (!product_id || !rating) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id,
        user_id: session.user.id,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting review:", error);
      
      // Handle Postgres unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: "You have already reviewed this product." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to submit review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in POST review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
