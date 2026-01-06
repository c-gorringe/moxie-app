import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users from different states and regions
  const users = await Promise.all([
    // Nevada - West Region
    prisma.user.create({
      data: {
        email: 'caleb@moxie.com',
        name: 'Caleb Gorringe',
        tagline: 'Top performer 2024',
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
        tagline: 'No time for bagels',
        team: 'Las Vegas South, NV',
        region: 'West',
        joinedDate: new Date('2023-03-20'),
        isActive: true,
        lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
      },
    }),
    prisma.user.create({
      data: {
        email: 'jake@moxie.com',
        name: 'Jake Allen',
        tagline: 'Always hustling',
        team: 'Reno, NV',
        region: 'West',
        joinedDate: new Date('2023-04-20'),
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
        tagline: 'New but determined',
        team: 'Phoenix, AZ',
        region: 'Southwest',
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
        team: 'Tucson, AZ',
        region: 'Southwest',
        joinedDate: new Date('2022-08-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // Texas - Southwest Region
    prisma.user.create({
      data: {
        email: 'holden@moxie.com',
        name: 'Holden Anderson',
        tagline: 'Rising star',
        team: 'Austin, TX',
        region: 'Southwest',
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
        team: 'Dallas, TX',
        region: 'Southwest',
        joinedDate: new Date('2022-12-01'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // New York - Northeast Region
    prisma.user.create({
      data: {
        email: 'alex@moxie.com',
        name: 'Alex Rivera',
        tagline: 'NYC hustle',
        team: 'Manhattan, NY',
        region: 'Northeast',
        joinedDate: new Date('2023-07-15'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'maya@moxie.com',
        name: 'Maya Chen',
        tagline: 'Results driven',
        team: 'Brooklyn, NY',
        region: 'Northeast',
        joinedDate: new Date('2023-05-20'),
        isActive: true,
        lastActive: new Date(),
      },
    }),

    // Florida - Southeast Region
    prisma.user.create({
      data: {
        email: 'james@moxie.com',
        name: 'James Wilson',
        tagline: 'Sunshine sales',
        team: 'Miami, FL',
        region: 'Southeast',
        joinedDate: new Date('2023-02-10'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'olivia@moxie.com',
        name: 'Olivia Martinez',
        tagline: 'Dream closer',
        team: 'Orlando, FL',
        region: 'Southeast',
        joinedDate: new Date('2023-08-25'),
        isActive: true,
        lastActive: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create sales for today
  const today = new Date()
  const salesData = [
    { userId: users[0].id, count: 12, revenue: 3600 }, // Caleb - Las Vegas (West)
    { userId: users[1].id, count: 10, revenue: 2800 }, // Cole - Las Vegas (West)
    { userId: users[2].id, count: 4, revenue: 2150 },  // Jake - Reno (West)
    { userId: users[3].id, count: 10, revenue: 2900 }, // Brock - LA (West)
    { userId: users[4].id, count: 6, revenue: 1800 },  // Whitney - SF (West)
    { userId: users[5].id, count: 6, revenue: 1750 },  // Emily - San Diego (West)
    { userId: users[6].id, count: 1, revenue: 450 },   // Sarah - Phoenix (Southwest)
    { userId: users[7].id, count: 9, revenue: 2700 },  // Justin - Tucson (Southwest)
    { userId: users[8].id, count: 4, revenue: 1200 },  // Holden - Austin (Southwest)
    { userId: users[9].id, count: 1, revenue: 300 },   // Matt - Dallas (Southwest)
    { userId: users[10].id, count: 8, revenue: 2400 }, // Alex - Manhattan (Northeast)
    { userId: users[11].id, count: 7, revenue: 2100 }, // Maya - Brooklyn (Northeast)
    { userId: users[12].id, count: 5, revenue: 1500 }, // James - Miami (Southeast)
    { userId: users[13].id, count: 3, revenue: 900 },  // Olivia - Orlando (Southeast)
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
