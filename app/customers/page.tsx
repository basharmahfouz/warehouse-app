import { prisma } from '@/lib/prisma'
import CustomersClient from './CustomersClient'

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      invoices: true,
      payments: true,
    }
  })

  const customersWithStats = customers.map(cust => {
    const totalSales = cust.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
    const totalPaid = cust.payments.reduce((acc, pay) => acc + pay.amount, 0)
    const remainingDebt = totalSales - totalPaid

    return {
      id: cust.id,
      name: cust.name,
      phone: cust.phone || '',
      totalSales,
      totalPaid,
      remainingDebt
    }
  })

  return <CustomersClient initialCustomers={customersWithStats} />
}
