import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CustomerDetailClient from './CustomerDetailClient'

export default async function CustomerPage({ params }: { params: { id: string } }) {
  const customerId = Number(params.id)
  if (isNaN(customerId)) return notFound()

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      invoices: {
        include: { items: { include: { category: true } } },
        orderBy: { date: 'desc' }
      },
      payments: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!customer) return notFound()

  const categories = await prisma.category.findMany()

  const totalSales = customer.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
  const totalPaid = customer.payments.reduce((acc, pay) => acc + pay.amount, 0)
  const remainingDebt = totalSales - totalPaid

  return (
    <CustomerDetailClient
      customer={customer}
      categories={categories}
      stats={{ totalSales, totalPaid, remainingDebt }}
    />
  )
}
