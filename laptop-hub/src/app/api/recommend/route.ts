import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface GeminiRecommendation {
  productId: string;
  reason: string;
  matchScore: number;
}

interface GeminiResponse {
  recommendations: GeminiRecommendation[];
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Fetch all products with their auctions and bids from database
    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products")
      .select(`
        *,
        auctions (
          id,
          status,
          starting_bid,
          end_time,
          bids (
            amount
          )
        )
      `);

    if (dbError) {
      console.error("Database fetch error:", dbError);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    // 2. Format products list for Gemini to make it compact
    const simplifiedProducts = dbProducts.map((p: any) => {
      const auction = Array.isArray(p.auctions) ? p.auctions[0] : p.auctions;
      const isAuction = auction && auction.status === "active";
      const currentPrice = isAuction
        ? (auction.bids?.reduce((max: number, b: any) => Math.max(max, b.amount), 0) || auction.starting_bid)
        : p.price;

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: currentPrice,
        isAuction,
        stock: p.stock,
        specs: p.specs || {},
      };
    });

    // 3. Get Gemini API Key from environment
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("Gemini API key is not configured.");
      // Return a descriptive response explaining that API key is missing
      return NextResponse.json({
        recommendations: [],
        error: "GEMINI_API_KEY is not configured in .env.local. Please set it to enable AI Recommendations.",
        fallbackProducts: simplifiedProducts.slice(0, 3) // Provide a fallback of first 3 products
      });
    }

    // 4. Build prompt
    const prompt = `
You are an expert AI laptop recommendation assistant for "Laptop Hub", a premium laptop marketplace.
The user is looking for a laptop matching this request: "${query}"

Here is the list of all available laptops in our inventory:
${JSON.stringify(simplifiedProducts, null, 2)}

Please analyze the user's request and choose up to 3 best laptops from the list that would fit their criteria (based on specs, brand, description, and price).
If the user specifies a price limit, make sure to respect it or explain if a slightly higher option is significantly better.
If they need it for a specific task (e.g. gaming, programming, school, office work), look at the CPU, GPU/Specs, and RAM to determine suitability.

Return a JSON object containing a "recommendations" array. Each recommendation must include:
- "productId": string (must exactly match the "id" of the matched product in the list)
- "reason": string (a customized, professional, and friendly 1-2 sentence explanation of why this laptop matches their specific query)
- "matchScore": number (an integer from 0 to 100 based on how well it fits their request)

If no laptops match the criteria at all, return an empty "recommendations" array.
Return ONLY valid JSON matching this schema:
{
  "recommendations": [
    {
      "productId": "id",
      "reason": "explanation",
      "matchScore": 95
    }
  ]
}
Do not include any markdown formatting, backticks, or extra text.
`;

    // 5. Query Gemini API
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json({ 
        error: "Failed to communicate with Gemini API", 
        details: errorText 
      }, { status: 502 });
    }

    const resData = await response.json();
    const textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 502 });
    }

    // 6. Parse JSON recommendations
    try {
      const parsedData = JSON.parse(textResult) as GeminiResponse;
      
      // Map matched product details back to recommendations
      const recommendationsWithDetails = (parsedData.recommendations || [])
        .map((rec) => {
          const product = dbProducts.find((p: any) => p.id === rec.productId);
          return {
            ...rec,
            product
          };
        })
        .filter((rec) => rec.product !== undefined); // Ensure product exists

      return NextResponse.json({ recommendations: recommendationsWithDetails });
    } catch (parseError) {
      console.error("Error parsing Gemini JSON:", textResult, parseError);
      return NextResponse.json({ error: "Invalid JSON response from AI" }, { status: 502 });
    }

  } catch (error: any) {
    console.error("AI Recommendation API failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
