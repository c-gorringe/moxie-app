import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to generate random date between two dates
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper to generate random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
  console.log('🌱 Seeding database with extended data...')

  // Clear existing data
  await prisma.sale.deleteMany()
  await prisma.commission.deleteMany()
  await prisma.withholdingLimit.deleteMany()
  await prisma.accolade.deleteMany()
  await prisma.user.deleteMany()

  // Create users from different states and regions
  const users = await Promise.all([
    // Nevada - West Region
    prisma.user.create({
      data: {
        email: 'jake@moxie.com',
        name: 'Jake Allen',
        tagline: 'Always hustling',
        team: 'Las Vegas North, NV',
        region: 'West',
        joinedDate: new Date('2023-01-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'cole@moxie.com',
        name: 'Cole Gorringe',
        tagline: 'Crushing it daily',
        team: 'Las Vegas South, NV',
        region: 'West',
        joinedDate: new Date('2023-03-20'),
        isActive: true,
        lastActive: new Date(Date.now() - 2 * 60 * 1000),
      },
    }),
    prisma.user.create({
      data: {
        email: 'caleb@moxie.com',
        name: 'Caleb Gorringe',
        tagline: 'Top performer 2024',
        team: 'Reno, NV',
        region: 'West',
        joinedDate: new Date('2023-02-10'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // California - West Region
    prisma.user.create({
      data: {
        email: 'brock@moxie.com',
        name: 'Brock Barton',
        tagline: 'Closing deals daily',
        team: 'Los Angeles, CA',
        region: 'West',
        joinedDate: new Date('2022-11-10'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'whitney@moxie.com',
        name: 'Whitney Smith',
        tagline: 'Customer first',
        team: 'San Francisco, CA',
        region: 'West',
        joinedDate: new Date('2023-06-12'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'emily@moxie.com',
        name: 'Emily Statton',
        tagline: 'Consistent performer',
        team: 'San Diego, CA',
        region: 'West',
        joinedDate: new Date('2023-02-28'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // Arizona - Southwest Region
    prisma.user.create({
      data: {
        email: 'sarah@moxie.com',
        name: 'Sarah Hernandez',
        tagline: 'Rising star',
        team: 'Phoenix, AZ',
        region: 'Southwest',
        joinedDate: new Date('2024-01-05'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'maya@moxie.com',
        name: 'Maya Chen',
        team: 'Tucson, AZ',
        region: 'Southwest',
        joinedDate: new Date('2023-09-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // Texas - Southwest Region
    prisma.user.create({
      data: {
        email: 'justin@moxie.com',
        name: 'Justin Bodden',
        tagline: 'Texas sized goals',
        team: 'Dallas, TX',
        region: 'Southwest',
        joinedDate: new Date('2023-05-20'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'marcus@moxie.com',
        name: 'Marcus Johnson',
        team: 'Houston, TX',
        region: 'Southwest',
        joinedDate: new Date('2023-07-10'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // New York - Northeast Region
    prisma.user.create({
      data: {
        email: 'olivia@moxie.com',
        name: 'Olivia Martinez',
        team: 'New York City, NY',
        region: 'Northeast',
        joinedDate: new Date('2023-04-01'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'liam@moxie.com',
        name: 'Liam Brown',
        team: 'Buffalo, NY',
        region: 'Northeast',
        joinedDate: new Date('2023-08-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // Florida - Southeast Region
    prisma.user.create({
      data: {
        email: 'sophia@moxie.com',
        name: 'Sophia Garcia',
        tagline: 'Sunshine seller',
        team: 'Miami, FL',
        region: 'Southeast',
        joinedDate: new Date('2023-03-10'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'noah@moxie.com',
        name: 'Noah Davis',
        team: 'Tampa, FL',
        region: 'Southeast',
        joinedDate: new Date('2023-10-20'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Date ranges - generate data through today
  const today = new Date() // Current date
  today.setHours(23, 59, 59, 999) // End of today
  const decemberStart = new Date(today.getFullYear(), today.getMonth() - 1, 1) // Last month
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Generate sales data from December through today
  const allSales = []

  for (const user of users) {
    // Generate consistent daily sales for every day from Dec 1 through today
    const currentDate = new Date(decemberStart)

    while (currentDate <= today) {
      // Determine if this is a demo week day (Jan 18-24)
      const isDemoWeek = currentDate.getFullYear() === 2026 &&
                        currentDate.getMonth() === 0 &&
                        currentDate.getDate() >= 18 &&
                        currentDate.getDate() <= 24

      // Consistent daily sales: 3-6 normal days, 5-8 during demo week
      const dailySales = isDemoWeek ? randomInt(5, 8) : randomInt(3, 6)

      for (let i = 0; i < dailySales; i++) {
        const saleTime = new Date(currentDate)
        saleTime.setHours(randomInt(8, 18), randomInt(0, 59), randomInt(0, 59))

        const revenue = randomInt(100, 200)
        const isCanceled = Math.random() < (isDemoWeek ? 0.08 : 0.12) // Lower cancel rate in demo week

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

  // Create all sales
  await prisma.sale.createMany({ data: allSales })
  console.log(`✅ Created ${allSales.length} sales records`)

  // Generate commission data
  const commissions = []
  for (const user of users) {
    // Get user's sales
    const userSales = allSales.filter(s => s.userId === user.id)

    // Group by date and create commission records
    const salesByDate = new Map<string, typeof allSales>()
    userSales.forEach(sale => {
      const dateKey = sale.date.toISOString().split('T')[0]
      if (!salesByDate.has(dateKey)) {
        salesByDate.set(dateKey, [])
      }
      salesByDate.get(dateKey)!.push(sale)
    })

    // Create commission for each day
    for (const [dateKey, daySales] of salesByDate) {
      const accountsSold = daySales.filter(s => !s.isCanceled).length
      const earnedAmount = daySales
        .filter(s => !s.isCanceled)
        .reduce((sum, s) => sum + s.revenue, 0) * 0.50 // 50% commission

      const withheldAmount = earnedAmount * 0.20 // 20% withholding
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
        isPaid: new Date(dateKey) < weekAgo, // Paid if older than a week
      })
    }
  }

  await prisma.commission.createMany({ data: commissions })
  console.log(`✅ Created ${commissions.length} commission records`)

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
  console.log(`✅ Created withholding limits for ${users.length} users`)

  // Add some accolades to top performers
  await prisma.accolade.createMany({
    data: [
      { userId: users[0].id, title: 'Top Seller Q4 2024', year: 2024 },
      { userId: users[0].id, title: 'Rookie of the Year 2023', year: 2023 },
      { userId: users[3].id, title: 'Most Installs 2024', year: 2024 },
      { userId: users[5].id, title: 'Team Player Award 2024', year: 2024 },
      { userId: users[2].id, title: 'President\'s Club 2024', year: 2024 },
    ],
  })
  console.log('✅ Created accolades')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
