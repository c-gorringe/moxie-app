import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper functions from seed file
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function POST(request: NextRequest) {
  try {
    // Simple password protection
    const { password } = await request.json()

    if (password !== 'reseed-moxie-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting database re-seed...')

    // Clear existing sales and commissions only
    await prisma.sale.deleteMany()
    await prisma.commission.deleteMany()
    await prisma.withholdingLimit.deleteMany()

    console.log('Cleared existing data')

    // Get all users
    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} users`)

    // Date ranges
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    const decemberStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Generate sales data
    const allSales = []

    for (const user of users) {
      const currentDate = new Date(decemberStart)

      while (currentDate <= today) {
        const isDemoWeek = currentDate.getFullYear() === 2026 &&
                          currentDate.getMonth() === 0 &&
                          currentDate.getDate() >= 18 &&
                          currentDate.getDate() <= 24

        const dailySales = isDemoWeek ? randomInt(5, 8) : randomInt(3, 6)

        for (let i = 0; i < dailySales; i++) {
          const saleTime = new Date(currentDate)
          saleTime.setHours(randomInt(8, 18), randomInt(0, 59), randomInt(0, 59))

          const revenue = randomInt(30, 150)
          const isCanceled = Math.random() < (isDemoWeek ? 0.08 : 0.12)

          allSales.push({
            userId: user.id,
            date: saleTime,
            revenue: revenue,
            isCanceled: isCanceled,
            isInstall: !isCanceled && Math.random() < (isDemoWeek ? 0.85 : 0.75),
          })
        }

        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    await prisma.sale.createMany({ data: allSales })
    console.log(`Created ${allSales.length} sales records`)

    // Generate commission data
    const commissions = []
    for (const user of users) {
      const userSales = allSales.filter(s => s.userId === user.id)

      const salesByDate = new Map<string, typeof allSales>()
      userSales.forEach(sale => {
        const dateKey = sale.date.toISOString().split('T')[0]
        if (!salesByDate.has(dateKey)) {
          salesByDate.set(dateKey, [])
        }
        salesByDate.get(dateKey)!.push(sale)
      })

      for (const [dateKey, daySales] of salesByDate) {
        const accountsSold = daySales.filter(s => !s.isCanceled).length
        const earnedAmount = daySales
          .filter(s => !s.isCanceled)
          .reduce((sum, s) => sum + s.revenue, 0) * 0.25

        const withheldAmount = earnedAmount * 0.20
        const paidAmount = earnedAmount - withheldAmount

        const commissionDate = new Date(dateKey)
        const payPeriodStart = new Date(commissionDate.getFullYear(), commissionDate.getMonth(), 1)
        const payPeriodEnd = new Date(commissionDate.getFullYear(), commissionDate.getMonth() + 1, 0)

        commissions.push({
          userId: user.id,
          date: commissionDate,
          accountsSold: accountsSold,
          earnedAmount: earnedAmount,
          paidAmount: paidAmount,
          withheldAmount: withheldAmount,
          payPeriodStart: payPeriodStart,
          payPeriodEnd: payPeriodEnd,
          isPaid: new Date(dateKey) < weekAgo,
        })
      }
    }

    await prisma.commission.createMany({ data: commissions })
    console.log(`Created ${commissions.length} commission records`)

    // Create withholding limits
    for (const user of users) {
      const userCommissions = commissions.filter(c => c.userId === user.id)
      const totalWithheld = userCommissions.reduce((sum, c) => sum + c.withheldAmount, 0)

      await prisma.withholdingLimit.create({
        data: {
          userId: user.id,
          currentAmount: Math.min(totalWithheld, 3000),
          limitAmount: 3000,
          resetDate: new Date('2026-03-01'),
        },
      })
    }

    console.log(`Created withholding limits for ${users.length} users`)

    return NextResponse.json({
      success: true,
      message: 'Database re-seeded successfully',
      stats: {
        users: users.length,
        sales: allSales.length,
        commissions: commissions.length,
      },
    })
  } catch (error) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

