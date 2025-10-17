// app/api/generate-invite/route.ts
import { supabase } from '@/lib/supabase'
import { rateLimiterMiddleware } from '@/middleware/rateLimiterMiddleware';
import { NextResponse } from 'next/server'

import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    const cookies = req.cookies;
    const adminToken = cookies.get("issa_token")?.value;
    if (!adminToken) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (adminToken !== process.env.ISSATOKEN) {
        return new Response("Unauthorized", { status: 401 });
    }
        
  try {
    // توليد توكن عشوائي
    const generateToken = () => {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15)
    }

    const token = generateToken()
    
    // إضافة التوكن إلى قاعدة البيانات
    const {  error } = await supabase
      .from('invite_tokens')
      .insert([
        {
          token: token,
          has_been_used: false,
        }
      ])
      .select()

    if (error) {
      console.error('Error inserting token:', error)
      return NextResponse.json(
        { success: false, error: 'فشل في إنشاء رمز الدعوة' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      token: token,
      invite_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/getInvited?invite_token=${token}`,
      message: 'تم إنشاء رابط الدعوة بنجاح'
    })

  } catch (error) {
    console.error('Error generating invite:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    )
  }
}