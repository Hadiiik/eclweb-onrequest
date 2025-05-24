import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4" dir="rtl">
      <div className="text-center animate-pulse">
        <div className="flex justify-center mb-4">
          <FaSpinner size={60} className="text-green-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-green-700 mb-4">ecl web</h1>
        <p className="text-green-600">ملفاتك في الطريق ... لا تذهب بعيدا 😊</p>
      </div>
    </div>
  )
}

export default Loading
