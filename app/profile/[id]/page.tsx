'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MobileHeader from '@/components/layout/MobileHeader'

interface ProfileData {
  user: {
    id: string
    name: string
    tagline: string | null
    profileImage: string | null
    email: string
    phone: string | null
    team: string
    region: string
    joinedDate: string
    isActive: boolean
    lastActive: string | null
  }
  stats: {
    bestDay: number
    bestQuarter: number
    bestYear: number
  }
  accolades: Array<{
    id: string
    title: string
    year: number
  }>
}

export default function ProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'accolades'>('details')
  const [isOnWatchlist, setIsOnWatchlist] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()

    // Get current user ID from localStorage
    const currentUser = localStorage.getItem('currentUserId')
    setCurrentUserId(currentUser)

    if (currentUser) {
      checkWatchlistStatus(currentUser)
    }
  }, [userId])

  const checkWatchlistStatus = async (currentUser: string) => {
    try {
      const response = await fetch(`/api/watchlist?userId=${currentUser}`)
      const data = await response.json()
      const isWatched = data.watchlist.some((item: any) => item.userId === userId)
      setIsOnWatchlist(isWatched)
    } catch (error) {
      console.error('Failed to check watchlist status:', error)
    }
  }

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Profile data received:', data)
      setData(data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Offline'
    const now = new Date()
    const lastActive = new Date(dateString)
    const diff = Math.floor((now.getTime() - lastActive.getTime()) / 1000 / 60)

    if (diff < 1) return 'Active now'
    if (diff < 60) return `Active ${diff} min ago`
    if (diff < 1440) return `Active ${Math.floor(diff / 60)} hours ago`
    return 'Offline'
  }

  const toggleWatchlist = async () => {
    if (!currentUserId) {
      alert('Please log in to use watchlist')
      return
    }

    try {
      if (isOnWatchlist) {
        // Remove from watchlist
        const response = await fetch(
          `/api/watchlist?userId=${currentUserId}&watchedUserId=${userId}`,
          { method: 'DELETE' }
        )

        if (response.ok) {
          setIsOnWatchlist(false)
          alert(`${data?.user.name} removed from watchlist`)
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
          setIsOnWatchlist(true)
          alert(`${data?.user.name} added to watchlist`)
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
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moxie-primary"></div>
        </div>
      </div>
    )
  }

  if (!data || !data.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          {/* Profile Image Placeholder */}
          <div className="w-24 h-24 bg-gradient-to-br from-moxie-primary to-moxie-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {data.user.name?.charAt(0) || 'U'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{data.user.name || 'Unknown User'}</h1>
          {data.user.tagline && (
            <p className="text-gray-600 mt-1">{data.user.tagline}</p>
          )}

          <p className="text-sm text-green-600 mt-2">
            {getTimeAgo(data.user.lastActive)}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button className="px-4 py-2 bg-moxie-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
              📞 Call
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              💬 Text
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              ✉️ Email
            </button>
            <button
              onClick={toggleWatchlist}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isOnWatchlist
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isOnWatchlist ? '⭐ On Watchlist' : '👁️ Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                activeTab === 'details'
                  ? 'text-moxie-primary border-b-2 border-moxie-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('accolades')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                activeTab === 'accolades'
                  ? 'text-moxie-primary border-b-2 border-moxie-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Accolades
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="p-6 space-y-6">
              {/* Team Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Team</p>
                  <p className="font-semibold text-gray-900">{data.user.team}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Region</p>
                  <p className="font-semibold text-gray-900">{data.user.region}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Joined</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(data.user.joinedDate)}
                  </p>
                </div>
              </div>

              {/* Best Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Best Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-moxie-primary">
                      {data.stats.bestDay}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Best Day</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-moxie-primary">
                      {data.stats.bestQuarter}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Best Quarter</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-moxie-primary">
                      {data.stats.bestYear}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Best Year</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accolades Tab */}
          {activeTab === 'accolades' && (
            <div className="p-6">
              {data.accolades.length > 0 ? (
                <div className="space-y-3">
                  {data.accolades.map((accolade) => (
                    <div
                      key={accolade.id}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <span className="text-3xl">🏆</span>
                      <div>
                        <p className="font-semibold text-gray-900">{accolade.title}</p>
                        <p className="text-sm text-gray-600">{accolade.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-5xl mb-3">🎯</p>
                  <p>No accolades yet</p>
                  <p className="text-sm mt-1">Keep pushing to earn your first award!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
