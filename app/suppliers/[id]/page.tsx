import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import SupplierDetailClient from './SupplierDetailClient'

export default async function SupplierPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id)
  
  if (isNaN(supplierId)) return notFound()

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      invoices: {
        include: { category: true },
        orderBy: { date: 'desc' }
      },
      payments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!supplier) return notFound()

  const categories = await prisma.category.findMany()

  const totalPurchases = supplier.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
  const totalPaid = supplier.payments.reduce((acc, pay) => acc + pay.amount, 0)
  const remainingDebt = totalPurchases - totalPaid

  return (
    <SupplierDetailClient 
      supplier={supplier} 
      categories={categories} 
      stats={{ totalPurchases, totalPaid, remainingDebt }} 
    />
  )
}
