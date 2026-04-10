import { prisma } from '@/lib/prisma'
import SuppliersClient from './SuppliersClient'

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      invoices: true,
      payments: true,
    }
  })

  const suppliersWithStats = suppliers.map(sup => {
    const totalPurchases = sup.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
    const totalPaid = sup.payments.reduce((acc, pay) => acc + pay.amount, 0)
    const remainingDebt = totalPurchases - totalPaid
    
    const totalKgFromSupplier = sup.invoices.reduce((acc, inv) => acc + inv.kg, 0)

    return {
      id: sup.id,
      name: sup.name,
      phone: sup.phone || '',
      notes: sup.notes || '',
      totalPurchases,
      totalPaid,
      remainingDebt,
      totalKgFromSupplier
    }
  })

  return <SuppliersClient initialSuppliers={suppliersWithStats} />
}
