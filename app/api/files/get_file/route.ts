import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return new Response("File ID is required", { status: 400 });
    }

    const {data,error} = await supabase
    .from("files_info")
    .select("*")
    .eq("id", id)
    .single();
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    if (!data) {
        return new Response("File not found", { status: 404 });
    }
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}