import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch watchlist with real-time stats
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get user's watchlist with watched users' data
    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        watchedUser: {
          include: {
            sales: {
              where: {
                date: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's sales
                },
              },
            },
            commissions: {
              where: {
                date: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's commissions
                },
              },
            },
          },
        },
      },
      orderBy: {
        addedAt: 'desc',
      },
    })

    // Calculate stats for each watched user
    const watchlistWithStats = watchlist.map((item) => {
      const user = item.watchedUser
      const todaySales = user.sales.filter((s) => !s.isCanceled).length
      const todayRevenue = user.sales
        .filter((s) => !s.isCanceled)
        .reduce((sum, sale) => sum + Number(sale.revenue), 0)
      const todayCommission = user.commissions.reduce(
        (sum, comm) => sum + Number(comm.earnedAmount),
        0
      )

      return {
        id: item.id,
        userId: user.id,
        name: user.name,
        team: user.team,
        region: user.region,
        profileImage: user.profileImage,
        tagline: user.tagline,
        addedAt: item.addedAt,
        stats: {
          todaySales,
          todayRevenue,
          todayCommission,
        },
      }
    })

    return NextResponse.json({
      watchlist: watchlistWithStats,
      count: watchlistWithStats.length,
    })
  } catch (error) {
    console.error('Watchlist GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

// POST - Add to watchlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, watchedUserId } = body

    if (!userId || !watchedUserId) {
      return NextResponse.json(
        { error: 'userId and watchedUserId are required' },
        { status: 400 }
      )
    }

    // Prevent user from watching themselves
    if (userId === watchedUserId) {
      return NextResponse.json(
        { error: 'Cannot add yourself to watchlist' },
        { status: 400 }
      )
    }

    // Check if already on watchlist
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_watchedUserId: {
          userId,
          watchedUserId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'User already on watchlist' },
        { status: 400 }
      )
    }

    // Add to watchlist
    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId,
        watchedUserId,
      },
      include: {
        watchedUser: {
          select: {
            id: true,
            name: true,
            team: true,
            region: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `${watchlistItem.watchedUser.name} added to watchlist`,
      watchlistItem,
    })
  } catch (error) {
    console.error('Watchlist POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const watchedUserId = searchParams.get('watchedUserId')

    if (!userId || !watchedUserId) {
      return NextResponse.json(
        { error: 'userId and watchedUserId are required' },
        { status: 400 }
      )
    }

    // Delete from watchlist
    await prisma.watchlist.delete({
      where: {
        userId_watchedUserId: {
          userId,
          watchedUserId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Removed from watchlist',
    })
  } catch (error) {
    console.error('Watchlist DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    )
  }
}
