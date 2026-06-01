import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ProductService } from "@/services/product-service";

interface GeminiExtraction {
  brands?: string[];
  minPrice?: string;
  maxPrice?: string;
  processors?: string[];
  rams?: string[];
  search_query?: string;
  reason: string;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Check Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("Gemini API key is not configured.");
      // Fetch some fallback products
      const fallbackData = await ProductService.getRecentProducts(3, supabaseAdmin);
      
      return NextResponse.json({
        recommendations: [],
        error: "GEMINI_API_KEY is not configured in .env.local. Please set it to enable AI Recommendations.",
        fallbackProducts: fallbackData || []
      });
    }

    // 2. Build prompt to extract search parameters
    const prompt = `
You are an expert AI laptop recommendation assistant for "Laptop Hub".
The user is searching for a laptop with this request: "${query}"

Instead of searching a database, your job is to translate their request into strict search parameters.
Extract the following information if mentioned or implied (leave as empty array/null if not applicable):
- brands: Array of strings (e.g. ["Dell", "HP", "Apple", "Lenovo", "ASUS", "MSI"])
- minPrice: string (e.g. "50000")
- maxPrice: string (e.g. "200000")
- processors: Array of strings (e.g. ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "Apple M1"])
- rams: Array of strings (e.g. ["8GB", "16GB", "32GB"])
- search_query: string (Extract a generic keyword like "gaming", "programming", or "office" if implied, otherwise null)
- reason: string (Write a professional, friendly 1-2 sentence explanation of why a laptop matching these criteria fits their request. E.g., "These Dell laptops under 200k match your gaming requirements perfectly.")

Return ONLY valid JSON matching this schema exactly:
{
  "brands": ["Dell"],
  "minPrice": null,
  "maxPrice": "200000",
  "processors": [],
  "rams": [],
  "search_query": "gaming",
  "reason": "explanation"
}
Do not include any markdown formatting, backticks, or extra text.
`;

    // 3. Query Gemini API
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

    // 4. Parse JSON parameters
    let extractedParams: GeminiExtraction;
    try {
      extractedParams = JSON.parse(textResult) as GeminiExtraction;
    } catch (parseError) {
      console.error("Error parsing Gemini JSON:", textResult, parseError);
      return NextResponse.json({ error: "Invalid JSON response from AI" }, { status: 502 });
    }

    // 5. Query the database using the extracted parameters
    const filters = {
      query: extractedParams.search_query,
      brands: extractedParams.brands,
      processors: extractedParams.processors,
      rams: extractedParams.rams,
      minPrice: extractedParams.minPrice,
      maxPrice: extractedParams.maxPrice
    };

    const matchingProducts = await ProductService.searchProducts(filters, supabaseAdmin) as any[];

    // 6. Map the top 3 results to the expected Recommendation format
    const topResults = (matchingProducts || []).slice(0, 3);
    
    const recommendations = topResults.map(product => {
      // Calculate a pseudo match score (e.g., 90-98%)
      const randomScore = Math.floor(Math.random() * (98 - 90 + 1)) + 90;
      return {
        productId: product.id,
        reason: extractedParams.reason || "This product matches your specific criteria.",
        matchScore: randomScore,
        product
      };
    });

    return NextResponse.json({ recommendations });

  } catch (error: any) {
    console.error("AI Recommendation API failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
