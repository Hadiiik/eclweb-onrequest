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
    const {file_id} = await req.json();
    if (!file_id) {
        return new Response("File ID is required", { status: 400 });
    }
    const {data,error} = await supabase
        .from("files_info")
        .delete()
        .eq("id", file_id);
        if (error) {
            return new Response("Error deleting file", { status: 500 });
        }
    return new Response(JSON.stringify({ message: "File deleted successfully", data }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}