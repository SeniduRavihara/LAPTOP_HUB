import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  // Simple authorization for cron
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();
    
    // Find active auctions that have expired
    const { data: expiredAuctions, error: fetchError } = await supabaseAdmin
      .from("auctions")
      .select("id")
      .eq("status", "active")
      .lt("end_time", now);

    if (fetchError) {
      console.error("Error fetching expired auctions:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!expiredAuctions || expiredAuctions.length === 0) {
      return NextResponse.json({ message: "No expired auctions found" });
    }

    const expiredIds = expiredAuctions.map((a) => a.id);

    // Update their status to completed
    const { error: updateError } = await supabaseAdmin
      .from("auctions")
      .update({ status: "completed", updated_at: now })
      .in("id", expiredIds);

    if (updateError) {
      console.error("Error updating expired auctions:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // TODO: Future enhancement - Create pending orders for the winners

    return NextResponse.json({
      message: `Successfully closed ${expiredIds.length} auctions.`,
      closedAuctions: expiredIds,
    });
  } catch (error: any) {
    console.error("Cron execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
