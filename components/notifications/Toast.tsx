'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'milestone'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    milestone: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    milestone: '🎉',
  }[type]

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{icon}</span>
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
