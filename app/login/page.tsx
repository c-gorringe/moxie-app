'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  team: string
  region: string
  profileImage: string | null
}

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (userId: string, userName: string) => {
    // Store selected user in localStorage
    localStorage.setItem('currentUserId', userId)
    localStorage.setItem('currentUserName', userName)

    // Redirect to leaderboard
    router.push('/leaderboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-moxie-primary mb-2">MOXIE</h1>
          <p className="text-gray-600">Select your profile to continue</p>
        </div>

        {/* User List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id, user.name)}
              className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-moxie-primary hover:bg-gray-50 transition-all group"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-moxie-primary to-moxie-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 group-hover:text-moxie-primary transition-colors">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">{user.team}</p>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-moxie-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          MOXIE Sales Tracking v1.0.0
        </p>
      </div>
    </div>
  )
}
