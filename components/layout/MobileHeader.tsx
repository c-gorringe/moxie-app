'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from './Navigation'
import ProfileDropdown from './ProfileDropdown'

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/leaderboard" className="text-xl font-bold text-moxie-primary">
            MOXIE
          </Link>

          <ProfileDropdown />
        </div>
      </header>

      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
