import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuctionService } from "@/services/auction-service";

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

    const closedAuctions = [];
    const errors = [];

    // Process each expired auction using AuctionService.closeAuction
    for (const auction of expiredAuctions) {
      try {
        await AuctionService.closeAuction(auction.id, supabaseAdmin);
        closedAuctions.push(auction.id);
      } catch (err: any) {
        console.error(`Error closing auction ${auction.id}:`, err);
        errors.push({ id: auction.id, error: err.message });
      }
    }

    return NextResponse.json({
      message: `Processed ${expiredAuctions.length} expired auctions. Successfully closed ${closedAuctions.length}.`,
      closedAuctions,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error("Cron execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
