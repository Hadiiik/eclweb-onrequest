// components/InviteProcessor.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface InviteProcessorProps {
  inviteToken: string
}

type Status = 'loading' | 'success' | 'error'

export default function InviteProcessor({ inviteToken }: InviteProcessorProps) {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('جاري تجهيز الدعوة للإشراف...')
  const router = useRouter()

  useEffect(() => {
    const processInvitation = async () => {
      try {
        setStatus('loading')
        setMessage('جاري التحقق من صحة الدعوة...')

        const response = await fetch('/api/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invite_token: inviteToken }),
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setStatus('success')
          setMessage(result.message || 'تم تفعيل الدعوة بنجاح!')
          
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage(result.error || 'حدث خطأ أثناء معالجة الدعوة')
        }
      } catch (error) {
        console.error('Error processing invitation:', error)
        setStatus('error')
        setMessage('حدث خطأ في الاتصال بالخادم')
      }
    }

    processInvitation()
  }, [inviteToken, router])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="flex justify-center mb-4">
              <FaSpinner size={60} className="text-green-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-4">جاري تجهيز الدعوة للإشراف...</h1>
            <p className="text-green-600">{message}</p>
          </>
        )
      
      case 'success':
        return (
          <>
            <div className="flex justify-center mb-4">
              <FaCheckCircle size={60} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-4">تم التفويض بنجاح!</h1>
            <p className="text-green-600">{message}</p>
            <p className="text-green-500 text-sm mt-2">سيتم تحويلك تلقائياً...</p>
          </>
        )
      
      case 'error':
        return (
          <>
            <div className="flex justify-center mb-4">
              <FaTimesCircle size={60} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-4">خطأ في التفويض</h1>
            <p className="text-red-600">{message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {renderContent()}
      </div>
    </div>
  )
}