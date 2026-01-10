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
    let endDate: Date | undefined
    let label = 'This Pay Period'

    switch (period) {
      case 'pay-period':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        label = 'This Pay Period'
        break
      case 'prev-pay-period':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
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

    const dateFilter: any = { gte: startDate }
    if (endDate) {
      dateFilter.lte = endDate
    }

    const commissions = await prisma.commission.findMany({
      where: {
        userId,
        date: dateFilter,
      },
      orderBy: { date: 'desc' },
    })

    // Get withholding limit
    const withholdingLimit = await prisma.withholdingLimit.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    const limitAmount = Number(withholdingLimit?.limitAmount || 3000)
    const currentWithheld = Number(withholdingLimit?.currentAmount || 0)

    // Calculate summary
    const totalAccountsSold = commissions.reduce((sum, c) => sum + c.accountsSold, 0)
    const totalWithheld = commissions.reduce((sum, c) => sum + Number(c.withheldAmount), 0)

    // Get current pay period
    const payPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const payPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return NextResponse.json({
      limit: {
        amount: limitAmount,
        current: Math.round(currentWithheld),
        remaining: Math.round(limitAmount - currentWithheld),
        percentage: Math.round((currentWithheld / limitAmount) * 100),
      },
      summary: {
        accountsSold: totalAccountsSold,
        withheld: Math.round(totalWithheld),
        days: commissions.length,
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
        withheld: Math.round(Number(c.withheldAmount)),
      })),
    })
  } catch (error) {
    console.error('Withholding API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch withholding data' },
      { status: 500 }
    )
  }
}
