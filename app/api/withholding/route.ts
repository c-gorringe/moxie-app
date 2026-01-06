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
    const now = new Date()
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
        label: 'This Pay Period',
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
