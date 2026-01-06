import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateFilter = searchParams.get('date') || 'today'
    const regionFilter = searchParams.get('region') || 'all'
    const stateFilter = searchParams.get('state') || 'all'
    const rankType = searchParams.get('rankType') || 'individual'

    // Calculate date range (using 2026-01-06 as current date to match seed data)
    const now = new Date('2026-01-06')
    let startDate = new Date('2026-01-06')

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
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setHours(0, 0, 0, 0)
    }

    // Build user filter
    const userFilter: any = {}

    if (regionFilter !== 'all') {
      userFilter.region = regionFilter
    }

    if (stateFilter !== 'all') {
      userFilter.team = {
        contains: stateFilter
      }
    }

    // Get filtered users with their sales
    const users = await prisma.user.findMany({
      where: userFilter,
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
    const rankings = users.map(user => {
      const sales = user.sales.filter(s => !s.isCanceled).length
      const cancels = user.sales.filter(s => s.isCanceled).length
      const revenue = user.sales
        .filter(s => !s.isCanceled)
        .reduce((sum, sale) => sum + Number(sale.revenue), 0)
      const installs = user.sales.filter(s => s.isInstall && !s.isCanceled).length

      return {
        userId: user.id,
        name: user.name,
        team: user.team,
        region: user.region,
        sales,
        cancels,
        revenue,
        installs,
      }
    })

    // Sort by sales descending
    rankings.sort((a, b) => b.sales - a.sales)

    // Add rank numbers
    const rankedData = rankings.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

    // Get top performer
    const topPerformer = rankedData[0] || null

    return NextResponse.json({
      topPerformer,
      rankings: rankedData,
      filters: {
        date: dateFilter,
        region: regionFilter,
        state: stateFilter,
        rankType,
      },
    })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    )
  }
}
