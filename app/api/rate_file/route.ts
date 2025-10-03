import { supabase } from "@/lib/supabase";
import { rateLimiterMiddleware } from "@/middleware/rateLimiterMiddleware";
import { getUserIp } from "@/security/get_ip";
import { ipToShortUniqueId } from "@/security/get_unique_id";
import { sanitizeInput } from "@/security/remove_injictions";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiterMiddleware(req);
      if (rateLimitResponse) return rateLimitResponse;
      const { fileId, rating } = await req.json();

      if (!fileId || typeof rating !== "number" || rating < 1 || rating > 5) {
        return new Response(JSON.stringify({ success: false, error: "Invalid input" }), { status: 400 });
      }
      const file_id = sanitizeInput(fileId);
      const user_ip = getUserIp(req) ;

      if(!user_ip) return new NextResponse(JSON.stringify({ success: false, error: "Cannot determine user IP" }), { status: 400 });

      const unique_id = ipToShortUniqueId(user_ip, 12);
      const {error} =  await supabase
    .from('files_ratings')
    .upsert([{ file_id, rating, unique_id }]);

      if(error) return new NextResponse(JSON.stringify({ success: false, error: error.message ?? "Unknown error" }), { status: 404 });

      return NextResponse.json({ success: true });
}
