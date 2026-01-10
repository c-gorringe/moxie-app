'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import Link from 'next/link'

interface Ranking {
  rank: number
  userId: string
  name: string
  team: string
  sales: number
  cancels: number
  revenue: number
}

interface LeaderboardData {
  topPerformer: Ranking | null
  rankings: Ranking[]
  filters: {
    date: string
    team: string
    rankType: string
  }
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('today')
  const [regionFilter, setRegionFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [rankType, setRankType] = useState('individual')
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set())
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  useEffect(() => {
    // Get current user ID from localStorage
    const userId = localStorage.getItem('currentUserId')
    setCurrentUserId(userId)

    if (userId) {
      fetchWatchlist(userId)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [dateFilter, regionFilter, stateFilter, rankType])

  const fetchWatchlist = async (userId: string) => {
    try {
      const response = await fetch(`/api/watchlist?userId=${userId}`)
      const data = await response.json()
      const ids = new Set<string>(data.watchlist.map((item: any) => item.userId as string))
      setWatchlistIds(ids)
    } catch (error) {
      console.error('Failed to fetch watchlist:', error)
    }
  }

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        date: dateFilter,
        region: regionFilter,
        state: stateFilter,
        rankType,
      })

      // Add custom date range if selected
      if (dateFilter === 'custom' && customStartDate && customEndDate) {
        params.set('startDate', customStartDate)
        params.set('endDate', customEndDate)
      }

      const response = await fetch(`/api/leaderboard?${params}`)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)
    if (value === 'custom') {
      setShowCustomDatePicker(true)
    } else {
      setShowCustomDatePicker(false)
    }
  }

  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      fetchLeaderboard()
      setShowCustomDatePicker(false)
    }
  }

  const toggleWatchlist = async (userId: string, name: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to profile
    e.stopPropagation()

    if (!currentUserId) {
      alert('Please log in to use watchlist')
      return
    }

    const isOnWatchlist = watchlistIds.has(userId)

    try {
      if (isOnWatchlist) {
        // Remove from watchlist
        const response = await fetch(
          `/api/watchlist?userId=${currentUserId}&watchedUserId=${userId}`,
          { method: 'DELETE' }
        )

        if (response.ok) {
          const newWatchlist = new Set(watchlistIds)
          newWatchlist.delete(userId)
          setWatchlistIds(newWatchlist)
        }
      } else {
        // Add to watchlist
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUserId,
            watchedUserId: userId,
          }),
        })

        if (response.ok) {
          const newWatchlist = new Set(watchlistIds)
          newWatchlist.add(userId)
          setWatchlistIds(newWatchlist)
        } else {
          const error = await response.json()
          alert(error.error || 'Failed to add to watchlist')
        }
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error)
      alert('Failed to update watchlist')
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
        {/* Top 3 Podium */}
        {data?.rankings && data.rankings.length > 0 && (
          <div className="bg-gradient-to-br from-moxie-primary to-moxie-secondary rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">🏆 Top Performers</h2>

            {/* Podium Layout */}
            <div className="grid grid-cols-3 gap-3">
              {/* 2nd Place */}
              {data.rankings[1] && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-3xl mb-1">🥈</div>
                  <p className="text-xs opacity-75 mb-1">2nd Place</p>
                  <p className="font-bold text-sm truncate">{data.rankings[1].name}</p>
                  <p className="text-2xl font-bold mt-2">{data.rankings[1].sales}</p>
                  <p className="text-xs opacity-75">sales</p>
                </div>
              )}

              {/* 1st Place - Taller */}
              {data.rankings[0] && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center -mt-2">
                  <div className="text-4xl mb-1">🥇</div>
                  <p className="text-xs opacity-75 mb-1">1st Place</p>
                  <p className="font-bold truncate">{data.rankings[0].name}</p>
                  <p className="text-xs opacity-75 truncate mt-1">{data.rankings[0].team}</p>
                  <p className="text-3xl font-bold mt-2">{data.rankings[0].sales}</p>
                  <p className="text-xs opacity-75">sales</p>
                </div>
              )}

              {/* 3rd Place */}
              {data.rankings[2] && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-3xl mb-1">🥉</div>
                  <p className="text-xs opacity-75 mb-1">3rd Place</p>
                  <p className="font-bold text-sm truncate">{data.rankings[2].name}</p>
                  <p className="text-2xl font-bold mt-2">{data.rankings[2].sales}</p>
                  <p className="text-xs opacity-75">sales</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          {/* Row 1: Date and Rank Type */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="today">📅 Today</option>
              <option value="week">📅 Week</option>
              <option value="month">📅 Month</option>
              <option value="custom">📅 Custom Range</option>
            </select>

            <select
              value={rankType}
              onChange={(e) => setRankType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="individual">👤 Individual</option>
              <option value="team">👥 Team</option>
            </select>
          </div>

          {/* Row 2: Region and State */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="all">🌎 All Regions</option>
              <option value="West">West</option>
              <option value="Southwest">Southwest</option>
              <option value="Northeast">Northeast</option>
              <option value="Southeast">Southeast</option>
            </select>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="all">📍 All States</option>
              <option value="NV">Nevada</option>
              <option value="CA">California</option>
              <option value="AZ">Arizona</option>
              <option value="TX">Texas</option>
              <option value="NY">New York</option>
              <option value="FL">Florida</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-600">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Name</div>
              <div className="col-span-3 text-center">Sales</div>
              <div className="col-span-2 text-center">Cancels</div>
              <div className="col-span-1 text-center">⭐</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {data?.rankings.map((ranking) => (
              <div
                key={ranking.userId}
                className="px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1 text-lg font-bold text-gray-400">
                    {ranking.rank}
                  </div>
                  <Link
                    href={`/profile/${ranking.userId}`}
                    className="col-span-5"
                  >
                    <p className="font-semibold text-gray-900">{ranking.name}</p>
                    <p className="text-xs text-gray-500">{ranking.team}</p>
                  </Link>
                  <div className="col-span-3 text-center">
                    <span className="text-lg font-bold text-moxie-primary">
                      {ranking.sales}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {ranking.cancels}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={(e) => toggleWatchlist(ranking.userId, ranking.name, e)}
                      className={`p-1 rounded-full transition-all ${
                        watchlistIds.has(ranking.userId)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-300 hover:text-yellow-500'
                      }`}
                      aria-label={
                        watchlistIds.has(ranking.userId)
                          ? 'Remove from watchlist'
                          : 'Add to watchlist'
                      }
                    >
                      {watchlistIds.has(ranking.userId) ? (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh hint */}
        <p className="text-center text-sm text-gray-500 py-4">
          Pull down to refresh
        </p>
      </main>

      {/* Custom Date Range Modal */}
      {showCustomDatePicker && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowCustomDatePicker(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Date Range
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-moxie-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-moxie-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomDatePicker(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCustomDateRange}
                disabled={!customStartDate || !customEndDate}
                className="flex-1 px-4 py-2 bg-moxie-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
