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
  const [teamFilter, setTeamFilter] = useState('all')
  const [rankType, setRankType] = useState('individual')

  useEffect(() => {
    fetchLeaderboard()
  }, [dateFilter, teamFilter, rankType])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        date: dateFilter,
        team: teamFilter,
        rankType,
      })
      const response = await fetch(`/api/leaderboard?${params}`)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
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
        {/* Top Performer */}
        {data?.topPerformer && (
          <div className="bg-gradient-to-r from-moxie-primary to-moxie-secondary rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">⭐ Feature Top Performer</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.topPerformer.name}</p>
                <p className="text-sm opacity-90">{data.topPerformer.team}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{data.topPerformer.sales}</p>
                <p className="text-sm">sales</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="today">Today</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="all">All Teams</option>
              <option value="region">Region</option>
              <option value="state">State</option>
            </select>

            <select
              value={rankType}
              onChange={(e) => setRankType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-moxie-primary"
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-600">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Name</div>
              <div className="col-span-3 text-center">Sales</div>
              <div className="col-span-2 text-center">Cancels</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {data?.rankings.map((ranking) => (
              <Link
                key={ranking.userId}
                href={`/profile/${ranking.userId}`}
                className="block px-4 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1 text-lg font-bold text-gray-400">
                    {ranking.rank}
                  </div>
                  <div className="col-span-6">
                    <p className="font-semibold text-gray-900">{ranking.name}</p>
                    <p className="text-xs text-gray-500">{ranking.team}</p>
                  </div>
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
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Refresh hint */}
        <p className="text-center text-sm text-gray-500 py-4">
          Pull down to refresh
        </p>
      </main>
    </div>
  )
}
