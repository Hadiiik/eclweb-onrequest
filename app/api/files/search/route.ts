import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { sanitizeInput } from "@/security/remove_injictions";
import { generateSimilarWords } from "@/server_helpers/genrate_similar_words";
import { NextRequest, NextResponse } from "next/server";
type SearchQyery = {
    search_bar_query: string;
    filters: string[];
    page: string;

}
export async function POST(req: NextRequest){
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;

    const req_body: SearchQyery = await req.json();
    let search_bar_query = sanitizeInput(req_body.search_bar_query);
    const filters = req_body.filters.map((filter) => sanitizeInput(filter));



    if(search_bar_query.trim() === ""){
        if(filters.length === 0)
            return NextResponse.json({"data":[]}, { status: 200 });
        
        const query = supabase
        .from("files_info")
        .select("*")
        .limit(250);

        if (filters.length > 0) {
            query.contains("categories", filters);
        }
        
        const { data, error } = await query
    
        if (error) {
            console.log(error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ data }, { status: 200 });


    }
    

    const similarWords = generateSimilarWords(search_bar_query);
    // console.log(similarWords)
    const f = Array.from(similarWords)
    .flatMap(word => [
        `file_name.ilike.%${word}%`,
        `file_description.ilike.%${word}%`
    ])
    .join(',');


    
    const query = supabase
        .from("files_info")
        .select("*")
        .or(f);

    if (filters.length > 0) {
        query.contains("categories", filters);
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching data:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
}
