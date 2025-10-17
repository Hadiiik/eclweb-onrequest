import { NewsItem } from "@/app/components/NewsPanel";
import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    
    const cookies = req.cookies;
    const adminToken = cookies.get("admin_token")?.value;
    if (!adminToken) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (adminToken !== process.env.ADMITOKEN) {
        return new Response("Unauthorized", { status: 401 });
    }
    const req_body : NewsItem = await req.json();
    const { excerpt, link } = req_body;
    const {error} = await supabase
    .from("news")
    .insert([{ excerpt, link }]);
    if (error) {
        console.error("Error inserting news:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
    return new Response("News added successfully", { status: 200 });
}