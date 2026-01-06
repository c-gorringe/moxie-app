'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity"
      >
        J
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
                  J
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jake Allen</p>
                  <p className="text-xs text-gray-500">jake@moxie.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsOpen(false)
                    if (item.name === 'Logout') {
                      // TODO: Handle logout
                      alert('Logout functionality would go here')
                    }
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    item.danger ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
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
