'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useNotifications, Notification } from '@/hooks/useNotifications'
import Toast from './Toast'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type?: 'success' | 'error' | 'info' | 'milestone') => string
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationMethods = useNotifications()

  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}

      {/* Render toasts */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 pb-6 space-y-2 pointer-events-auto">
          {notificationMethods.notifications.map((notification) => (
            <Toast
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => notificationMethods.removeNotification(notification.id)}
            />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider')
  }
  return context
}
