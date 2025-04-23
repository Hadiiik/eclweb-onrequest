import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { sanitizeInput } from "@/security/remove_injictions";
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
    const search_bar_query = sanitizeInput(req_body.search_bar_query);
    const filters = req_body.filters.map((filter) => sanitizeInput(filter));
    const page = sanitizeInput(req_body.page);

    const LIMIT = 10; // عدد العناصر في الصفحة`

    const query = supabase
        .from("files_info")
        .select("*")
        .ilike("file_name", `%${search_bar_query}%`);

    if (filters.length > 0) {
        query.contains("categories", filters);
    }

    const { data, error } = await query.range(
        parseInt(page) * LIMIT,
        (parseInt(page) + 1) * LIMIT - 1
    );
    console.log(data)
    console.log(error)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
}