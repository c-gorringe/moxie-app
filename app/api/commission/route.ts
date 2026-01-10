import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'pay-period'

    // If no userId provided, get first user from database
    if (!userId) {
      const firstUser = await prisma.user.findFirst({ orderBy: { name: 'asc' } })
      userId = firstUser?.id || ''
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    let label = 'This Pay Period'

    switch (period) {
      case 'pay-period':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        label = 'This Pay Period'
        break
      case 'prev-pay-period':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        label = 'Previous Pay Period'
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        label = 'Last 30 Days'
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        label = 'Last Quarter'
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        label = 'Last Year'
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        label = 'This Pay Period'
    }

    const commissions = await prisma.commission.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
    })

    // Calculate summary
    const totalAccountsSold = commissions.reduce((sum, c) => sum + c.accountsSold, 0)
    const totalEarned = commissions.reduce((sum, c) => sum + Number(c.earnedAmount), 0)
    const totalPaid = commissions.reduce((sum, c) => sum + Number(c.paidAmount), 0)
    const totalWithheld = commissions.reduce((sum, c) => sum + Number(c.withheldAmount), 0)

    // Get current pay period for reference
    const payPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const payPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return NextResponse.json({
      summary: {
        accountsSold: totalAccountsSold,
        earned: Math.round(totalEarned),
        paid: Math.round(totalPaid),
        withheld: Math.round(totalWithheld),
      },
      payPeriod: {
        start: payPeriodStart,
        end: payPeriodEnd,
        label: label,
      },
      transactions: commissions.map(c => ({
        id: c.id,
        date: c.date,
        accountsSold: c.accountsSold,
        earned: Math.round(Number(c.earnedAmount)),
        paid: Math.round(Number(c.paidAmount)),
        withheld: Math.round(Number(c.withheldAmount)),
        isPaid: c.isPaid,
      })),
    })
  } catch (error) {
    console.error('Commission API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commission data' },
      { status: 500 }
    )
  }
}
