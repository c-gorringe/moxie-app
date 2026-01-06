import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sales: true,
        accolades: {
          orderBy: {
            year: 'desc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate best stats
    const allSales = user.sales.filter(s => !s.isCanceled)

    // Group by day
    const salesByDay = allSales.reduce((acc, sale) => {
      const day = sale.date.toISOString().split('T')[0]
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const bestDay = Math.max(...Object.values(salesByDay), 0)

    // Calculate quarterly sales (simplified - using last 90 days as a quarter)
    const lastQuarter = new Date()
    lastQuarter.setDate(lastQuarter.getDate() - 90)
    const bestQuarter = allSales.filter(s => s.date >= lastQuarter).length

    // Calculate yearly sales
    const thisYear = new Date().getFullYear()
    const bestYear = allSales.filter(s => s.date.getFullYear() === thisYear).length

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        tagline: user.tagline,
        profileImage: user.profileImage,
        email: user.email,
        phone: user.phone,
        team: user.team,
        region: user.region,
        joinedDate: user.joinedDate,
        isActive: user.isActive,
        lastActive: user.lastActive,
      },
      stats: {
        bestDay,
        bestQuarter,
        bestYear,
      },
      accolades: user.accolades,
    })
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}
