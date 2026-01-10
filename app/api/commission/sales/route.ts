import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'userId and date are required' },
        { status: 400 }
      )
    }

    // Parse the date and get start/end of day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Fetch all sales for this user on this day
    const sales = await prisma.sale.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Format the sales data
    const formattedSales = sales.map(sale => ({
      id: sale.id,
      date: sale.date,
      revenue: Number(sale.revenue),
      accountsSold: sale.accountsSold,
      isCanceled: sale.isCanceled,
      isInstall: sale.isInstall,
    }))

    return NextResponse.json({
      sales: formattedSales,
      total: {
        count: sales.length,
        revenue: sales.reduce((sum, s) => sum + Number(s.revenue), 0),
      },
    })
  } catch (error) {
    console.error('Commission sales API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}
