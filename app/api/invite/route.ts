// app/api/invite/route.ts
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { invite_token } = await request.json()

    if (!invite_token) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم تقديم رمز دعوة صالح' 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("invite_tokens")
      .select("*")
      .eq("token", invite_token)
      .single()

    if (error || !data) {
      return NextResponse.json({ 
        success: false, 
        error: 'رمز الدعوة غير صالح' 
      }, { status: 400 })
    }

    if (data.has_been_used) {
      return NextResponse.json({ 
        success: false, 
        error: 'تم استخدام هذه الدعوة مسبقاً' 
      }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from("invite_tokens")
      .update({ has_been_used: true })
      .eq("token", invite_token)

    if (updateError) {
      return NextResponse.json({ 
        success: false, 
        error: 'حدث خطأ أثناء تحديث حالة الدعوة' 
      }, { status: 500 })
    }

    const adminTokenValue = process.env.ADMITOKEN
    
    if (!adminTokenValue) {
      return NextResponse.json({ 
        success: false, 
        error: 'خطأ في إعدادات النظام' 
      }, { status: 500 })
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'تم تفعيل الدعوة بنجاح' 
    })

    response.cookies.set('admin_token', adminTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Error processing invite:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ غير متوقع أثناء المعالجة' 
    }, { status: 500 })
  }
}