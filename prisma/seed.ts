import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'caleb@moxie.com',
        name: 'Caleb Gorringe',
        tagline: 'Top performer 2024',
        team: 'Las Vegas, North',
        region: 'Nevada',
        joinedDate: new Date('2023-01-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'cole@moxie.com',
        name: 'Cole Gorringe',
        tagline: 'No time for bagels',
        team: 'Las Vegas, South',
        region: 'Nevada',
        joinedDate: new Date('2023-03-20'),
        isActive: true,
        lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
      },
    }),
    prisma.user.create({
      data: {
        email: 'brock@moxie.com',
        name: 'Brock Barton',
        tagline: 'Closing deals daily',
        team: 'Las Vegas, North',
        region: 'Nevada',
        joinedDate: new Date('2022-11-10'),
        isActive: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jake@moxie.com',
        name: 'Jake Allen',
        tagline: 'Always hustling',
        team: 'Reno',
        region: 'Nevada',
        joinedDate: new Date('2023-04-20'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@moxie.com',
        name: 'Sarah Hernandez',
        tagline: 'New but determined',
        team: 'Henderson',
        region: 'Nevada',
        joinedDate: new Date('2024-01-05'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'justin@moxie.com',
        name: 'Justin Bodden',
        tagline: 'Record breaker',
        team: 'Las Vegas, West',
        region: 'Nevada',
        joinedDate: new Date('2022-08-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'whitney@moxie.com',
        name: 'Whitney Smith',
        tagline: 'Customer first',
        team: 'Sparks',
        region: 'Nevada',
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
        team: 'Las Vegas, East',
        region: 'Nevada',
        joinedDate: new Date('2023-02-28'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'holden@moxie.com',
        name: 'Holden Anderson',
        tagline: 'Rising star',
        team: 'Carson City',
        region: 'Nevada',
        joinedDate: new Date('2023-09-10'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'matt@moxie.com',
        name: 'Matt Moran',
        tagline: 'Steady and reliable',
        team: 'Elko',
        region: 'Nevada',
        joinedDate: new Date('2022-12-01'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create sales for today
  const today = new Date()
  const salesData = [
    { userId: users[0].id, count: 12, revenue: 3600 }, // Caleb - 12 sales
    { userId: users[1].id, count: 10, revenue: 2800 }, // Cole - 10 sales
    { userId: users[2].id, count: 10, revenue: 2900 }, // Brock - 10 sales
    { userId: users[3].id, count: 4, revenue: 2150 },  // Jake - 4 sales
    { userId: users[4].id, count: 1, revenue: 450 },   // Sarah - 1 sale
    { userId: users[5].id, count: 9, revenue: 2700 },  // Justin - 9 sales
    { userId: users[6].id, count: 6, revenue: 1800 },  // Whitney - 6 sales
    { userId: users[7].id, count: 6, revenue: 1750 },  // Emily - 6 sales
    { userId: users[8].id, count: 4, revenue: 1200 },  // Holden - 4 sales
    { userId: users[9].id, count: 1, revenue: 300 },   // Matt - 1 sale
  ]

  let totalSales = 0
  for (const data of salesData) {
    const sales = []
    for (let i = 0; i < data.count; i++) {
      sales.push({
        userId: data.userId,
        date: today,
        revenue: data.revenue / data.count,
        accountsSold: 1,
        isInstall: i % 2 === 0, // Half are installs
        isCanceled: false,
      })
    }
    await prisma.sale.createMany({ data: sales })
    totalSales += data.count
  }

  // Add some cancels
  await prisma.sale.create({
    data: {
      userId: users[1].id, // Cole
      date: today,
      revenue: 0,
      accountsSold: 1,
      isCanceled: true,
      isInstall: false,
    },
  })
  await prisma.sale.create({
    data: {
      userId: users[2].id, // Brock
      date: today,
      revenue: 0,
      accountsSold: 1,
      isCanceled: true,
      isInstall: false,
    },
  })
  await prisma.sale.create({
    data: {
      userId: users[2].id, // Brock - 2 cancels
      date: today,
      revenue: 0,
      accountsSold: 1,
      isCanceled: true,
      isInstall: false,
    },
  })

  console.log(`✅ Created ${totalSales + 3} sales`)

  // Create accolades
  const accolades = await Promise.all([
    prisma.accolade.create({
      data: {
        userId: users[0].id, // Caleb
        title: '2024 Top Dog Winner',
        year: 2024,
      },
    }),
    prisma.accolade.create({
      data: {
        userId: users[1].id, // Cole
        title: '2024 Most Improved',
        year: 2024,
      },
    }),
    prisma.accolade.create({
      data: {
        userId: users[1].id, // Cole
        title: '2024 Rookie of the Year',
        year: 2024,
      },
    }),
    prisma.accolade.create({
      data: {
        userId: users[3].id, // Jake
        title: '2023 Top Performer',
        year: 2023,
      },
    }),
  ])

  console.log(`✅ Created ${accolades.length} accolades`)

  // Create commissions
  const commissions = []
  for (const user of users) {
    commissions.push({
      userId: user.id,
      date: today,
      accountsSold: 5,
      earnedAmount: 1500,
      paidAmount: 1200,
      withheldAmount: 300,
      payPeriodStart: new Date(today.getFullYear(), today.getMonth(), 1),
      payPeriodEnd: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      isPaid: false,
    })
  }
  await prisma.commission.createMany({ data: commissions })

  console.log(`✅ Created ${commissions.length} commissions`)

  // Create withholding limits
  const withholdingLimits = await Promise.all([
    prisma.withholdingLimit.create({
      data: {
        userId: users[0].id, // Caleb
        currentAmount: 2588,
        limitAmount: 3000,
      },
    }),
    prisma.withholdingLimit.create({
      data: {
        userId: users[1].id, // Cole
        currentAmount: 1200,
        limitAmount: 3000,
      },
    }),
    prisma.withholdingLimit.create({
      data: {
        userId: users[3].id, // Jake
        currentAmount: 2750,
        limitAmount: 3000,
      },
    }),
  ])

  console.log(`✅ Created ${withholdingLimits.length} withholding limits`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
