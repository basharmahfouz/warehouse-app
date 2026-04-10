import { prisma } from '@/lib/prisma'
import { HandCoins } from 'lucide-react'
import CustomerCollectionForm from './CustomerCollectionForm'

export default async function CustomerCollectionsPage() {
  const customers = await prisma.customer.findMany({ 
    orderBy: { name: 'asc' },
    include: {
      invoices: true,
      payments: true
    }
  })

  // Calculate current debt for each customer
  const customersWithDebt = customers.map(c => {
    const totalSales = c.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
    const totalPaid = c.payments.reduce((acc, pay) => acc + pay.amount, 0)
    return {
      id: c.id,
      name: c.name,
      debt: totalSales - totalPaid
    }
  })

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
          <HandCoins className="w-7 h-7 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">تحصيل مبالغ من العملاء</h2>
          <p className="text-slate-500">تسجيل مبالغ مالية وردت من العملاء لتسوية حساباتهم</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border dark:border-slate-700">
        <CustomerCollectionForm customers={customersWithDebt} />
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          📍 ملاحظة: استلام مبلغ كاش يقلل من مديونية العميل فوراً ويظهر في الـ Dashboard وفي كشف حسابه.
        </p>
      </div>
    </div>
  )
}
