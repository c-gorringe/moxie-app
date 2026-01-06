import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let userId = searchParams.get('userId')

    // If no userId provided, get first user from database
    if (!userId) {
      const firstUser = await prisma.user.findFirst({ orderBy: { name: 'asc' } })
      userId = firstUser?.id || ''
    }

    const commissions = await prisma.commission.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    })

    // Calculate summary
    const totalAccountsSold = commissions.reduce((sum, c) => sum + c.accountsSold, 0)
    const totalEarned = commissions.reduce((sum, c) => sum + Number(c.earnedAmount), 0)
    const totalPaid = commissions.reduce((sum, c) => sum + Number(c.paidAmount), 0)
    const totalWithheld = commissions.reduce((sum, c) => sum + Number(c.withheldAmount), 0)

    // Get current pay period
    const now = new Date()
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
        label: 'This Pay Period',
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
