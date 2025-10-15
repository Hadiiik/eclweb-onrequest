// app/create-invite/page.tsx
'use client'

import { useState } from 'react'
import { FaCopy, FaLink, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

interface InviteData {
  token: string
  invite_url: string
  message: string
}

export default function CreateInvitePage() {
  const [loading, setLoading] = useState(false)
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateInvite = async () => {
    setLoading(true)
    setError(null)
    setInviteData(null)
    setCopied(false)

    try {
      const response = await fetch('/api/generate-invite')
      const result = await response.json()

      if (response.ok && result.success) {
        setInviteData(result)
      } else {
        setError(result.error || 'فشل في إنشاء رابط الدعوة')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaLink className="text-3xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">منشئ روابط الدعوة</h1>
          <p className="text-gray-600 text-lg">
            قم بإنشاء روابط دعوة فريدة لإضافة مشرفين جدد إلى النظام
          </p>
        </div>

        {/* Generate Button */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <button
            onClick={generateInvite}
            disabled={loading}
            className={`
              w-full max-w-md mx-auto py-4 px-8 rounded-xl text-lg font-semibold
              transition-all duration-300 transform hover:scale-105
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }
              text-white shadow-lg
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin" />
                <span>جاري إنشاء رابط الدعوة...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FaLink />
                <span>إنشاء رابط دعوة جديد</span>
              </div>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 text-red-700">
              <FaExclamationTriangle className="text-xl" />
              <div>
                <h3 className="font-semibold text-lg mb-1">خطأ</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Invite Data */}
        {inviteData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <div className="flex items-center gap-3 text-green-600 mb-6">
              <FaCheckCircle className="text-2xl" />
              <h2 className="text-2xl font-bold">تم إنشاء رابط الدعوة بنجاح!</h2>
            </div>

            {/* Token */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز الدعوة:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteData.token}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(inviteData.token)}
                  className="px-4 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            {/* Invite URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط الدعوة:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteData.invite_url}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-blue-600 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(inviteData.invite_url)}
                  className="px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            {/* Copy Status */}
            {copied && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center animate-fade-in">
                <span className="text-green-700 font-medium">✓ تم النسخ إلى الحافظة</span>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">تعليمات الاستخدام:</h3>
              <ul className="text-blue-700 text-sm space-y-1 list-disc pr-4">
                <li>شارك رابط الدعوة مع الشخص المراد دعوته</li>
                <li>الرابط صالح للاستخدام مرة واحدة فقط</li>
                <li>سيحصل المستخدم على صلاحيات المشرف بعد تفعيل الدعوة</li>
              </ul>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
            <div className="text-gray-600">استخدام واحد لكل رابط</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">365</div>
            <div className="text-gray-600">أيام صلاحية</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">فوري</div>
            <div className="text-gray-600">التفعيل</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}