import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'بنطلون حريمي', pricePerKg: 150 },
    { name: 'قميص رجالي', pricePerKg: 200 },
    { name: 'تيشرت اطفالي', pricePerKg: 100 },
    { name: 'كنزة اطفالي', pricePerKg: 120 },
    { name: 'سوبر كريم', pricePerKg: 300 },
  ]

  for (const c of categories) {
    const existing = await prisma.category.findUnique({ where: { name: c.name } })
    if (!existing) {
      await prisma.category.create({ data: c })
    }
  }

  console.log('✅ Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
