import { prisma } from '@/lib/prisma'
import InventoryClient from './InventoryClient'

export default async function InventoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'desc' }
  })

  // حساب الكميات لكل صنف
  const supplierInvoices = await prisma.supplierInvoice.groupBy({
    by: ['categoryId'],
    _sum: { bales: true, kg: true }
  })

  const saleInvoices = await prisma.saleInvoiceItem.groupBy({
    by: ['categoryId'],
    _sum: { bales: true, kg: true }
  })

  // دمج الداتا
  const categoryStats = categories.map(cat => {
    const p = supplierInvoices.find(s => s.categoryId === cat.id)?._sum
    const s = saleInvoices.find(s => s.categoryId === cat.id)?._sum

    const purchasedBales = p?.bales || 0
    const purchasedKg = p?.kg || 0
    
    const soldBales = s?.bales || 0
    const soldKg = s?.kg || 0

    return {
      ...cat,
      availableBales: purchasedBales - soldBales,
      availableKg: purchasedKg - soldKg
    }
  })

  return <InventoryClient initialCategories={categoryStats} />
}
