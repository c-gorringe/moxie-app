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

    // Get user with sales
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate metrics
    const sales = user.sales.filter(s => !s.isCanceled).length
    const revenue = user.sales
      .filter(s => !s.isCanceled)
      .reduce((sum, sale) => sum + Number(sale.revenue), 0)
    const installs = user.sales.filter(s => s.isInstall && !s.isCanceled).length
    const cancels = user.sales.filter(s => s.isCanceled).length

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
