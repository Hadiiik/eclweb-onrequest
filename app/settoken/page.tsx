// app/set-token-simple/page.tsx
'use client'

import { useState } from 'react'

export default function SimpleSetTokenPage() {
  const [isSet, setIsSet] = useState(false)

  const setCookie = () => {
    const tokenValue = process.env.NEXT_PUBLIC_ISSATOKEN || 'default_token_value'
    if (!tokenValue) {
      alert('Token value is not set in environment variables.')
      return
    }
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)
    
    document.cookie = `issa_token=${tokenValue}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`
    
    setIsSet(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">تعيين التوكن</h1>
        
        {!isSet ? (
          <>
            <p className="text-gray-600 mb-6">انقر على الزر لتعيين الكوكي المطلوب</p>
            <button
              onClick={setCookie}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              تعيين الكوكي
            </button>
          </>
        ) : (
          <>
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <p className="text-green-700 font-medium mb-4">تم تعيين الكوكي بنجاح!</p>
            <p className="text-gray-600 text-sm">يمكنك إغلاق هذه الصفحة الآن</p>
          </>
        )}
      </div>
    </div>
  )
}