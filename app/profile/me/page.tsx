'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import Link from 'next/link'

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
    totalSales: number
    totalRevenue: number
  }
  accolades: Array<{
    id: string
    title: string
    year: number
  }>
}

export default function MyProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    tagline: '',
    phone: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      // Get first user from performance API, then fetch their profile
      console.log('Fetching current user...')
      const perfResponse = await fetch('/api/performance')
      const perfData = await perfResponse.json()
      const userId = perfData.user?.id

      if (!userId) {
        throw new Error('No user found')
      }

      console.log('Fetching profile for user:', userId)
      const response = await fetch(`/api/users/${userId}`)
      console.log('Response status:', response.status)
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Profile data received:', data)
      if (data.error) {
        throw new Error(data.error)
      }
      setData(data)
      setEditForm({
        name: data.user.name,
        tagline: data.user.tagline || '',
        phone: data.user.phone || '',
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // TODO: Save to API
    alert('Profile updated! (This would save to the API)')
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (data) {
      setEditForm({
        name: data.user.name,
        tagline: data.user.tagline || '',
        phone: data.user.phone || '',
      })
    }
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
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
          <p className="text-gray-500">Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-moxie-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-moxie-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-moxie-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-moxie-primary to-moxie-secondary rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {data.user.name?.charAt(0) || 'U'}
                </span>
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                  📷
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{data.user.name}</h2>
                  {data.user.tagline && (
                    <p className="text-gray-600 mt-1">{data.user.tagline}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>📧 {data.user.email}</span>
                    {data.user.phone && <span>📞 {data.user.phone}</span>}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Add a tagline..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team & Region Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Team Information</h3>
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
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-moxie-primary to-moxie-secondary rounded-lg p-4 text-white">
              <p className="text-3xl font-bold">{data.stats.bestDay}</p>
              <p className="text-sm opacity-90 mt-1">Best Day</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-3xl font-bold">{data.stats.bestQuarter}</p>
              <p className="text-sm opacity-90 mt-1">Best Quarter</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-3xl font-bold">{data.stats.bestYear}</p>
              <p className="text-sm opacity-90 mt-1">Best Year</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-3xl font-bold">{data.stats.bestYear}</p>
              <p className="text-sm opacity-90 mt-1">Total Sales</p>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/performance"
              className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View Full Stats →
            </Link>
          </div>
        </div>

        {/* Accolades */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">My Accolades</h3>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/commission"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors"
            >
              <span>💰</span>
              <span>Commission</span>
            </Link>
            <Link
              href="/performance"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              <span>📊</span>
              <span>Performance</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors"
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
