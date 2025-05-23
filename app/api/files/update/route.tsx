import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { sanitizeInput } from "@/security/remove_injictions";
import { NextRequest } from "next/server";
type FileInfo = {
    file_name: string;
    file_description: string;
    categories: string[];
    file_url: string;
    file_id: string;
}

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

    const req_body : FileInfo = await req.json();
    const file_name = sanitizeInput(req_body.file_name);
    const file_description = sanitizeInput(req_body.file_description);
    const categories = req_body.categories.map((category) => sanitizeInput(category));
    const file_url = sanitizeInput(req_body.file_url);
    const { data, error } = await supabase
        .from("files_info")
        .update({
            file_name,
            file_description,
            categories,
            file_url,
            created_at: new Date(),
        })
        .eq("id", req_body.file_id);
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

}