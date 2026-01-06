'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import Link from 'next/link'

interface PerformanceData {
  user: {
    id: string
    name: string
    team: string
    region: string
  }
  metrics: {
    sales: number
    revenue: number
    installs: number
    cancels: number
  }
  ranking: {
    currentRank: number
    topPerformers: Array<{
      rank: number
      userId: string
      name: string
      sales: number
      cancels: number
    }>
  }
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('today')

  useEffect(() => {
    fetchPerformance()
  }, [dateFilter])

  const fetchPerformance = async () => {
    setLoading(true)
    try {
      // Fetch without userId - API will get first user from database
      const params = new URLSearchParams({
        date: dateFilter,
      })
      const response = await fetch(`/api/performance?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setData(data)
    } catch (error) {
      console.error('Failed to fetch performance:', error)
      setData(null)
    } finally {
      setLoading(false)
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
          <p className="text-gray-500">Failed to load performance data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header with user name and date filter */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data?.user.name}</h1>
            <p className="text-sm text-gray-500">{data?.user.team}</p>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-moxie-primary"
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sales Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-moxie-primary">
            <p className="text-sm font-medium text-gray-600 mb-1">Sales</p>
            <p className="text-4xl font-bold text-moxie-primary">{data?.metrics.sales}</p>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
            <p className="text-4xl font-bold text-green-600">
              ${data?.metrics.revenue.toLocaleString()}
            </p>
          </div>

          {/* Installs Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Installs</p>
            <p className="text-4xl font-bold text-blue-600">{data?.metrics.installs}</p>
          </div>

          {/* Cancels Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Cancels</p>
            <p className="text-4xl font-bold text-red-600">{data?.metrics.cancels}</p>
          </div>
        </div>

        {/* Current Rank */}
        <div className="bg-gradient-to-r from-moxie-primary to-moxie-secondary rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Your Current Rank</p>
          <p className="text-3xl font-bold">#{data?.ranking.currentRank}</p>
        </div>

        {/* Team Leaderboard */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Team Leader Board</h3>
            <button className="text-sm text-moxie-primary font-medium">
              View All →
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {data?.ranking.topPerformers.map((performer) => (
              <Link
                key={performer.userId}
                href={`/profile/${performer.userId}`}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      {performer.rank}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {performer.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-moxie-primary">
                        {performer.sales}
                      </p>
                      <p className="text-xs text-gray-500">sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-600">
                        {performer.cancels}
                      </p>
                      <p className="text-xs text-gray-500">cancels</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pull to refresh hint */}
        <p className="text-center text-sm text-gray-500 py-4">
          Pull down to refresh
        </p>
      </main>
    </div>
  )
}
