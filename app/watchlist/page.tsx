'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import Link from 'next/link'

interface WatchlistItem {
  id: string
  userId: string
  name: string
  team: string
  region: string
  profileImage: string | null
  tagline: string | null
  addedAt: string
  stats: {
    todaySales: number
    todayRevenue: number
    todayCommission: number
  }
}

interface WatchlistData {
  watchlist: WatchlistItem[]
  count: number
}

export default function WatchlistPage() {
  const [data, setData] = useState<WatchlistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get current user ID from localStorage
    const userId = localStorage.getItem('currentUserId')
    setCurrentUserId(userId)

    if (userId) {
      fetchWatchlist(userId)
    }
  }, [])

  const fetchWatchlist = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/watchlist?userId=${userId}`)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWatchlist = async (watchedUserId: string, name: string) => {
    if (!currentUserId) return

    if (!confirm(`Remove ${name} from your watchlist?`)) return

    try {
      const response = await fetch(
        `/api/watchlist?userId=${currentUserId}&watchedUserId=${watchedUserId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        // Refresh watchlist
        fetchWatchlist(currentUserId)

        // Show success message
        alert(`${name} removed from watchlist`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to remove from watchlist')
      }
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
      alert('Failed to remove from watchlist')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moxie-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-moxie-primary to-moxie-secondary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">👁️ Your Watchlist</h1>
          <p className="text-sm opacity-90">
            {data?.count || 0} {data?.count === 1 ? 'rep' : 'reps'} being watched
          </p>
        </div>

        {/* Empty State */}
        {data?.watchlist.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add reps to your watchlist to track their performance in real-time
            </p>
            <Link
              href="/leaderboard"
              className="inline-block px-6 py-3 bg-moxie-primary text-white rounded-lg font-semibold hover:bg-moxie-primary/90 transition-colors"
            >
              Browse Leaderboard
            </Link>
          </div>
        )}

        {/* Watchlist Items */}
        {data && data.watchlist.length > 0 && (
          <div className="space-y-4">
            {data.watchlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-4">
                    <Link
                      href={`/profile/${item.userId}`}
                      className="flex-1 min-w-0"
                    >
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.team}</p>
                      {item.tagline && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          "{item.tagline}"
                        </p>
                      )}
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWatchlist(item.userId, item.name)}
                      className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove from watchlist"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Today's Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {item.stats.todaySales}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Sales Today</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${Math.round(item.stats.todayRevenue).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Revenue</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        ${Math.round(item.stats.todayCommission).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Commission</p>
                    </div>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-400 mt-3 text-right">
                    Added {new Date(item.addedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* View Profile Link */}
                <Link
                  href={`/profile/${item.userId}`}
                  className="block bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-moxie-primary hover:bg-gray-100 transition-colors"
                >
                  View Full Profile →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Refresh hint */}
        <p className="text-center text-sm text-gray-500 py-4">
          Pull down to refresh
        </p>
      </main>
    </div>
  )
}
