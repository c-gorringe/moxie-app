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
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'pay-period':
        // This pay period = start of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'prev-pay-period':
        // Previous pay period = all of last month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        startDate.setHours(0, 0, 0, 0)
        break
      default:
        // Default to pay period
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        startDate.setHours(0, 0, 0, 0)
    }

    // Calculate previous period for comparison
    let previousStartDate = new Date()
    let previousEndDate = new Date()

    switch (dateFilter) {
      case 'today':
        // Previous period = yesterday
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      case 'week':
        // Previous period = previous 7 days
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 7)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      case 'month':
        // Previous period = previous month
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(previousStartDate.getMonth() - 1)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      case 'quarter':
        // Previous period = previous 3 months
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(previousStartDate.getMonth() - 3)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      case 'year':
        // Previous period = previous year
        previousStartDate = new Date(startDate)
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      case 'pay-period':
        // Previous period = previous pay period (last month)
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      case 'prev-pay-period':
        // Previous period = 2 months ago
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
        break
      default:
        // Default to previous pay period
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        previousStartDate.setHours(0, 0, 0, 0)
        previousEndDate = new Date(startDate)
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1)
    }

    // Get user with sales for current and previous period
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sales: true,
      },
    })

    if (!user) {
      console.error(`Performance API: User not found with id: ${userId}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log(`Performance API: Found user ${user.name}, ${user.sales.length} total sales`)
    console.log(`Date range - Current: ${startDate.toISOString()} to now`)
    console.log(`Date range - Previous: ${previousStartDate.toISOString()} to ${previousEndDate.toISOString()}`)

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
      if (previous === 0) {
        return current > 0 ? 100 : 0
      }
      const percentChange = ((current - previous) / previous) * 100
      // Cap at +/- 999% to avoid extreme values
      const capped = Math.max(-999, Math.min(999, percentChange))
      return Math.round(capped)
    }

    const salesTrend = calculateTrend(sales, prevSales)
    const revenueTrend = calculateTrend(revenue, prevRevenue)
    const installsTrend = calculateTrend(installs, prevInstalls)
    const cancelsTrend = calculateTrend(cancels, prevCancels)

    console.log(`Trends - Sales: ${salesTrend}%, Revenue: ${revenueTrend}%, Installs: ${installsTrend}%, Cancels: ${cancelsTrend}%`)

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
