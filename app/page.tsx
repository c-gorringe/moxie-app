'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('currentUserId')

    if (userId) {
      // User is logged in, redirect to leaderboard
      router.push('/leaderboard')
    } else {
      // No user logged in, redirect to login
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  )
}
