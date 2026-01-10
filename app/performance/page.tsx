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
  trends: {
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

const TrendIndicator = ({ value, inverse = false }: { value: number; inverse?: boolean }) => {
  const isPositive = inverse ? value < 0 : value > 0
  const isNegative = inverse ? value > 0 : value < 0
  const color = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-400'

  if (value === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
        <span>→</span>
        <span>0%</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${color}`}>
      {value > 0 ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{Math.abs(value)}%</span>
    </div>
  )
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
      // Get current user from localStorage
      const userId = localStorage.getItem('currentUserId') || ''
      const params = new URLSearchParams({
        userId: userId,
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
            {data?.trends && <TrendIndicator value={data.trends.sales} />}
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
            <p className="text-4xl font-bold text-green-600">
              ${data?.metrics.revenue.toLocaleString()}
            </p>
            {data?.trends && <TrendIndicator value={data.trends.revenue} />}
          </div>

          {/* Installs Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Installs</p>
            <p className="text-4xl font-bold text-blue-600">{data?.metrics.installs}</p>
            {data?.trends && <TrendIndicator value={data.trends.installs} />}
          </div>

          {/* Cancels Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Cancels</p>
            <p className="text-4xl font-bold text-red-600">{data?.metrics.cancels}</p>
            {data?.trends && <TrendIndicator value={data.trends.cancels} inverse />}
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
