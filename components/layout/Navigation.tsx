'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { name: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
  { name: 'Performance', href: '/performance', icon: '📊' },
  { name: 'Watchlist', href: '/watchlist', icon: '👁️' },
  { name: 'Commission', href: '/commission', icon: '💰' },
  { name: 'Profiles', href: '/profile/current', icon: '👤' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform">
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-moxie-primary">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-moxie-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
