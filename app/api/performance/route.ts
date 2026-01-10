import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let userId = searchParams.get('userId')
    const dateFilter = searchParams.get('date') || 'today'

    // If no userId provided, get first user from database
    if (!userId) {
      const firstUser = await prisma.user.findFirst({ orderBy: { name: 'asc' } })
      userId = firstUser?.id || ''
    }

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (dateFilter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      default:
        startDate.setHours(0, 0, 0, 0)
    }

    // Calculate previous period for comparison
    let previousStartDate = new Date()
    let previousEndDate = new Date(startDate)
    previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)

    switch (dateFilter) {
      case 'today':
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate.setHours(23, 59, 59, 999)
        break
      case 'week':
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 7)
        break
      case 'month':
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(previousStartDate.getMonth() - 1)
        break
    }

    // Get user with sales for current and previous period
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sales: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Filter sales for current period
    const currentSales = user.sales.filter(s => s.date >= startDate)
    const previousSales = user.sales.filter(
      s => s.date >= previousStartDate && s.date <= previousEndDate
    )

    // Calculate current period metrics
    const sales = currentSales.filter(s => !s.isCanceled).length
    const revenue = currentSales
      .filter(s => !s.isCanceled)
      .reduce((sum, sale) => sum + Number(sale.revenue), 0)
    const installs = currentSales.filter(s => s.isInstall && !s.isCanceled).length
    const cancels = currentSales.filter(s => s.isCanceled).length

    // Calculate previous period metrics
    const prevSales = previousSales.filter(s => !s.isCanceled).length
    const prevRevenue = previousSales
      .filter(s => !s.isCanceled)
      .reduce((sum, sale) => sum + Number(sale.revenue), 0)
    const prevInstalls = previousSales.filter(s => s.isInstall && !s.isCanceled).length
    const prevCancels = previousSales.filter(s => s.isCanceled).length

    // Calculate trends (percentage change)
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const salesTrend = calculateTrend(sales, prevSales)
    const revenueTrend = calculateTrend(revenue, prevRevenue)
    const installsTrend = calculateTrend(installs, prevInstalls)
    const cancelsTrend = calculateTrend(cancels, prevCancels)

    // Get all users for leaderboard
    const allUsers = await prisma.user.findMany({
      include: {
        sales: {
          where: {
            date: {
              gte: startDate,
            },
          },
        },
      },
    })

    // Calculate rankings
    const rankings = allUsers.map(u => {
      const userSales = u.sales.filter(s => !s.isCanceled).length
      const userCancels = u.sales.filter(s => s.isCanceled).length
      return {
        userId: u.id,
        name: u.name,
        team: u.team,
        sales: userSales,
        cancels: userCancels,
      }
    })

    rankings.sort((a, b) => b.sales - a.sales)

    // Find current user's rank
    const userRank = rankings.findIndex(r => r.userId === userId) + 1

    // Get top 4 for mini leaderboard
    const topRankings = rankings.slice(0, 4).map((r, index) => ({
      ...r,
      rank: index + 1,
    }))

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        team: user.team,
        region: user.region,
      },
      metrics: {
        sales,
        revenue: Math.round(revenue),
        installs,
        cancels,
      },
      trends: {
        sales: salesTrend,
        revenue: revenueTrend,
        installs: installsTrend,
        cancels: cancelsTrend,
      },
      ranking: {
        currentRank: userRank,
        topPerformers: topRankings,
      },
    })
  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}
