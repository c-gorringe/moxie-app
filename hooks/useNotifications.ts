'use client'

import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'milestone'
  timestamp: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'milestone' = 'info') => {
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: Date.now(),
      }

      setNotifications((prev) => [...prev, notification])

      // Auto-remove after 3 seconds
      setTimeout(() => {
        removeNotification(notification.id)
      }, 3000)

      return notification.id
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  }
}
