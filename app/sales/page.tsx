import { prisma } from '@/lib/prisma'
import { TrendingUp } from 'lucide-react'
import SalesForm from './SalesForm'

export default async function SalesPage() {
  const [customers, categoriesRaw] = await Promise.all([
    prisma.customer.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ 
      orderBy: { name: 'asc' },
      include: {
        supplierInvoices: true,
        saleInvoiceItems: true
      }
    }),
  ])

  // حساب المتاح لكل صنف
  const categories = categoriesRaw.map(cat => {
    const purchasedBales = cat.supplierInvoices.reduce((acc, inv) => acc + inv.bales, 0)
    const purchasedKg = cat.supplierInvoices.reduce((acc, inv) => acc + inv.kg, 0)
    const soldBales = cat.saleInvoiceItems.reduce((acc, item) => acc + item.bales, 0)
    const soldKg = cat.saleInvoiceItems.reduce((acc, item) => acc + item.kg, 0)

    return {
      id: cat.id,
      name: cat.name,
      pricePerKg: cat.pricePerKg,
      availableBales: purchasedBales - soldBales,
      availableKg: purchasedKg - soldKg
    }
  })

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">بيع بضاعة لعميل</h2>
          <p className="text-slate-500">تسجيل فاتورة مبيعات جديدة للعملاء وتحديث المخزن</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border dark:border-slate-700">
        <SalesForm customers={customers} categories={categories} />
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium text-center">
          ⚠️ تنبيه: يتم تثبيت سعر البيع وقت تسجيل الفاتورة بناءً على "سعر الكيلو" المسجل للصنف في المخزن حالياً.
        </p>
      </div>
    </div>
  )
}
