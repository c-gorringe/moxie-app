'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Get current user from localStorage
  useEffect(() => {
    const userName = localStorage.getItem('currentUserName')
    const userId = localStorage.getItem('currentUserId')

    if (userName && userId) {
      // Fetch user email from API
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          setCurrentUser({
            name: userName,
            email: data.user?.email || 'user@moxie.com'
          })
        })
        .catch(() => {
          setCurrentUser({ name: userName, email: 'user@moxie.com' })
        })
    } else {
      setCurrentUser({ name: 'Guest', email: 'guest@moxie.com' })
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { name: 'My Profile', href: '/profile/me', icon: '👤' },
    { name: 'My Stats', href: '/performance', icon: '📊' },
    { name: 'Commission', href: '/commission', icon: '💰' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Help & Support', href: '#', icon: '❓' },
    { name: 'Logout', href: '#', icon: '🚪', danger: true },
  ]

  const handleLogout = () => {
    localStorage.removeItem('currentUserId')
    localStorage.removeItem('currentUserName')
    router.push('/login')
  }

  const getInitial = () => {
    return currentUser?.name?.charAt(0).toUpperCase() || 'G'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity"
      >
        {getInitial()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center text-white font-bold">
                  {getInitial()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentUser?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email || 'guest@moxie.com'}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                item.name === 'Logout' ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-red-600 w-full text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      item.danger ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500 text-center">
                MOXIE v1.0.0
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
